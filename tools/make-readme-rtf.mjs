import fs from "node:fs";
const text = `FANDOMVERSE - ASSUMPTIONS AND INSTALLATION

Web Innovation Unleashed independent educational fan discovery project.

INSTALLATION
Install Node.js 20.19+ or 22.12+ and npm. Run npm install, npm run build, and npm run preview in the extracted folder. Open the local URL shown by Vite. For development run npm run dev. PowerShell users with script execution restrictions may use npm.cmd.

ASSUMPTIONS
1. Seven worlds are Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga. K-Pop profiles represent factual artists/members.
2. Factual JSON, USD prices, and dated announcements are an editorial snapshot checked 26 September 2026. Recheck before submission.
3. The cart, login/signup, and visitor count are clearly labelled demonstrations. No checkout, account, password storage, or payment occurs.
4. Bookmarks use localStorage; notes use sessionStorage; the cart exists only in memory. Visitors cannot edit bundled JSON.
5. Orbit is a scripted local JSON assistant with no live AI API.
6. Some copyrighted franchise/product imagery lacks republication permission, so the site uses labelled fallbacks and official links. Licensed local media is credited in docs/MEDIA-CREDITS.md.
7. Warriors Xtreme, Hassan Jahangir, Hassan Khan, Hassan Afridi, Shayan Shahnoor, hassanssk21@gmail.com, and DHA Karachi are participant-supplied public details in src/config/team.json. Verify spelling and consent before publishing.
8. FandomVerse is independent and is not an official retailer or franchise partner. Static preview cannot establish hosted uptime or capacity.

OpenAI Codex assisted with research organization, design, implementation, testing, and documentation. The participant must understand, personalize, and validate the final submission.

See README.md and docs/PROJECT-REPORT.md for full installation, architecture, tests, diagrams, and limits.`;
const escape = (value) => value
  .replaceAll("\\", "\\\\")
  .replaceAll("{", "\\{")
  .replaceAll("}", "\\}")
  .replace(/[^\x00-\x7f]/g, (char) => `\\u${char.charCodeAt(0)}?`)
  .replaceAll("\n", "\\par\n");
fs.writeFileSync("ReadMe.rtf", `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\f0\\fs22 ${escape(text)}}`);
console.log("Wrote genuine RTF fallback ReadMe.rtf");
