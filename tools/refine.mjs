import fs from "node:fs";
let p = "src/App.jsx";
let s = fs.readFileSync(p, "utf8");
s = s.replace(
  "initialQuery={new URLSearchParams(route.split('?')[1]||'').get('q')||''}",
  "initialQuery={new URLSearchParams(route.split('?')[1]||'').get('q')||''} initialType={new URLSearchParams(route.split('?')[1]||'').get('type')||''}",
);
fs.writeFileSync(p, s);
p = "src/pages.jsx";
s = fs.readFileSync(p, "utf8");
s = s.replace(
  "initialQuery='',...props",
  "initialQuery='',initialType='',...props",
);
s = s.replace("type:fixedType,tag:", "type:fixedType||initialType,tag:");
s = s.replace(
  "{setQuery(initialQuery);},[initialQuery]",
  "{setQuery(initialQuery);setFilters(previous=>({...previous,type:fixedType||initialType}));},[initialQuery,initialType,fixedType]",
);
s = s.replace(
  "{!fixedType&&<label>Content type",
  "{mode==='media'&&<label>Media format<select value={filters.mediaKind||''} onChange={e=>update('mediaKind',e.target.value)}><option value=''>All media formats</option>{['trailer','interview','podcast','fan content'].map(kind=><option value={kind} key={kind}>{kind}</option>)}</select></label>}{!fixedType&&<label>Content type",
);
fs.writeFileSync(p, s);
