export function readStorage(storageName, key, fallback) {
  try {
    const value = JSON.parse(window[storageName].getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}
export function writeStorage(storageName, key, value) {
  try {
    window[storageName].setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function bookmarkExport(records, notes) {
  return [
    "FANDOMVERSE — YOUR SAVED COLLECTION",
    `Exported ${new Date().toLocaleString()}`,
    "Personal notes are included in this file. Keep it private.",
    "",
    ...records.flatMap((item) => [
      item.title,
      `${item.category.toUpperCase()} · ${item.type}`,
      item.description,
      ...(item.sources || []).map((source) => `${source.label}: ${source.url}`),
      notes[item.id] ? `My note: ${notes[item.id]}` : "",
      "—".repeat(48),
      "",
    ]),
  ].join("\n");
}
