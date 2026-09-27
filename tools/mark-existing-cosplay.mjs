import fs from 'node:fs/promises';
for(const category of ['anime','gaming']){
  const path=`src/data/${category}.json`;
  const rows=JSON.parse(await fs.readFile(path,'utf8'));
  for(const row of rows)if(row.type==='profile'&&row.image)row.imageKind='fan-cosplay';
  await fs.writeFile(path,JSON.stringify(rows,null,2)+'\n');
}
