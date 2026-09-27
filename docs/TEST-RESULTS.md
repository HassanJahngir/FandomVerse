# Verification results - 27 September 2026

The following checks used the local production preview in Chrome, followed by a live Vercel smoke test.

| Check | Observed result |
|---|---|
| Production build | `npm.cmd run build` passed. Vite produced 49.39 kB CSS (11.97 kB gzip) and 467.91 kB JavaScript (125.53 kB gzip). |
| Data and logic | `npm.cmd test`: 9/9 passed. This covers seven-world content minimums, unique IDs, sources, local asset existence, combined filters, sorting, cart cents and currencies, date status, bookmark export, and storage failure behavior. |
| Chrome integration | `npm.cmd run test:browser`: 15/15 passed. The suite covers routes/history, search, bookmarks and session-only notes, cart, chatbot, related trailers, gallery keyboard controls, media fallback, geolocation, mobile/tablet/desktop overflow, reduced motion, demo login/signup, sourced Anime imagery, equal card dimensions, and all five merchandise image loads. |
| Image loading | All 104 records and all gallery visuals now reference existing local AVIF/WebP assets. Five merchandise cards show labelled franchise context images because exact product photo reuse remains unverified. Browser tests checked all five merchandise images loaded. Official video players remain online only. |
| Visual review | Chrome screenshots in `docs/screenshots/` show desktop Anime, tablet Gaming, mobile Anime, and a profile. The local Naruto, Attack on Titan, Jujutsu Kaisen, My Hero Academia and Demon Slayer photos are visible. No horizontal overflow was observed in those captures. |
| Demonstration video | `submission/FandomVerse-demo.mp4` was re-recorded after the image update: H.264 MP4 browser capture at 1280 x 720, 5 fps, 49 seconds, 245 frames. |
| Live deployment | Vercel production build passed. `https://fandomverse-iota.vercel.app/` and its JavaScript asset returned HTTP 200. A 390 px Chrome check loaded Home, direct Anime and Contact hash routes, displayed “DHA Karachi,” found no horizontal overflow, and reported no page errors. |

Lighthouse reports are saved at `docs/audits/lighthouse-mobile.{json,html}` and `docs/audits/lighthouse-desktop.{json,html}`. The latest production-preview scores were **mobile 87 performance / 100 accessibility / 100 best practices / 100 SEO; desktop 100 / 100 / 100 / 100**. The mobile audit uses simulated slow CPU and network conditions and measured 3.8 s largest contentful paint. Mobile performance varied across local runs, so this measured score is a snapshot rather than a guarantee. The saved reports contain the evidence.

External official links, third-party embed availability, and production hosting concurrency were not measured. Time-sensitive events and retailer prices should be checked again before judging.
