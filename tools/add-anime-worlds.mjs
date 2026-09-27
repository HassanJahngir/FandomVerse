import fs from 'node:fs/promises';
const videos=[
  {id:'anime-trailer-naruto',videoId:'yeUpnIKt6k4',author:'vizmedia',title:'Naruto — official English trailer',description:'VIZ Media’s official English trailer for Naruto, Set 1. An archive preview of the published ninja series, not a new 2026 announcement.',franchise:'Naruto',tags:['Naruto','VIZ Media','Archive']},
  {id:'anime-trailer-attack-on-titan',videoId:'MUCN-JwUvbY',author:'Crunchyroll',title:'Attack on Titan Final Season — official trailer',description:'Crunchyroll’s official 2020 trailer for the final season of Attack on Titan. The series has already aired; this is an archive preview.',date:'2020-09-22',franchise:'Attack on Titan',tags:['Attack on Titan','Crunchyroll','Archive']},
  {id:'anime-trailer-jujutsu-kaisen',videoId:'ztO4Bk0ALGI',author:'Crunchyroll',title:'JUJUTSU KAISEN Sendai Colony — official trailer',description:'Crunchyroll’s official 2026 preview of the Sendai Colony story. Opens an authorized online player only when requested.',franchise:'JUJUTSU KAISEN',tags:['JUJUTSU KAISEN','Crunchyroll','2026']},
  {id:'anime-trailer-my-hero-academia',videoId:'zz37nGym3OQ',author:'Crunchyroll',title:'My Hero Academia FINAL SEASON — official trailer',description:'Crunchyroll’s official preview of the final season of My Hero Academia, published in 2025. It is an archive trailer, not a current premiere notice.',franchise:'My Hero Academia',tags:['My Hero Academia','Crunchyroll','Archive']},
];
const path='src/data/anime.json';
const rows=JSON.parse(await fs.readFile(path,'utf8'));
for(const video of videos){
  const url=`https://www.youtube.com/watch?v=${video.videoId}`;
  const response=await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
  if(!response.ok){console.log('SKIP',video.id,response.status);continue;}
  const oembed=await response.json();
  if(oembed.author_name!==video.author){console.log('SKIP',video.id,'uploader',oembed.author_name);continue;}
  const image=oembed.thumbnail_url;
  const record={id:video.id,category:'anime',type:'trailer',title:video.title,description:video.description,tags:video.tags,franchise:video.franchise,featured:true,date:video.date,status:'released',verifiedAt:'2026-09-26',image,imageAlt:`Official ${oembed.title} thumbnail`,imageCredit:video.author,imageKind:'official-trailer-thumbnail',imageSourceUrl:url,mediaKind:'trailer',mediaUrl:url,embedUrl:`https://www.youtube-nocookie.com/embed/${video.videoId}`,poster:image,mediaPermission:'Official channel YouTube oEmbed player and thumbnail; online only, no local copy or republication license claimed.',transcript:'See the official YouTube player for captions and transcript where supplied by the publisher.',sources:[{label:`${video.author} official video`,url}]};
  const index=rows.findIndex(x=>x.id===video.id);
  if(index>=0)rows[index]=record;else rows.push(record);
  console.log('OK',video.id,oembed.title);
}
await fs.writeFile(path,JSON.stringify(rows,null,2)+'\n');
