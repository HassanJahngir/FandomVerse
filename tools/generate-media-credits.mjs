import fs from "node:fs/promises";

const read = async (name) =>
  JSON.parse(await fs.readFile(`docs/${name}`, "utf8"));
const assets = [
  ...(await read("assets-agm.json")),
  ...(await read("assets-remaining.json")),
  ...(await read("assets-kpop-portraits.json")),
  ...(await read("assets-anime-cosplay.json")),
  ...(await read("assets-gaming-cosplay.json")),
  ...(await read("assets-profile-expansion.json")),
  ...(await read("assets-event-expansion.json")),
  ...(await read("assets-context-expansion.json")),
];
const rows = assets.map((asset) => {
  const name = asset.name;
  const files = asset.files || (name
    ? `${name}-{480,960}.{avif,webp}`
    : asset.filename || asset.src);
  const source = asset.sourceUrl || asset.source;
  const license = asset.licenseUrl ? `[${asset.license}](${asset.licenseUrl})` : asset.license.startsWith('CC BY-SA') ? `[${asset.license}](https://creativecommons.org/licenses/by-sa/${asset.license.split(' ').at(-1)}/)` : asset.license.startsWith('CC BY') ? `[${asset.license}](https://creativecommons.org/licenses/by/${asset.license.split(' ').at(-1)}/)` : asset.license;
  return `| ${files} | ${asset.creator} | [Source](${source}) | ${license} | Resized and converted; thumbnails may crop. |`;
});
const intro = `# Media credits and permission register

Verified 26 September 2026. Local images below are **real event, venue, creator, artist, or fan cosplay photographs**. Anime cosplay is labelled as fan performance, not official character art or an anime frame. Each file's Commons page records the creator and reuse terms. Creative Commons attribution is required; converted CC BY-SA photo variants are shared under the same license and preserve the source watermark where present. Edited variants retain attribution, license links, and change notices here and, where shown, beside the media. The JSON registers preserve original file names, direct source URLs, and detailed permission evidence. Photos were actually downloaded and converted to 480/960-pixel AVIF and WebP; the extension was not merely renamed.

| Local file stem and variants | Creator | Source | License | Changes |
|---|---|---|---|---|
`;
const video = `
## Official remote trailer visuals

Official channel YouTube oEmbed thumbnail URLs and on-demand embedded players are used across Anime, Gaming, Movies, TV, Manga and K-Pop, verified on 26–27 September 2026. Anime includes Demon Slayer, Naruto, Naruto Shippuden, Attack on Titan, JUJUTSU KAISEN and My Hero Academia. These images are **not downloaded or relicensed**; they require an internet connection and link to the publisher videos. The original set is recorded in \`docs/assets-official-embeds.json\`; additional embeds are recorded in content JSON and \`docs/assets-official-embeds-extra.json\`. A thumbnail previews its specific trailer; it is not independent character artwork. The Naruto Shippuden shirt card uses VIZ Media's official Set 1 trailer thumbnail as a clearly labelled franchise visual, **not** as a photograph of the shirt.

## Local video, poster, and audio

| Files | Creator | Source | Permission basis and changes |
|---|---|---|---|
| \`tales-zestiria.webm\`, \`tales-zestiria.mp4\`, \`tales-zestiria-poster-{480,960}.{avif,webp}\`, \`tales-zestiria-audio.mp3\` | Bandai Namco Entertainment America | [Tales of Zestiria Anime Expo 2015 trailer](https://commons.wikimedia.org/wiki/File:Tales_of_Zestiria_-_Anime_Expo_2015_Trailer.webm) | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), as recorded and license-reviewed on its Commons file page. Source WebM was transcoded to optimized WebM and H.264/AAC MP4; still poster and 30-second MP3 excerpt were created from that trailer. Attribution and change notice required; no endorsement implied. |

This historical trailer is local and plays offline. Other trailers link to official rights-holder pages or use official players only where embedding is available; those players and external source links require internet. No copyrighted show scenes, music videos, or film clips were ripped.

## Typography and original graphics

DM Sans and Space Grotesk variable WOFF2 files are bundled from Fontsource under the [SIL Open Font License](https://openfontlicense.org/); the license texts are saved in \`docs/licenses/\`. Portal geometry, logo letters, and interface icons are original CSS/SVG interface graphics, not depictions of licensed characters.

## Permission gaps

Official standalone character artwork, franchise key art, and the five exact merchandise product photographs could not be independently cleared for bundling. Profiles use correctly labelled fan cosplay or performer photos where licensed. Some event and release cards use clearly labelled subject-related context visuals instead of pretending the image depicts that event or product. Four product cards retain an explicit rights fallback and official source link; the Naruto shirt shows the labelled official trailer visual instead of a product photograph. An official page's public visibility is not permission to republish its images. The site does not assert exclusive, official, or retailer status. Only the reusable Tales of Zestiria trailer provides local audio/video; other categories use official online players where authorized. The team should request rights-holder permission before replacing the merchandise fallbacks.
`;
await fs.writeFile("docs/MEDIA-CREDITS.md", (intro + rows.join("\n") + video)
  .replace("Anime cosplay is labelled", "Anime and Gaming cosplay is labelled")
  .replace("Five Anime profiles now show", "Five Anime and five Gaming profiles now show")
  .replace("other categories offer their relevant official media links", "four categories also show official remote players and previews where oEmbed permits them; other entries provide official source links"));
console.log(`Wrote ${rows.length} photo credits plus local trailer.`);
