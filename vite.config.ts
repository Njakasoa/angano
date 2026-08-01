import { execFileSync } from "node:child_process";
import { defineConfig, type Plugin } from "vite";

const git = (...args: string[]): string | null => {
  try { return execFileSync("git", args, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || null; }
  catch { return null; } // not a checkout (CI tarball, docker context) — not a failure
};

/**
 * Stamp the build into `dist/version.json`.
 *
 * Nothing in a deployed bundle says which commit produced it, so "is the fix live?"
 * used to be answered by diffing assets by hand. `scripts/check-live.ts` reads this
 * file and answers in one line. `public/_headers` only caches `/assets/*` for a year,
 * so this one stays revalidated.
 */
function buildStamp(): Plugin {
  return {
    name: "angano-build-stamp",
    generateBundle() {
      const stamp = {
        sha: process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ?? git("rev-parse", "--short", "HEAD") ?? "unknown",
        branch: process.env.CF_PAGES_BRANCH ?? git("rev-parse", "--abbrev-ref", "HEAD") ?? "unknown",
        builtAt: new Date().toISOString(),
      };
      this.emitFile({ type: "asset", fileName: "version.json", source: JSON.stringify(stamp, null, 2) + "\n" });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [buildStamp()],
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
