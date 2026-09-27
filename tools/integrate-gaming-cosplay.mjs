import fs from "node:fs/promises";

const path = "src/data/gaming.json";
const catalog = JSON.parse(await fs.readFile(path, "utf8"));
const photos = JSON.parse(await fs.readFile("docs/assets-gaming-cosplay.json", "utf8"));
if (photos.length !== 5) throw new Error("Expected five verified Gaming photos");
for (const photo of photos) {
  const profile = catalog.find((item) => item.id === photo.id);
  if (!profile) throw new Error(`Missing profile ${photo.id}`);
  profile.image = `/media/${photo.name}-960.webp`;
  profile.imageFocus = ({
    "gaming-profile-mario": "center 20%",
    "gaming-profile-luigi": "center 18%",
    "gaming-profile-peach": "center 20%",
    "gaming-profile-bowser": "center 20%",
    "gaming-profile-yoshi": "center 35%",
  })[photo.id];
  profile.imageAlt = photo.alt;
  profile.imageCredit = photo.creator;
  profile.imageSourceUrl = photo.sourceUrl;
  profile.mediaPermission = `Fan cosplay photograph, ${photo.license}; not official Nintendo character art. Converted and cropped for responsive display.`;
  profile.sources = profile.sources.filter((source) => !source.label?.startsWith("Cosplay photo and"));
  if (!profile.sources.some((source) => source.url === photo.sourceUrl))
    profile.sources.push({ label: `Cosplay photo and ${photo.license} license`, url: photo.sourceUrl });
}
await fs.writeFile(path, JSON.stringify(catalog, null, 2) + "\n");
console.log("Integrated five sourced Gaming cosplay images.");
