/**
 * Favicon "B" — Edwardian Script ITC, render vettoriale (opentype.js).
 * Uso: node scripts/make-favicon.js
 */
import sharp from 'sharp';
import opentype from 'opentype.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BRAND_DIR = path.join(ROOT, 'classic-gucci', 'assets', 'img', 'brand');
const OUT_DIR = path.join(BRAND_DIR, 'favicon');

const FONT_CANDIDATES = [
  path.join(ROOT, 'Edwardian Script ITC', 'edwardianscriptitc.ttf'),
  path.join(BRAND_DIR, 'fonts', 'edwardianscriptitc.ttf'),
  path.join(BRAND_DIR, 'fonts', 'EdwardianScriptITC.ttf'),
];

const LETTER = 'B';
const CANVAS = 1024;
const PADDING = 0.14;

function resolveFontPath() {
  for (const p of FONT_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(
    `Edwardian Script ITC non trovato. Atteso in:\n${FONT_CANDIDATES.map((p) => `  - ${p}`).join('\n')}`,
  );
}

function buildSvgFromPath(font, letter, size) {
  const fontSize = size * (1 - PADDING * 2);
  const glyphPath = font.getPath(letter, 0, 0, fontSize);
  const bbox = glyphPath.getBoundingBox();
  const cx = (bbox.x1 + bbox.x2) / 2;
  const cy = (bbox.y1 + bbox.y2) / 2;
  const tx = size / 2 - cx;
  const ty = size / 2 + cy;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="100%" height="100%" fill="transparent"/>
  <g transform="translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) scale(1, -1)">
    <path d="${glyphPath.toPathData(2)}" fill="#111111"/>
  </g>
</svg>`;
}

async function renderSvg(svg) {
  // Sharp/librsvg capovolge il glifo: flip verticale ripristina orientamento corretto
  return sharp(Buffer.from(svg))
    .flip()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function main() {
  const fontPath = resolveFontPath();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const fontBuf = fs.readFileSync(fontPath);
  const font = opentype.parse(fontBuf.buffer.slice(fontBuf.byteOffset, fontBuf.byteOffset + fontBuf.byteLength));
  const svg = buildSvgFromPath(font, LETTER, CANVAS);
  const square = await renderSvg(svg);

  const sizes = [
    { name: 'favicon-512.png', size: 512 },
    { name: 'favicon-192.png', size: 192 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon-32.png', size: 32 },
    { name: 'favicon-16.png', size: 16 },
    { name: 'favicon.png', size: 32 },
  ];

  for (const { name, size } of sizes) {
    await sharp(square)
      .resize(size, size, {
        kernel: 'lanczos3',
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(path.join(OUT_DIR, name));
  }

  await sharp(square).toFile(path.join(OUT_DIR, 'favicon-b-preview.png'));

  console.log('Font:', fontPath);
  console.log('Favicon generata — Edwardian Script ITC');
  console.log('Output:', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
