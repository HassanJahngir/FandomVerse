import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const reports = [];
try {
  for (const category of ["anime", "gaming", "movies", "tv", "kpop", "comics", "manga"]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`http://127.0.0.1:4173/#/world/${category}`);
    await page.locator(".content-card").first().waitFor();
    for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 600) {
      await page.evaluate((nextY) => scrollTo(0, nextY), y);
      await page.waitForTimeout(90);
    }
    await page.waitForFunction(
      () => [...document.querySelectorAll(".content-card img")].every((image) => image.complete),
      null,
      { timeout: 8000 },
    ).catch(() => {});
    const cards = await page.locator(".content-card").evaluateAll((elements) =>
      elements.map((card) => {
        const image = card.querySelector(".card-art img");
        return {
          title: card.querySelector("h3")?.textContent,
          type: card.querySelector(".card-meta span:nth-child(2)")?.textContent,
          image: image?.src || null,
          loaded: Boolean(image?.naturalWidth),
        };
      }),
    );
    const missing = cards.filter((card) => !card.image || !card.loaded);
    const rightsFallback = missing.filter((card) => card.type === "Merchandise" && !card.image);
    const broken = missing.filter((card) => !rightsFallback.includes(card));
    reports.push({ category, total: cards.length, rightsFallback: rightsFallback.map((card) => card.title), broken });
    await page.close();
  }
} finally {
  await browser.close();
}
for (const report of reports) console.log(JSON.stringify(report));
if (reports.some((report) => report.broken.length)) process.exitCode = 1;
