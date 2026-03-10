import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

async function main() {
  const inPath = process.argv[2];
  const outPath = process.argv[3];
  const width = Number(process.argv[4] ?? 1936);
  const height = Number(process.argv[5] ?? 1816);

  if (!inPath || !outPath) {
    console.error("Usage: node scripts/render-svg-to-png.mjs <in.svg> <out.png> [width] [height]");
    process.exit(1);
  }

  const svg = fs.readFileSync(inPath);
  const outAbs = path.isAbsolute(outPath) ? outPath : path.join(process.cwd(), outPath);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });

  await sharp(svg, { density: 300 })
    .resize(width, height, { fit: "fill" })
    .png()
    .toFile(outAbs);

  console.log(`Wrote ${outAbs}`);
}

main().catch((e) => {
  console.error(e?.stack || String(e));
  process.exit(1);
});

