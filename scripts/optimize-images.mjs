// Converts site-referenced images to resized WebP with clean slug names,
// deduplicates identical source files by content hash, and rewrites all
// references in src/. Originals in public/images are left untouched.
// Usage: node scripts/optimize-images.mjs
import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SRC = join(ROOT, "src");
const IMG_DIR = join(ROOT, "public", "images");
const MAX_WIDTH = 2000;
const QUALITY = 78;

// Collect all .astro files under src/
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".astro") ? [p] : [];
  });
}
const srcFiles = walk(SRC);

// Extract /images/... references (raw and %20-encoded)
// terminate at quotes/parens/query only — filenames may contain spaces
const refRe = /\/images\/[^"'()?]+/g;
const refs = new Set();
for (const f of srcFiles) {
  for (const m of readFileSync(f, "utf8").matchAll(refRe)) refs.add(m[0]);
}

const slugify = (name) =>
  name
    .replace(/\.(jpg|jpeg|png)(\.(jpg|jpeg|png))*$/i, "")
    .replace(/\.(MP|PORTRAIT)$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const byHash = new Map(); // content hash -> slug (dedupe)
const mapping = []; // { ref, newRef }
let saved = 0;

for (const ref of refs) {
  const rawName = decodeURIComponent(ref.replace("/images/", ""));
  const ext = extname(rawName).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue; // skip svg/ico/etc.
  const srcPath = join(IMG_DIR, rawName);
  let buf;
  try {
    buf = readFileSync(srcPath);
  } catch {
    console.warn(`SKIP missing: ${rawName}`);
    continue;
  }
  const hash = createHash("md5").update(buf).digest("hex");
  let slug = byHash.get(hash);
  if (!slug) {
    slug = slugify(rawName);
    // avoid slug collisions between different images
    while ([...byHash.values()].includes(slug)) slug += "-2";
    byHash.set(hash, slug);
    const img = sharp(buf, { failOn: "none" }).rotate();
    const meta = await img.metadata();
    const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);
    const out = await img.resize({ width, withoutEnlargement: true }).webp({ quality: QUALITY }).toBuffer();
    writeFileSync(join(IMG_DIR, `${slug}.webp`), out);
    saved += buf.length - out.length;
    console.log(`${rawName} -> ${slug}.webp  (${(buf.length / 1e6).toFixed(1)}MB -> ${(out.length / 1e3).toFixed(0)}KB)`);
  }
  mapping.push({ ref, newRef: `/images/${slug}.webp` });
}

// Rewrite references in src files
for (const f of srcFiles) {
  let text = readFileSync(f, "utf8");
  const before = text;
  for (const { ref, newRef } of mapping) text = text.split(ref).join(newRef);
  if (text !== before) {
    writeFileSync(f, text);
    console.log(`updated refs: ${f.replace(ROOT, "")}`);
  }
}

console.log(`\nTotal saved on referenced set: ${(saved / 1e6).toFixed(1)} MB across ${byHash.size} unique images`);
