import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

// Each title points to its own Wikimedia Commons file page. Inspect the page
// before replacing any entry; a matching filename alone is not a license.
const photos = [
  ['comics-profile-superman','Superman Cosplayer.jpg','Tony Shek','CC BY-SA 2.0','Superman fan cosplay'],
  ['comics-profile-batman','Batman cosplayer (12163783063).jpg','Gage Skidmore','CC BY-SA 2.0','Batman fan cosplay'],
  ['comics-profile-wonder-woman','Wondercon 2016 - Wonder Woman Cosplay (26054968196).jpg','Gage Skidmore','CC BY-SA 2.0','Wonder Woman fan cosplay'],
  ['comics-profile-aquaman','Aquaman cosplayers (37671454274).jpg','Gage Skidmore','CC BY-SA 2.0','Aquaman fan cosplay'],
  ['comics-profile-harley-quinn','Harley Quinn.jpg','Suso Herero','CC BY-SA 3.0','Harley Quinn fan cosplay'],
  ['movies-profile-luke-skywalker','SWCA - Luke Skywalker (16580421784).jpg','William Tung','CC BY-SA 2.0','Luke Skywalker fan cosplay'],
  ['movies-profile-leia-organa','Cosplay of Leia Organa Solo at Brussels Comic Con 2019 (33600504718).jpg','Miguel Discart','CC BY-SA 2.0','Leia Organa fan cosplay'],
  ['movies-profile-han-solo','SDCC 15 - Han Solo (19652877106).jpg','William Tung','CC BY-SA 2.0','Han Solo fan cosplay'],
  ['movies-profile-darth-vader','SWC 6 - Darth Vader Costume (7865106344).jpg','Sam Howzit','CC BY 2.0','Darth Vader costume at Star Wars Celebration'],
  ['movies-profile-yoda','Yoda Sculpt.jpg','The Official Star Wars','CC BY 2.0','Yoda sculpture at Lucasfilm'],
  ['manga-profile-luffy','Cosplay of Monkey D. Luffy.jpg','Castorice','CC BY-SA 4.0','Monkey D. Luffy fan cosplay'],
  ['manga-profile-zoro','Cosplay Roronoa Zoro - One Piece.jpg','gaudiramone','CC BY-SA 2.0','Roronoa Zoro fan cosplay'],
  ['manga-profile-nami','Nami Cosplay de One Piece.jpg','Jhulis','CC BY-SA 4.0','Nami fan cosplay'],
  ['manga-profile-usopp','Anime North 2013 - Usopp Cosplayer.jpg','Tabercil','CC BY-SA 2.0','Usopp fan cosplay'],
  ['manga-profile-sanji','Sanji Vinsmoke ONE PIECE.jpg','Dystopix','CC BY-SA 4.0','Sanji fan cosplay'],
  ['tv-profile-tenth-doctor','Tenth Doctor.jpg','EPMLE','CC BY 2.0','Tenth Doctor portrait'],
  ['tv-profile-ruby-sunday','Millie Gibson.png','Doctor Who','CC BY 3.0','Millie Gibson, who portrays Ruby Sunday'],
  ['tv-profile-rose-tyler','Billie Piper at the 2019 Brussels Comic Con (cropped).jpg','Miguel Discart','CC BY-SA 2.0','Billie Piper, who portrays Rose Tyler'],
  ['tv-profile-martha-jones','Freema Agyeman 2007.jpg','DavidDjJohnson','CC BY 3.0','Freema Agyeman, who portrays Martha Jones'],
  ['tv-profile-river-song','WW St Louis 2014 - River Song (14042548855).jpg','Gage Skidmore','CC BY-SA 2.0','River Song fan cosplay'],
];

await fs.mkdir('public/media', {recursive:true});
const register=JSON.parse(await fs.readFile('docs/assets-profile-expansion.json','utf8').catch(()=>'[]'));
for(const [id,file,creator,license,alt] of photos){
  if(register.some(x=>x.id===id)) continue;
  const name=file.replaceAll(' ','_');
  const hash=createHash('md5').update(name).digest('hex');
  const originalUrl=`https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0,2)}/${encodeURIComponent(name)}`;
  try {
    const thumbnailUrl=`https://thumb.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash.slice(0,2)}/${encodeURIComponent(name)}/960px-${encodeURIComponent(name)}`;
    const res=await fetch(thumbnailUrl,{headers:{'User-Agent':'FandomVerseCompetition/1.0 (educational CC media audit)'}});
    if(!res.ok || !res.headers.get('content-type')?.startsWith('image/')) throw Error(`HTTP ${res.status}`);
    const bytes=Buffer.from(await res.arrayBuffer());
    const metadata=await sharp(bytes).metadata();
    if(!['jpeg','png'].includes(metadata.format) || bytes.length<10000) throw Error(`unexpected ${metadata.format} image`);
    for(const width of [480,960]) for(const format of ['webp','avif'])
      await sharp(bytes).rotate().resize({width,withoutEnlargement:true})[format]({quality:format==='avif'?49:76}).toFile(`public/media/${id}-${width}.${format}`);
    const sourceUrl=`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name)}`;
    register.push({id,file,creator,license,alt,files:`${id}-{480,960}.{webp,avif}`,sourceUrl,originalUrl:thumbnailUrl,permissionBasis:'Creative Commons license stated on Wikimedia Commons file page',changes:'Resized and converted to WebP and AVIF',verifiedAt:'2026-09-26',originalBytes:bytes.length});
    console.log('OK',id,metadata.width,metadata.height);
  }catch(error){console.log('FAILED',id,error.message)}
  await fs.writeFile('docs/assets-profile-expansion.json',JSON.stringify(register,null,2));
}
for(const category of ['comics','movies','manga','tv']){
  const path=`src/data/${category}.json`;
  const rows=JSON.parse(await fs.readFile(path,'utf8'));
  for(const row of rows){
    const media=register.find(x=>x.id===row.id);
    if(!media) continue;
    row.image=`/media/${row.id}-960.webp`;
    row.imageAlt=media.alt;
    row.imageCredit=`${media.creator} · ${media.license}`;
    row.imageKind=row.id==='tv-profile-ruby-sunday'?'official-artist-photo':row.id.includes('tv-profile-rose')||row.id.includes('tv-profile-martha')?'performer-photo':'fan-cosplay';
    row.imageSourceUrl=media.sourceUrl;
    row.mediaPermission=`${media.license} photograph by ${media.creator}; character and franchise rights remain with their owners. ${row.imageKind==='fan-cosplay'?'Fan cosplay, not official character artwork.':'Image of performer, not an official character still.'}`;
  }
  await fs.writeFile(path,JSON.stringify(rows,null,2)+'\n');
}
