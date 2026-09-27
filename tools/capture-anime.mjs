import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

await fs.mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
try {
  for (const [name, width, height, route] of [
    ["anime-desktop", 1440, 900, "world/anime"],
    ["gaming-tablet", 834, 1112, "world/gaming"],
    ["anime-mobile", 390, 844, "world/anime"],
    ["anime-profile", 960, 900, "item/anime-profile-nezuko"],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:4173/#/${route}`);
    await page.locator(".image-heading").first().waitFor();
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(500, innerHeight * 0.8)) {
        scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 160));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage: true, animations: "disabled" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    console.log(JSON.stringify({ name, overflow }));
    await page.close();
  }
} finally {
  await browser.close();
}
