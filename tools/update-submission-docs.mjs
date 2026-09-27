import fs from 'node:fs/promises';
async function revise(path,changes){
  let text=await fs.readFile(path,'utf8');
  for(const [pattern,replacement] of changes){
    if(!pattern.test(text))console.warn('No match',path,pattern);
    text=text.replace(pattern,replacement);
  }
  await fs.writeFile(path,text);
}
await revise('README.md',[
  [/Fill the blank fields in `src\/config\/team.json`:[^\n]*/, 'Team name, six members, public email, and DHA Karachi map location are configured in `src/config/team.json` from participant-provided details. Review their spelling and consent before submission. Make your own meaningful edits and practise the judge walkthrough in `docs/CODE-GUIDE.md`.'],
  [/The Anime portal, hub, featured story, trailer cards, and gallery show \*\*actual Demon Slayer anime previews\*\*[^\n]*/, 'The Anime world uses online official previews for Demon Slayer, Naruto, Naruto Shippuden, Attack on Titan, JUJUTSU KAISEN, and My Hero Academia. These publisher videos and thumbnails require internet and are not bundled. All 35 profiles have subject-matched licensed photographs, cosplay, performer portraits, or documented official visuals; cards label fan cosplay and context photos. All event, release, article, and trailer records have relevant visuals. The five exact merchandise photographs remain on official retailer sites because reuse permission could not be verified; the Naruto shirt shows a labelled Shippuden trailer visual. Seventeen sourced trailer/video entries include online authorized players or official source links; the locally licensed Tales of Zestiria video plays offline.'],
]);
await revise('docs/SRS-CHECKLIST.md',[
  [/\| 7 \| Original, licensed, or public-domain visual material \|[^\n]*/, '| 7 | Original, licensed, or public-domain visual material | **Partial.** 56 reusable authentic photos/logos plus one CC trailer are bundled and credited. Official online oEmbed previews cover Demon Slayer, Naruto, Attack on Titan, JUJUTSU KAISEN, My Hero Academia, Mario, Jin, Avengers, Star Wars, TV, and Manga. All non-merchandise cards have subject-matched visuals, with context images labelled honestly. Five exact merchandise photos lack verified reuse permission and remain official retailer links. |'],
  [/\| 9 \| Category JSON cards[^\n]*/, '| 9 | Category JSON cards with title, thumbnail where permitted, description/type/tags; type/sub-tag filters and alphabetical/newest/featured sort | **Done with merchandise rights gap.** All non-merchandise records have relevant images. The Naruto shirt has a labelled trailer visual; four product cards retain rights fallbacks, and all five link to exact official retailer photos. Query and browser tests pass. |'],
  [/\| 11 \| Five authentic profiles[^\n]*/, '| 11 | Five authentic profiles per category with biography, franchise/group, traits and image; filters | **Done.** 35 factual profiles, all with credited subject-matched images and clear fan-cosplay or performer-photo labels; category and franchise/group filters verified. Official standalone character artwork is still not claimed as licensed for local redistribution. |'],
  [/\| 7, 11 \| Upcoming release calendar[^\n]*/, '| 7, 11 | Upcoming release calendar and dedicated filtered trailers | **Done.** Seventeen sourced trailer/video records, including Naruto Shippuden and five other Anime franchises, on-demand authorized players, and source links. Confirmed dated release announcements only; status/category filters and unavailable-player state. |'],
  [/\| 12–13 \| Scripted chatbot[^\n]*/, '| 12–13 | Scripted chatbot FAQs/recommendations, typed/suggested replies and links | **Done.** 32 local FAQ entries, eight content-type intents, seven world rules, dynamic sourced record answers, and 13 suggested prompts; no live model or backend. Grounded and fallback paths browser-tested. |'],
  [/\| 13 \| About\/team[^\n]*/, '| 13 | About/team, Contact with Google Map and GPS | **Done.** Warriors Xtreme, six member names, public email, and DHA Karachi map location were supplied by the participant and configured. User-triggered geolocation handles denial/unavailable states. |'],
]);
await revise('docs/PROJECT-REPORT.md',[
  [/The Commons file pages and license terms for 23 downloaded photographs,[^\n]*/, 'The Commons file pages and license terms for 56 downloaded photographs and simple logos, including Anime, Gaming, Comics, Manga, Star Wars, and TV subject photos, and the publisher’s Creative Commons game trailer are in `MEDIA-CREDITS.md`. Cosplay is identified as fan performance, and performer photos are not presented as character stills. The trailer was genuinely transcoded to WebM/MP4, with a still poster and an audio excerpt. Official video previews from multiple Anime franchises and other worlds use YouTube oEmbed metadata for remote thumbnails and on-demand players. They require internet and are not downloaded or relicensed. Other official media without established download permission is linked. Missing product-photo rights are disclosed in the interface.'],
  [/Team identity and map location remain blank until the participant supplies them\./, 'Team identity and DHA Karachi map location were supplied by the participant and are configured.'],
]);
await revise('docs/SUBMISSION-GAPS.md',[
  [/1\. Fill `src\/config\/team.json`[^\n]*/, '1. Verify the supplied public details in `src/config/team.json`: Warriors Xtreme; Hassan Jahangir, Hassan Khan, Hassan Afridi, Shayan, Shahnoor, Gufran; hassanssk21@gmail.com; DHA Karachi. Confirm spelling and consent before publishing.'],
  [/4\. Review every credit[^\n]*/, '4. Review `docs/MEDIA-CREDITS.md`: 56 locally converted, credited photos/logos and official remote trailer previews are documented. Every non-merchandise card has a subject-matched image; context photos are explicitly labelled. The Naruto shirt shows a labelled Shippuden trailer visual, while the five exact product photos stay on official retailer pages. Four product cards retain rights fallbacks.'],
]);
await revise('docs/CODE-GUIDE.md',[
  [/To make the submission yours, edit `src\/config\/team.json` with your team's approved public details\./, 'To make the submission yours, check the supplied team details in `src/config/team.json` and confirm consent to publish them.'],
]);
await revise('ReadMe.rtf',[
  [/7\. Team details and map location in src\/config\/team.json must be supplied by the participant\. No personal details have been invented\./, '7. Team details and DHA Karachi map location in src/config/team.json were supplied by the participant; verify spelling and publication consent.'],
]);
