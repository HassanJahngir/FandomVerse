# FandomVerse

An independent, source-led fan discovery site for **Web Innovation Unleashed**. Seven portals lead to Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga. It is a responsive React single-page application; facts come from local JSON, while bookmarks and private notes use browser storage.

Live site: [fandomverse-iota.vercel.app](https://fandomverse-iota.vercel.app). Source: [HassanJahngir/FandomVerse](https://github.com/HassanJahngir/FandomVerse).

## Install and run

Use Node.js 20.19+ or 22.12+ and npm. From this folder:

1. `npm install`
2. `npm run dev`
3. Open the local URL printed by Vite (usually `http://localhost:5173/`).

For the submission build, run `npm run build` and `npm run preview`; the preview URL is usually `http://localhost:4173/`. `npm test` runs data and logic tests; `npm run test:browser` runs Chrome browser tests after starting preview. On a Windows PowerShell machine that blocks npm scripts, use `npm.cmd` in these commands. Browser tests use an installed Chrome at the path in `playwright.config.js`; adjust that path or install Chrome if needed. `npm run audit` produces Lighthouse reports when Chrome is available.

## Deploy the finished build

The GitHub repository is connected to the Vercel project `fandomverse`; pushes to `main` trigger deployments. You can also run `vercel deploy --prod` from this folder with an authenticated Vercel CLI. `npm run verify:live` checks the public homepage, Anime route, Contact location, mobile overflow, and page errors in Chrome. For a manual static upload, run `npm run build` and `npm run package:deploy`; the ZIP has `index.html` at its root. The app uses hash routes (`/#/world/anime`), so direct links and browser back/forward work without server rewrites. The site needs internet for official YouTube players, source links, and the Google Map. No environment variables or server process are required.

## Personalize before submitting

Team name, four members, public email, and DHA Karachi map location are configured in `src/config/team.json` from participant-provided details. Review their spelling and consent before submission. Make your own meaningful edits and practise the judge walkthrough in `docs/CODE-GUIDE.md`.

## How it works

`src/data/*.json` holds factual catalogs, products, and scripted chatbot rules. `src/lib/catalog.js` combines records; `query.js` filters and sorts; `storage.js` owns bookmark, note, and visitor-counter behavior. `App.jsx` handles navigation and shared state. `pages.jsx` renders screens. `components/` contains reusable controls. `styles.css` defines the visual system and responsive/reduced-motion rules. `public/media/` contains only assets with a documented reuse basis; `docs/MEDIA-CREDITS.md` links the register. Content links open sources or licensed media as appropriate. Bundled JSON cannot be changed by visitors.

The cart is temporary and has no checkout. Login/signup are labelled demos and do not authenticate or store passwords. Orbit is scripted from local JSON, not live AI. The local visitor count is simulated. No payment, account, database, or backend is included.

Prices and future schedules are snapshots checked on 26 September 2026; recheck them before judging. FandomVerse is an independent fan project, not a retailer or rights-holder partner. The Anime world uses online official previews for Demon Slayer, Naruto, Attack on Titan, JUJUTSU KAISEN, and My Hero Academia. These publisher videos and thumbnails require internet and are not bundled. All 35 profiles now have subject-matched licensed photographs, cosplay, performer portraits, or documented official visuals; cards label fan cosplay and context photos. All event, release, article, and trailer records have relevant visuals. The five exact merchandise photographs remain on official retailer sites because reuse permission could not be verified. Sixteen sourced trailer/video entries include online authorized players or official source links; the locally licensed Tales of Zestiria video plays offline.

See `docs/PROJECT-REPORT.md`, `docs/SRS-CHECKLIST.md`, `docs/TEST-RESULTS.md`, `docs/MEDIA-CREDITS.md`, `docs/WALKTHROUGH.md`, and `docs/CODE-GUIDE.md`. The MP4 demo and source ZIP are in `submission/`.
