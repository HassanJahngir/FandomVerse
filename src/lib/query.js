// Pure functions: usable by React and by Node's built-in test runner.
export function filterContent(
  records,
  {
    query = "",
    category = "",
    type = "",
    tag = "",
    franchise = "",
    status = "",
    mediaKind = "",
    sort = "featured",
  } = {},
) {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const result = records.filter((item) => {
    const searchable = [
      item.title,
      item.description,
      item.franchise,
      item.biography,
      ...(item.tags || []),
    ]
      .join(" ")
      .toLocaleLowerCase();
    return (
      words.every((word) => searchable.includes(word)) &&
      (!category || item.category === category) &&
      (!type || item.type === type) &&
      (!tag || item.tags?.includes(tag)) &&
      (!franchise || item.franchise === franchise) &&
      (!status || getStatus(item) === status) &&
      (!mediaKind || item.mediaKind === mediaKind)
    );
  });
  return result.sort((a, b) =>
    sort === "alphabetical"
      ? a.title.localeCompare(b.title)
      : sort === "newest"
        ? (b.date || "").localeCompare(a.date || "")
        : Number(!!b.featured) - Number(!!a.featured) ||
          a.title.localeCompare(b.title),
  );
}
export function getStatus(item, today = new Date().toISOString().slice(0, 10)) {
  if (["cancelled", "postponed", "unannounced"].includes(item.status))
    return item.status;
  if (item.type === "event" && item.date)
    return (item.endDate || item.date) < today ? "past" : "upcoming";
  if (item.type === "release" && item.date)
    return item.date < today ? "released" : "upcoming";
  // Trailer publication is not the release date of the work it promotes.
  if (item.type === "trailer" && item.releaseDate)
    return item.releaseDate < today ? "released" : "upcoming";
  return item.status || "";
}
export const money = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
export const dateLabel = (date) =>
  date
    ? new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date unannounced";
export function calculateTotals(cart, records) {
  return Object.entries(cart).reduce((totals, [id, quantity]) => {
    const item = records.find((record) => record.id === id);
    if (
      item &&
      Number.isFinite(item.price) &&
      Number.isInteger(quantity) &&
      quantity > 0
    )
      totals[item.currency] =
        (totals[item.currency] || 0) + Math.round(item.price * 100) * quantity;
    return totals;
  }, {});
}
