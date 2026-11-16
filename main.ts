// Entry point: copy the bundled image to the make.fun output directory.
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve entry.png relative to this file, so the script works from any cwd.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

// Output directory comes from the environment; make.fun uses /output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const dest = join(outputDir, "entry.png");

try {
  // Guard: the bundled image must exist before we attempt the copy.
  statSync(source);
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(source, dest);

  // Guard: a zero-byte output means the copy silently failed; treat it as an error.
  const written = statSync(dest).size;
  if (written === 0) {
    throw new Error("copied image is empty (0 bytes)");
  }
} catch (err) {
  // Fail loudly on stderr and exit non-zero so the harness sees the failure.
  console.error(`entry: failed to copy ${source} -> ${dest}: ${(err as Error).message}`);
  process.exit(1);
}
