/**
 * Placeholder editoriali per sezione Esplora (home).
 * Uso: node scripts/make-home-cat-images.js
 */
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'classic-gucci', 'assets', 'img', 'home');

const CATEGORIES = [
  { id: 3, top: '#f6f1e8', bottom: '#e4d9c8' },
  { id: 6, top: '#efe8dc', bottom: '#d9cfc0' },
  { id: 9, top: '#e8dfd2', bottom: '#c9b9a4' },
];

const WIDTH = 800;
const HEIGHT = 1000;

async function buildCategoryImage({ id, top, bottom }) {
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${top}"/>
          <stop offset="100%" stop-color="${bottom}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>
  `;

  const outPath = path.join(OUT_DIR, `cat-${id}.jpg`);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outPath);

  return outPath;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const category of CATEGORIES) {
  const outPath = await buildCategoryImage(category);
  console.log(`Created ${outPath}`);
}
