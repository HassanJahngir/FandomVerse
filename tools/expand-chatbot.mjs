import fs from 'node:fs/promises';
const path='src/data/chatbot.json';
const bot=JSON.parse(await fs.readFile(path,'utf8'));
bot.suggestions=['Recommend anime beyond Demon Slayer','Show Nintendo trailers','Who is Luffy?','What is Ahsoka’s release date?','Explore K-Pop events','Show DC profiles','Find movie trailers','What releases are listed?','How do bookmarks work?','Can I buy merchandise?','Where are media credits?','How do I search?','Tell me about the team'];
for(const faq of bot.faqs){
  if(faq.keywords.includes('location permission'))faq.answer='Contact shows the team’s public map location in DHA, Karachi. You can request your own location through the browser; denial and unavailable states are explained without saving your coordinates.';
  if(faq.keywords.includes('team'))faq.answer='Warriors Xtreme created this independent competition project. The team members listed on About are Hassan Jahangir, Hassan Khan, Hassan Afridi, and Shayan Shahnoor. Contact uses hassanssk21@gmail.com and a DHA Karachi map.';
  if(faq.keywords.includes('why no image'))faq.answer='Character, event, and trailer cards use licensed or official subject visuals where verified. Exact product photography remains on the official retailer sites because republication permission has not been established.';
}
const extras=[
  {keywords:['beyond demon slayer','other anime','more anime'],answer:'The Anime world also features official Naruto, Attack on Titan, JUJUTSU KAISEN, and My Hero Academia video previews. They are historical or current entries as labeled, not invented artwork.',links:[{label:'Open Anime',href:'#/world/anime'}]},
  {keywords:['who made this','warriors xtreme','team members'],answer:'Warriors Xtreme is the student team behind this independent competition project. The About page lists Hassan Jahangir, Hassan Khan, Hassan Afridi, and Shayan Shahnoor.',links:[{label:'Meet the team',href:'#/about'}]},
  {keywords:['demon slayer anniversary','sixth anniversary'],answer:'The Demon Slayer sixth-anniversary celebration is a sourced past event. Open its record for the exact date and official announcement.',links:[{label:'Demon Slayer anniversary',href:'#/item/anime-event-demonslayer-anniversary'}]},
  {keywords:['anime expo 2025','ax2025'],answer:'Anime Expo 2025 is recorded as a past Los Angeles event. Its card uses a photograph taken at the 2025 convention.',links:[{label:'Anime Expo 2025',href:'#/item/anime-event-ax2025'}]},
  {keywords:['comic con 2025','sdcc 2025'],answer:'San Diego Comic-Con 2025 is a past event in this archive. The event page includes its source and a licensed photograph from the convention.',links:[{label:'San Diego Comic-Con 2025',href:'#/item/comics-event-comic-con-2025'}]},
  {keywords:['ahsoka release date','ahsoka season 2'],answer:'Lucasfilm announced Ahsoka season 2 for January 20, 2027 on Disney+. The date was verified from StarWars.com on September 26, 2026 and may change.',links:[{label:'Ahsoka season 2',href:'#/item/tv-release-ahsoka-season-2'}]},
  {keywords:['avengers doomsday','doomsday trailer'],answer:'Marvel Entertainment published an official Avengers: Doomsday trailer in July 2026. The trailer player loads from YouTube only when opened, and the release entry links to the confirmed date.',links:[{label:'Official trailer',href:'#/item/movies-trailer-avengers-doomsday'},{label:'Release',href:'#/item/movies-release-avengers-doomsday'}]},
  {keywords:['wonder flowers','super mario wonder'],answer:'Nintendo’s Super Mario Bros. Wonder launch trailer shows Wonder Flowers and transformations. The game’s release, article, and official trailer each have their own sourced record.',links:[{label:'Watch official trailer',href:'#/item/gaming-trailer-wonder'}]},
  {keywords:['the astronaut','jin music video'],answer:'Jin’s The Astronaut was released in 2022. Its official HYBE LABELS music video loads through an online player; no song file is hosted here.',links:[{label:'Official video',href:'#/item/kpop-trailer-astronaut'}]},
  {keywords:['photo source','image permission','fan cosplay'],answer:'Every bundled image has a source, creator, and license in Media Credits. Fan cosplay is labeled so it is not confused with official franchise artwork.',links:[{label:'Media Credits',href:'#/credits'}]},
  {keywords:['notes private','note privacy'],answer:'Notes are kept only in this tab’s sessionStorage. Closing the tab ends the session; no backend receives them.',links:[{label:'Saved collection',href:'#/bookmarks'}]},
  {keywords:['map location','dha karachi'],answer:'The configured public team location is DHA Karachi. The map opens from Contact and needs an internet connection.',links:[{label:'Contact and map',href:'#/contact'}]},
];
bot.faqs.push(...extras.filter(extra=>!bot.faqs.some(faq=>faq.keywords[0]===extra.keywords[0])));
await fs.writeFile(path,JSON.stringify(bot,null,2)+'\n');
