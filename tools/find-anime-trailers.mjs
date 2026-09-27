const url = "https://www.youtube.com/results?search_query=Aniplex+USA+Demon+Slayer+official+trailer";
const response = await fetch(url);
const html = await response.text();
console.log(`Search status ${response.status}, ${html.length} characters`);
const matches = [...html.matchAll(/"videoRenderer":\{"videoId":"([^"]+)"[\s\S]{0,3000}?"title":\{"runs":\[\{"text":"([^"]+)/g)];
for (const [, id, title] of matches.slice(0, 15)) console.log(`${id}\t${title}`);
