#!/usr/bin/env node
/**
 * Build and launch Almaniac on the iOS Simulator.
 * Xcode 27+ uses Device Hub instead of the standalone Simulator.app.
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iosAppDir = join(root, 'ios', 'App');
const simApp =
  join(iosAppDir, 'build', 'Build', 'Products', 'Debug-iphonesimulator', 'App.app');
const bundleId = 'app.engelsma.almaniac';
const defaultUdid = '0802DB35-17F3-4443-B590-25C06FB375B5';

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', cwd: opts.cwd ?? root, env: process.env });
}

function getBootedUdid() {
  const out = execSync('xcrun simctl list devices booted -j', { encoding: 'utf8' });
  const { devices } = JSON.parse(out);
  for (const runtime of Object.values(devices)) {
    for (const device of runtime) {
      if (device.state === 'Booted') {
        return device.udid;
      }
    }
  }
  return null;
}

const udid = process.env.IOS_SIM_UDID ?? getBootedUdid() ?? defaultUdid;

console.log('Syncing Capacitor…');
run('npm run cap:sync');

console.log(`Booting simulator ${udid}…`);
try {
  execSync(`xcrun simctl boot "${udid}"`, { stdio: 'inherit' });
} catch {
  // Already booted.
}

console.log('Building for iOS Simulator…');
run(
  `xcodebuild -scheme App -configuration Debug -destination "platform=iOS Simulator,id=${udid}" -derivedDataPath build -quiet`,
  { cwd: iosAppDir },
);

if (!existsSync(simApp)) {
  console.error(`Missing build product: ${simApp}`);
  process.exit(1);
}

console.log('Installing and launching Almaniac…');
run(`xcrun simctl install "${udid}" "${simApp}"`);
const launch = spawnSync('xcrun', ['simctl', 'launch', udid, bundleId], {
  encoding: 'utf8',
});
if (launch.status !== 0) {
  console.error(launch.stderr || launch.stdout);
  process.exit(launch.status ?? 1);
}
console.log(launch.stdout.trim());

const deviceHub = '/Applications/Xcode.app/Contents/Applications/DeviceHub.app';
if (existsSync(deviceHub)) {
  console.log('Opening Device Hub (simulator UI in Xcode 27+)…');
  run(`open "${deviceHub}"`);
} else {
  console.log('Open the booted simulator from Xcode → Open Developer Tool.');
}
