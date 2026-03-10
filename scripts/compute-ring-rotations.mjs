import fs from "node:fs";
import path from "node:path";

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function* walk(node) {
  yield node;
  const kids = node?.children;
  if (Array.isArray(kids)) for (const c of kids) yield* walk(c);
}

function deg360(rad) {
  const d = (rad * 180) / Math.PI;
  return (d + 360) % 360;
}

function smooth1d(arr, win = 11) {
  const r = Math.floor(win / 2);
  const out = new Array(arr.length).fill(0);
  for (let i = 0; i < arr.length; i++) {
    let s = 0;
    for (let k = -r; k <= r; k++) {
      const j = (i + k + arr.length) % arr.length;
      s += arr[j];
    }
    out[i] = s / win;
  }
  return out;
}

function findPeaks(arr, count, minSep = 35) {
  const peaks = [];
  const used = new Array(arr.length).fill(false);

  for (let iter = 0; iter < count * 6; iter++) {
    let bestI = -1;
    let bestV = -Infinity;
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue;
      if (arr[i] > bestV) {
        bestV = arr[i];
        bestI = i;
      }
    }
    if (bestI === -1) break;

    peaks.push({ deg: bestI, value: bestV });
    for (let k = -minSep; k <= minSep; k++) used[(bestI + k + arr.length) % arr.length] = true;
    if (peaks.length >= count) break;
  }

  return peaks.sort((a, b) => b.value - a.value);
}

function nearest(target, options) {
  let best = options[0];
  let bestDist = Infinity;
  for (const o of options) {
    const d = Math.min(Math.abs(o - target), 360 - Math.abs(o - target));
    if (d < bestDist) {
      best = o;
      bestDist = d;
    }
  }
  return best;
}

function main() {
  const labelsNodePath = path.join(process.cwd(), "tmp", "figma", "node-80-401.json");
  const circleNodePath = path.join(process.cwd(), "tmp", "figma", "node-80-443.json");

  const labelsJson = readJson(labelsNodePath);
  const circleJson = readJson(circleNodePath);

  const labelsDoc = labelsJson?.nodes?.["80:401"]?.document;
  const circleDoc = circleJson?.nodes?.["80:443"]?.document;
  if (!labelsDoc || !circleDoc) throw new Error("Missing docs");

  const bb = circleDoc.absoluteBoundingBox;
  const cx = bb.x + bb.width / 2;
  const cy = bb.y + bb.height / 2;

  const hist = new Array(360).fill(0);
  for (const n of walk(labelsDoc)) {
    if (n?.type !== "VECTOR") continue;
    const b = n.absoluteBoundingBox;
    if (!b) continue;
    const x = b.x + b.width / 2;
    const y = b.y + b.height / 2;
    const area = Math.max(1, b.width * b.height);
    const d = deg360(Math.atan2(y - cy, x - cx));
    hist[Math.floor(d)] += area;
  }

  const sm = smooth1d(hist, 17);
  const peaks = findPeaks(sm, 4, 45).map((p) => p.deg);

  // Map peaks to the 4 labels by nearest expected positions around the ring.
  const expected = {
    thinker: 270,
    builder: 315,
    creator: 0,
    launcher: 60,
  };

  const remaining = new Set(peaks);
  const angleById = {};
  for (const [id, exp] of Object.entries(expected)) {
    const opt = Array.from(remaining);
    const pick = nearest(exp, opt);
    angleById[id] = pick;
    remaining.delete(pick);
  }

  const target = 90; // bottom center (SVG/DOM coordinates: +Y down)
  const rotations = {};
  for (const [id, ang] of Object.entries(angleById)) {
    let rot = target - ang;
    // normalize to [-180..180] for nicer animation
    rot = ((rot + 180) % 360) - 180;
    rotations[id] = Math.round(rot * 10) / 10;
  }

  console.log("Circle center:", { cx: Math.round(cx), cy: Math.round(cy) });
  console.log("Peaks(deg):", peaks.sort((a, b) => a - b));
  console.log("Angles:", angleById);
  console.log("Rotations(deg) to bring label to bottom:", rotations);
}

main();

