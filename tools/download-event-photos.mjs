import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const photos=[
  ['anime-event-ax2025','GeeXPlus Anime Expo panel (2), 2025.jpg','Reppop','CC0 1.0','GeeXPlus panel photographed at Anime Expo 2025',960],
  ['anime-event-animejapan2025','Animejapanlogo.png','AnimeJapan','PD textlogo','AnimeJapan wordmark',960],
  ['gaming-event-gamescom2025','Visitors at Gamescom 2025 in Cologne, Germany.jpg','RAWdz Ivan','CC BY 4.0','Visitors at gamescom 2025 in Cologne',960],
  ['gaming-event-gameawards2024','Recording with a New Nintendo 2DS XL at The Game Awards 2024.jpg','TzarN64','CC BY-SA 4.0','A Nintendo handheld being used at The Game Awards 2024',330],
  ['movies-event-celebration-japan-2025','Star Wars Celebration 2025 Japan-Anime Manga Pavilion.jpg','さえぼー','CC0 1.0','Anime Manga Pavilion at Star Wars Celebration Japan 2025',960],
  ['movies-event-cannes-2025','Christopher McQuarrie at the 2025 Cannes Film Festival 03.jpg','Gabriel Hutchinson / WikiPortraits','CC BY-SA 4.0','Christopher McQuarrie at the 2025 Cannes Film Festival',960],
  ['movies-event-oscars-2025','Jennifer Stahl and Gabriel Sherman.jpg','Mecredis','CC BY-SA 4.0','Guests at the 97th Academy Awards in 2025',960],
  ['comics-event-comic-con-2025','San Diego Comic Con sign - 54710499331.jpg','Gage Skidmore','CC BY-SA 4.0','Comic-Con sign at San Diego Comic-Con 2025',960],
  ['comics-event-fcbd-2025','Free Comic Book Day logo.jpg','Diamond Comics Distributors','PD textlogo','Free Comic Book Day wordmark',330],
];
const register=JSON.parse(await fs.readFile('docs/assets-event-expansion.json','utf8').catch(()=>'[]'));
await fs.mkdir('public/media',{recursive:true});
for(const [id,file,creator,license,alt,previewWidth] of photos){
  if(register.some(x=>x.id===id)) continue;
  const name=file.replaceAll(' ','_');
  const hash=createHash('md5').update(name).digest('hex');
  const url=`https://thumb.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash.slice(0,2)}/${encodeURIComponent(name)}/${previewWidth}px-${encodeURIComponent(name)}`;
  try{
    const response=await fetch(url,{headers:{'User-Agent':'FandomVerseCompetition/1.0 (educational CC media audit)'}});
    if(!response.ok||!response.headers.get('content-type')?.startsWith('image/')) throw Error(`HTTP ${response.status}`);
    const bytes=Buffer.from(await response.arrayBuffer());
    const info=await sharp(bytes).metadata();
    for(const width of [480,960])for(const format of ['webp','avif']) await sharp(bytes).rotate().resize({width,withoutEnlargement:true})[format]({quality:format==='avif'?49:76}).toFile(`public/media/${id}-${width}.${format}`);
    register.push({id,file,creator,license,alt,files:`${id}-{480,960}.{webp,avif}`,sourceUrl:`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name)}`,downloadUrl:url,permissionBasis:license==='PD textlogo'?'Public domain textlogo designation on Commons; trademark rights remain with owner':'Creative Commons license on Commons file page',changes:'Resized and converted to WebP and AVIF',verifiedAt:'2026-09-26',downloadBytes:bytes.length});
    console.log('OK',id,info.width,info.height);
  }catch(error){console.log('FAILED',id,error.message)}
  await fs.writeFile('docs/assets-event-expansion.json',JSON.stringify(register,null,2));
}
for(const category of ['anime','gaming','movies','comics']){
  const path=`src/data/${category}.json`;
  const rows=JSON.parse(await fs.readFile(path,'utf8'));
  for(const row of rows){
    const image=register.find(x=>x.id===row.id);
    if(!image)continue;
    Object.assign(row,{image:`/media/${row.id}-960.webp`,imageAlt:image.alt,imageCredit:`${image.creator} · ${image.license}`,imageKind:image.license==='PD textlogo'?'event-logo':'event-photo',imageSourceUrl:image.sourceUrl,mediaPermission:`${image.license}; see source and media credits. ${image.license==='PD textlogo'?'Trademark rights remain with the owner.':''}`});
  }
  await fs.writeFile(path,JSON.stringify(rows,null,2)+'\n');
}
