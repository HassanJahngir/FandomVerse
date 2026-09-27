import fs from "node:fs";
import path from "node:path";
import { ZipArchive } from "archiver";

fs.mkdirSync("submission", { recursive: true });
const output = fs.createWriteStream("submission/FandomVerse-source.zip");
const archive = new ZipArchive({ zlib: { level: 9 } });
archive.on("warning", (error) => {
  if (error.code !== "ENOENT") throw error;
  console.warn(error.message);
});
archive.on("error", (error) => {
  throw error;
});
archive.pipe(output);

for (const name of [
  "src",
  "public",
  "tests",
  "tools",
  "docs",
]) {
  archive.glob("**/*", {
    cwd: name,
    dot: false,
    ignore: ["screenshots/**", "audits/**", "srs-extracted.txt"],
  }, {
    prefix: name,
  });
}
for (const name of [
  "index.html",
  ".vercelignore",
  "package.json",
  "package-lock.json",
  "vite.config.js",
  "vercel.json",
  "playwright.config.js",
  "README.md",
  "ReadMe.doc",
  "ReadMe.rtf",
]) {
  if (fs.existsSync(name)) archive.file(name, { name: path.basename(name) });
}
await archive.finalize();
await new Promise((resolve, reject) => {
  output.on("close", resolve);
  output.on("error", reject);
});
console.log(`Packaged ${archive.pointer()} bytes to submission/FandomVerse-source.zip`);
