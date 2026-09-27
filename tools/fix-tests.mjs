import fs from "node:fs";
const file = "tests/browser/app.spec.js";
let text = fs.readFileSync(file, "utf8");
text = text.replace(
  "fill('Tanjiro');await page.getByLabel('World'",
  "fill('sharp sense');await page.getByLabel('World'",
);
fs.writeFileSync(file, text);
