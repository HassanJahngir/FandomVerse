import fs from "node:fs";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
const videoUrl = "https://www.youtube.com/watch?v=22R0j8UKRzY";
const thumbnail = "https://i.ytimg.com/vi/22R0j8UKRzY/hqdefault.jpg";

const products = read("src/data/products.json");
const shirt = products.find((item) => item.id === "merch-naruto-shirt");
if (!shirt) throw new Error("Naruto Shippuden shirt record is missing");
Object.assign(shirt, {
  image: thumbnail,
  imageAlt: "Naruto Uzumaki in VIZ Media's official Naruto Shippuden Set 1 trailer; this is not the T-shirt",
  imageKind: "official-trailer-thumbnail",
  imageCredit: "VIZ Media via its official YouTube trailer",
  imageSourceUrl: videoUrl,
  imageContext: "Official Naruto Shippuden trailer visual, shown for franchise context; the exact T-shirt photo is on the retailer page, not reproduced here.",
  imageVerifiedAt: "2026-09-27",
  mediaNote: "Official Naruto Shippuden trailer visual for context. The exact product photograph remains on Crunchyroll Store because republication permission was not established.",
});
if (!shirt.sources.some((source) => source.url === videoUrl)) {
  shirt.sources.push({ label: "VIZ Media official Naruto Shippuden trailer — contextual visual", url: videoUrl });
}
write("src/data/products.json", products);

const anime = read("src/data/anime.json");
const id = "anime-trailer-naruto-shippuden";
if (!anime.some((item) => item.id === id)) {
  anime.push({
    id,
    category: "anime",
    type: "trailer",
    title: "Naruto Shippuden, Set 1 — official VIZ trailer",
    description: "VIZ Media's official trailer for the Naruto Shippuden Set 1 home-video release. Published in 2023; this is an archive preview, not a new release announcement.",
    tags: ["Naruto Shippuden", "VIZ Media", "Archive"],
    franchise: "Naruto Shippuden",
    featured: true,
    status: "released",
    verifiedAt: "2026-09-27",
    image: thumbnail,
    imageAlt: "Naruto Uzumaki and the Naruto Shippuden title in VIZ Media's official Set 1 trailer thumbnail",
    imageCredit: "vizmedia",
    imageKind: "official-trailer-thumbnail",
    imageSourceUrl: videoUrl,
    mediaKind: "trailer",
    mediaUrl: videoUrl,
    embedUrl: "https://www.youtube-nocookie.com/embed/22R0j8UKRzY",
    poster: thumbnail,
    mediaPermission: "Official channel YouTube oEmbed player and thumbnail; online only, no local copy or republication license claimed.",
    transcript: "Use captions or the transcript in the official YouTube player when VIZ supplies them.",
    sources: [{ label: "VIZ Media official Naruto Shippuden Set 1 trailer", url: videoUrl }],
  });
}
write("src/data/anime.json", anime);

const register = read("docs/assets-official-embeds-extra.json");
if (!register.some((item) => item.id === id)) {
  register.push({
    id,
    title: "Naruto Shippuden, Set 1 — official VIZ trailer",
    creator: "vizmedia (verified VIZ Media channel)",
    sourceUrl: videoUrl,
    thumbnailUrl: thumbnail,
    embedUrl: "https://www.youtube-nocookie.com/embed/22R0j8UKRzY",
    permissionBasis: "Official channel YouTube oEmbed player and thumbnail; online display only, no downloaded copy or standalone reuse license",
    verifiedAt: "2026-09-27",
  });
}
write("docs/assets-official-embeds-extra.json", register);
console.log("Added official Naruto Shippuden trailer visual and labelled shirt-card context.");
