# SRS requirements checklist

Source: *FandomVerse — Web Innovation Unleashed*, SRS v1.0, all 17 PDF pages read. References are physical PDF pages. Verified against the local build on 26 September 2026. “Partial” states the remaining gap.

| PDF pages | Mandatory requirement | Status and evidence |
|---|---|---|
| 4, 7, 16 | Responsive seven-world SPA; static JSON/TXT, no backend/database writes | **Done.** React/Vite/JS/CSS, local JSON, static hash routes; mobile/tablet/desktop browser tests. |
| 7 | Original, licensed, or public-domain visual material | **Partial.** 56 reusable authentic photos/logos plus one CC trailer are bundled and credited. Official online oEmbed previews cover Demon Slayer, Naruto, Attack on Titan, JUJUTSU KAISEN, My Hero Academia, Mario, Jin, Avengers, Star Wars, TV, and Manga. All non-merchandise cards have subject-matched visuals, with context images labelled honestly. Five exact merchandise photos lack verified reuse permission and remain official retailer links. |
| 8 | Logo, animated home intro, seven links, featured articles/trailers/events, chatbot | **Done.** Home, portal links, featured sections, persistent Orbit launcher, reduced-motion/pause support. |
| 9 | Category JSON cards with title, thumbnail where permitted, description/type/tags; type/sub-tag filters and alphabetical/newest/featured sort | **Done with merchandise rights gap.** All non-merchandise records have relevant images; five product cards link to exact official retailer photos. Query and browser tests pass. |
| 9 | Global search across categories/types with result navigation | **Done.** Persistent header access, combined category/type/text filters, empty state, working links. |
| 9 | Gallery in every category with accessible lightbox/carousel | **Done.** Seven category galleries, keyboard arrows/Escape and focus restore verified. |
| 10 | Media collection with category filters and descriptions; videos/audio where applicable | **Partial.** Local licensed gaming video and audio excerpt, official links/authorized players elsewhere, descriptive transcripts or audio descriptions. Reuse permission for local audio/video across all categories was unavailable. |
| 10 | Full articles with related content and sources | **Done.** Original editorial articles in every world with related links and source references. |
| 11 | Five authentic profiles per category with biography, franchise/group, traits and image; filters | **Done.** 35 factual profiles, all with credited subject-matched images and clear fan-cosplay or performer-photo labels; category and franchise/group filters verified. Official standalone character artwork is still not claimed as licensed for local redistribution. |
| 11 | Three real dated events per category with location, description, category, and source | **Done.** At least 21 verified records; historical status marked past, official future announcements labelled upcoming. |
| 7, 11 | Upcoming release calendar and dedicated filtered trailers | **Done.** Sixteen sourced trailer/video records, including five distinct Anime franchises, on-demand authorized players, and source links. Confirmed dated release announcements only; status/category filters and unavailable-player state. |
| 12 | Real merchandise, variant price, temporary cart, total, no checkout | **Partial.** Five authentic products, checked USD variant prices, official retailers, accurate cart arithmetic. Product photographs omitted pending republication permission. |
| 12–13 | Scripted chatbot FAQs/recommendations, typed/suggested replies and links | **Done.** 32 local FAQ entries, eight content-type intents, seven world rules, dynamic sourced record answers, and 13 suggested prompts; no live model or backend. Grounded and fallback paths browser-tested. |
| 13 | Bookmarks localStorage, notes sessionStorage, removal, export | **Done.** Cross-type bookmarks, session-only notes, formatted export; automated tests. |
| 13 | About/team, Contact with Google Map and GPS | **Done.** Warriors Xtreme, four member names, public email, and DHA Karachi map location were supplied by the participant and configured. User-triggered geolocation handles denial/unavailable states. |
| 14 | Breadcrumbs, live clock, simulated counter, transitions, demo login/signup | **Done.** Counter labelled simulated; account screens authenticate nobody and store no password. |
| 14–15 | Accessible, efficient, compatible experience; Lighthouse checks | **Partial.** Production build, Chrome browser checks, reduced motion, screenshots, and Lighthouse performed. The Vercel site passed a live mobile route smoke test; continuous uptime/capacity cannot be verified from one check. See actual mobile performance in `TEST-RESULTS.md`. |
| 14 | Acknowledge AI; participant understands and meaningfully modifies work | **Partial.** AI is acknowledged and a code guide/judge Q&A is provided. Participant must review and personalize the submission. |
| 17 | Report with problem, design, diagrams, test data/results and mandatory installation; no code | **Done.** `PROJECT-REPORT.md`. |
| 17 | Source ZIP and genuine `ReadMe.doc` assumptions file | **Partial.** Source ZIP prepared; genuine Word 97–2003 conversion is unavailable because installed Word's COM SaveAs stalled. A real `ReadMe.rtf` with assumptions is included, without misleading `.doc` renaming. Convert it in Word before final submission. |
| 17 | Actual MP4 of working functionality | **Done.** `submission/FandomVerse-demo.mp4` recorded from the production browser. |

## Examples and suggestions distinguished from requirements

- Page 6 labels the sitemap a **sample**. Its essential pages were implemented, but exact diagram layout is not mandatory.
- Pages 4 and 16 list alternative tools/frameworks; they do not require installing every one. React/Vite follows the user's selected stack.
- Pages 13 and 16 mention third-party chatbot platforms as examples. The SRS's no-backend/scripted constraint and user's explicit instruction govern this build.
- Page 9 permits popularity **or** featured sorting. Featured editorial flags avoid fabricated popularity numbers.
- Page 12's T-shirt is an example; the catalog includes a real licensed Naruto shirt among other verified products.
- Page 17 makes hosting optional. The project is deployed to Vercel, though continuous uptime and production capacity remain unmeasured.

The user's additional constraints—real profiles/events/products, dated source verification, lawful media reuse, accurate cart currency, reduced motion, and candid gaps—are addressed in `PROJECT-REPORT.md`, `MEDIA-CREDITS.md`, and `TEST-RESULTS.md`.
