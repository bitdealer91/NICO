import fs from "node:fs";
import path from "node:path";

function parseTransforms(transform) {
  const ops = [];
  if (!transform) return ops;

  const re = /(translate|scale|rotate)\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(transform))) {
    const type = m[1];
    const nums = m[2]
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((n) => Number(n));
    ops.push({ type, nums });
  }
  return ops;
}

function invertOp(op) {
  if (op.type === "translate") {
    const [x = 0, y = 0] = op.nums;
    return { type: "translate", nums: [-x, -y] };
  }
  if (op.type === "scale") {
    const [sx = 1, sy = sx] = op.nums;
    return { type: "scale", nums: [1 / sx, 1 / sy] };
  }
  if (op.type === "rotate") {
    const [a = 0, cx, cy] = op.nums;
    // If rotate has a center, preserve it in inverse too.
    return cx != null && cy != null ? { type: "rotate", nums: [-a, cx, cy] } : { type: "rotate", nums: [-a] };
  }
  return op;
}

function stringifyTransforms(ops) {
  if (!ops.length) return "";
  return ops
    .map((op) => {
      const args = op.nums.map((n) => (Number.isFinite(n) ? String(n) : "0")).join(" ");
      return `${op.type}(${args})`;
    })
    .join(" ");
}

function extractCrewInner(svgText) {
  const crewStart = svgText.indexOf('<g id="CREW"');
  if (crewStart === -1) throw new Error('Could not find `<g id="CREW"...>`');

  const defsStart = svgText.indexOf("<defs", crewStart);
  const end = defsStart !== -1 ? defsStart : svgText.lastIndexOf("</svg>");
  if (end === -1) throw new Error("Could not find end of SVG");

  const segment = svgText.slice(crewStart, end);
  const openEnd = segment.indexOf(">");
  if (openEnd === -1) throw new Error("Malformed CREW group open tag");

  const afterOpen = segment.slice(openEnd + 1);
  const closeIdx = afterOpen.lastIndexOf("</g>");
  if (closeIdx === -1) throw new Error("Malformed CREW group close tag");

  return afterOpen.slice(0, closeIdx).trim();
}

function extractClipRectTransform(svgText) {
  const m = svgText.match(/<rect\s+width="968"\s+height="908"[^>]*\stransform="([^"]+)"/);
  return m?.[1] ?? null;
}

function main() {
  const inPath = process.argv[2];
  const outPath = process.argv[3];
  const noClip = process.argv.includes("--no-clip");
  if (!inPath || !outPath) {
    console.error("Usage: node scripts/normalize-figma-crew-svg.mjs <in.svg> <out.svg> [--no-clip]");
    process.exit(1);
  }

  const raw = fs.readFileSync(inPath, "utf8");
  const inner = extractCrewInner(raw);

  const clipTransform = extractClipRectTransform(raw);
  const ops = parseTransforms(clipTransform);
  const inverse = ops.slice().reverse().map(invertOp);
  const inverseTransform = stringifyTransforms(inverse);

  const normalized = [
    '<svg width="968" height="908" viewBox="0 0 968 908" fill="none" xmlns="http://www.w3.org/2000/svg" overflow="visible">',
    ...(noClip
      ? []
      : [
          "<defs>",
          '  <clipPath id="clip">',
          '    <rect width="968" height="908" fill="white"/>',
          "  </clipPath>",
          "</defs>",
        ]),
    `  <g${noClip ? "" : ' clip-path="url(#clip)"'}${inverseTransform ? ` transform="${inverseTransform}"` : ""}>`,
    inner
      .split("\n")
      .map((l) => "    " + l)
      .join("\n"),
    "  </g>",
    "</svg>",
    "",
  ].join("\n");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, normalized, "utf8");
  console.log(`Wrote ${outPath}`);
}

main();

