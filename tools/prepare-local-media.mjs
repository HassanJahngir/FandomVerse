import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";
await fs.mkdir("public/fonts", { recursive: true });
await fs.mkdir("docs/licenses", { recursive: true });
for (const [pkg, file, name] of [
  ["dm-sans", "dm-sans-latin-wght-normal.woff2", "dm-sans.woff2"],
  [
    "space-grotesk",
    "space-grotesk-latin-wght-normal.woff2",
    "space-grotesk.woff2",
  ],
]) {
  await fs.copyFile(
    `node_modules/@fontsource-variable/${pkg}/files/${file}`,
    `public/fonts/${name}`,
  );
  await fs.copyFile(
    `node_modules/@fontsource-variable/${pkg}/LICENSE`,
    `docs/licenses/${pkg}-OFL.txt`,
  );
}
let css = await fs.readFile("src/styles.css", "utf8");
css = css.replace(
  /^@import[^\n]+/,
  `@font-face{font-family:'DM Sans';src:url('/fonts/dm-sans.woff2') format('woff2');font-weight:100 1000;font-display:swap}\n@font-face{font-family:'Space Grotesk';src:url('/fonts/space-grotesk.woff2') format('woff2');font-weight:300 700;font-display:swap}`,
);
await fs.writeFile("src/styles.css", css);
function run(args) {
  const result = spawnSync(
    ffmpeg,
    ["-hide_banner", "-loglevel", "error", "-y", ...args],
    { stdio: "inherit" },
  );
  if (result.status) throw new Error("FFmpeg conversion failed");
}
const original = "tmp/media/tales-zestiria-original.webm";
run([
  "-i",
  original,
  "-vf",
  "scale=854:-2",
  "-c:v",
  "libx264",
  "-preset",
  "fast",
  "-crf",
  "29",
  "-c:a",
  "aac",
  "-b:a",
  "64k",
  "-movflags",
  "+faststart",
  "public/media/tales-zestiria.mp4",
]);
run([
  "-i",
  original,
  "-vf",
  "scale=854:-2",
  "-c:v",
  "libvpx-vp9",
  "-deadline",
  "realtime",
  "-cpu-used",
  "6",
  "-crf",
  "39",
  "-b:v",
  "400k",
  "-c:a",
  "libopus",
  "-b:a",
  "48k",
  "public/media/tales-zestiria.webm",
]);
for (const second of [15, 35, 65, 90]) {
  run([
    "-ss",
    String(second),
    "-i",
    original,
    "-frames:v",
    "1",
    `tmp/media/tales-frame-${second}.png`,
  ]);
}
for (const width of [480, 960])
  for (const format of ["webp", "avif"])
    await sharp("tmp/media/tales-frame-35.png")
      .resize({ width, withoutEnlargement: true })
      [format]({ quality: format === "avif" ? 50 : 79 })
      .toFile(`public/media/tales-zestiria-poster-${width}.${format}`);
const data = JSON.parse(await fs.readFile("src/data/gaming.json"));
const id = "gaming-trailer-tales-zestiria";
const record = {
  id,
  category: "gaming",
  type: "trailer",
  title: "Tales of Zestiria — Anime Expo 2015 trailer",
  description:
    "An archive preview of Bandai Namco’s fantasy role-playing adventure, officially shared under Creative Commons Attribution 3.0. Originally published in July 2015.",
  tags: ["Tales of Zestiria", "RPG", "Archive"],
  date: "2015-07-03",
  status: "released",
  featured: true,
  verifiedAt: "2026-09-26",
  mediaKind: "trailer",
  image: "/media/tales-zestiria-poster-960.webp",
  imageAlt: "A frame from the licensed Tales of Zestiria trailer",
  poster: "/media/tales-zestiria-poster-960.webp",
  videoMp4: "/media/tales-zestiria.mp4",
  videoWebm: "/media/tales-zestiria.webm",
  mediaUrl: "https://www.youtube.com/watch?v=yyPvXOlauSs",
  mediaPermission:
    "Bandai Namco Entertainment America; CC BY 3.0. License reviewed by Wikimedia Commons on 3 May 2016. Resized and transcoded to MP4/WebM; poster extracted. No endorsement implied.",
  sources: [
    {
      label: "Publisher trailer, archived license and review",
      url: "https://commons.wikimedia.org/wiki/File:Tales_of_Zestiria_-_Anime_Expo_2015_Trailer.webm",
    },
    {
      label: "Creative Commons Attribution 3.0 license",
      url: "https://creativecommons.org/licenses/by/3.0/",
    },
  ],
  transcript:
    "Accessible description: this historical promotional video introduces the fantasy role-playing game Tales of Zestiria, its characters and combat. It includes music, character voices, animated scenes and gameplay. A complete verbatim caption track has not been verified; the official source may provide additional caption options. This description is not a dialogue transcript.",
};
const old = data.findIndex((item) => item.id === id);
if (old >= 0) data[old] = record;
else data.push(record);
await fs.writeFile(
  "src/data/gaming.json",
  JSON.stringify(data, null, 2) + "\n",
);
console.log(
  "Local fonts, licensed MP4/WebM trailer, frames and AVIF/WebP poster written.",
);
