# Actions before final competition submission

1. Verify the supplied public details in `src/config/team.json`: Warriors Xtreme; Hassan Jahangir, Hassan Khan, Hassan Afridi, Shayan Shahnoor; hassanssk21@gmail.com; DHA Karachi. Confirm spelling and consent before publishing.
2. Open the genuine `ReadMe.rtf` in Microsoft Word, choose **File → Save As → Browse → Save as type: Word 97–2003 Document (*.doc)**, name it `ReadMe.doc`, and place it at project root. Re-run `npm run package` so the `.doc` enters `submission/FandomVerse-source.zip`. Automated Word COM conversion stalled and the Windows Computer Use helper returned `native pipe is unavailable`; a real `.doc` could not be verified here. The RTF was not falsely renamed `.doc`.
3. Recheck the five official retailer prices and any future event/release announcement immediately before judging. The content was checked on 26 September 2026 and can change.
4. Review `docs/MEDIA-CREDITS.md`: 56 locally converted, credited photos/logos and official remote trailer previews are documented. Every non-merchandise card has a subject-matched image; context photos are explicitly labelled. The five exact product photos stay on official retailer pages because permission to embed or republish them was not established.
5. Read `docs/CODE-GUIDE.md`, make your own meaningful design/editorial edits, and practise `docs/WALKTHROUGH.md`. Confirm that the AI acknowledgement matches the tools you actually used.
6. Decide whether to deploy to a static host. The local build cannot establish public uptime or capacity. If hosting, test its direct routes, external embeds, map, and mobile behavior again.

`submission/FandomVerse-demo.mp4` is an actual recorded 47.6-second browser demonstration; it is already supplied separately from the source ZIP. `submission/FandomVerse-deploy.zip` contains the ready-built static site with `index.html` at its root.
