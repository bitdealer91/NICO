import fs from "node:fs";
import path from "node:path";

function parseEnvLocal(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const raw = fs.readFileSync(envPath, "utf8");
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

async function figmaFetch(url, token) {
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Figma API ${res.status} ${res.statusText}\n${text.slice(0, 600)}`);
  }
  return res.json();
}

async function main() {
  const fileKey = process.argv[2] ?? "D9Da9PYtZOISux0dj8v3za";
  const nodeId = process.argv[3] ?? "2:2";
  const format = (process.argv[4] ?? "png").toLowerCase();
  const outPathArg = process.argv[5] ?? null;

  const flags = new Set(process.argv.slice(2).filter((a) => String(a).startsWith("--")));
  const svgIncludeIds = flags.has("--svg-include-ids") || flags.has("--include-ids");
  const useAbsoluteBounds = flags.has("--use-absolute-bounds") || flags.has("--abs-bounds");
  const scale = Number(process.argv.find((a) => String(a).startsWith("--scale="))?.split("=", 2)?.[1] ?? 2);

  const env = parseEnvLocal(path.join(process.cwd(), ".env.local"));
  const token = process.env.FIGMA_ACCESS_TOKEN || env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error("Missing FIGMA_ACCESS_TOKEN. Add it to .env.local or export it in your shell.");
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "tmp", "figma");
  fs.mkdirSync(outDir, { recursive: true });

  const nodeUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`;
  const nodeJson = await figmaFetch(nodeUrl, token);
  fs.writeFileSync(path.join(outDir, `node-${nodeId.replaceAll(":", "-")}.json`), JSON.stringify(nodeJson, null, 2));

  const params = new URLSearchParams();
  params.set("ids", nodeId);
  params.set("format", format);
  if (format === "png" || format === "jpg" || format === "jpeg" || format === "webp") {
    params.set("scale", Number.isFinite(scale) && scale > 0 ? String(scale) : "2");
  }
  if (format === "svg" && svgIncludeIds) params.set("svg_include_id", "true");
  if (useAbsoluteBounds) params.set("use_absolute_bounds", "true");

  const imageUrl = `https://api.figma.com/v1/images/${fileKey}?${params.toString()}`;
  const imageJson = await figmaFetch(imageUrl, token);
  fs.writeFileSync(path.join(outDir, `image-${nodeId.replaceAll(":", "-")}.json`), JSON.stringify(imageJson, null, 2));

  const img = imageJson?.images?.[nodeId];
  if (!img) {
    console.error("No image URL returned for node. Check node id and token permissions.");
    process.exit(1);
  }

  const imgRes = await fetch(img);
  if (!imgRes.ok) throw new Error(`Image fetch failed: ${imgRes.status} ${imgRes.statusText}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const ext = format === "jpeg" ? "jpg" : format;
  const renderName = `render-${nodeId.replaceAll(":", "-")}.${ext}`;
  const renderPath = path.join(outDir, renderName);
  fs.writeFileSync(renderPath, buf);

  if (outPathArg) {
    const target = path.isAbsolute(outPathArg) ? outPathArg : path.join(process.cwd(), outPathArg);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(renderPath, target);
  }

  const relOut = path.relative(process.cwd(), outDir);
  const relRender = `${relOut}/${renderName}`;
  const relNode = `${relOut}/node-${nodeId.replaceAll(":", "-")}.json`;

  const extra = outPathArg ? `\n- ${path.relative(process.cwd(), path.isAbsolute(outPathArg) ? outPathArg : path.join(process.cwd(), outPathArg))}` : "";
  console.log(`Saved:\n- ${relNode}\n- ${relRender}${extra}`);
}

main().catch((e) => {
  console.error(e?.stack || String(e));
  process.exit(1);
});

