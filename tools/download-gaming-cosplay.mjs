import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const photos = [
  {
    id: "gaming-profile-mario",
    name: "gaming-mario-cosplay",
    file: "Cosplay of Mario at Brussels Comic Con 2019 (40335217333).jpg",
    creator: "Miguel Discart",
    license: "CC BY-SA 2.0",
    alt: "Fan cosplaying as Mario at Brussels Comic Con 2019",
  },
  {
    id: "gaming-profile-luigi",
    name: "gaming-luigi-cosplay",
    file: "Cosplay of Luigi at Yume ACG Fest 2024.jpg",
    creator: "Chongkian",
    license: "CC BY-SA 4.0",
    alt: "Fan cosplaying as Luigi at Yume ACG Fest 2024",
  },
  {
    id: "gaming-profile-peach",
    name: "gaming-peach-cosplay",
    file: "Princess peach cosplay at Asia Comic Expo 001 2.jpg",
    creator: "Mrb Rafi",
    license: "CC BY-SA 4.0",
    alt: "Fan cosplaying as Princess Peach at Asia Comic Expo 2023",
  },
  {
    id: "gaming-profile-bowser",
    name: "gaming-bowser-cosplay",
    file: "Bowser costume.jpg",
    creator: "Phil! Gold",
    license: "CC BY-SA 2.0",
    alt: "Fan wearing a Bowser costume at Otakon 2006",
  },
  {
    id: "gaming-profile-yoshi",
    name: "gaming-yoshi-cosplay",
    file: "San Diego Comic-Con 2014 - Yoshi (14769237294).jpg",
    creator: "William Tung",
    license: "CC BY-SA 2.0",
    alt: "Fan cosplaying as Yoshi at San Diego Comic-Con 2014",
  },
];

await fs.mkdir("public/media", { recursive: true });
const register = [];
for (const photo of photos) {
  const remoteName = photo.file.replaceAll(" ", "_");
  const hash = createHash("md5").update(remoteName).digest("hex");
  const originalUrl = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(remoteName)}`;
  const response = await fetch(originalUrl, {
    headers: { "User-Agent": "FandomVerseCompetition/1.0 (educational CC media audit)" },
  });
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/"))
    throw new Error(`Could not download ${photo.file}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const info = await sharp(bytes).metadata();
  if (info.format !== "jpeg" || bytes.length < 20_000)
    throw new Error(`Unexpected source image: ${photo.file}`);
  for (const width of [480, 960])
    for (const format of ["webp", "avif"])
      await sharp(bytes)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        [format]({ quality: format === "avif" ? 49 : 76 })
        .toFile(`public/media/${photo.name}-${width}.${format}`);
  register.push({
    ...photo,
    files: `${photo.name}-{480,960}.{avif,webp}`,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(remoteName)}`,
    originalUrl,
    licenseUrl: `https://creativecommons.org/licenses/by-sa/${photo.license.endsWith("4.0") ? "4.0" : "2.0"}/`,
    permissionBasis: "Creative Commons license on the Wikimedia Commons file page; Flickr review where applicable",
    changes: "Resized and converted to WebP and AVIF; previews may crop. No endorsement implied.",
    verifiedAt: "2026-09-26",
    originalBytes: bytes.length,
  });
  await fs.writeFile("docs/assets-gaming-cosplay.json", JSON.stringify(register, null, 2));
  console.log(`${photo.name}: ${info.width}x${info.height}, ${bytes.length} source bytes`);
}
