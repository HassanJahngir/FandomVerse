# Understand and personalize FandomVerse

Start with `src/App.jsx`: it reads the hash route, chooses a page, and owns shared state such as the temporary cart and bookmark list. `src/pages.jsx` contains the screens. `src/components/UI.jsx` contains repeated card, image, modal, and bookmark controls; `Chatbot.jsx` turns local FAQ/rule records into conversations. `src/lib/catalog.js` loads the JSON files into one searchable collection, `query.js` performs filtering/sorting and date status, and `storage.js` protects browser-storage operations. `src/styles.css` defines the colors, spacing, portals, responsive breakpoints, and motion rules. You can explain the system as **data → query utility → React page → browser interaction**.

To make the submission yours, check the supplied team details in `src/config/team.json` and confirm consent to publish them. Change the opening introduction or a category's editorial line in `src/data/categories.json`, keeping factual record titles and citations intact. Adjust CSS variables near the top of `styles.css` to tune the palette. Add your own paragraph to an article after checking a reliable source and keeping its URL in the record. Run the tests and browser walkthrough after editing. The abstract portal lettering and shapes are original CSS decoration; licensed photographs provide authentic fandom context.

K-Pop uses real BTS artist/member profiles, not fictional “characters.” Profiles currently cover one group to keep the initial scope verifiable. If you expand to another group, cite official artist pages, avoid personal speculation, and verify image rights separately. FandomVerse should never imply that an event photograph depicts a named fictional character.

Likely judge questions and clear answers:

- **Why a SPA and hash routes?** React updates the current page without a server round trip; hashes make direct links and back/forward work on a simple static host.
- **Where does data come from?** Local JSON files bundled at build time, with source URLs on factual records. There is no database and visitors cannot edit those files.
- **Why are some images absent?** Public visibility is not a reuse license. Cards show an honest fallback and source link when independent republication permission was not established.
- **How does search work?** `query.js` combines text, world, content type, tag, and group filters, then applies a documented sort. “Featured” is an editorial flag, not an invented popularity score.
- **How is cart money calculated?** The selected variant's verified price is converted to integer cents and multiplied by quantity; totals are separated by currency. There is no checkout or tax/shipping claim.
- **What does the chatbot do?** It matches typed questions and suggested replies against JSON FAQs/recommendations, returning only local verified content links or a fallback. It is not an AI chatbot.
- **What persists?** Bookmarks and the simulated visit count in `localStorage`; notes only in `sessionStorage`. Cart state is temporary React memory. Demo login creates no identity.
- **What makes it accessible?** Semantic buttons/links, visible focus, keyboard-operable modals and gallery, descriptive fallbacks, responsive layout, reduced-motion CSS, and an animation pause control.
- **How did you check it?** Unit/data tests, 11 Chrome integration tests, production build, phone/tablet/desktop screenshots, and actual Lighthouse reports are saved in `docs/`.
- **Where would you extend it?** Add a sourced record in its category JSON and a rights-cleared asset in `public/media`; the catalog and search then expose it automatically. Keep its ID stable.

If asked what you personally changed, point to your actual edits and reasoning. Do not claim you created work you have not reviewed or that rights-holder media is licensed without evidence.
