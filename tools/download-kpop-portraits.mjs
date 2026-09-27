import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
const portraits = [
  {
    id: "kpop-rm",
    file: "190501 BTS RM at the 2019 BBMAs (cropped).png",
    name: "bts-rm-bbmas-2019",
    creator: "Newsen",
    source:
      "https://commons.wikimedia.org/wiki/File:190501_BTS_RM_at_the_2019_BBMAs_(cropped).png",
    alt: "RM at the 2019 Billboard Music Awards",
  },
  {
    id: "kpop-jin",
    file: 'Jin for Dispatch "Boy With Luv" MV behind the scene shooting, 15 March 2019 05.jpg',
    name: "bts-jin-dispatch-2019",
    creator: "Dispatch",
    source:
      "https://commons.wikimedia.org/wiki/File:Jin_for_Dispatch_%22Boy_With_Luv%22_MV_behind_the_scene_shooting,_15_March_2019_05.jpg",
    alt: "Jin in a 2019 Dispatch photo session",
  },
  {
    id: "kpop-suga",
    file: "Suga on the 33rd Golden Disc Awards red carpet, 5 January 2019.jpg",
    name: "bts-suga-gda-2019",
    creator: "Newsen",
    source:
      "https://commons.wikimedia.org/wiki/File:Suga_on_the_33rd_Golden_Disc_Awards_red_carpet,_5_January_2019.jpg",
    alt: "SUGA at the 33rd Golden Disc Awards in 2019",
  },
  {
    id: "kpop-jhope",
    file: "J-Hope on the 33rd Golden Disc Awards red carpet, 5 January 2019 02.jpg",
    name: "bts-jhope-gda-2019",
    creator: "Newsen",
    source:
      "https://commons.wikimedia.org/wiki/File:J-Hope_on_the_33rd_Golden_Disc_Awards_red_carpet,_5_January_2019_02.jpg",
    alt: "j-hope at the 33rd Golden Disc Awards in 2019",
  },
];
const registry = [];
const p = "src/data/kpop.json";
const data = JSON.parse(await fs.readFile(p));
for (const entry of portraits) {
  const profile = data.find((item) => item.id === entry.id);
  if (profile.image) {
    console.log(`Already downloaded ${entry.id}`);
    continue;
  }
  const normalized = entry.file.replaceAll(" ", "_");
  const hash = createHash("md5").update(normalized).digest("hex");
  const url = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(normalized)}`;
  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await fetch(url, {
      headers: { "User-Agent": "FandomVerseCompetition/1.0 media audit" },
    });
    if (response.status !== 429) break;
    console.log(`Rate limited on ${entry.name}; waiting before retry.`);
    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(60000, 15000 * (attempt + 1))),
    );
  }
  if (!response.ok) {
    console.log(
      `${entry.name} unavailable (${response.status}); using accurately labelled BTS group photo.`,
    );
    profile.image = "/media/bts-white-house-2022-960.webp";
    profile.imageAlt = `${profile.title} appears with BTS in a 2022 White House group photograph`;
    profile.sources.push({
      label: "White House BTS group photograph, public domain",
      url: "https://commons.wikimedia.org/wiki/File:BTS_at_the_White_House_on_May_31,_2022.jpg",
    });
    await fs.writeFile(p, JSON.stringify(data, null, 2) + "\n");
    continue;
  }
  if (!response.headers.get("content-type")?.startsWith("image/"))
    throw new Error(`Not an image: ${entry.name}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  for (const width of [480, 960])
    for (const format of ["webp", "avif"])
      await sharp(bytes)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        [format]({ quality: format === "avif" ? 50 : 79 })
        .toFile(`public/media/${entry.name}-${width}.${format}`);
  const record = {
    ...entry,
    filename: `${entry.name}-960.webp`,
    sourceUrl: entry.source,
    originalUrl: url,
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    permissionBasis:
      "Wikimedia Commons describes the source publisher photo as Creative Commons Attribution 3.0 and records a license reviewer. Review the linked file page for exact attribution.",
    changes: "Converted to WebP and AVIF and resized; thumbnails may crop.",
    verifiedAt: "2026-09-26",
  };
  registry.push(record);
  await fs.writeFile(
    "docs/assets-kpop-portraits.json",
    JSON.stringify(registry, null, 2),
  );
  profile.image = `/media/${record.filename}`;
  profile.imageAlt = entry.alt;
  profile.sources.push({
    label: `Licensed portrait — ${entry.creator} (CC BY 3.0)`,
    url: entry.source,
  });
  await fs.writeFile(p, JSON.stringify(data, null, 2) + "\n");
  console.log(`${entry.id} ${bytes.length} bytes`);
}
const jimin = data.find((item) => item.id === "kpop-jimin");
jimin.image = "/media/bts-white-house-2022-960.webp";
jimin.imageAlt =
  "Jimin appears with all seven BTS members at the White House, May 2022";
jimin.sources.push({
  label: "White House BTS group photograph, public domain",
  url: "https://commons.wikimedia.org/wiki/File:BTS_at_the_White_House_on_May_31,_2022.jpg",
});
await fs.writeFile(p, JSON.stringify(data, null, 2) + "\n");
