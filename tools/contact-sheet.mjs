import fs from 'node:fs/promises';
import sharp from 'sharp';
const kind=process.argv[2]||'profile';
const entries=JSON.parse(await fs.readFile(`docs/assets-${kind}-expansion.json`,'utf8'));
const cols=5,cellW=240,cellH=260;
const width=cols*cellW,height=Math.ceil(entries.length/cols)*cellH;
const labels=`<svg width="${width}" height="${height}">${entries.map((x,i)=>`<text x="${(i%cols)*cellW+4}" y="${Math.floor(i/cols)*cellH+246}" fill="white" font-size="13">${x.id.replace('-profile-',' ')}</text>`).join('')}</svg>`;
const images=await Promise.all(entries.map(async(x,i)=>({input:await sharp(`public/media/${x.id}-480.webp`).resize(230,220,{fit:'cover'}).toBuffer(),left:(i%cols)*cellW,top:Math.floor(i/cols)*cellH})));
await sharp({create:{width,height,channels:3,background:'#111'}}).composite([...images,{input:Buffer.from(labels),left:0,top:0}]).png().toFile(`tmp/${kind}-contact.png`);
