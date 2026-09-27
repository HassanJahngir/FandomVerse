import fs from 'node:fs/promises';
const ids=new Set(['manga-profile-sanji','manga-profile-nami','tv-profile-tenth-doctor','tv-profile-river-song','tv-profile-ruby-sunday','movies-profile-luke-skywalker','movies-profile-leia-organa']);
for(const category of ['manga','tv','movies']){
  const path=`src/data/${category}.json`,rows=JSON.parse(await fs.readFile(path,'utf8'));
  for(const row of rows)if(ids.has(row.id))row.imageFocus='center 18%';
  await fs.writeFile(path,JSON.stringify(rows,null,2)+'\n');
}
