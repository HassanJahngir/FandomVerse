import fs from "node:fs/promises";
import sharp from "sharp";

// These Wikimedia Commons files have verified reuse licenses. They depict
// real fan costumes related to the cards, never official franchise artwork.
const images = [
  ["merch-spiderman-context", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/NYCC_2018_-_Lego_Spider-Man_Cosplayer.jpg/960px-NYCC_2018_-_Lego_Spider-Man_Cosplayer.jpg"],
  ["merch-mandalorian-context", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/2021_NYCC_Cosplay_of_the_Mandalorian_Din_Djarin.jpg/960px-2021_NYCC_Cosplay_of_the_Mandalorian_Din_Djarin.jpg"],
  ["anime-naruto-context", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Naruto_Uzumaki_cosplay_at_Japan_Expo_2016.jpg/960px-Naruto_Uzumaki_cosplay_at_Japan_Expo_2016.jpg"],
  ["anime-aot-context", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Cosplay_of_Eren_Yeager.jpg/960px-Cosplay_of_Eren_Yeager.jpg"],
  ["anime-jjk-context", "https://upload.wikimedia.org/wikipedia/commons/4/4c/Satoru_Goj%C5%8D_cosplay.jpg"],
  ["anime-mha-context", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Cosplay_of_Rumi_Usagiyama,_Keigo_Takami_and_Yu_Takeyama_from_My_Hero_Academia_at_Japan_Expo_2023,_Day_2_(53176984562).jpg/960px-Cosplay_of_Rumi_Usagiyama,_Keigo_Takami_and_Yu_Takeyama_from_My_Hero_Academia_at_Japan_Expo_2023,_Day_2_(53176984562).jpg"],
  ["movies-avengers-context", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/SDCC_-_Avengers_(7561329924).jpg/960px-SDCC_-_Avengers_(7561329924).jpg"],
];

await fs.mkdir("public/media", { recursive: true });
for (const [name, url] of images) {
  if (await fs.stat(`public/media/${name}-960.webp`).catch(() => null)) continue;
  const response = await fetch(url, { headers: { "User-Agent": "FandomVerse/1.0 (school project; Wikimedia Commons licensed reuse)" } });
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const original = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(original).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`${name}: invalid image`);
  for (const width of [480, 960]) {
    const image = sharp(original).rotate().resize({ width, withoutEnlargement: true });
    await image.clone().webp({ quality: 78, effort: 5 }).toFile(`public/media/${name}-${width}.webp`);
    await image.clone().avif({ quality: 48, effort: 5 }).toFile(`public/media/${name}-${width}.avif`);
  }
  console.log(`${name}: downloaded ${metadata.width}x${metadata.height} ${metadata.format}, converted to WebP and AVIF`);
}
