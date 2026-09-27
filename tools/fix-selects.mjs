import fs from "node:fs";
const file = "src/pages.jsx";
let text = fs.readFileSync(file, "utf8");
for (const name of [
  "World",
  "Content type",
  "Media format",
  "Sub-tag",
  "Franchise / group",
  "Status",
  "Sort by",
])
  text = text.replaceAll(
    `${name}<select`,
    `${name}<select aria-label="${name}"`,
  );
fs.writeFileSync(file, text);
