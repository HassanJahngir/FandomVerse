import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

await fs.mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:4173/#/world/gaming");
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 650) {
    await page.evaluate((position) => scrollTo(0, position), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `docs/screenshots/gaming-${width}.png`, fullPage: true });
  await page.close();
}
await browser.close();
