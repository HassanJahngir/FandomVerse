import fs from "node:fs/promises";

// Trailer playback stays at the official source. These card and poster visuals
// use locally bundled, licensed photos of the matching fandom so thumbnails
// remain useful when YouTube's image host is blocked or offline.
const photos = {
  "9kb7vK11_Rw": ["/media/anime-demon-slayer-group-cosplay-960.webp", "Demon Slayer fan cosplay at FanimeCon", "LX-Designs (Alex Wong) · CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Cosplay_of_Tanjiro_Kamado%2C_Nezuko_Kamado_and_Zenitsu_Agatsuma_from_Demon_Slayer_Kimetsu_no_Yaiba_at_FanimeCon_2023_(53055055252).jpg", "fan-cosplay"],
  VQGCKyvzIM4: ["/media/anime-nezuko-cosplay-960.webp", "Nezuko fan cosplay", "Kiri Karma · CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Cosplay_of_Nezuko_Kamado_at_Made_in_Asia_2022_(52129814711).jpg", "fan-cosplay"],
  a9tq0aS5Zu8: ["/media/anime-giyu-cosplay-960.webp", "Giyu and Shinobu fan cosplay", "Kaisars Fang · CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Cosplayers_of_Giy%C5%AB_Tomioka_and_Shinobu_Koch%C5%8D_20200907a.jpg", "fan-cosplay"],
  rq1tllAUS1I: ["/media/anime-zenitsu-cosplay-960.webp", "Zenitsu and Nezuko fan cosplay", "LX-Designs (Alex Wong) · CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Cosplay_of_Nezuko_Kamado_and_Zenitsu_Agatsuma_from_Demon_Slayer_Kimetsu_no_Yaiba_at_FanimeCon_2023_(53056018850).jpg", "fan-cosplay"],
  "MUCN-JwUvbY": ["/media/anime-aot-context-960.webp", "Eren Yeager fan cosplay from Attack on Titan", "GabboT (Tony Shek) · CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Cosplay_of_Eren_Yeager.jpg", "fan-cosplay"],
  ztO4Bk0ALGI: ["/media/anime-jjk-context-960.webp", "Satoru Gojo fan cosplay from Jujutsu Kaisen", "Solomon203 · CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Satoru_Goj%C5%8D_cosplay.jpg", "fan-cosplay"],
  zz37nGym3OQ: ["/media/anime-mha-context-960.webp", "My Hero Academia fan cosplay at Japan Expo", "Kiri Karma · CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Cosplay_of_Rumi_Usagiyama,_Keigo_Takami_and_Yu_Takeyama_from_My_Hero_Academia_at_Japan_Expo_2023,_Day_2_(53176984562).jpg", "fan-cosplay"],
  yeUpnIKt6k4: ["/media/anime-naruto-context-960.webp", "Naruto Uzumaki fan cosplay at Japan Expo", "Miguel Discart · CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Naruto_Uzumaki_cosplay_at_Japan_Expo_2016.jpg", "fan-cosplay"],
  "22R0j8UKRzY": ["/media/anime-naruto-context-960.webp", "Naruto Uzumaki fan cosplay at Japan Expo", "Miguel Discart · CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Naruto_Uzumaki_cosplay_at_Japan_Expo_2016.jpg", "fan-cosplay"],
  XvQNlGKNC6o: ["/media/gaming-mario-cosplay-960.webp", "Mario fan cosplay", "Miguel Discart · CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Cosplay_of_Mario_at_Brussels_Comic_Con_2019_(40335217333).jpg", "fan-cosplay"],
  sGbxmsDFVnE: ["/media/movies-profile-luke-skywalker-960.webp", "Luke Skywalker fan cosplay", "William Tung · CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:SWCA_-_Luke_Skywalker_(16580421784).jpg", "fan-cosplay"],
  iFl4YeX6jmc: ["/media/movies-avengers-context-960.webp", "Avengers fan cosplay at San Diego Comic-Con", "Pat Loika · CC BY 2.0", "https://commons.wikimedia.org/wiki/File:SDCC_-_Avengers_(7561329924).jpg", "fan-cosplay"],
  MPxtqx55PA0: ["/media/doctor-who-experience-2016-960.webp", "Doctor Who Experience exhibit", "Armina · CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Doctor_Who_Experience_(29349401791).jpg", "licensed-photo"],
  c6ASQOwKkhk: ["/media/bts-jin-dispatch-2019-960.webp", "Jin of BTS photographed in 2019", "Dispatch · CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Jin_for_Dispatch_%22Boy_With_Luv%22_MV_behind_the_scene_shooting%2C_15_March_2019_05.jpg", "performer-photo"],
  "3uaMeEcwvvU": ["/media/manga-profile-luffy-960.webp", "Monkey D. Luffy fan cosplay from One Piece", "Castorice · CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Cosplay_of_Monkey_D._Luffy.jpg", "fan-cosplay"],
};

