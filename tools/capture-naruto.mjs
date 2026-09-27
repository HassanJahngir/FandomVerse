import { chromium } from "@playwright/test";

const base = process.argv[2] || "http://127.0.0.1:4173";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${base}/#/world/anime`);
  const card = page.locator(".content-card").filter({ hasText: "Naruto Shippuden — Ichiraku Ramen T-Shirt" });
  await card.scrollIntoViewIfNeeded();
  const picture = card.locator("img");
  await picture.waitFor();
  await page.waitForFunction((image) => image.complete && image.naturalWidth > 0, await picture.elementHandle());
  const result = {
    base,
    loadedWidth: await picture.evaluate((image) => image.naturalWidth),
    label: await card.locator(".card-photo-label").innerText(),
    source: await picture.getAttribute("src"),
  };
  if (!process.argv[2]) await card.screenshot({ path: "docs/screenshots/naruto-shippuden-card.png" });
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
}
