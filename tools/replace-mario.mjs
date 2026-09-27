import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const file = "Cosplay of Mario at Brussels Comic Con 2019 (40335217333).jpg";
const remoteName = file.replaceAll(" ", "_");
const hash = createHash("md5").update(remoteName).digest("hex");
const originalUrl = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(remoteName)}`;
const response = await fetch(originalUrl, { headers: { "User-Agent": "FandomVerseCompetition/1.0 (educational CC media audit)" } });
if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error(`Download failed: ${response.status}`);
const bytes = Buffer.from(await response.arrayBuffer());
const info = await sharp(bytes).metadata();
if (info.format !== "jpeg" || bytes.length < 20000) throw new Error("Unexpected Mario image source");
for (const width of [480, 960]) for (const format of ["webp", "avif"])
  await sharp(bytes).rotate().resize({ width, withoutEnlargement: true })[format]({ quality: format === "avif" ? 49 : 76 }).toFile(`public/media/gaming-mario-cosplay-${width}.${format}`);
const register = JSON.parse(await fs.readFile("docs/assets-gaming-cosplay.json", "utf8"));
Object.assign(register.find((entry) => entry.id === "gaming-profile-mario"), {
  file,
  creator: "Miguel Discart",
  license: "CC BY-SA 2.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  alt: "Fan cosplaying as Mario at Brussels Comic Con 2019",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Cosplay_of_Mario_at_Brussels_Comic_Con_2019_(40335217333).jpg",
  originalUrl,
  permissionBasis: "Creative Commons Attribution-ShareAlike 2.0 license on Wikimedia Commons, confirmed by Flickr review",
  originalBytes: bytes.length,
});
await fs.writeFile("docs/assets-gaming-cosplay.json", JSON.stringify(register, null, 2) + "\n");
console.log(`Replaced Mario photo: ${info.width}x${info.height}, ${bytes.length} bytes`);
