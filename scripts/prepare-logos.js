import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const sourcePath = path.join(repoRoot, "materials", "logo.jpeg");
const outputDir = path.join(repoRoot, "classic-gucci", "assets", "img", "brand");

async function buildLogoVariant({ inputBuffer, variant }) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const output = Buffer.from(data);

  for (let i = 0; i < width * height; i += 1) {
    const offset = i * channels;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    let alpha = 0;
    if (luminance < 248) {
      alpha = Math.min(255, Math.round(((248 - luminance) / 248) * 255));
    }

    if (variant === "white") {
      output[offset] = 255;
      output[offset + 1] = 255;
      output[offset + 2] = 255;
    } else {
      output[offset] = 0;
      output[offset + 1] = 0;
      output[offset + 2] = 0;
    }

    output[offset + 3] = alpha;
  }

  return sharp(output, {
    raw: { width, height, channels: 4 },
  })
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const sourceBuffer = await fs.readFile(sourcePath);
  const meta = await sharp(sourceBuffer).metadata();
  console.log(`Source: ${meta.width}x${meta.height}`);

  for (const variant of ["black", "white"]) {
    let buffer = await buildLogoVariant({ inputBuffer: sourceBuffer, variant });

    buffer = await sharp(buffer)
      .resize({
        width: 520,
        withoutEnlargement: true,
        fit: "inside",
      })
      .png()
      .toBuffer();

    const outputPath = path.join(outputDir, `logo-${variant}.png`);
    await fs.writeFile(outputPath, buffer);

    const outMeta = await sharp(buffer).metadata();
    console.log(`Wrote ${outputPath} (${outMeta.width}x${outMeta.height})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
