#!/usr/bin/env node
/**
 * Tap grid on Android emulator, compare adb coords vs JS-received pointer coords.
 */
import { execSync } from 'node:child_process';
import { createConnection } from 'node:net';
import { randomBytes } from 'node:crypto';

const serial = process.env.ADB_SERIAL || 'emulator-5554';

function adb(...args) {
  return execSync(['adb', '-s', serial, ...args].join(' '), { encoding: 'utf8' }).trim();
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function wsEval(wsUrl, expression) {
  return new Promise((resolve, reject) => {
    const hostport = wsUrl.slice(5).split('/')[0];
    const path = '/' + wsUrl.slice(5).split('/').slice(1).join('/');
    const [host, portStr] = hostport.split(':');
    const port = Number(portStr);
    const socket = createConnection({ host, port });
    let upgraded = false;
    let buffer = Buffer.alloc(0);

    socket.on('connect', () => {
      const key = randomBytes(16).toString('base64');
      socket.write(
        `GET ${path} HTTP/1.1\r\nHost: ${hostport}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`,
      );
    });

    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      if (!upgraded) {
        const headerEnd = buffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) return;
        upgraded = true;
        const payload = Buffer.from(
          JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: { expression, returnByValue: true, awaitPromise: true },
          }),
        );
        const len = payload.length;
        const header = Buffer.alloc(2 + (len > 125 ? 2 : 0));
        header[0] = 0x81;
        if (len <= 125) {
          header[1] = len;
          socket.write(Buffer.concat([header.slice(0, 2), payload]));
        } else {
          header[1] = 126;
          header.writeUInt16BE(len, 2);
          socket.write(Buffer.concat([header, payload]));
        }
        return;
      }

      if (buffer.length < 2) return;
      const opcode = buffer[0] & 0x0f;
      if (opcode === 0x8) {
        socket.end();
        return;
      }
      let offset = 2;
      let payloadLen = buffer[1] & 0x7f;
      if (payloadLen === 126) {
        payloadLen = buffer.readUInt16BE(2);
        offset = 4;
      } else if (payloadLen === 127) {
        reject(new Error('Large frames unsupported'));
        return;
      }
      const masked = (buffer[1] & 0x80) !== 0;
      if (masked) offset += 4;
      if (buffer.length < offset + payloadLen) return;
      const payload = buffer.subarray(offset, offset + payloadLen);
      const text = payload.toString('utf8');
      const jsonStart = text.indexOf('{"id":1');
      if (jsonStart === -1) return;
      const message = JSON.parse(text.slice(jsonStart));
      socket.end();
      resolve(message.result?.result?.value);
    });

    socket.on('error', reject);
    setTimeout(() => reject(new Error('CDP timeout')), 15000);
  });
}

function getDevtoolsPage() {
  try {
    execSync(`adb -s ${serial} forward --remove tcp:9223`, { stdio: 'ignore' });
  } catch {
    // no existing forward
  }
  const pid = adb('shell', 'pidof', 'app.engelsma.almaniac');
  execSync(`adb -s ${serial} forward tcp:9223 localabstract:webview_devtools_remote_${pid}`);
  const pages = JSON.parse(execSync('curl -s http://localhost:9223/json/list', { encoding: 'utf8' }));
  const page = pages.find((entry) => entry.type === 'page');
  if (!page) throw new Error('No devtools page');
  return page.webSocketDebuggerUrl;
}

async function dumpProbe(wsUrl) {
  return wsEval(wsUrl, 'window.__tapProbeDump ? window.__tapProbeDump() : null');
}

async function main() {
  adb('shell', 'am', 'force-stop', 'app.engelsma.almaniac');
  adb('shell', 'am', 'start', '-n', 'app.engelsma.almaniac/.MainActivity');
  sleep(8000);

  const wsUrl = getDevtoolsPage();
  const baseline = await dumpProbe(wsUrl);
  if (!baseline) throw new Error('TapProbe not loaded');

  console.log('Viewport:', baseline.viewport);
  console.log('Expected targets (green rings):', baseline.targets);

  const tapPoints = [
    ...baseline.targets.map((t) => ({ label: `target:${t.label}`, x: t.x, y: t.y, expect: t.label })),
    { label: 'grid:TL', x: 40, y: 40, expect: null },
    { label: 'grid:C', x: Math.round(baseline.viewport.innerWidth / 2), y: Math.round(baseline.viewport.innerHeight / 2), expect: null },
    { label: 'grid:TR', x: baseline.viewport.innerWidth - 40, y: 40, expect: null },
    { label: 'offset:settings+80y', x: baseline.targets.find((t) => t.label === 'settings')?.x ?? 994, y: (baseline.targets.find((t) => t.label === 'settings')?.y ?? 28) + 80, expect: null },
  ];

  const results = [];

  for (const point of tapPoints) {
    adb('logcat', '-c');
    adb('shell', 'input', 'tap', String(point.x), String(point.y));
    sleep(900);

    const logs = execSync(`adb -s ${serial} logcat -d -s chromium:V Capacitor:V`, { encoding: 'utf8' });
    const probeLine = logs.split('\n').find((line) => line.includes('[TapProbe]'));

    const after = await dumpProbe(wsUrl);
    const lastMark = after?.marks?.[after.marks.length - 1];

    const expectedHit = point.expect;
    let actualHit = lastMark?.hit ?? 'NO_MARK';
    const received = lastMark ? { x: lastMark.x, y: lastMark.y } : null;
    const delta = received ? { dx: received.x - point.x, dy: received.y - point.y } : null;

    results.push({
      sent: { x: point.x, y: point.y, label: point.label },
      received,
      delta,
      expectedTarget: expectedHit,
      actualHit,
      match: expectedHit ? actualHit.toLowerCase().includes(expectedHit) : null,
      log: probeLine?.trim() ?? null,
    });
  }

  adb('shell', 'screencap', '-p', '/sdcard/tap-probe.png');
  execSync(`adb -s ${serial} pull /sdcard/tap-probe.png /Users/chris/Home/app/almaniac/tap-probe-result.png`);

  console.log('\n=== TAP RESULTS ===');
  for (const row of results) {
    console.log(JSON.stringify(row, null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
