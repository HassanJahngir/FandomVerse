import fs from "node:fs";
import { spawnSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";
const result = spawnSync(
  ffmpeg,
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-ss",
    "00:00:28",
    "-t",
    "00:00:30",
    "-i",
    "tmp/media/tales-zestiria-original.webm",
    "-vn",
    "-c:a",
    "libmp3lame",
    "-b:a",
    "80k",
    "public/media/tales-zestiria-audio.mp3",
  ],
  { stdio: "inherit" },
);
if (result.status) throw new Error("Audio extraction failed");
const p = "src/data/gaming.json";
const data = JSON.parse(fs.readFileSync(p));
const item = {
  id: "gaming-audio-tales-zestiria",
  type: "audio",
  category: "gaming",
  title: "Tales of Zestiria — licensed trailer audio excerpt",
  description:
    "A 30-second sound-only excerpt from Bandai Namco Entertainment America’s CC BY 3.0 Anime Expo 2015 trailer. It preserves the trailer’s music and sound design; listen alongside the complete licensed video.",
  tags: ["Tales of Zestiria", "RPG", "Sound design"],
  mediaKind: "trailer",
  date: "2015-07-03",
  featured: false,
  verifiedAt: "2026-09-26",
  image: "/media/tales-zestiria-poster-960.webp",
  imageAlt: "A frame from the licensed Tales of Zestiria trailer",
  audioUrl: "/media/tales-zestiria-audio.mp3",
  mediaUrl:
    "https://commons.wikimedia.org/wiki/File:Tales_of_Zestiria_-_Anime_Expo_2015_Trailer.webm",
  mediaPermission:
    "30 seconds excerpted from Bandai Namco Entertainment America’s reviewed CC BY 3.0 trailer, converted to MP3. Original creator and license linked below; no endorsement implied.",
  transcript:
    "Accessible audio description: a historical fantasy-game trailer excerpt featuring instrumental music, effects and character voices. A verified verbatim dialogue transcript is unavailable.",
  sources: [
    {
      label: "Original publisher trailer and license review",
      url: "https://commons.wikimedia.org/wiki/File:Tales_of_Zestiria_-_Anime_Expo_2015_Trailer.webm",
    },
    {
      label: "Creative Commons Attribution 3.0",
      url: "https://creativecommons.org/licenses/by/3.0/",
    },
  ],
};
const old = data.findIndex((record) => record.id === item.id);
if (old >= 0) data[old] = item;
else data.push(item);
fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
