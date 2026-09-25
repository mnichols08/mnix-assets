import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { validateAssets } from "../schema/validate.mjs";
validateAssets(JSON.parse(await readFile("manifest.json", "utf8")));
const files = execFileSync("git", ["ls-files", "-z"], {
  encoding: "utf8",
}).split("\0");
for (const file of files) {
  if (
    /\.(zip|iso|img|ima|7z|rar|vhdx?|qcow2?|vmdk|exe|com|sys|dll|bin|wasm)(\.gz)?$/i.test(
      file,
    )
  )
    throw new Error(`Binaries belong in Releases, not Git: ${file}`);
}
console.log(
  "Metadata validated; Git contains no downloadable binary packages.",
);
