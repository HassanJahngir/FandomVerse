# Verification results - 26 September 2026

The following checks used the local production preview in Chrome, followed by a live Vercel smoke test.

| Check | Observed result |
|---|---|
| Production build | `npm.cmd run build` passed. Vite produced 47.51 kB CSS (11.61 kB gzip) and 444.92 kB JavaScript (123.28 kB gzip). |
| Data and logic | `npm.cmd test`: 9/9 passed. This covers seven-world content minimums, unique IDs, sources, local asset existence, combined filters, sorting, cart cents and currencies, date status, bookmark export, and storage failure behavior. |
| Chrome integration | `npm.cmd run test:browser`: 13/13 passed on the corrected site. The suite covers routes/history, search, bookmarks and session-only notes, cart, chatbot, related trailers, gallery keyboard controls, media fallback, geolocation, mobile/tablet/desktop overflow, reduced motion, demo login/signup, and Anime preview attribution. |
| Image loading | A browser scroll-through of all seven category hubs checked 103 cards. The only five cards without a republished image are the exact merchandise products whose retailer-photo reuse rights were not established. All other card images loaded. |
| Visual review | Network-enabled Chrome screenshots in `docs/screenshots/` show desktop, tablet, and mobile layouts, official Anime previews from five franchises, Gaming pages, and a profile. Card focal points were adjusted to keep faces visible. No horizontal overflow or page errors were observed. |
| Demonstration video | `submission/FandomVerse-demo.mp4` is an actual H.264 MP4 browser capture at 1280 x 720, 5 fps, 47.6 seconds, 238 frames. |
| Live deployment | Vercel production build passed. `https://fandomverse-iota.vercel.app/` and its JavaScript asset returned HTTP 200. A 390 px Chrome check loaded Home, direct Anime and Contact hash routes, displayed “DHA Karachi,” found no horizontal overflow, and reported no page errors. |

Lighthouse reports are saved at `docs/audits/lighthouse-mobile.{json,html}` and `docs/audits/lighthouse-desktop.{json,html}`. The latest isolated network-enabled production-preview scores were **mobile 74 performance / 100 accessibility / 100 best practices / 100 SEO; desktop 100 / 100 / 100 / 100**. The mobile audit uses simulated slow CPU and network conditions. It measured 2.9 s largest contentful paint and 890 ms total blocking time. Mobile performance varied across local runs, so this measured score is a snapshot rather than a guarantee. The saved reports contain the evidence.

External official links, third-party embed availability, and production hosting concurrency were not measured. Time-sensitive events and retailer prices should be checked again before judging.
