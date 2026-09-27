import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
await fs.mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["tablet", 834, 1112],
  ["mobile", 390, 844],
]) {
  await page.setViewportSize({ width, height });
  await page.goto("http://127.0.0.1:4173");
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(500, innerHeight * 0.8)) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 160));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: `docs/screenshots/home-${name}.png`,
    fullPage: true,
  });
  console.log(
    JSON.stringify({
      name,
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      title: await page.title(),
    }),
  );
}
console.log("Errors", errors);
await browser.close();
