import fs from "node:fs";
const entries = {
  movies: [
    {
      id: "movies-release-avengers-doomsday",
      type: "release",
      title: "Avengers: Doomsday — theatrical release",
      description:
        "Marvel Studios and Disney list December 18, 2026 for the theatrical release of Avengers: Doomsday. This is a confirmed studio schedule as checked on September 26, 2026; dates can change.",
      tags: ["Marvel", "Avengers", "Theatrical"],
      date: "2026-12-18",
      location: "Theaters",
      status: "upcoming",
      featured: true,
      verifiedAt: "2026-09-26",
      image: null,
      sources: [
        {
          label: "Disney Movies — Avengers: Doomsday official film page",
          url: "https://movies.disney.com/avengers-doomsday",
        },
      ],
    },
    {
      id: "movies-release-star-wars-starfighter",
      type: "release",
      title: "Star Wars: Starfighter — theatrical release",
      description:
        "Lucasfilm’s official film page gives May 28, 2027 as the theatrical release date for Star Wars: Starfighter. Follow Lucasfilm for later schedule changes.",
      tags: ["Star Wars", "Lucasfilm", "Theatrical"],
      date: "2027-05-28",
      location: "Theaters",
      status: "upcoming",
      featured: true,
      verifiedAt: "2026-09-26",
      image: null,
      sources: [
        {
          label: "StarWars.com — Star Wars: Starfighter",
          url: "https://www.starwars.com/films/star-wars-starfighter",
        },
      ],
    },
    {
      id: "movies-event-star-wars-experience-2027",
      type: "event",
      title: "Star Wars: The Experience",
      description:
        "Lucasfilm announced a traveling exhibition beginning at The Franklin Institute on February 13, 2027. The published opening date is a future event as checked on September 26, 2026; confirm plans with the organizer.",
      tags: ["Star Wars", "Exhibition", "Upcoming"],
      date: "2027-02-13",
      endDate: "2027-09-06",
      location: "The Franklin Institute, Philadelphia, Pennsylvania, USA",
      status: "upcoming",
      featured: true,
      verifiedAt: "2026-09-26",
      image: null,
      sources: [
        {
          label: "StarWars.com — official exhibition announcement",
          url: "https://www.starwars.com/news/star-wars-the-experience",
        },
      ],
    },
  ],
  tv: [
    {
      id: "tv-release-ahsoka-season-2",
      type: "release",
      title: "Ahsoka season 2 — Disney+ premiere",
      description:
        "Lucasfilm announced that Ahsoka season 2 will premiere on Disney+ on January 20, 2027. This is a confirmed announcement as checked on September 26, 2026; schedules may change.",
      tags: ["Star Wars", "Ahsoka", "Streaming"],
      date: "2027-01-20",
      location: "Disney+",
      status: "upcoming",
      featured: true,
      verifiedAt: "2026-09-26",
      image: null,
      sources: [
        {
          label: "StarWars.com — Ahsoka season 2 teaser and date",
          url: "https://www.starwars.com/news/ahsoka-season-2",
        },
      ],
    },
  ],
};
for (const [category, records] of Object.entries(entries)) {
  const path = `src/data/${category}.json`;
  const data = JSON.parse(fs.readFileSync(path));
  for (const record of records) {
    record.category = category;
    const old = data.findIndex((i) => i.id === record.id);
    if (old >= 0) data[old] = record;
    else data.push(record);
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}
