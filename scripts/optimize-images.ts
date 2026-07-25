/**
 * Re-encode the painted game art to WebP.
 *
 *   bun scripts/optimize-images.ts [--quality 82] [--dry]
 *
 * The illustrations are generated as PNG masters (see docs/illustrations-prompts.csv)
 * — the right format to archive, the wrong one to ship: 19 MB of lossless paint was
 * being downloaded to fill tiles as small as 56 px. WebP at q82 holds the brushwork
 * and the chiaroscuro while cutting that by ~92%.
 *
 * `brand_icon` and `brand_og` deliberately stay PNG: they are consumed by favicons
 * and social scrapers rather than by players, and not every scraper reads WebP.
 *
 * PNG masters remain in git history, so a re-encode is always recoverable:
 *   git show <commit>:public/assets/images/<name>.png > <name>.png
 */
import { readdir, unlink, stat } from "node:fs/promises";
import { createRequire } from "node:module";

const DIR = new URL("../public/assets/images/", import.meta.url).pathname;
/** Consumed by scrapers and favicons, where PNG is still the safe bet. */
const KEEP_PNG = new Set(["brand_icon.png", "brand_og.png"]);

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const quality = Number(args[args.indexOf("--quality") + 1]) || 82;

const cwebp = (createRequire(import.meta.url)("cwebp-bin") as { default?: string } | string);
const CWEBP = typeof cwebp === "string" ? cwebp : cwebp.default!;

const kb = (n: number) => `${(n / 1024).toFixed(0)} Ko`;

async function main() {
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".png") && !KEEP_PNG.has(f)).sort();
  if (!files.length) { console.log("Rien à convertir — tout est déjà en WebP."); return; }

  let before = 0;
  let after = 0;
  for (const png of files) {
    const webp = png.replace(/\.png$/, ".webp");
    const sizeBefore = (await stat(DIR + png)).size;
    before += sizeBefore;

    if (dry) { console.log(`  · ${png} → ${webp} (${kb(sizeBefore)})`); continue; }

    const proc = Bun.spawn([CWEBP, "-quiet", "-q", String(quality), "-m", "6", DIR + png, "-o", DIR + webp]);
    if ((await proc.exited) !== 0) { console.error(`  ✗ échec sur ${png}`); process.exit(1); }

    const sizeAfter = (await stat(DIR + webp)).size;
    after += sizeAfter;
    await unlink(DIR + png);
    console.log(`  ✓ ${webp} — ${kb(sizeBefore)} → ${kb(sizeAfter)}`);
  }

  if (!dry) console.log(`\n${files.length} images · ${kb(before)} → ${kb(after)} (−${(100 - (100 * after) / before).toFixed(0)}%)`);
}

await main();
