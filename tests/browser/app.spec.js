import { test, expect } from "@playwright/test";
import fs from "node:fs";
const files = fs
  .readdirSync("src/data")
  .filter(
    (f) =>
      f.endsWith(".json") && !["categories.json", "chatbot.json"].includes(f),
  );
const content = files.flatMap((f) =>
  JSON.parse(fs.readFileSync(`src/data/${f}`)),
);
test("all worlds, direct routes and history work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Seven Worlds.",
  );
  for (const category of [
    "anime",
    "gaming",
    "movies",
    "tv",
    "kpop",
    "comics",
    "manga",
  ]) {
    await page.goto(`/#/world/${category}`);
    await expect(page.locator(".content-card").first()).toBeVisible();
    await expect(
      page.locator(".category-gallery .gallery-thumb").first(),
    ).toBeVisible();
  }
  await page.goto("/#/about");
  await page.getByRole("link", { name: "Contact & location" }).click();
  await expect(page).toHaveURL(/contact/);
  await page.goBack();
  await expect(page).toHaveURL(/about/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Different worlds",
  );
});
test("search combines filters, sorts and gives empty states", async ({
  page,
}) => {
  await page.goto("/#/search");
  await page.getByLabel("Search this collection").fill("sharp sense");
  await page.getByLabel("World", { exact: true }).selectOption("anime");
  await page
    .getByLabel("Content type", { exact: true })
    .selectOption("profile");
  await expect(page.locator(".content-card")).toHaveCount(1);
  await page
    .getByRole("heading", { name: "Tanjiro Kamado", exact: true })
    .getByRole("link")
    .click();
  await expect(page.locator(".detail-heading h1")).toHaveText("Tanjiro Kamado");
  await page.goto("/#/search?q=notARealRecord9182");
  await expect(
    page.getByRole("heading", { name: "No discoveries here yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".content-card").first()).toBeVisible();
  await page.getByLabel("Sort by").selectOption("alphabetical");
  const titles = await page.locator(".card-body h3").allTextContents();
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
});
test("bookmarks persist, notes only use sessionStorage, export and removal work", async ({
  page,
  context,
}) => {
  await page.goto("/#/item/anime-profile-tanjiro");
  await page
    .getByRole("button", { name: "Bookmark Tanjiro Kamado", exact: true })
    .click();
  await page.goto("/#/bookmarks");
  await page
    .getByLabel("Private session note")
    .fill("Practice explaining this character");
  expect(
    await page.evaluate(() => localStorage.getItem("fv.notes")),
  ).toBeNull();
  expect(
    await page.evaluate(() => sessionStorage.getItem("fv.notes")),
  ).toContain("Practice explaining");
  await page.reload();
  await expect(page.getByLabel("Private session note")).toHaveValue(
    "Practice explaining this character",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export formatted list" }).click();
  expect((await download).suggestedFilename()).toBe(
    "FandomVerse-bookmarks.txt",
  );
  const fresh = await context.newPage();
  await fresh.goto("/#/bookmarks");
  await expect(fresh.locator(".saved-item")).toHaveCount(1);
  await expect(fresh.getByLabel("Private session note")).toHaveValue("");
  await fresh.close();
  await page
    .getByRole("button", {
      name: "Remove bookmark for Tanjiro Kamado",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Your collection starts with curiosity.",
    }),
  ).toBeVisible();
});
test("temporary cart quantity, totals and reset", async ({ page }) => {
  const product = content.find((i) => i.type === "merchandise");
  expect(product).toBeTruthy();
  await page.goto(`/#/item/${product.id}`);
  await page
    .getByRole("button", { name: "Add to demo cart", exact: true })
    .click();
  await page.getByRole("button", { name: /Open demo cart/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: `Increase ${product.title} quantity` })
    .click();
  await expect(page.locator(".cart-total strong")).toHaveText(
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency,
    }).format(product.price * 2),
  );
  await page
    .getByRole("button", { name: `Decrease ${product.title} quantity` })
    .click();
  await expect(page.locator(".cart-total strong")).toHaveText(
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency,
    }).format(product.price),
  );
  await page
    .getByRole("button", { name: `Remove ${product.title} from cart` })
    .click();
  await expect(
    page.getByRole("heading", { name: "Room for your next favorite." }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Add to demo cart", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Open demo cart, 0 items" }),
  ).toBeVisible();
});
test("scripted chatbot provides grounded answers, fallback, working links", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Ask Orbit, scripted assistant" })
    .click();
  await page.getByLabel("Ask Orbit a question").fill("Who is Tanjiro Kamado?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.locator(".chat-message").last()).toContainText(
    "Demon Slayer",
  );
  await page
    .getByRole("link", { name: "Read Tanjiro Kamado's sourced profile" })
    .click();
  await expect(page).toHaveURL(/anime-profile-tanjiro/);
  await page
    .getByRole("button", { name: "Ask Orbit, scripted assistant" })
    .click();
  await page
    .getByLabel("Ask Orbit a question")
    .fill("Is the moon made of jam?");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.locator(".chat-message").last()).toContainText(
    "verified answer",
  );
});
test("gallery keyboard controls, Escape and focus restore", async ({
  page,
}) => {
  const gallery = content.find(
    (i) => i.type === "gallery" && i.gallery?.length,
  );
  await page.goto(`/#/item/${gallery.id}`);
  const trigger = page.locator(".gallery-thumb").first();
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".lightbox-controls")).toContainText(
    `${gallery.gallery.length > 1 ? 2 : 1} / ${gallery.gallery.length}`,
  );
  await page.keyboard.press("Tab");
  await expect(page.locator("dialog :focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
test("media failure fallback and on-demand video controls", async ({
  page,
}) => {
  const media =
    content.find((i) => i.type === "trailer" && (i.videoMp4 || i.embedUrl)) ||
    content.find((i) => i.type === "trailer");
  await page.goto(`/#/item/${media.id}`);
  await expect(page.locator("iframe,video")).toHaveCount(0);
  await page.locator(".media-launch").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open official source", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.route("**/media/**", (route) => route.abort());
  const gallery = content.find(
    (i) => i.type === "gallery" && i.gallery?.length,
  );
  await page.goto(`/#/item/${gallery.id}`);
  await expect(page.locator(".image-unavailable").first()).toBeVisible();
});
test("geolocation denial is clear and does not store coordinates", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition(_success, error) {
          error({ code: 1 });
        },
      },
      configurable: true,
    });
  });
  await page.goto("/#/contact");
  await page.getByRole("button", { name: "Use my location" }).click();
  await expect(page.getByRole("status").first()).toContainText(
    "permission was denied",
  );
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(
    "latitude",
  );
});
test("geolocation unavailable and success paths", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.goto("/#/contact");
  await page.getByRole("button", { name: "Use my location" }).click();
  await expect(page.getByRole("status").first()).toContainText("unavailable");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition(success) {
          success({ coords: { latitude: 0, longitude: 0 } });
        },
      },
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Use my location" }).click();
  await expect(
    page.getByRole("link", { name: "Open my position on Google Maps" }),
  ).toHaveAttribute("href", /query=0,0/);
});
test("mobile, tablet, desktop no horizontal overflow and reduced motion", async ({
  page,
}) => {
  for (const width of [390, 834, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "",
      "world/anime",
      "profiles",
      "releases",
      "contact",
      "bookmarks",
    ]) {
      await page.goto(`/#/${route}`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${width} ${route}`,
      ).toBe(true);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const duration = await page
    .locator(".hero h1")
    .evaluate((el) => getComputedStyle(el).animationDuration);
  expect(duration).toBe("1e-05s");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
});
test("demo login and signup collect no password and save no identity", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.locator("input[type=password]")).toHaveCount(0);
  await page.getByRole("button", { name: "New here? Preview signup" }).click();
  await page.getByLabel("Display name").fill("Test explorer");
  await page.getByLabel("Demo email").fill("test@example.com");
  await page
    .getByRole("button", { name: "Preview signup", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => JSON.stringify(localStorage) + JSON.stringify(sessionStorage),
    ),
  ).not.toContain("test@example.com");
});

test("locally bundled Anime cosplay and sources remain clearly attributed", async ({
  page,
}) => {
  await page.goto("/#/world/anime");
  await expect(page.locator(".image-heading .heading-visual img")).toHaveAttribute(
    "src",
    /anime-naruto-context-960\.webp/,
  );
  await expect(page.locator(".heading-photo-credit")).toContainText(
    "Fan cosplay photo",
  );
  for (const slug of ["tanjiro", "nezuko", "zenitsu", "inosuke", "giyu"]) {
    await page.goto(`/#/item/anime-profile-${slug}`);
    const picture = page.locator(".detail-image img");
    await picture.scrollIntoViewIfNeeded();
    await expect
      .poll(() => picture.evaluate((image) => image.naturalWidth))
      .toBeGreaterThan(0);
    await expect(page.locator(".image-credit")).toContainText(
      "not official character artwork",
    );
    await expect(page.locator(".image-credit a")).toHaveAttribute(
      "href",
      /commons\.wikimedia\.org/,
    );
  }
});

test("world headers use relevant sourced photos and cards share dimensions", async ({ page }) => {
  for (const world of ["anime", "gaming", "movies", "tv", "kpop", "comics", "manga"]) {
    await page.goto(`/#/world/${world}`);
    await expect(page.locator(".image-heading .heading-visual img")).toHaveAttribute("src", /\S+/);
    await expect(page.locator(".image-heading .heading-photo-credit")).toHaveAttribute("href", /^https:\/\//);
    const sizes = await page.locator(".card-grid .content-card").evaluateAll((cards) =>
      cards.slice(0, 5).map((card) => {
        const rect = card.getBoundingClientRect();
        return [Math.round(rect.width), Math.round(rect.height)];
      }),
    );
    expect(new Set(sizes.map(([width]) => width)).size).toBe(1);
    expect(new Set(sizes.map(([, height]) => height)).size).toBe(1);
  }
});

test("all merchandise cards show credited local context photos", async ({ page }) => {
  await page.goto("/#/merchandise");
  const cards = page.locator(".card-grid .content-card");
  await expect(cards).toHaveCount(5);
  for (let index = 0; index < 5; index++) {
    const card = cards.nth(index);
    const photo = card.locator(".card-art img");
    await photo.scrollIntoViewIfNeeded();
    await expect.poll(() => photo.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(card.locator(".card-photo-label")).toContainText("not product photo");
  }
});

test("expanded Orbit answers and related Gaming trailers work", async ({ page }) => {
  await page.goto("/#/world/gaming");
  await page.getByRole("button", { name: "Ask Orbit, scripted assistant" }).click();
  await page.getByLabel("Ask Orbit a question").fill("Show gaming profiles");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.locator(".chat-message").last()).toContainText("Gaming");
  await expect(page.locator(".chat-message").last().getByRole("link")).toHaveCount(5);
  await page.getByLabel("Ask Orbit a question").fill("What can Orbit answer? Give me information.");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.locator(".chat-message").last()).toContainText("scripted assistant");
  await page.keyboard.press("Escape");
  await page.goto("/#/item/gaming-profile-mario");
  const picture = page.locator(".detail-image img");
  await expect.poll(() => picture.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator(".image-credit")).toContainText("Fan cosplay");
  await expect(page.getByRole("heading", { name: "Official trailers and videos." })).toBeVisible();
  await expect(page.locator(".related").last().locator(".content-card")).toHaveCount(2);
});
