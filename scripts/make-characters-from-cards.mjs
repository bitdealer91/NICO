import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

function rowCountsFromAlpha(alpha, width, height, alphaMin = 8) {
  const counts = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    let c = 0;
    const rowStart = y * width;
    for (let x = 0; x < width; x++) {
      if (alpha[rowStart + x] > alphaMin) c++;
    }
    counts[y] = c;
  }
  return counts;
}

function findCutY(counts, width) {
  // Find a "quiet" gap (near-empty rows) above the label/text block.
  const labelMin = Math.max(18, Math.floor(width * 0.05));
  const gapMax = Math.max(6, Math.floor(width * 0.01));
  const gapWindow = 22;

  let seenLabel = false;
  for (let y = counts.length - 1; y >= 0; y--) {
    if (!seenLabel) {
      if (counts[y] >= labelMin) seenLabel = true;
      continue;
    }

    // once we've seen label pixels, look for a sustained "gap"
    let ok = true;
    for (let k = 0; k < gapWindow; k++) {
      const yy = y - k;
      if (yy < 0) {
        ok = false;
        break;
      }
      if (counts[yy] > gapMax) {
        ok = false;
        break;
      }
    }
    if (ok) return Math.max(1, y - Math.floor(gapWindow / 2));
  }

  // Fallback: cut to ~70% height
  return Math.floor(counts.length * 0.7);
}

async function cropCardToCharacter(inputPath, outputPath) {
  const img = sharp(inputPath);
  const meta = await img.metadata();
  if (!meta.width || !meta.height) throw new Error(`Missing metadata for ${inputPath}`);

  // Ensure we have an alpha channel to analyze.
  const rgba = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = rgba.info;
  const data = rgba.data;

  const alpha = new Uint8Array(width * height);
  for (let i = 0, p = 0; i < alpha.length; i++, p += 4) alpha[i] = data[p + 3];

  const counts = rowCountsFromAlpha(alpha, width, height, 10);
  const cutY = findCutY(counts, width);

  // Trim fully transparent borders first, then apply cut (relative to trimmed).
  const trimmed = await sharp(inputPath).ensureAlpha().trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  const tMeta = await sharp(trimmed.data).metadata();
  const tw = tMeta.width ?? width;
  const th = tMeta.height ?? height;

  const safeCut = Math.min(th, Math.max(120, Math.floor((cutY / height) * th)));

  await sharp(trimmed.data)
    .extract({ left: 0, top: 0, width: tw, height: safeCut })
    .png({ quality: 95 })
    .toFile(outputPath);
}

async function main() {
  const outDir = path.join(process.cwd(), "public", "characters");
  fs.mkdirSync(outDir, { recursive: true });

  const srcThinker = path.join(process.cwd(), "tmp", "figma", "render-316-2257.png");
  const srcBuilderCard = path.join(process.cwd(), "tmp", "figma", "render-374-771.png");
  const srcCreatorCard = path.join(process.cwd(), "tmp", "figma", "render-374-1012.png");
  const srcLauncherCard = path.join(process.cwd(), "tmp", "figma", "render-374-1022.png");

  const outThinker = path.join(outDir, "thinker.png");
  const outBuilder = path.join(outDir, "builder.png");
  const outCreator = path.join(outDir, "creator.png");
  const outLauncher = path.join(outDir, "launcher.png");

  await sharp(srcThinker).png({ quality: 95 }).toFile(outThinker);
  await cropCardToCharacter(srcBuilderCard, outBuilder);
  await cropCardToCharacter(srcCreatorCard, outCreator);
  await cropCardToCharacter(srcLauncherCard, outLauncher);

  console.log("Generated:");
  console.log("-", path.relative(process.cwd(), outThinker));
  console.log("-", path.relative(process.cwd(), outBuilder));
  console.log("-", path.relative(process.cwd(), outCreator));
  console.log("-", path.relative(process.cwd(), outLauncher));
}

main().catch((e) => {
  console.error(e?.stack || String(e));
  process.exit(1);
});

