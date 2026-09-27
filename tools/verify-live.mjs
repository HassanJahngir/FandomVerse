import { chromium } from "@playwright/test";

const base = process.argv[2] || "https://fandomverse-iota.vercel.app";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const home = await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: /Seven Worlds/ }).waitFor();
  await page.goto(`${base}/#/world/anime`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Anime", exact: true }).waitFor();
  await page.goto(`${base}/#/about`, { waitUntil: "domcontentloaded" });
  for (const member of ["Shayan", "Shahnoor", "Gufran"]) {
    await page.getByText(member, { exact: true }).waitFor();
  }
  await page.goto(`${base}/#/contact`, { waitUntil: "domcontentloaded" });
  await page.getByText("DHA Karachi", { exact: true }).first().waitFor();
  console.log(JSON.stringify({
    base,
    homeStatus: home.status(),
    title: await page.title(),
    contactHasDhaKarachi: true,
    teamNamesSeparate: true,
    mobileOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    pageErrors: errors,
  }));
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
