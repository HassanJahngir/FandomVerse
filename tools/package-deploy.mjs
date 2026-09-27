import fs from "node:fs";
import { ZipArchive } from "archiver";

if (!fs.existsSync("dist/index.html")) {
  throw new Error("Build the site with npm run build before packaging deployment files.");
}
fs.mkdirSync("submission", { recursive: true });
const output = fs.createWriteStream("submission/FandomVerse-deploy.zip");
const archive = new ZipArchive({ zlib: { level: 9 } });
archive.on("error", (error) => { throw error; });
archive.pipe(output);
archive.directory("dist", false);
await archive.finalize();
await new Promise((resolve, reject) => {
  output.on("close", resolve);
  output.on("error", reject);
});
console.log(`Packaged ${archive.pointer()} bytes to submission/FandomVerse-deploy.zip`);
