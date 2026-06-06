/**
 * Rimuove solo lo sfondo connesso ai bordi (flood-fill).
 * Preserva pixel interni alle silhouette anche se simili allo sfondo.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const inputPath = path.join(ROOT, 'materials', 'BarbaraAlvisi_foto_home_page.jpeg');
const outputPath = path.join(ROOT, 'materials_clean', 'BarbaraAlvisi_foto_home_page.png');

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function sampleBackground(data, width, height, channels) {
  const patch = Math.max(12, Math.min(40, Math.floor(Math.min(width, height) * 0.03)));
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

function isBackgroundPixel(r, g, b, bg, tolerance) {
  const dist = colorDistance(r, g, b, bg);
  if (dist <= tolerance) return true;

  // Ombre morbide sul pavimento studio (leggermente più scure del muro)
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const bgLum = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2];
  if (lum >= bgLum - 50 && lum <= bgLum + 16 && dist <= tolerance + 24) {
    return true;
  }

  return false;
}

async function removeBackgroundFlood(input, output) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const bg = sampleBackground(data, width, height, channels);
  const tolerance = 40;
  const softness = 28;

  const isBg = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const push = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    const i = idx * channels;
    if (isBackgroundPixel(data[i], data[i + 1], data[i + 2], bg, tolerance)) {
      isBg[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  const neighbors = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx - x) / width;

    for (const [dx, dy] of neighbors) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      push(nx, ny);
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const i = idx * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (isBg[idx]) {
        data[i + 3] = 0;
        continue;
      }

      let minEdgeDist = Infinity;
      for (const [dx, dy] of neighbors) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const nidx = ny * width + nx;
        if (isBg[nidx]) {
          const dist = colorDistance(r, g, b, bg);
          minEdgeDist = Math.min(minEdgeDist, dist);
        }
      }

      if (minEdgeDist < tolerance + softness) {
        const t = Math.max(0, Math.min(1, (minEdgeDist - tolerance) / softness));
        data[i + 3] = Math.round(255 * t);
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(output);

  const removed = isBg.reduce((acc, v) => acc + v, 0);
  console.log(`Sfondo campionato: rgb(${bg.join(', ')})`);
  console.log(`Pixel sfondo rimossi: ${removed} / ${width * height}`);
  console.log(`Salvato: ${output}`);
}

await removeBackgroundFlood(inputPath, outputPath);
