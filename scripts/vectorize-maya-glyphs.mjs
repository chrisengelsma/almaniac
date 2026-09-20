#!/usr/bin/env node
/**
 * Converts Smithsonian Maya glyph PNGs to crisp SVG vector art via potrace.
 * Run: node scripts/vectorize-maya-glyphs.mjs
 * Requires: ImageMagick (magick) and potrace
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const GLYPH_ROOT = 'public/maya-glyphs';

function vectorizePng(pngPath) {
  const svgPath = pngPath.replace(/\.png$/, '.svg');
  const tmpPbm = `${pngPath}.pbm`;

  execSync(`magick "${pngPath}" -alpha extract -negate "${tmpPbm}"`, { stdio: 'pipe' });
  execSync(`potrace "${tmpPbm}" -s -o "${svgPath}"`, { stdio: 'pipe' });
  unlinkSync(tmpPbm);

  const raw = readFileSync(svgPath, 'utf8');
  const viewBoxMatch = raw.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch?.[1] ?? '0 0 90 90';
  const viewBoxParts = viewBox.split(/\s+/).map(Number);
  const width = viewBoxParts[2] ?? 90;
  const height = viewBoxParts[3] ?? 90;

  const gMatch = raw.match(/<g([^>]*)>([\s\S]*)<\/g>/);
  const gAttrs = gMatch?.[1] ?? '';
  const paths = gMatch?.[2]?.trim() ?? '';
  const transformMatch = gAttrs.match(/transform="([^"]+)"/);
  const transform = transformMatch ? ` transform="${transformMatch[1]}"` : '';

  const cleaned = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
<g fill="#000000" stroke="none"${transform}>
${paths}
</g>
</svg>
`;

  writeFileSync(svgPath, cleaned);
  return svgPath;
}

function walkPngs(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkPngs(full));
    } else if (entry.endsWith('.png')) {
      results.push(full);
    }
  }
  return results;
}

const pngs = walkPngs(GLYPH_ROOT);
for (const png of pngs) {
  const svg = vectorizePng(png);
  console.log(`✓ ${png} → ${svg}`);
}
console.log(`\nVectorized ${pngs.length} glyphs.`);
