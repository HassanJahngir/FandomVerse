import fs from 'node:fs/promises';

const entries=[
  {id:'gaming-trailer-wonder',category:'gaming',videoId:'XvQNlGKNC6o',expectedAuthor:'Nintendo of America',releaseIds:['gaming-release-wonder','gaming-article-wonder-design']},
  {id:'kpop-trailer-astronaut',category:'kpop',videoId:'c6ASQOwKkhk',expectedAuthor:'HYBE LABELS',releaseIds:['kpop-release-astronaut']},
  {id:'movies-trailer-avengers-doomsday',category:'movies',videoId:'iFl4YeX6jmc',expectedAuthor:'Marvel Entertainment',releaseIds:['movies-release-avengers-doomsday']},
];
for(const entry of entries){
  const mediaUrl=`https://www.youtube.com/watch?v=${entry.videoId}`;
  const response=await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(mediaUrl)}&format=json`);
  if(!response.ok)throw Error(`No authorized oEmbed for ${entry.videoId}: ${response.status}`);
  const metadata=await response.json();
  if(metadata.author_name!==entry.expectedAuthor)throw Error(`Unexpected uploader ${metadata.author_name}`);
  const path=`src/data/${entry.category}.json`;
  const rows=JSON.parse(await fs.readFile(path,'utf8'));
  let trailer=rows.find(row=>row.id===entry.id);
  if(!trailer){
    trailer={id:entry.id,category:entry.category,type:'trailer',title:'Avengers: Doomsday — official trailer',description:'Marvel Entertainment’s official 2026 theatrical trailer for its December 2026 film. The player loads on demand from YouTube; internet is required.',tags:['Marvel','Avengers','Official trailer'],featured:true,date:'2026-07-20',releaseDate:'2026-12-18',status:'upcoming',mediaKind:'trailer',verifiedAt:'2026-09-26',transcript:'Official trailer from Marvel Entertainment. Use YouTube’s closed captions for spoken dialogue; the original source remains available below.',sources:[{label:'Marvel Entertainment official YouTube channel',url:mediaUrl}]};
    rows.push(trailer);
  }
  const image=metadata.thumbnail_url;
  const visual={image,imageAlt:`Official ${metadata.title} thumbnail`,imageCredit:metadata.author_name,imageKind:'official-trailer-thumbnail',imageSourceUrl:mediaUrl,mediaPermission:'YouTube oEmbed supplied an official channel player and thumbnail; media loads online and is not downloaded.',mediaPermissionNote:'Official online embed; no local copy or republication license claimed.'};
  Object.assign(trailer,visual,{poster:image,mediaUrl,embedUrl:`https://www.youtube-nocookie.com/embed/${entry.videoId}`});
  delete trailer.imageContext;
  if(entry.category==='gaming'){
    trailer.title='Super Mario Bros. Wonder — official launch trailer';
    trailer.description='Nintendo of America’s official launch trailer shows the Wonder Flowers, transformations, and playful platforming of the 2023 Nintendo Switch game. The player loads when opened.';
    trailer.sources=[{label:'Nintendo of America official launch trailer',url:mediaUrl},{label:'Nintendo official game page',url:'https://www.nintendo.com/us/store/products/super-mario-bros-wonder-switch/'}];
  }
  if(entry.category==='kpop'){
    trailer.title='Jin — The Astronaut: official music video';
    trailer.description='The official music video supplied through HYBE LABELS’ embeddable YouTube player. The video remains with the rights holder, loads only when opened, and requires internet.';
    trailer.sources=[{label:'HYBE LABELS official music video',url:mediaUrl},{label:'BIGHIT MUSIC release page',url:'https://bts.ibighit.com/eng/discography/jin/detail/astronaut/'}];
  }
  for(const id of entry.releaseIds){
    const row=rows.find(x=>x.id===id);
    if(!row)continue;
    Object.assign(row,visual);
    delete row.imageContext;
    if(row.type==='article')row.imageContext='Official trailer still for the game discussed; article is original commentary, not part of the video.';
  }
  await fs.writeFile(path,JSON.stringify(rows,null,2)+'\n');
  console.log(entry.id,metadata.title,metadata.author_name);
}
