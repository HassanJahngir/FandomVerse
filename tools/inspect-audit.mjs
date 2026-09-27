import fs from "node:fs";
const audit = JSON.parse(fs.readFileSync(`docs/audits/lighthouse-${process.argv[2] || "mobile"}.json`, "utf8"));
for (const id of ["long-tasks", "mainthread-work-breakdown", "bootup-time", "label-content-name-mismatch", "largest-contentful-paint-element", "image-delivery-insight", "diagnostics"]) {
  const item = audit.audits[id];
  console.log(id, JSON.stringify(item?.details?.items?.slice?.(0, 8) ?? item?.details ?? null).slice(0, 5000));
}
