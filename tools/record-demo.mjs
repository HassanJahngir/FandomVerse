import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import fs from "node:fs/promises";
await fs.mkdir("submission", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  acceptDownloads: true,
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.addInitScript(() =>
  Object.defineProperty(navigator, "geolocation", {
    value: {
      getCurrentPosition(_ok, fail) {
        fail({ code: 1 });
      },
    },
    configurable: true,
  }),
);
await page.goto("http://127.0.0.1:4173/");
const recorder = spawn(
  ffmpeg,
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-f",
    "image2pipe",
    "-vcodec",
    "mjpeg",
    "-r",
    "5",
    "-i",
    "pipe:0",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "25",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "submission/FandomVerse-demo.mp4",
  ],
  { stdio: ["pipe", "inherit", "inherit"] },
);
let running = true,
  frames = 0,
  error = null;
const capture = (async () => {
  while (running) {
    try {
      const frame = await page.screenshot({
        type: "jpeg",
        quality: 70,
        animations: "disabled",
      });
      if (!recorder.stdin.write(frame))
        await new Promise((resolve) => recorder.stdin.once("drain", resolve));
      frames++;
      await new Promise((resolve) => setTimeout(resolve, 150));
    } catch (e) {
      error = e;
      break;
    }
  }
})();
async function caption(text, ms = 1500) {
  await page.evaluate((message) => {
    let box = document.getElementById("demo-caption");
    if (!box) {
      box = document.createElement("div");
      box.id = "demo-caption";
      box.style.cssText =
        "position:fixed;z-index:1000;bottom:18px;left:22px;max-width:550px;background:#181120ee;color:#f7eaff;border:1px solid #bf94e6;border-radius:8px;padding:14px 19px;font:600 17px Arial,sans-serif;box-shadow:0 5px 30px #0008;pointer-events:none";
      document.body.append(box);
    }
    box.textContent = message;
  }, text);
  await page.waitForTimeout(ms);
}
async function route(hash, text, ms = 1100) {
  await page.goto(`http://127.0.0.1:4173/#/${hash}`);
  await caption(text, ms);
}
try {
  await caption("FandomVerse · Seven Worlds. One FandomVerse.", 2300);
  await page.evaluate(() => scrollTo(0, 480));
  await caption(
    "Seven interactive portals, each with real fandom context photography.",
    2000,
  );
  for (const world of [
    "anime",
    "gaming",
    "movies",
    "tv",
    "kpop",
    "comics",
    "manga",
  ])
    await route(
      `world/${world}`,
      `World: ${world.toUpperCase()} · Profiles, real events and licensed gallery`,
      750,
    );
  await route(
    "world/anime",
    "Category cards, type/sub-tag filters, and sorting",
  );
  await page
    .getByLabel("Content type", { exact: true })
    .selectOption("profile");
  await page.getByLabel("Sub-tag").selectOption({ index: 1 });
  await page.getByLabel("Sort by").selectOption("alphabetical");
  await caption("Combined category filters and A-to-Z sort", 1700);
  await page.getByRole("button", { name: "Reset" }).click();
  await route(
    "item/anime-article-demonslayer-start",
    "Original full article with source references and related content",
    1800,
  );
  await route("search", "Global search across every world and content type");
  await page.getByLabel("Search this collection").fill("Tanjiro");
  await page.getByLabel("World", { exact: true }).selectOption("anime");
  await page
    .getByLabel("Content type", { exact: true })
    .selectOption("profile");
  await caption("Search and combined category + profile filters", 1700);
  await page.getByRole("link", { name: "Tanjiro Kamado" }).last().click();
  await caption("Authentic character profile, traits and source links", 1800);
  await route("item/gaming-profile-mario", "Licensed fan cosplay also illustrates Gaming profiles", 1400);
  await route("item/anime-profile-tanjiro", "Anime profile with fan-cosplay attribution and official trailer card", 1400);
  await page.getByRole("button", { name: "Bookmark Tanjiro Kamado" }).click();
  await route(
    "bookmarks",
    "Bookmarks persist in localStorage; notes stay in sessionStorage",
  );
  await page
    .getByLabel("Private session note")
    .fill("Tell the judges how client-side storage works.");
  await caption("Personal session note and formatted export", 1400);
  await page.getByRole("button", { name: "Export formatted list" }).click();
  await route(
    "item/anime-gallery-culture",
    "Gallery: credited fan cosplay across five anime series",
  );
  await page.locator(".gallery-thumb").first().click();
  await caption("Keyboard-accessible lightbox with attribution", 1600);
  await page.keyboard.press("Escape");
  await route(
    "item/gaming-trailer-tales-zestiria",
    "Publisher-released Creative Commons trailer: MP4 / WebM",
  );
  await page.locator(".media-launch").click();
  await caption("The local player loads only when opened", 1600);
  await page.keyboard.press("Escape");
  await route(
    "item/gaming-audio-tales-zestiria",
    "Licensed 30-second trailer audio excerpt with description",
  );
  await caption("Audio has native controls and a source link", 1200);
  await route("trailers", "Dedicated trailer room and release-status filters");
  await route("events", "Real dated events: upcoming and clearly labeled past");
  await route("releases", "Upcoming calendar uses confirmed official dates");
  await page.getByRole("button", { name: "Next month" }).click();
  await page.getByRole("button", { name: "Next month" }).click();
  await page.getByRole("button", { name: "Next month" }).click();
  await caption("Avengers: Doomsday · December 18, 2026, per Disney", 1600);
  await route(
    "merchandise",
    "Authentic products with verified USD prices and retailer links",
  );
  await page
    .locator(".content-card")
    .first()
    .getByRole("button", { name: "Add to demo cart" })
    .click();
  await page.getByRole("button", { name: /Open demo cart/ }).click();
  await page.getByRole("button", { name: /Increase .* quantity/ }).click();
  await caption("Temporary demo cart: quantity and calculated total", 1700);
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: /Ask Orbit, scripted assistant/ })
    .click();
  await page.getByLabel("Ask Orbit a question").fill("How do bookmarks work?");
  await page.getByRole("button", { name: "Send question" }).click();
  await caption("Orbit uses local JSON FAQs and content links", 1200);
  await page.getByLabel("Ask Orbit a question").fill("Find movie trailers");
  await page.getByRole("button", { name: "Send question" }).click();
  await caption("Orbit also answers category and media requests", 1400);
  await page.keyboard.press("Escape");
  await route(
    "about",
    "About, AI acknowledgement and independent project context",
  );
  await route(
    "contact",
    "Contact configuration and permission-aware geolocation",
  );
  await page.getByRole("button", { name: "Use my location" }).click();
  await caption("Location denial is handled without storing coordinates", 1800);
  await route(
    "",
    "Demo login/signup collect no password and create no account",
  );
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await caption("Demo interface — no authentication or password storage", 1800);
  await page.getByRole("button", { name: "New here? Preview signup" }).click();
  await caption("Signup is also a clearly labelled interface demo", 1200);
  await page.keyboard.press("Escape");
  await caption("FandomVerse · Source-led discovery across seven worlds", 2200);
} finally {
  running = false;
  await capture;
  recorder.stdin.end();
  await new Promise((resolve, reject) =>
    recorder.on("exit", (code) =>
      code ? reject(new Error(`FFmpeg exited ${code}`)) : resolve(),
    ),
  );
  await browser.close();
  console.log(
    JSON.stringify({
      frames,
      seconds: frames / 5,
      output: "submission/FandomVerse-demo.mp4",
      error: error?.message || null,
    }),
  );
}
