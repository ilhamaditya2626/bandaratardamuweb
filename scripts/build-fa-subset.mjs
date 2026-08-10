// Membuat subset Font Awesome yang di-host sendiri.
// - Memindai src/ untuk semua kelas `fa-xxx` yang dipakai.
// - Membuat woff2 subset (hanya glyph yang dipakai) di public/fonts/fa/.
// - Membuat public/css/fa-subset.css dengan nama kelas fa-* yang SAMA,
//   sehingga markup <i className="fa-..."> tidak perlu diubah.
//
// Jalankan: node scripts/build-fa-subset.mjs
import fs from "node:fs";
import path from "node:path";
import { fontawesomeSubset } from "fontawesome-subset";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, "src");
const FONT_OUT = path.join(ROOT, "public", "fonts", "fa");
const CSS_OUT = path.join(ROOT, "public", "css", "fa-subset.css");

const MODIFIERS = new Set([
  "fa-solid", "fa-brands", "fa-regular", "fa-light", "fa-thin", "fa-duotone",
  "fa-spin", "fa-fw", "fa-pulse", "fa-beat", "fa-fade", "fa-bounce",
  "fa-flip", "fa-shake", "fa-border", "fa-inverse", "fa-stack",
  "fa-2xs", "fa-xs", "fa-sm", "fa-lg", "fa-xl", "fa-2xl",
  "fa-1x", "fa-2x", "fa-3x", "fa-4x", "fa-5x", "fa-6x", "fa-7x", "fa-8x", "fa-9x", "fa-10x",
  "fa-subset", // dari nama file /css/fa-subset.css, bukan ikon
]);

// Ikon yang dipakai dengan style "regular" (outline) di markup.
const REGULAR = new Set(["clock", "comment-dots", "calendar", "newspaper"]);

// ── 1. Kumpulkan semua nama ikon yang dipakai ─────────────────
function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(full);
  }
  return out;
}

const used = new Set();
for (const file of walk(SRC)) {
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(/fa-([a-z0-9-]+)/g)) {
    const cls = `fa-${m[1]}`;
    if (!MODIFIERS.has(cls)) used.add(m[1]);
  }
}

// ── 2. Klasifikasikan per style dari metadata FA ──────────────
const metadata = require("@fortawesome/fontawesome-free/metadata/icon-families.json");

// Peta alias → nama kanonik (mis. info-circle → circle-info di FA6).
const aliasToCanonical = {};
for (const [canon, meta] of Object.entries(metadata)) {
  for (const alias of meta.aliases?.names || []) aliasToCanonical[alias] = canon;
}

const brands = [];
const solid = [];
const regular = [];
const contentByName = {};
const missing = [];

for (const name of [...used].sort()) {
  const canon = metadata[name] ? name : aliasToCanonical[name];
  const meta = canon ? metadata[canon] : null;
  if (!meta) { missing.push(name); continue; }
  contentByName[name] = meta.unicode; // hex, mis. "f072"
  const freeStyles = (meta.familyStylesByLicense?.free || []).map((s) => s.style);
  // Selalu subset pakai nama kanonik supaya glyph pasti masuk.
  if (freeStyles.includes("brands")) {
    brands.push(canon);
  } else {
    if (freeStyles.includes("solid")) solid.push(canon);
    if (REGULAR.has(name) && freeStyles.includes("regular")) regular.push(canon);
  }
}

if (missing.length) {
  console.warn("⚠ Ikon tak ditemukan di metadata (diabaikan):", missing.join(", "));
}

console.log(`Ikon dipakai: ${used.size} | solid ${solid.length}, brands ${brands.length}, regular ${regular.length}`);

// ── 3. Generate woff2 subset ──────────────────────────────────
fs.mkdirSync(FONT_OUT, { recursive: true });
const subsetInput = { solid, brands };
if (regular.length) subsetInput.regular = regular;
await fontawesomeSubset(subsetInput, FONT_OUT, { targetFormats: ["woff2"] });

// ── 4. Generate CSS ───────────────────────────────────────────
// Aturan ::before dibuat untuk setiap nama yang DIPAKAI (termasuk alias),
// dengan unicode kanoniknya. Glyph-nya sudah masuk font via nama kanonik.
const iconRules = Object.keys(contentByName)
  .sort()
  .map((name) => `.fa-${name}::before{content:"\\${contentByName[name]}"}`)
  .join("\n");

const css = `/* Font Awesome 6 Free — SUBSET (dibuat otomatis oleh scripts/build-fa-subset.mjs)
   Hanya berisi ${used.size} ikon yang dipakai. Jangan diedit manual. */
@font-face{font-family:"Font Awesome 6 Free";font-style:normal;font-weight:900;font-display:swap;src:url(/fonts/fa/fa-solid-900.woff2) format("woff2")}
@font-face{font-family:"Font Awesome 6 Free";font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/fa/fa-regular-400.woff2) format("woff2")}
@font-face{font-family:"Font Awesome 6 Brands";font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/fa/fa-brands-400.woff2) format("woff2")}
.fa,.fas,.fa-solid,.far,.fa-regular,.fab,.fa-brands{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:var(--fa-display,inline-block);font-style:normal;font-variant:normal;line-height:1;text-rendering:auto}
.fa,.fas,.fa-solid{font-family:"Font Awesome 6 Free";font-weight:900}
.far,.fa-regular{font-family:"Font Awesome 6 Free";font-weight:400}
.fab,.fa-brands{font-family:"Font Awesome 6 Brands";font-weight:400}
.fa-fw{text-align:center;width:1.25em}
.fa-spin{animation:fa-spin 2s linear infinite}
@keyframes fa-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
${iconRules}
`;

fs.mkdirSync(path.dirname(CSS_OUT), { recursive: true });
fs.writeFileSync(CSS_OUT, css, "utf8");

// Laporan ukuran
const sizes = fs.readdirSync(FONT_OUT).map((f) => {
  const kb = (fs.statSync(path.join(FONT_OUT, f)).size / 1024).toFixed(1);
  return `  ${f}: ${kb} KiB`;
});
console.log("Woff2 subset:");
console.log(sizes.join("\n"));
console.log(`CSS: ${CSS_OUT} (${(fs.statSync(CSS_OUT).size / 1024).toFixed(1)} KiB)`);
