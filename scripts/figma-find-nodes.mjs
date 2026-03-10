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

function* walk(node, pageName = "") {
  if (!node) return;
  yield { node, pageName };
  const kids = node.children;
  if (Array.isArray(kids)) {
    for (const child of kids) yield* walk(child, pageName || node.name || "");
  }
}

function hasImageFill(node) {
  const fills = node?.fills;
  if (!Array.isArray(fills)) return false;
  return fills.some((f) => f?.type === "IMAGE");
}

function bounds(node) {
  return node?.absoluteBoundingBox || node?.absoluteRenderBounds || null;
}

async function main() {
  const fileKey = process.argv[2] ?? "D9Da9PYtZOISux0dj8v3za";
  const env = parseEnvLocal(path.join(process.cwd(), ".env.local"));
  const token = process.env.FIGMA_ACCESS_TOKEN || env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error("Missing FIGMA_ACCESS_TOKEN. Add it to .env.local or export it in your shell.");
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), "tmp", "figma");
  fs.mkdirSync(outDir, { recursive: true });

  const fileUrl = `https://api.figma.com/v1/files/${fileKey}`;
  const fileJson = await figmaFetch(fileUrl, token);
  fs.writeFileSync(path.join(outDir, `file-${fileKey}.json`), JSON.stringify(fileJson, null, 2));

  const rx = /(thinker|builder|maker|creator|launcher|gemini_generated_image|1111)/i;

  const hits = [];
  for (const { node, pageName } of walk(fileJson?.document, "")) {
    const name = String(node?.name ?? "");
    const type = String(node?.type ?? "");
    const b = bounds(node);
    const area = b ? b.width * b.height : 0;
    const interestingName = rx.test(name);
    const interestingType = ["FRAME", "GROUP", "COMPONENT", "INSTANCE", "RECTANGLE"].includes(type);
    const interesting = interestingName || (hasImageFill(node) && interestingType);
    if (!interesting) continue;
    if (!b) continue;
    if (b.width < 120 || b.height < 120) continue;
    hits.push({
      id: node.id,
      type,
      name,
      page: pageName,
      x: Math.round(b.x),
      y: Math.round(b.y),
      w: Math.round(b.width),
      h: Math.round(b.height),
      area,
      hasImageFill: hasImageFill(node),
      visible: node?.visible !== false,
    });
  }

  hits.sort((a, b) => b.area - a.area);
  const top = hits.slice(0, 120);

  console.log(`Found ${hits.length} hits. Top ${top.length} by area:\n`);
  for (const h of top) {
    const flags = [
      h.visible ? "vis" : "hid",
      h.hasImageFill ? "img" : "—",
    ].join(",");
    console.log(`${h.id} | ${h.type} | ${h.w}x${h.h} @ ${h.x},${h.y} | ${flags} | ${h.page} / ${h.name}`);
  }

  console.log("\nTip: export interesting IDs via scripts/figma-pull.mjs <fileKey> <nodeId>.");
}

main().catch((e) => {
  console.error(e?.stack || String(e));
  process.exit(1);
});

