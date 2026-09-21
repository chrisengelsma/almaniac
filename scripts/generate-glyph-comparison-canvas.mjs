#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GLYPH_ROOT = join(ROOT, 'public/maya-glyphs');
const OUT = process.argv[2] ?? join(ROOT, 'maya-glyph-comparison.canvas.tsx');

const LONG_PERIODS = ['Baktun', 'Katun', 'Tun', 'Uinal', 'Kin'];
const TZOLKIN = [
  'Imix', 'Ik', 'Akbal', 'Kan', 'Chikchan', 'Kimi', 'Manik', 'Lamat', 'Muluk', 'Ok',
  'Chuwen', 'Eb', 'Ben', 'Ix', 'Men', 'Kib', 'Kaban', 'Etznab', 'Kawak', 'Ajaw',
];
const HAAB = [
  'Pop', 'Wo', 'Sip', 'Sotz', 'Sek', 'Xul', 'Yaxkin', 'Mol', 'Chen', 'Yax',
  'Sak', 'Keh', 'Mak', 'Kankin', 'Muan', 'Pax', 'Kayab', 'Kumku', 'Wayeb',
];
const LORDS = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9'];

function pngDataUrl(path) {
  const buf = readFileSync(path);
  return `data:image/png;base64,${buf.toString('base64')}`;
}

function svgDataUrl(path) {
  const svg = readFileSync(path, 'utf8');
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function buildGlyphs() {
  const categories = [];

  categories.push({
    id: 'long',
    title: 'Long Count periods',
    rotated: false,
    items: LONG_PERIODS.map((label, index) => ({
      label,
      png: pngDataUrl(join(GLYPH_ROOT, 'long', `long${index}.png`)),
      svg: svgDataUrl(join(GLYPH_ROOT, 'long', `long${index}.svg`)),
    })),
  });

  categories.push({
    id: 'numerals',
    title: 'Numerals (0–19)',
    rotated: false,
    items: Array.from({ length: 20 }, (_, value) => ({
      label: String(value),
      png: pngDataUrl(join(GLYPH_ROOT, 'numerals', `${value}.png`)),
      svg: svgDataUrl(join(GLYPH_ROOT, 'numerals', `${value}.svg`)),
    })),
  });

  categories.push({
    id: 'tzolkin',
    title: 'Tzolkin day signs',
    rotated: true,
    items: TZOLKIN.map((label, index) => ({
      label,
      png: pngDataUrl(join(GLYPH_ROOT, 'tzolkin', `${index}.png`)),
      svg: svgDataUrl(join(GLYPH_ROOT, 'tzolkin', `${index}.svg`)),
    })),
  });

  categories.push({
    id: 'haab',
    title: 'Haab months',
    rotated: true,
    items: HAAB.map((label, index) => ({
      label,
      png: pngDataUrl(join(GLYPH_ROOT, 'haab', `${index}.png`)),
      svg: svgDataUrl(join(GLYPH_ROOT, 'haab', `${index}.svg`)),
    })),
  });

  categories.push({
    id: 'night',
    title: 'Lords of Night',
    rotated: true,
    items: LORDS.map((label, index) => ({
      label,
      png: pngDataUrl(join(GLYPH_ROOT, 'night', `g${index + 1}.png`)),
      svg: svgDataUrl(join(GLYPH_ROOT, 'night', `g${index + 1}.svg`)),
    })),
  });

  return categories;
}

const categories = buildGlyphs();

const canvas = `import {
  Card,
  CardBody,
  Grid,
  H1,
  H2,
  Row,
  Select,
  Stack,
  Text,
  useHostTheme,
  useState,
} from 'cursor/canvas';

const CATEGORIES = ${JSON.stringify(categories, null, 2)} as const;

const GLYPH_SIZE = 72;

function GlyphPair({
  label,
  png,
  svg,
  rotated,
  theme,
}: {
  label: string;
  png: string;
  svg: string;
  rotated: boolean;
  theme: ReturnType<typeof useHostTheme>;
}) {
  const imgStyle = {
    width: GLYPH_SIZE,
    height: GLYPH_SIZE,
    objectFit: 'contain' as const,
    transform: rotated ? 'rotate(-90deg)' : undefined,
  };

  const cellStyle = {
    border: \`1px solid \${theme.stroke.secondary}\`,
    borderRadius: 8,
    padding: 12,
    background: theme.bg.elevated,
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: theme.text.primary,
    textAlign: 'center' as const,
    marginBottom: 8,
  };

  const captionStyle = {
    fontSize: 10,
    color: theme.text.secondary,
    textAlign: 'center' as const,
    marginTop: 6,
  };

  return (
    <div style={cellStyle}>
      <div style={labelStyle}>{label}</div>
      <Row gap={12} align="center" justify="center">
        <Stack gap={4} style={{ alignItems: 'center' }}>
          <img src={png} alt={\`\${label} PNG\`} style={imgStyle} />
          <span style={captionStyle}>PNG (90px)</span>
        </Stack>
        <Stack gap={4} style={{ alignItems: 'center' }}>
          <img src={svg} alt={\`\${label} SVG\`} style={imgStyle} />
          <span style={captionStyle}>SVG (vector)</span>
        </Stack>
      </Row>
    </div>
  );
}

export default function MayaGlyphComparison() {
  const theme = useHostTheme();
  const [categoryId, setCategoryId] = useState<string>('long');
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];

  const options = CATEGORIES.map((c) => ({ value: c.id, label: c.title }));

  return (
    <Stack gap={20} style={{ padding: 24, maxWidth: 960 }}>
      <Stack gap={6}>
        <H1>Maya glyph comparison</H1>
        <Text style={{ color: theme.text.secondary }}>
          Smithsonian PNG source (left) vs potrace SVG vectorization (right). Tzolkin, Haab, and Lords
          glyphs are rotated −90° to match the app.
        </Text>
      </Stack>

      <Stack gap={6}>
        <Text style={{ color: theme.text.secondary, fontSize: 12 }}>Category</Text>
        <Select value={categoryId} onChange={setCategoryId} options={options} />
      </Stack>

      <H2>{category.title}</H2>

      <Grid columns={category.items.length > 10 ? 4 : 3} gap={12}>
        {category.items.map((item) => (
          <GlyphPair
            key={item.label}
            label={item.label}
            png={item.png}
            svg={item.svg}
            rotated={category.rotated}
            theme={theme}
          />
        ))}
      </Grid>

      <Card>
        <CardBody>
          <Text style={{ color: theme.text.secondary, fontSize: 12 }}>
            Source: Smithsonian Maya Calendar Converter PNGs traced with potrace. 73 glyphs total across
            5 categories.
          </Text>
        </CardBody>
      </Card>
    </Stack>
  );
}
`;

writeFileSync(OUT, canvas);
const kb = Math.round(Buffer.byteLength(canvas) / 1024);
console.log(`Wrote ${OUT} (${kb} KB)`);