for (const file of ["anime", "gaming", "movies", "tv", "kpop", "comics", "manga", "products"]) {
  const path = `src/data/${file}.json`;
  const records = JSON.parse(await fs.readFile(path, "utf8"));
  for (const item of records) {
    if (item.image === "/media/anime-naruto-context-960.webp") item.imageFocus = "center 9%";
    if (item.image === "/media/anime-aot-context-960.webp") item.imageFocus = "center 16%";
    if (item.image === "/media/anime-jjk-context-960.webp") item.imageFocus = "center 12%";
    if (item.id === "anime-gallery-culture") {
      item.title = "Anime fan culture across five series";
      item.description = "Licensed photographs of Naruto, Attack on Titan, Jujutsu Kaisen, My Hero Academia and Demon Slayer fan cosplay, plus an Anime Expo crowd scene. These are real fans, not official anime frames.";
      const galleryPhotos = [photos["22R0j8UKRzY"], photos["MUCN-JwUvbY"], photos.ztO4Bk0ALGI, photos.zz37nGym3OQ];
      item.gallery.splice(0, 4, ...galleryPhotos.map(([src, alt, credit, source]) => {
        const license = credit.match(/CC BY(?:-SA)? [\d.]+/)?.[0] || "CC BY";
        return {
          src, alt, credit, sourceUrl: source, license,
          licenseUrl: `https://creativecommons.org/licenses/${license.includes("SA") ? "by-sa" : "by"}/${license.split(" ").at(-1)}/`,
          changes: "Downloaded, resized and converted to AVIF/WebP. Gallery uses the original photo; no official anime frame is implied.",
        };
      }));
      for (const [, , , source] of galleryPhotos)
        if (!item.sources.some((entry) => entry.url === source)) item.sources.push({ label: "Licensed fan cosplay and reuse terms", url: source });
    }
    const videoId = item.image?.match(/i\.ytimg\.com\/vi\/([^/]+)/)?.[1];
    const photo = photos[videoId];
    if (!photo) continue;
    const [image, alt, credit, source, kind] = photo;
    item.officialThumbnailUrl = item.image;
    item.image = image;
    if (image === "/media/anime-naruto-context-960.webp") item.imageFocus = "center 9%";
    if (image === "/media/anime-aot-context-960.webp") item.imageFocus = "center 16%";
    if (image === "/media/anime-jjk-context-960.webp") item.imageFocus = "center 12%";
    item.imageAlt = `${alt}; context image, not an official video frame${item.type === "merchandise" ? " or product photo" : ""}`;
    item.imageKind = kind;
    item.imageCredit = credit;
    item.imageSourceUrl = source;
    item.imageContext = `${alt} for ${item.type === "merchandise" ? "franchise" : "video or story"} context; not an official ${item.type === "merchandise" ? "product photograph" : "video frame"}.`;
    item.imageVerifiedAt = "2026-09-27";
    item.imagePermission = `${credit}; locally resized and converted to AVIF/WebP. Character and franchise rights remain with their owners.`;
    if (item.poster?.startsWith("https://i.ytimg.com/")) item.poster = image;
    if (!item.sources?.some((entry) => entry.url === source)) item.sources.push({ label: "Licensed context photo and reuse terms", url: source });
  }
  await fs.writeFile(path, `${JSON.stringify(records, null, 2)}\n`);
}
