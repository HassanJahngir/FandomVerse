import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const photos=[
  ['movies-release-star-wars-starfighter','Ryan Gosling by Gage Skidmore.jpg','Gage Skidmore','CC BY-SA 3.0','Ryan Gosling, lead actor in Star Wars: Starfighter','The photograph shows lead actor Ryan Gosling at an earlier event, not a Starfighter still.'],
  ['tv-release-ahsoka-season-2','Rosario Dawson 2025.jpg','John E. Manard','CC BY-SA 4.0','Rosario Dawson, who portrays Ahsoka Tano','The photograph shows Ahsoka performer Rosario Dawson in 2025, not a season 2 still.'],
  ['tv-event-emmys-2024','Peacock Theater Exterior February 2026.jpg','Haruhi8','CC0 1.0','Peacock Theater, venue of the 76th Primetime Emmy Awards','The photograph shows the event venue in 2026, not the 2024 awards ceremony.'],
  ['tv-event-paleyfest-la-2025','The Paley Center for Media (48155560156).jpg','Ajay Suresh','CC BY 2.0','The Paley Center for Media, organizer of PaleyFest','The photograph shows the Paley Center in 2019, not a PaleyFest 2025 panel.'],
];
const register=JSON.parse(await fs.readFile('docs/assets-context-expansion.json','utf8').catch(()=>'[]'));
for(const [id,file,creator,license,alt,context] of photos){
  if(register.some(x=>x.id===id))continue;
  const name=file.replaceAll(' ','_'),hash=createHash('md5').update(name).digest('hex');
  const url=`https://thumb.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash.slice(0,2)}/${encodeURIComponent(name)}/960px-${encodeURIComponent(name)}`;
  try{
    const response=await fetch(url,{headers:{'User-Agent':'FandomVerseCompetition/1.0 (educational CC media audit)'}});
    if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw Error(`HTTP ${response.status}`);
    const bytes=Buffer.from(await response.arrayBuffer());
    const info=await sharp(bytes).metadata();
    for(const width of [480,960])for(const format of ['webp','avif'])await sharp(bytes).rotate().resize({width,withoutEnlargement:true})[format]({quality:format==='avif'?49:76}).toFile(`public/media/${id}-${width}.${format}`);
    register.push({id,file,creator,license,alt,context,files:`${id}-{480,960}.{webp,avif}`,sourceUrl:`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name)}`,downloadUrl:url,permissionBasis:'Creative Commons license on Commons file page',changes:'Resized and converted to WebP and AVIF',verifiedAt:'2026-09-26',downloadBytes:bytes.length});
    console.log('OK',id,info.width,info.height);
  }catch(error){console.log('FAILED',id,error.message)}
  await fs.writeFile('docs/assets-context-expansion.json',JSON.stringify(register,null,2));
}
for(const category of ['movies','tv']){
  const path=`src/data/${category}.json`,rows=JSON.parse(await fs.readFile(path,'utf8'));
  for(const row of rows){
    const photo=register.find(x=>x.id===row.id);
    if(!photo)continue;
    Object.assign(row,{image:`/media/${row.id}-960.webp`,imageAlt:photo.alt,imageCredit:`${photo.creator} · ${photo.license}`,imageKind:'related-photo',imageSourceUrl:photo.sourceUrl,imageContext:photo.context,mediaPermission:`${photo.license} photo; context image, not a production still or event photo. See source and media credits.`});
  }
  await fs.writeFile(path,JSON.stringify(rows,null,2)+'\n');
}
