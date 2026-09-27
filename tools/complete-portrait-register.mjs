import fs from "node:fs";
const file = "docs/assets-kpop-portraits.json";
let rows = JSON.parse(fs.readFileSync(file));
for (const row of [
  {
    id: "kpop-rm",
    file: "190501 BTS RM at the 2019 BBMAs (cropped).png",
    name: "bts-rm-bbmas-2019",
    creator: "Newsen",
    alt: "RM at the 2019 Billboard Music Awards",
  },
  {
    id: "kpop-jin",
    file: 'Jin for Dispatch "Boy With Luv" MV behind the scene shooting, 15 March 2019 05.jpg',
    name: "bts-jin-dispatch-2019",
    creator: "Dispatch",
    alt: "Jin in a 2019 Dispatch photo session",
  },
]) {
  if (rows.some((r) => r.id === row.id)) continue;
  row.filename = `${row.name}-960.webp`;
  row.sourceUrl = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(row.file.replaceAll(" ", "_"))}`;
  row.license = "CC BY 3.0";
  row.licenseUrl = "https://creativecommons.org/licenses/by/3.0/";
  row.permissionBasis =
    "Creative Commons Attribution 3.0 and license review on linked Wikimedia Commons file page";
  row.changes = "Converted to WebP and AVIF, resized; preview may crop";
  row.verifiedAt = "2026-09-26";
  rows.push(row);
}
rows.sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(file, JSON.stringify(rows, null, 2) + "\n");
