import fs from "node:fs/promises";
import sharp from "sharp";
import { createHash } from "node:crypto";
const entries = [
  {
    file: "Star Wars Celebration, Anaheim 2022.jpg",
    name: "star-wars-celebration-2022",
    category: "movies",
    alt: "Fans at Star Wars Celebration in Anaheim, 2022",
    creator: "Bluesnote",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    file: "Doctor Who Experience (29349401791).jpg",
    name: "doctor-who-experience-2016",
    category: "tv",
    alt: "Inside the Doctor Who Experience in Cardiff, 2016",
    creator: "Armina",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    file: "San Diego Comic Con 2019 (48344445402).jpg",
    name: "sdcc-2019",
    category: "comics",
    alt: "San Diego Comic-Con at the San Diego Convention Center, 2019",
    creator: "Gage Skidmore",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  {
    file: "BTS at the White House on May 31, 2022.jpg",
    name: "bts-white-house-2022",
    category: "kpop",
    alt: "The seven members of BTS at the White House in 2022",
    creator: "The White House",
    license: "Public domain",
    licenseUrl:
      "https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/United_States#Works_of_the_federal_government",
  },
  {
    file: "BTS at the White House on May 31, 2022 03.jpg",
    name: "bts-white-house-2022-group",
    category: "kpop",
    alt: "BTS at the White House, May 31, 2022",
    creator: "The White House",
    license: "Public domain",
    licenseUrl:
      "https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/United_States#Works_of_the_federal_government",
  },
];
await fs.mkdir("tmp/media", { recursive: true });
await fs.mkdir("public/media", { recursive: true });
const records = [];
for (const entry of entries) {
  const normalized = entry.file.replaceAll(" ", "_");
  const hash = createHash("md5").update(normalized).digest("hex");
  const originalUrl = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(normalized)}`;
  const asset = await fetch(originalUrl, {
    headers: {
      "User-Agent": "FandomVerseCompetition/1.0 educational media audit",
    },
  });
  if (!asset.ok) throw new Error(`Download ${asset.status}: ${entry.file}`);
  if (!asset.headers.get("content-type")?.startsWith("image/"))
    throw new Error(`Non-image response: ${entry.file}`);
  const bytes = Buffer.from(await asset.arrayBuffer());
  await fs.writeFile(`tmp/media/${entry.name}.source`, bytes);
  for (const width of [480, 960])
    for (const format of ["webp", "avif"])
      await sharp(bytes)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        [format]({ quality: format === "avif" ? 50 : 79 })
        .toFile(`public/media/${entry.name}-${width}.${format}`);
  const record = {
    ...entry,
    src: `/media/${entry.name}-960.webp`,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(normalized)}`,
    originalUrl,
    permissionBasis:
      entry.license === "Public domain"
        ? "U.S. federal employee work published by the White House, identified as public domain on the source page"
        : `Creative Commons ${entry.license} on Wikimedia file page`,
    changes:
      "Resized and converted to WebP and AVIF; preview may crop. Original work credited and not endorsed.",
    verifiedAt: "2026-09-26",
  };
  records.push(record);
  await fs.writeFile(
    "docs/assets-remaining.json",
    JSON.stringify(records, null, 2),
  );
  console.log(
    JSON.stringify({
      name: entry.name,
      license: entry.license,
      creator: entry.creator,
      bytes: bytes.length,
    }),
  );
}
