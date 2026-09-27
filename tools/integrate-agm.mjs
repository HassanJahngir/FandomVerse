import fs from "node:fs";
const assets = JSON.parse(fs.readFileSync("docs/assets-agm.json"));
const description = {
  anime:
    "A panoramic view of fans at Anime Expo in 2015. This is historical event photography, not a scene from an anime.",
  gaming:
    "The ESL stage at Gamescom in 2019, photographed by dronepicr. A glimpse of the live events surrounding gaming culture.",
  manga:
    "Manga creator Ken Akamatsu at Japan Expo in 2015. This gallery documents a real creator appearance, not artwork from One Piece.",
};
const dates = {
  anime: "2015-07-05",
  gaming: "2019-08-20",
  manga: "2015-07-05",
};
for (const category of ["anime", "gaming", "manga"]) {
  const asset = assets.find(
    (asset) => asset.category === category && !asset.video,
  );
  const data = JSON.parse(fs.readFileSync(`src/data/${category}.json`));
  const gallery = {
    id: `${category}-gallery-culture`,
    category,
    type: "gallery",
    title: {
      anime: "Anime Expo: a community in panorama",
      gaming: "Gamescom: around the ESL stage",
      manga: "Ken Akamatsu at Japan Expo",
    }[category],
    description: description[category],
    tags: ["Photography", "Archive", "Community"],
    date: dates[category],
    featured: true,
    verifiedAt: "2026-09-26",
    image: asset.src,
    imageAlt: asset.description,
    sources: [
      { label: "Original photograph and reuse license", url: asset.sourceUrl },
    ],
    gallery: [
      {
        src: asset.src,
        alt: asset.description,
        credit: asset.creator,
        sourceUrl: asset.sourceUrl,
        license: asset.license,
        licenseUrl: asset.licenseUrl,
        changes:
          "Resized and converted to AVIF/WebP. Interface may crop preview; lightbox preserves the image.",
      },
    ],
  };
  const existing = data.findIndex((item) => item.id === gallery.id);
  if (existing >= 0) data[existing] = gallery;
  else data.push(gallery);
  fs.writeFileSync(
    `src/data/${category}.json`,
    JSON.stringify(data, null, 2) + "\n",
  );
}
