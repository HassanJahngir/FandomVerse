import fs from "node:fs/promises";

for (const filename of ["anime", "movies", "tv", "manga", "gaming"]) {
  const records = JSON.parse(await fs.readFile(`src/data/${filename}.json`, "utf8"));
  for (const item of records.filter((entry) => entry.type === "trailer" && entry.mediaUrl?.includes("youtube.com/watch"))) {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(item.mediaUrl)}&format=json`;
    try {
      const response = await fetch(endpoint);
      const data = response.ok ? await response.json() : {};
      console.log(JSON.stringify({ id: item.id, status: response.status, author: data.author_name, title: data.title, thumbnail: data.thumbnail_url, embed: data.html?.match(/src="([^"]+)/)?.[1] }));
    } catch (error) {
      console.log(JSON.stringify({ id: item.id, error: error.message }));
    }
  }
}
