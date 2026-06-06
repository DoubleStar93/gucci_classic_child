/**
 * Rimuove lo sfondo da tutte le immagini in materials/ → materials_clean/ (PNG trasparente)
 * Algoritmo: campionamento angoli + tolleranza colore (sharp, senza dipendenze ML)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INPUT_DIR = path.join(ROOT, 'materials');
const OUTPUT_DIR = path.join(ROOT, 'materials_clean');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.bmp']);

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function sampleBackground(data, width, height, channels) {
  const patch = Math.max(8, Math.min(24, Math.floor(Math.min(width, height) * 0.04)));
  const samples = [];
  const corners = [
    [0, 0],
    [width - patch, 0],
    [0, height - patch],
    [width - patch, height - patch],
  ];

  for (const [cx, cy] of corners) {
    for (let y = cy; y < Math.min(cy + patch, height); y++) {
      for (let x = cx; x < Math.min(cx + patch, width); x++) {
        const i = (y * width + x) * channels;
        samples.push([data[i], data[i + 1], data[i + 2]]);
      }
    }
  }

  return [
    median(samples.map((s) => s[0])),
    median(samples.map((s) => s[1])),
    median(samples.map((s) => s[2])),
  ];
}

function colorDistance(r, g, b, bg) {
  const dr = r - bg[0];
  const dg = g - bg[1];
  const db = b - bg[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

async function removeBackground(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const bg = sampleBackground(data, width, height, channels);

  const isLightBg = (bg[0] + bg[1] + bg[2]) / 3 > 200;
  const tolerance = isLightBg ? 38 : 55;
  const softness = isLightBg ? 22 : 35;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const minChannel = Math.min(r, g, b);
      const maxChannel = Math.max(r, g, b);

      let alpha = data[i + 3];

      if (isLightBg) {
        // Sfondo chiaro (prodotti, logo): rimuovi solo pixel quasi-bianchi, preserva anti-alias scuro
        if (minChannel >= 248) {
          alpha = 0;
        } else if (minChannel >= 232 && maxChannel >= 245) {
          alpha = Math.min(alpha, Math.round((255 * (248 - minChannel)) / 16));
        }
      } else {
        const dist = colorDistance(r, g, b, bg);
        if (dist <= tolerance) {
          alpha = 0;
        } else if (dist <= tolerance + softness) {
          alpha = Math.min(alpha, Math.round((255 * (dist - tolerance)) / softness));
        }
      }

      data[i + 3] = alpha;
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const entries = await fs.readdir(INPUT_DIR, { withFileTypes: true });
  const images = entries
    .filter((entry) => entry.isFile() && IMAGE_EXT.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort();

  if (!images.length) {
    console.log('Nessuna immagine trovata in materials/');
    return;
  }

  console.log(`Elaborazione ${images.length} immagini → materials_clean/`);

  for (const name of images) {
    const inputPath = path.join(INPUT_DIR, name);
    const base = path.basename(name, path.extname(name));
    const outputPath = path.join(OUTPUT_DIR, `${base}.png`);

    process.stdout.write(`  ${name} … `);
    await removeBackground(inputPath, outputPath);
    console.log(`→ ${base}.png`);
  }

  console.log('Completato.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
