import { cp, access, constants, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "_next");
const dest = path.join(root, "dist", "_next");

async function main() {
  try {
    await access(src, constants.R_OK);
  } catch {
    console.warn("[copy-next-assets] _next folder not found, skipping copy.");
    return;
  }

  await mkdir(path.dirname(dest), { recursive: true });
  await cp(src, dest, { recursive: true, force: true });
  console.log("[copy-next-assets] Copied _next assets to dist/_next");
}

main().catch((err) => {
  console.error("[copy-next-assets] Failed:", err);
  process.exit(1);
});
