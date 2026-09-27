import fs from "node:fs/promises";

const path = "src/data/anime.json";
const data = JSON.parse(await fs.readFile(path, "utf8"));
const photos = JSON.parse(
  await fs.readFile("docs/assets-anime-cosplay.json", "utf8"),
);
const byName = Object.fromEntries(photos.map((photo) => [photo.name, photo]));
const assignments = {
  "anime-profile-tanjiro": "anime-tanjiro-cosplay",
  "anime-profile-nezuko": "anime-nezuko-cosplay",
  "anime-profile-zenitsu": "anime-zenitsu-cosplay",
  "anime-profile-inosuke": "anime-inosuke-cosplay",
  "anime-profile-giyu": "anime-giyu-cosplay",
  "anime-article-demonslayer-start": "anime-demon-slayer-group-cosplay",
};
for (const item of data) {
  const photo = byName[assignments[item.id]];
  if (!photo) continue;
  item.image = `/media/${photo.name}-960.webp`;
  item.imageAlt = photo.alt;
  item.imageCredit = photo.creator;
  item.imageSourceUrl = photo.sourceUrl;
  item.mediaPermission = `Fan cosplay photograph, ${photo.license}; not official character artwork. Converted and cropped for responsive display.`;
  if (!item.sources.some((source) => source.url === photo.sourceUrl)) {
    item.sources.push({
      label: `Cosplay photo and ${photo.license} license`,
      url: photo.sourceUrl,
    });
  }
}
const gallery = data.find((item) => item.id === "anime-gallery-culture");
const group = byName["anime-demon-slayer-group-cosplay"];
gallery.title = "Demon Slayer cosplay and Anime Expo fandom";
gallery.description =
  "FanimeCon 2023 cosplay of Tanjiro, Nezuko and Zenitsu, alongside a historical Anime Expo panorama. Fan cosplay, not official anime artwork.";
gallery.image = `/media/${group.name}-960.webp`;
gallery.imageAlt = group.alt;
gallery.gallery.unshift({
  src: gallery.image,
  alt: group.alt,
  credit: group.creator,
  sourceUrl: group.sourceUrl,
  license: group.license,
  licenseUrl: group.licenseUrl,
  changes: group.changes,
});
gallery.sources.unshift({
  label: `Demon Slayer fan cosplay photo and ${group.license} license`,
  url: group.sourceUrl,
});
await fs.writeFile(path, JSON.stringify(data, null, 2) + "\n");
console.log(
  "Integrated six credited anime cosplay images across profiles, article, and gallery.",
);
