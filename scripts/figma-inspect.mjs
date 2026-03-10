import fs from "node:fs";
import path from "node:path";

function* walk(node, parentPath = []) {
  const nextPath = [...parentPath, node?.name].filter(Boolean);
  yield { node, path: nextPath };
  const kids = node?.children;
  if (Array.isArray(kids)) {
    for (const child of kids) yield* walk(child, nextPath);
  }
}

function pickBounds(n) {
  return n?.absoluteBoundingBox || n?.absoluteRenderBounds || null;
}

function main() {
  const nodeId = process.argv[2] ?? "2:2";
  const jsonPath = process.argv[3] ?? path.join(process.cwd(), "tmp", "figma", `node-${nodeId.replaceAll(":", "-")}.json`);
  const rangeX = Number(process.argv[4] ?? 6500);
  const rangeY = Number(process.argv[5] ?? 2200);
  const raw = fs.readFileSync(jsonPath, "utf8");
  const data = JSON.parse(raw);

  const doc = data?.nodes?.[nodeId]?.document;
  if (!doc) {
    console.error(`Could not find nodes["${nodeId}"].document in ${jsonPath}`);
    process.exit(1);
  }

  const all = [];
  for (const { node, path: p } of walk(doc, [])) {
    const b = pickBounds(node);
    if (!b) continue;
    const { x, y, width: w, height: h } = b;
    all.push({
      id: node.id,
      type: node.type,
      name: node.name,
      x,
      y,
      w,
      h,
      area: w * h,
      path: p.join(" / "),
    });
  }

  const frame = all.find((n) => n.id === nodeId);
  const fx = frame?.x ?? 0;
  const fy = frame?.y ?? 0;

  const candidates = all
    .filter((n) => {
      // inside the main frame area (with some tolerance)
      const inX = n.x >= fx - 200 && n.x <= fx + rangeX;
      const inY = n.y >= fy - 200 && n.y <= fy + rangeY;
      if (!inX || !inY) return false;
      if (n.w < 120 || n.h < 120) return false;
      // ignore the frame itself and gigantic background rectangles
      if (n.w >= 2000 || n.h >= 2000) return false;
      return ["GROUP", "FRAME", "INSTANCE", "COMPONENT", "VECTOR"].includes(n.type);
    })
    .sort((a, b) => b.area - a.area)
    .slice(0, 120);

  console.log(`Top candidates (${candidates.length}) by area (id | type | x y w h | name):\n`);
  for (const n of candidates) {
    console.log(
      `${n.id} | ${n.type} | ${Math.round(n.x)} ${Math.round(n.y)} ${Math.round(n.w)} ${Math.round(n.h)} | ${n.name}`
    );
  }

  console.log("\nHint: rerun with grep on IDs/names that look like characters/crew.");
}

main();

