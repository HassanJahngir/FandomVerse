import fs from "node:fs/promises";
const url =
  "https://upload.wikimedia.org/wikipedia/commons/5/5c/Tales_of_Zestiria_-_Anime_Expo_2015_Trailer.webm";
const response = await fetch(url, {
  headers: {
    "User-Agent": "FandomVerse/1.0 educational competition media attribution",
  },
});
if (!response.ok)
  throw new Error(
    `Wikimedia returned ${response.status}; do not bypass limits.`,
  );
await fs.mkdir("tmp/media", { recursive: true });
await fs.writeFile(
  "tmp/media/tales-zestiria-original.webm",
  Buffer.from(await response.arrayBuffer()),
);
console.log("Downloaded verified CC BY 3.0 publisher trailer.");
