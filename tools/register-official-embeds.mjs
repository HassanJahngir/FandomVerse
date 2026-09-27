import fs from 'node:fs/promises';
const categories=['anime','gaming','movies','tv','kpop','comics','manga'];
const rows=(await Promise.all(categories.map(async category=>JSON.parse(await fs.readFile(`src/data/${category}.json`,'utf8'))))).flat();
const entries=rows.filter(row=>row.type==='trailer'&&row.embedUrl&&row.imageKind==='official-trailer-thumbnail').map(row=>({id:row.id,title:row.title,creator:row.imageCredit,sourceUrl:row.mediaUrl,thumbnailUrl:row.image,embedUrl:row.embedUrl,permissionBasis:'Official channel YouTube oEmbed player and thumbnail; online display only, no downloaded copy or standalone reuse license',verifiedAt:'2026-09-26'}));
await fs.writeFile('docs/assets-official-embeds-extra.json',JSON.stringify(entries,null,2)+'\n');
console.log(entries.length,'official online embeds');
