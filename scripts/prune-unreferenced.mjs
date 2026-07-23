// Moves images in public/images that are no longer referenced anywhere in
// src/ to source-media/originals/ (local backup; also in git history).
// Keeps all .webp and og-*.jpg regardless. Prints what it moved.
// Usage: node scripts/prune-unreferenced.mjs
import { readFileSync, readdirSync, statSync, renameSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SRC = join(ROOT, "src");
const IMG_DIR = join(ROOT, "public", "images");
const BACKUP = join(ROOT, "source-media", "originals");
mkdirSync(BACKUP, { recursive: true });

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".astro") ? [p] : [];
  });
}

const refRe = /\/images\/[^"'()?]+/g;
const referenced = new Set();
for (const f of walk(SRC)) {
  for (const m of readFileSync(f, "utf8").matchAll(refRe)) {
    referenced.add(decodeURIComponent(m[0].replace("/images/", "")).trim());
  }
}

let moved = 0, movedBytes = 0, kept = 0;
for (const name of readdirSync(IMG_DIR)) {
  const keep = name.endsWith(".webp") || /^og-/.test(name) || referenced.has(name);
  if (keep) { kept++; continue; }
  const size = statSync(join(IMG_DIR, name)).size;
  renameSync(join(IMG_DIR, name), join(BACKUP, name));
  moved++; movedBytes += size;
  console.log(`moved: ${name}`);
}
console.log(`\nmoved ${moved} files (${(movedBytes / 1e6).toFixed(1)} MB) to source-media/originals; kept ${kept}`);
