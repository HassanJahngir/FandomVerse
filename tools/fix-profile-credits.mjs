import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const fixes=[
  {id:'manga-profile-sanji',category:'manga',file:'Cosplayer of Vinsmoke Sanji standing on one leg (15537757258).jpg',creator:'FAT8893 x OTAKU PETROLHEADS LIFE',license:'CC BY 2.0',alt:'Fan cosplaying as Sanji standing on one leg',kind:'fan-cosplay'},
  {id:'tv-profile-river-song',category:'tv',file:'Alex Kingston (7702442302).jpg',creator:'Super Festivals',license:'CC BY 2.0',alt:'Alex Kingston, who portrays River Song',kind:'performer-photo'},
];
const register=JSON.parse(await fs.readFile('docs/assets-profile-expansion.json','utf8'));
for(const fix of fixes){
  const name=fix.file.replaceAll(' ','_'),hash=createHash('md5').update(name).digest('hex');
  const url=`https://thumb.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash.slice(0,2)}/${encodeURIComponent(name)}/960px-${encodeURIComponent(name)}`;
  const response=await fetch(url,{headers:{'User-Agent':'FandomVerseCompetition/1.0 (educational CC media audit)'}});
  if(!response.ok)throw Error(`${fix.id} HTTP ${response.status}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  for(const width of [480,960])for(const format of ['webp','avif'])await sharp(bytes).rotate().resize({width,withoutEnlargement:true})[format]({quality:format==='avif'?49:76}).toFile(`public/media/${fix.id}-${width}.${format}`);
  const sourceUrl=`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name)}`;
  const index=register.findIndex(x=>x.id===fix.id);
  register[index]={id:fix.id,file:fix.file,creator:fix.creator,license:fix.license,alt:fix.alt,files:`${fix.id}-{480,960}.{webp,avif}`,sourceUrl,originalUrl:url,permissionBasis:'Creative Commons license on Commons file page; Flickr license review',changes:'Resized and converted to WebP and AVIF',verifiedAt:'2026-09-26',originalBytes:bytes.length};
  const path=`src/data/${fix.category}.json`,rows=JSON.parse(await fs.readFile(path,'utf8'));
  const row=rows.find(x=>x.id===fix.id);
  Object.assign(row,{imageAlt:fix.alt,imageCredit:`${fix.creator} · ${fix.license}`,imageKind:fix.kind,imageSourceUrl:sourceUrl,mediaPermission:`${fix.license} photo by ${fix.creator}; ${fix.kind==='fan-cosplay'?'fan cosplay, not official art':'performer photo, not an official character still'}.`});
  await fs.writeFile(path,JSON.stringify(rows,null,2)+'\n');
  console.log('REPLACED',fix.id);
}
for(const [id,creator] of [['comics-profile-wonder-woman','William Tung'],['manga-profile-zoro','Gaudencio Garcinuño']]){
  const asset=register.find(x=>x.id===id);asset.creator=creator;
  const category=id.split('-')[0],path=`src/data/${category}.json`,rows=JSON.parse(await fs.readFile(path,'utf8'));
  const row=rows.find(x=>x.id===id);row.imageCredit=`${creator} · ${asset.license}`;
  row.mediaPermission=`${asset.license} photograph by ${creator}; fan cosplay, not official character artwork.`;
  await fs.writeFile(path,JSON.stringify(rows,null,2)+'\n');
}
await fs.writeFile('docs/assets-profile-expansion.json',JSON.stringify(register,null,2)+'\n');
