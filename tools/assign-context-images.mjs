import fs from 'node:fs/promises';

// These are subject-matched context images, explicitly identified as such.
// They never pretend to depict an event, release, or retail product itself.
const donor={
  'anime-event-demonslayer-anniversary':'anime-trailer-original-2019',
  'anime-release-infinitycastle-us':'anime-trailer-infinitycastle',
  'gaming-event-nintendolive2023':'gaming-profile-mario',
  'gaming-release-wonder':'gaming-profile-mario',
  'gaming-trailer-wonder':'gaming-profile-mario',
  'gaming-article-wonder-design':'gaming-profile-mario',
  'movies-release-force-awakens':'movies-trailer-force-awakens',
  'movies-event-star-wars-experience-2027':'movies-profile-darth-vader',
  'tv-event-doctor-who-prom-2024':'tv-trailer-doctor-who-2025',
  'tv-release-doctor-who-2025':'tv-trailer-doctor-who-2025',
  'kpop-event-busan-2022':'kpop-gallery-real-world',
  'kpop-event-festa-2023':'kpop-gallery-real-world',
  'kpop-event-proof-2022':'kpop-gallery-real-world',
  'kpop-trailer-astronaut':'kpop-jin',
  'kpop-release-astronaut':'kpop-jin',
  'comics-event-batman-day-2025':'comics-profile-batman',
  'comics-release-absolute-batman-1':'comics-profile-batman',
  'comics-trailer-dc-all-in':'comics-profile-batman',
  'comics-article-dc-entry-points':'comics-profile-superman',
  'manga-release-onepiece108':'manga-profile-luffy',
  'manga-article-strawhats':'manga-profile-luffy',
  'manga-event-publishing2025':'anime-event-ax2025',
  'manga-event-kinoshita2025':'anime-event-ax2025',
  'manga-event-squareenix2025':'anime-event-ax2025',
};
const filenames=['anime','gaming','movies','tv','kpop','comics','manga'];
const rowsByFile=Object.fromEntries(await Promise.all(filenames.map(async f=>[f,JSON.parse(await fs.readFile(`src/data/${f}.json`,'utf8'))])));
const byId=new Map(Object.values(rowsByFile).flat().map(row=>[row.id,row]));
for(const [targetId,donorId] of Object.entries(donor)){
  const target=byId.get(targetId),source=byId.get(donorId);
  if(!target || !source?.image) {console.log('SKIP',targetId,donorId);continue;}
  if(target.image) continue;
  Object.assign(target,{
    image:source.image,
    imageAlt:source.imageAlt||`Related visual: ${source.title}`,
    imageCredit:source.imageCredit||source.title,
    imageKind:source.imageKind||'related-photo',
    imageSourceUrl:source.imageSourceUrl||source.mediaUrl||source.sources?.[0]?.url,
    imageContext:`Related ${source.type==='profile'?'character or artist':'franchise'} visual; it does not depict ${target.type==='event'?'this event':target.type==='release'?'the release artwork':'the linked media'} itself.`,
    mediaPermission:`Context visual from ${donorId}; see its credited source. Not an official image of this ${target.type}.`,
  });
  if(targetId.startsWith('manga-event-'))target.imageContext='Photograph from Anime Expo 2025, the host convention; it does not show this specific manga panel.';
  console.log('SET',targetId,donorId);
}
for(const [filename,rows] of Object.entries(rowsByFile)) await fs.writeFile(`src/data/${filename}.json`,JSON.stringify(rows,null,2)+'\n');
