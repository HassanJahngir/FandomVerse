import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

// Each Wikimedia file page was checked for its photographer and CC license.
// These are photographs of cosplay, never official anime frames or key art.
const photos = [
  {
    name: "anime-tanjiro-cosplay",
    file: "Cosplay of Tanjiro Kamado from Demon Slayer Kimetsu no Yaiba at FanimeCon 2023 (53056126228).jpg",
    creator: "LX-Designs (Alex Wong)",
    alt: "Demon Slayer cosplayers at FanimeCon 2023, with Tanjiro Kamado in the center",
  },
  {
    name: "anime-nezuko-cosplay",
    file: "Cosplay of Nezuko Kamado at Made in Asia 2022 (52129814711).jpg",
    creator: "Kiri Karma",
    alt: "Fan cosplaying as Nezuko Kamado at Made in Asia 2022",
  },
  {
    name: "anime-zenitsu-cosplay",
    file: "Cosplay of Nezuko Kamado and Zenitsu Agatsuma from Demon Slayer Kimetsu no Yaiba at FanimeCon 2023 (53056018850).jpg",
    creator: "LX-Designs (Alex Wong)",
    alt: "Fans cosplaying as Nezuko Kamado and Zenitsu Agatsuma at FanimeCon 2023",
  },
  {
    name: "anime-inosuke-cosplay",
    file: "Cosplay of Inosuke Hashibira at Made in Asia 2022 (52115543600).jpg",
    creator: "Miguel Discart",
    alt: "Fan cosplaying as Inosuke Hashibira at Made in Asia 2022",
  },
  {
    name: "anime-giyu-cosplay",
    file: "Cosplayers of Giyū Tomioka and Shinobu Kochō 20200907a.jpg",
    creator: "Kaisars Fang",
    alt: "Fans cosplaying as Giyu Tomioka and Shinobu Kocho in 2020",
  },
  {
    name: "anime-demon-slayer-group-cosplay",
    file: "Cosplay of Tanjiro Kamado, Nezuko Kamado and Zenitsu Agatsuma from Demon Slayer Kimetsu no Yaiba at FanimeCon 2023 (53055055252).jpg",
    creator: "LX-Designs (Alex Wong)",
    alt: "Fans cosplaying as Tanjiro, Nezuko, and Zenitsu at FanimeCon 2023",
  },
];

await fs.mkdir("public/media", { recursive: true });
const register = JSON.parse(
  await fs.readFile("docs/assets-anime-cosplay.json", "utf8").catch(() => "[]"),
);
const selected = process.argv[2]
  ? photos.filter((photo) => photo.name === process.argv[2])
  : photos;
if (!selected.length) throw new Error("No matching asset selected");
for (const photo of selected) {
  const remoteName = photo.file.replaceAll(" ", "_");
  const hash = createHash("md5").update(remoteName).digest("hex");
  const originalUrl = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(remoteName)}`;
  const response = await fetch(originalUrl, {
    headers: {
      "User-Agent": "FandomVerseCompetition/1.0 (educational CC media audit)",
    },
  });
  if (
    !response.ok ||
    !response.headers.get("content-type")?.startsWith("image/")
  )
    throw new Error(
      `Could not download image ${photo.file}: HTTP ${response.status}`,
    );
  const original = Buffer.from(await response.arrayBuffer());
  if (original.length < 20_000)
    throw new Error(`Suspiciously small image: ${photo.file}`);
  const info = await sharp(original).metadata();
  if (info.format !== "jpeg")
    throw new Error(`Unexpected format: ${photo.file}`);
  for (const width of [480, 960]) {
    for (const format of ["webp", "avif"]) {
      await sharp(original)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        [format]({ quality: format === "avif" ? 49 : 76 })
        .toFile(`public/media/${photo.name}-${width}.${format}`);
    }
  }
  const record = {
    ...photo,
    files: `${photo.name}-{480,960}.{avif,webp}`,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(remoteName)}`,
    originalUrl,
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    permissionBasis:
      "Creative Commons license on the Wikimedia Commons file page, with Flickr review where applicable",
    changes:
      "Resized and converted from JPEG to WebP and AVIF; the interface may crop previews. No endorsement implied.",
    verifiedAt: "2026-09-26",
    originalBytes: original.length,
  };
  const old = register.findIndex((asset) => asset.name === photo.name);
  if (old === -1) register.push(record);
  else register[old] = record;
  await fs.writeFile(
    "docs/assets-anime-cosplay.json",
    JSON.stringify(register, null, 2),
  );
  console.log(
    `${photo.name}: ${info.width}x${info.height}, ${original.length} source bytes`,
  );
}
