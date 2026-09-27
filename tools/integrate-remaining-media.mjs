import fs from "node:fs";
const records = JSON.parse(fs.readFileSync("docs/assets-remaining.json"));
const galleries = {
  movies: {
    title: "Inside Star Wars Celebration",
    description:
      "Historical photography of the real Star Wars fan gathering in Anaheim, California. No film stills are republished.",
    date: "2022-05-26",
  },
  tv: {
    title: "Inside the Doctor Who Experience",
    description:
      "Historical visitor photography from a Doctor Who exhibition, showing a real place where fans explored the programme.",
    date: "2016-08-19",
  },
  comics: {
    title: "San Diego Comic-Con, seen by fans",
    description:
      "Photography of a real comic convention setting. This depicts the event, not fictional character art.",
    date: "2019-07-21",
  },
  kpop: {
    title: "BTS at the White House",
    description:
      "Two public-domain United States government photographs documenting BTS’s May 2022 White House visit.",
    date: "2022-05-31",
  },
};
for (const [category, info] of Object.entries(galleries)) {
  const assets = records.filter((record) => record.category === category);
  const data = JSON.parse(fs.readFileSync(`src/data/${category}.json`));
  const gallery = {
    id: `${category}-gallery-real-world`,
    category,
    type: "gallery",
    title: info.title,
    description: info.description,
    tags: ["Photography", "Archive", "Community"],
    date: info.date,
    featured: true,
    verifiedAt: "2026-09-26",
    image: assets[0].src,
    imageAlt: assets[0].alt,
    sources: assets.map((asset) => ({
      label: `Photograph, ${asset.creator} (${asset.license})`,
      url: asset.sourceUrl,
    })),
    gallery: assets.map((asset) => ({
      src: asset.src,
      alt: asset.alt,
      credit: asset.creator,
      license: asset.license,
      licenseUrl: asset.licenseUrl,
      sourceUrl: asset.sourceUrl,
      changes: asset.changes,
    })),
  };
  const existing = data.findIndex((item) => item.id === gallery.id);
  if (existing >= 0) data[existing] = gallery;
  else data.push(gallery);
  if (category === "kpop") {
    const article = data.find((item) => item.type === "article");
    if (article) {
      article.image = assets[0].src;
      article.imageAlt = assets[0].alt;
    }
  }
  fs.writeFileSync(
    `src/data/${category}.json`,
    JSON.stringify(data, null, 2) + "\n",
  );
}
