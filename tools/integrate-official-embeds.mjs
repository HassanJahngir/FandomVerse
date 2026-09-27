import fs from "node:fs/promises";

// Each entry was checked through YouTube's oEmbed endpoint on 2026-09-26.
// The images stay on YouTube's server; this project does not download or relicense them.
const verified = [
  { category: "anime", trailer: "anime-trailer-infinitycastle", article: "anime-article-demonslayer-start", id: "9kb7vK11_Rw", creator: "Aniplex USA", alt: "Official Demon Slayer: Infinity Castle trailer thumbnail" },
  { category: "movies", trailer: "movies-trailer-force-awakens", article: "movies-article-star-wars-character-choices", id: "sGbxmsDFVnE", creator: "Star Wars", alt: "Official Star Wars: The Force Awakens trailer thumbnail" },
  { category: "tv", trailer: "tv-trailer-doctor-who-2025", article: "tv-article-doctor-who-companions", id: "MPxtqx55PA0", creator: "Doctor Who", alt: "Official Doctor Who Season 2 trailer thumbnail" },
  { category: "manga", trailer: "manga-trailer-wanted", id: "3uaMeEcwvvU", creator: "VIZ Media", alt: "Official Wanted! manga trailer thumbnail" },
];

for (const media of verified) {
  const path = `src/data/${media.category}.json`;
  const records = JSON.parse(await fs.readFile(path, "utf8"));
  const trailer = records.find((item) => item.id === media.trailer);
  if (!trailer) throw new Error(`Missing trailer ${media.trailer}`);
  const image = `https://i.ytimg.com/vi/${media.id}/hqdefault.jpg`;
  const mediaUrl = `https://www.youtube.com/watch?v=${media.id}`;
  trailer.image = image;
  trailer.poster = image;
  trailer.imageAlt = media.alt;
  trailer.imageCredit = media.creator;
  trailer.imageKind = "official-trailer-thumbnail";
  trailer.imageSourceUrl = mediaUrl;
  trailer.embedUrl = `https://www.youtube-nocookie.com/embed/${media.id}`;
  trailer.mediaPermission = "Official YouTube player is embeddable according to YouTube oEmbed; media remains on YouTube and is not downloaded.";
  trailer.mediaPermissionNote = "Official YouTube player and thumbnail supplied through YouTube oEmbed; loads online. The video and image are not bundled or licensed for download by this project.";
  if (media.article) {
    const article = records.find((item) => item.id === media.article);
    if (!article) throw new Error(`Missing article ${media.article}`);
    Object.assign(article, {
      image,
      imageAlt: media.alt,
      imageCredit: media.creator,
      imageKind: "official-trailer-thumbnail",
      imageSourceUrl: mediaUrl,
    });
    if (!article.sources.some((source) => source.url === mediaUrl))
      article.sources.push({ label: `${media.creator} official trailer`, url: mediaUrl });
  }
  if (media.category === "anime") {
    const gallery = records.find((item) => item.id === "anime-gallery-culture");
    gallery.title = "Official Demon Slayer previews and fan culture";
    gallery.description = "Official Aniplex USA anime trailer previews followed by separately credited fan cosplay and Anime Expo photography. The anime previews load from YouTube.";
    delete gallery.date;
    gallery.image = image;
    gallery.imageAlt = media.alt;
    gallery.imageCredit = media.creator;
    gallery.imageKind = "official-trailer-thumbnail";
    gallery.imageSourceUrl = mediaUrl;
    gallery.gallery = gallery.gallery.filter((entry) => entry.sourceUrl !== mediaUrl);
    gallery.gallery.unshift({
      src: image,
      alt: media.alt,
      credit: "Aniplex USA via YouTube oEmbed",
      sourceUrl: mediaUrl,
      license: "Official remote preview; not licensed for local download",
      changes: "No local copy or conversion; displayed from YouTube's thumbnail URL",
    });
    if (!gallery.sources.some((source) => source.url === mediaUrl))
      gallery.sources.unshift({ label: "Aniplex USA official trailer and preview", url: mediaUrl });
  }
  await fs.writeFile(path, JSON.stringify(records, null, 2) + "\n");
}
const animePath = "src/data/anime.json";
const anime = JSON.parse(await fs.readFile(animePath, "utf8"));
const moreAnime = [
  { id: "anime-trailer-original-2019", videoId: "VQGCKyvzIM4", title: "Demon Slayer: Kimetsu no Yaiba — Trailer 1", description: "Aniplex USA's official trailer for the original Demon Slayer anime. Watch on the publisher's player for the video and its publication details.", tags: ["Demon Slayer", "Series", "Original trailer"] },
  { id: "anime-trailer-swordsmith-village", videoId: "a9tq0aS5Zu8", title: "Demon Slayer: Swordsmith Village Arc — official trailer", description: "Aniplex USA's official preview for the Swordsmith Village Arc. The video is streamed by YouTube; no copy is bundled here.", tags: ["Demon Slayer", "Series", "Swordsmith Village"] },
  { id: "anime-trailer-hashira-training", videoId: "rq1tllAUS1I", title: "Demon Slayer: Hashira Training Arc — official trailer", description: "Aniplex USA's official preview for the Hashira Training Arc. Open the sourced player for the full trailer and availability details.", tags: ["Demon Slayer", "Series", "Hashira Training"] },
];
const animeGallery = anime.find((item) => item.id === "anime-gallery-culture");
for (const extra of moreAnime) {
  const mediaUrl = `https://www.youtube.com/watch?v=${extra.videoId}`;
  const image = `https://i.ytimg.com/vi/${extra.videoId}/hqdefault.jpg`;
  if (!anime.some((item) => item.id === extra.id)) anime.push({
    id: extra.id,
    category: "anime",
    type: "trailer",
    title: extra.title,
    description: extra.description,
    tags: extra.tags,
    featured: false,
    verifiedAt: "2026-09-26",
    image,
    imageAlt: `Official ${extra.title} thumbnail`,
    imageCredit: "Aniplex USA",
    imageKind: "official-trailer-thumbnail",
    imageSourceUrl: mediaUrl,
    poster: image,
    franchise: "Demon Slayer: Kimetsu no Yaiba",
    mediaKind: "trailer",
    mediaUrl,
    embedUrl: `https://www.youtube-nocookie.com/embed/${extra.videoId}`,
    mediaPermission: "Official YouTube player is embeddable according to YouTube oEmbed; media remains on YouTube and is not downloaded.",
    mediaPermissionNote: "Official YouTube thumbnail and player, verified by oEmbed on 2026-09-26. Requires internet; no local video or image copy.",
    transcript: `Accessible description: An official promotional trailer for ${extra.title}. For captions and full audiovisual context, use the publisher's player.`,
    sources: [{ label: "Aniplex USA official YouTube upload", url: mediaUrl }],
  });
  if (!animeGallery.gallery.some((entry) => entry.sourceUrl === mediaUrl))
    animeGallery.gallery.push({
      src: image,
      alt: `Official ${extra.title} thumbnail`,
      credit: "Aniplex USA via YouTube oEmbed",
      sourceUrl: mediaUrl,
      license: "Official remote preview; not licensed for local download",
      changes: "No local copy or conversion; displayed from YouTube's thumbnail URL",
    });
  if (!animeGallery.sources.some((source) => source.url === mediaUrl))
    animeGallery.sources.push({ label: `${extra.title} official upload`, url: mediaUrl });
}
animeGallery.gallery.sort((left, right) => Number(right.src.includes("i.ytimg.com")) - Number(left.src.includes("i.ytimg.com")));
await fs.writeFile(animePath, JSON.stringify(anime, null, 2) + "\n");
await fs.writeFile("docs/assets-official-embeds.json", JSON.stringify([
  ...verified.map((media) => ({
  category: media.category,
  trailerId: media.trailer,
  articleId: media.article || null,
  thumbnailUrl: `https://i.ytimg.com/vi/${media.id}/hqdefault.jpg`,
  officialUrl: `https://www.youtube.com/watch?v=${media.id}`,
  creator: media.creator,
  permissionBasis: "YouTube oEmbed returned an embeddable official player and thumbnail URL; image remains hosted by YouTube, not downloaded or relicensed",
  verifiedAt: "2026-09-26",
  })),
  ...moreAnime.map((media) => ({
    category: "anime",
    trailerId: media.id,
    articleId: null,
    thumbnailUrl: `https://i.ytimg.com/vi/${media.videoId}/hqdefault.jpg`,
    officialUrl: `https://www.youtube.com/watch?v=${media.videoId}`,
    creator: "Aniplex USA",
    permissionBasis: "YouTube oEmbed returned an embeddable official player and thumbnail URL; image remains hosted by YouTube, not downloaded or relicensed",
    verifiedAt: "2026-09-26",
  })),
], null, 2) + "\n");
console.log("Integrated seven official remote trailer thumbnails and players.");
