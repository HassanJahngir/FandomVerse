import lighthouse from "lighthouse";
import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
await fs.mkdir("docs/audits", { recursive: true });
// Launch with Playwright's tested Chrome flags; Chrome Launcher could not connect
// to its child on this Windows environment.
const chrome = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--remote-debugging-port=9223"],
});
try {
  for (const mode of ["mobile", "desktop"]) {
    const options = {
      port: 9223,
      output: ["json", "html"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      ...(mode === "desktop"
        ? {
            formFactor: "desktop",
            screenEmulation: {
              mobile: false,
              width: 1440,
              height: 900,
              deviceScaleFactor: 1,
              disabled: false,
            },
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0,
            },
          }
        : {}),
    };
    const result = await lighthouse("http://127.0.0.1:4173/", options);
    await fs.writeFile(`docs/audits/lighthouse-${mode}.json`, result.report[0]);
    await fs.writeFile(`docs/audits/lighthouse-${mode}.html`, result.report[1]);
    console.log(
      JSON.stringify({
        mode,
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([k, v]) => [
            k,
            Math.round(v.score * 100),
          ]),
        ),
        failures: Object.values(result.lhr.audits)
          .filter(
            (a) =>
              a.score !== null &&
              a.score < 0.9 &&
              a.scoreDisplayMode !== "informative",
          )
          .map((a) => ({
            id: a.id,
            title: a.title,
            displayValue: a.displayValue,
          })),
      }),
    );
  }
} finally {
  await chrome.close();
}
