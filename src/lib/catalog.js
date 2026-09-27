import categories from "../data/categories.json";
import bot from "../data/chatbot.json";
import {
  filterContent,
  getStatus,
  money,
  dateLabel,
  calculateTotals,
} from "./query.js";
export { filterContent, getStatus, money, dateLabel } from "./query.js";

// Each category owns its content file. Vite bundles these read-only JSON records.
const modules = import.meta.glob("../data/*.json", {
  eager: true,
  import: "default",
});
export const content = Object.entries(modules)
  .filter(
    ([path]) =>
      !path.endsWith("categories.json") && !path.endsWith("chatbot.json"),
  )
  .flatMap(([, records]) => (Array.isArray(records) ? records : []));
export { categories, bot };
export const categoryFor = (id) =>
  categories.find((category) => category.id === id);
export const types = [
  "article",
  "profile",
  "gallery",
  "trailer",
  "audio",
  "event",
  "release",
  "merchandise",
];
export const typeLabel = (type) =>
  ({
    profile: "Profile",
    article: "Article",
    gallery: "Gallery",
    trailer: "Trailer",
    audio: "Audio",
    event: "Event",
    release: "Release",
    merchandise: "Merchandise",
  })[type] || type;
export function cartTotals(cart, records = content) {
  return calculateTotals(cart, records);
}
export function answerQuestion(question) {
  const query = question.toLowerCase().trim();
  const link = (item) => ({ label: item.title, href: `#/item/${item.id}` });
  const matchedProfile = content.find((item) => {
    if (item.type !== "profile") return false;
    const name = item.title.toLowerCase();
    return name.length <= 3
      ? new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(query)
      : query.includes(name);
  });
  if (matchedProfile) {
    const asksWhere = /where|which (group|franchise|series)|from what/.test(query);
    const asksTraits = /trait|ability|power|role/.test(query);
    return {
      text: asksWhere
        ? `${matchedProfile.title} belongs to ${matchedProfile.franchise}. ${matchedProfile.description}`
        : asksTraits
          ? `${matchedProfile.title}: ${(matchedProfile.traits || []).join(", ")}. Read the sourced profile for context.`
          : matchedProfile.biography || matchedProfile.description,
      links: [{ label: `Read ${matchedProfile.title}'s sourced profile`, href: `#/item/${matchedProfile.id}` }],
    };
  }
  const specific = content.find((item) => item.title.length > 6 && query.includes(item.title.toLowerCase()));
  if (specific) return {
    text: `${specific.description}${specific.date ? ` Date: ${dateLabel(specific.date)}.` : ""}${specific.location ? ` Location: ${specific.location}.` : ""}${specific.type === "merchandise" ? ` Verified listed price: ${money(specific.price, specific.currency)} as checked ${dateLabel(specific.verifiedAt)}.` : ""}`,
    links: [link(specific)],
  };
  const faq = bot.faqs.find((entry) => entry.keywords.some((word) => query.includes(word)));
  if (faq && /\b(buy|checkout|payment|purchase|bookmark|notes|export|login|signup|password|search|filter|sort|credits|license|attribution|offline|internet|captions|transcript|geolocation|contact|email|team|warriors xtreme|who made this|map|orbit)\b/.test(query))
    return { text: faq.answer, links: faq.links };
  const category = bot.recommendations.find((rule) => rule.keywords.some((word) => query.includes(word)))?.category;
  const intent = bot.intents.find((rule) => rule.keywords.some((word) => query.includes(word)));
  if (intent) {
    const matches = content.filter((item) => item.type === intent.type && (!category || item.category === category));
    const ordered = intent.type === "event" || intent.type === "release"
      ? [...matches].sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      : matches;
    const heading = category ? categoryFor(category).name : "all seven worlds";
    return {
      text: ordered.length
        ? `${intent.intro} in ${heading}. These are sourced collection entries; check each source for updates.`
        : `There are no verified ${intent.label.toLowerCase()} entries for ${heading} in this collection yet.`,
      links: [
        { label: intent.label, href: intent.href },
        ...ordered.slice(0, 4).map(link),
      ],
    };
  }
  if (faq) return { text: faq.answer, links: faq.links };
  const rule = bot.recommendations.find((rule) =>
    rule.keywords.some((word) => query.includes(word)),
  );
  if (rule)
    return {
      text: `Your ${categoryFor(rule.category).name} starting points, selected from our sourced collection:`,
      links: [
        {
          label: `Explore ${categoryFor(rule.category).name}`,
          href: `#/world/${rule.category}`,
        },
        ...content
          .filter(
            (item) =>
              item.category === rule.category &&
              ["article", "profile"].includes(item.type),
          )
          .slice(0, 3)
          .map(link),
      ],
    };
  return {
    text: bot.fallback,
    links: [
      {
        label: "Search all worlds",
        href: `#/search?q=${encodeURIComponent(question)}`,
      },
    ],
  };
}
