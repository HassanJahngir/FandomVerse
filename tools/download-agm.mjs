import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const entries = [
  {
    file: "Anime Expo 2015 panorama (19875315555).jpg",
    name: "anime-expo-panorama",
    category: "anime",
  },
  {
    file: "ESL stage Gamescom 2019 (48605708741).jpg",
    name: "gamescom-esl-stage",
    category: "gaming",
  },
  {
    file: "Ken Akamatsu at Japan Expo 20150705.jpg",
    name: "ken-akamatsu-japan-expo",
    category: "manga",
  },
  {
    file: "Tales of Zestiria - Anime Expo 2015 Trailer.webm",
    name: "tales-zestiria-original",
    category: "gaming",
    video: true,
  },
];
await fs.mkdir("tmp/media", { recursive: true });
await fs.mkdir("public/media", { recursive: true });
const report = [];
for (const entry of entries) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.search = new URLSearchParams({
    action: "query",
    format: "json",
    titles: `File:${entry.file}`,
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
  });
  const response = await fetch(api, {
    headers: {
      "User-Agent": "FandomVerseCompetition/1.0 (educational asset research)",
    },
  });
  if (!response.ok) throw new Error(`Metadata ${response.status}`);
  const data = await response.json();
  const info = Object.values(data.query.pages)[0].imageinfo?.[0];
  if (!info) throw new Error(`No file: ${entry.file}`);
  const metadata = info.extmetadata;
  const clean = (value) =>
    (value || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&");
  const record = {
    ...entry,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(entry.file.replaceAll(" ", "_"))}`,
    originalUrl: info.url,
    creator: clean(metadata.Artist?.value),
    license: clean(metadata.LicenseShortName?.value),
    licenseUrl: metadata.LicenseUrl?.value,
    description: clean(metadata.ImageDescription?.value),
    verifiedAt: "2026-09-26",
    metadata,
  };
  // Do not download a file unless explicit reusable terms are present.
  if (!/CC BY|public domain|CC0/i.test(record.license))
    throw new Error(`Uncleared license ${record.license}`);
  console.log(
    JSON.stringify({
      name: entry.name,
      license: record.license,
      creator: record.creator,
      url: info.url,
    }),
  );
  const asset = await fetch(info.url, {
    headers: { "User-Agent": "FandomVerseCompetition/1.0" },
  });
  if (!asset.ok) throw new Error(`Download ${asset.status}: ${entry.file}`);
  const bytes = Buffer.from(await asset.arrayBuffer());
  const originalPath = path.join("tmp/media", entry.file);
  await fs.writeFile(originalPath, bytes);
  if (!entry.video) {
    for (const width of [480, 960])
      for (const format of ["webp", "avif"])
        await sharp(bytes)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          [format]({ quality: format === "avif" ? 50 : 79 })
          .toFile(`public/media/${entry.name}-${width}.${format}`);
    record.src = `/media/${entry.name}-960.webp`;
  } else record.originalPath = originalPath;
  report.push(record);
  await fs.writeFile("docs/assets-agm.json", JSON.stringify(report, null, 2));
}
