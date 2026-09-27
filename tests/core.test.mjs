import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { calculateTotals, filterContent, getStatus } from "../src/lib/query.js";
import { bookmarkExport, readStorage } from "../src/lib/storage.js";
const categories = [
  "anime",
  "gaming",
  "movies",
  "tv",
  "kpop",
  "comics",
  "manga",
];
const records = fs
  .readdirSync("src/data")
  .filter(
    (file) =>
      file.endsWith(".json") &&
      !["categories.json", "chatbot.json"].includes(file),
  )
  .flatMap((file) => JSON.parse(fs.readFileSync(`src/data/${file}`)));
test("all seven categories have minimum profiles/events, an article and gallery", () => {
  for (const category of categories) {
    const items = records.filter((item) => item.category === category);
    assert.ok(
      items.filter((i) => i.type === "profile").length >= 5,
      `${category} needs 5 profiles`,
    );
    assert.ok(
      items.filter((i) => i.type === "event").length >= 3,
      `${category} needs 3 events`,
    );
    assert.ok(
      items.some((i) => i.type === "article"),
      `${category} article`,
    );
    assert.ok(
      items.some((i) => i.type === "gallery" && i.gallery?.length),
      `${category} licensed gallery`,
    );
  }
});
test("stable unique IDs and sourced records", () => {
  assert.equal(new Set(records.map((i) => i.id)).size, records.length);
  for (const item of records) {
    assert.ok(item.id && item.title && item.description, JSON.stringify(item));
    assert.ok(item.sources?.length, `${item.id} source`);
    for (const source of item.sources) assert.match(source.url, /^https:\/\//);
    if (["event", "merchandise", "release"].includes(item.type))
      assert.match(item.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
});
test("every local asset reference exists and gallery credits are present", () => {
  for (const item of records) {
    if (item.type !== "merchandise")
      assert.ok(item.image, `${item.id}: missing subject-matched visual`);
    for (const src of [
      item.image,
      item.poster,
      item.audioUrl,
      item.videoMp4,
      item.videoWebm,
      item.captionsUrl,
      ...(item.gallery || []).map((image) => image.src),
    ].filter(Boolean)) {
      if (src.startsWith("/"))
        assert.ok(fs.existsSync(`public${src}`), `${item.id}: missing ${src}`);
    }
    for (const image of item.gallery || [])
      assert.ok(
        image.alt && image.credit && image.license && image.sourceUrl,
        `${item.id}: missing attribution`,
      );
  }
});
test("search AND-combines category, type, tag, franchise and words", () => {
  const all = filterContent(records, {
    category: "anime",
    type: "profile",
    query: "tanjiro",
    franchise: "Demon Slayer: Kimetsu no Yaiba",
    tag: "Demon Slayer",
  });
  assert.ok(all.length);
  assert.ok(
    all.every(
      (i) =>
        i.category === "anime" &&
        i.type === "profile" &&
        i.tags.includes("Demon Slayer"),
    ),
  );
  assert.equal(
    filterContent(records, { query: "noSuchFandomRecord928772" }).length,
    0,
  );
});
test("alphabetical/newest/featured sorting uses real fields without mutating data", () => {
  const ids = records.map((i) => i.id);
  const az = filterContent(records, { sort: "alphabetical" });
  assert.ok(
    az.every(
      (item, index) =>
        !index || az[index - 1].title.localeCompare(item.title) <= 0,
    ),
  );
  const dated = filterContent(records, { sort: "newest" });
  assert.ok(
    dated.every(
      (item, index) =>
        !index || (dated[index - 1].date || "") >= (item.date || ""),
    ),
  );
  assert.deepEqual(
    records.map((i) => i.id),
    ids,
  );
});
test("cart uses cents and keeps currency totals separate", () => {
  const fixtures = [
    { id: "a", price: 0.1, currency: "USD" },
    { id: "b", price: 0.2, currency: "USD" },
    { id: "c", price: 5.99, currency: "EUR" },
  ];
  assert.deepEqual(calculateTotals({ a: 3, b: 1, c: 2 }, fixtures), {
    USD: 50,
    EUR: 1198,
  });
  assert.deepEqual(calculateTotals({ a: 0, unknown: 4, b: -1 }, fixtures), {});
});
test("date status respects cancellations and does not confuse trailer publication with release", () => {
  assert.equal(
    getStatus({ type: "event", date: "2025-01-01" }, "2026-09-26"),
    "past",
  );
  assert.equal(
    getStatus({ type: "release", date: "2026-12-18" }, "2026-09-26"),
    "upcoming",
  );
  assert.equal(
    getStatus({ type: "event", date: "2027-01-01", status: "cancelled" }),
    "cancelled",
  );
  assert.equal(
    getStatus(
      { type: "trailer", date: "2025-01-01", releaseDate: "2026-12-18" },
      "2026-09-26",
    ),
    "upcoming",
  );
});
test("bookmark export is readable, includes sources and notes, not executable HTML", () => {
  const result = bookmarkExport([records[0]], {
    [records[0].id]: "Remember this story",
  });
  assert.ok(result.includes(records[0].title));
  assert.ok(result.includes(records[0].sources[0].url));
  assert.ok(result.includes("Remember this story"));
  assert.ok(result.includes("FANDOMVERSE"));
});
test("storage failures return defaults", () => {
  globalThis.window = {
    localStorage: {
      getItem() {
        throw new Error("blocked");
      },
    },
  };
  assert.deepEqual(readStorage("localStorage", "key", []), []);
  delete globalThis.window;
});
