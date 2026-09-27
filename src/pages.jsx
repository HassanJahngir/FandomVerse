import { useEffect, useMemo, useState } from "react";
import Icon from "./components/Icon";
import {
  BookmarkButton,
  Card,
  Empty,
  Image,
  Modal,
  SectionHead,
  Sources,
} from "./components/UI";
import {
  categories,
  categoryFor,
  content,
  dateLabel,
  filterContent,
  getStatus,
  money,
  types,
  typeLabel,
} from "./lib/catalog";
import { bookmarkExport } from "./lib/storage";
import team from "./config/team.json";

const itemLink = (item) => `#/item/${item.id}`;
// Page art comes from sourced records. Context photos and online trailer previews
// are credited rather than presented as original franchise artwork.
const headingRecord = (id) => content.find((item) => item.id === id);
const worldHeadingIds = {
  anime: "anime-trailer-naruto-shippuden",
  gaming: "gaming-event-gamescom2025",
  movies: "movies-event-celebration-japan-2025",
  tv: "tv-gallery-real-world",
  kpop: "kpop-gallery-real-world",
  comics: "comics-event-comic-con-2025",
  manga: "manga-gallery-culture",
};
const collectionHeadingIds = {
  explore: "anime-event-ax2025",
  profiles: "movies-gallery-real-world",
  events: "gaming-event-gamescom2025",
  trailers: "anime-trailer-naruto-shippuden",
  merchandise: "anime-trailer-naruto-shippuden",
  media: "gaming-gallery-culture",
  search: "comics-event-comic-con-2025",
  calendar: "movies-release-star-wars-starfighter",
  about: "anime-event-ax2025",
  contact: "kpop-gallery-real-world",
  credits: "manga-gallery-culture",
};
function HeadingVisual({ item, context = "" }) {
  if (!item?.image) return null;
  const source = item.imageSourceUrl || item.sources?.[0]?.url;
  const isTrailer = item.imageKind === "official-trailer-thumbnail";
  const label = context || (isTrailer ? "Official trailer preview" : item.imageKind === "fan-cosplay" ? "Fan cosplay photo" : "Credited fandom photo");
  return (
    <>
      <div className="heading-visual" aria-hidden="true">
        <Image src={item.image} alt="" priority sizes="(max-width: 700px) 100vw, 1200px" style={{ objectPosition: item.imageFocus || "center 38%" }} />
      </div>
      {source && (
        <a className="heading-photo-credit" href={source} target="_blank" rel="noreferrer">
          {label} · {item.imageCredit || "source"}{isTrailer ? " · online" : ""}
        </a>
      )}
    </>
  );
}
function categoryImage(id) {
  if (id === "anime") return content.find((item) => item.id === "anime-trailer-jujutsu-kaisen")?.image;
  return (
    content.find((item) => item.category === id && item.type === "trailer" && item.image)?.image ||
    content.find((item) => item.category === id && item.type === "profile" && item.image)?.image ||
    content.find((item) => item.category === id && item.type === "gallery")?.gallery?.[0]?.src
  );
}
function Portal({ category, index }) {
  return (
    <a
      className={`portal portal-${category.id}`}
      href={`#/world/${category.id}`}
      style={{ "--world": category.color }}
    >
      <div className="portal-background">
        {categoryImage(category.id) && (
          <Image
            src={categoryImage(category.id)}
            alt=""
            sizes="(max-width: 640px) 46vw, (max-width: 900px) 35vw, 28vw"
          />
        )}
      </div>
      <div className="portal-number">
        0{index + 1} <Icon name="diagonal" size={18} />
      </div>
      <span className="portal-symbol" aria-hidden="true">
        {category.symbol}
      </span>
      <div className="portal-title">
        <small>{category.eyebrow}</small>
        <h3>{category.name}</h3>
        <span>
          Enter world <Icon name="arrow" size={16} />
        </span>
      </div>
    </a>
  );
}

export function Home(props) {
  const articles = content.filter((item) => item.type === "article");
  const trailers = content.filter((item) => item.type === "trailer");
  const featuredTrailers = [
    trailers.find((item) => item.category === "anime"),
    trailers.find((item) => item.id === "gaming-trailer-tales-zestiria"),
    trailers.find((item) => item.category === "movies"),
  ].filter(Boolean);
  const events = filterContent(content, {
    type: "event",
    sort: "newest",
  }).slice(0, 3);
  const galleryImage = categoryImage("kpop") || categoryImage("movies");
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="line" /> A UNIVERSE OF YOUR OWN
          </p>
          <h1>
            Seven Worlds.
            <br />
            One <span>FandomVerse.</span>
          </h1>
          <p className="hero-description">
            For the stories that stay with you.
            <br />
            The characters you carry. The worlds you call home.
          </p>
          <div className="hero-actions">
            <a className="button" href="#/explore">
              Explore the Worlds <Icon name="diagonal" size={18} />
            </a>
            <a className="button ghost" href="#/trailers">
              <span className="small-play">
                <Icon name="play" size={13} />
              </span>
              Step into the trailer room
            </a>
          </div>
          <div className="hero-footnote">
            <span className="seven-dots">
              {categories.map((category) => (
                <i key={category.id} style={{ background: category.color }} />
              ))}
            </span>
            <span>SEVEN WORLDS. ENDLESS CONNECTIONS.</span>
          </div>
        </div>
        <div className="hero-art ambient-motion" aria-hidden="true">
          <div className="orbital-grid" />
          <div className="portal-ring ring-one" />
          <div className="portal-ring ring-two" />
          <div className="portal-core">
            <span>F</span>
            <span>V</span>
          </div>
          <span className="coordinate top">EXPLORE / CONNECT / BELONG</span>
          <span className="coordinate bottom">
            35+ ICONS &nbsp; ∞ POSSIBILITIES
          </span>
          <div className="hero-fragment fragment-one">
            <span>01 / ENTER THE VERSE</span>
            <b>
              Beyond
              <br />
              the ordinary.
            </b>
            <Icon name="spark" size={38} />
          </div>
          <div className="hero-fragment fragment-two">
            {galleryImage && <Image priority src={galleryImage} alt="" />}
            <span>
              REAL STORIES.
              <br />
              SHARED WORLDS.
            </span>
          </div>
          <span className="floating-star star-one">✧</span>
          <span className="floating-star star-two">+</span>
        </div>
        <button
          className="hero-motion"
          onClick={() => props.setPaused(!props.paused)}
          aria-label={
            props.paused ? "Resume hero animation" : "Pause hero animation"
          }
        >
          <Icon name={props.paused ? "play" : "pause"} size={13} />
        </button>
      </section>
      <section className="worlds-section container">
        <SectionHead
          eyebrow="01 / CHOOSE YOUR UNIVERSE"
          title={
            <>
              Where do you <em>belong?</em>
            </>
          }
          description="Follow what you love. Discover what you didn’t know you needed."
          href="#/explore"
          link="Explore everything"
        />
        <div className="portals">
          {categories.map((category, index) => (
            <Portal key={category.id} category={category} index={index} />
          ))}
        </div>
      </section>
      <section className="editorial-section container">
        <SectionHead
          eyebrow="02 / THE EDITOR’S ORBIT"
          title={
            <>
              Stories worth <em>getting lost in.</em>
            </>
          }
          href="#/search?type=article"
          link="All stories"
        />
        <div className="editorial-layout">
          {articles[0] && (
            <a className="editorial-feature" href={itemLink(articles[0])}>
              <div className="feature-visual">
                {articles[0].image || categoryImage(articles[0].category) ? (
                  <Image
                    src={
                      articles[0].image || categoryImage(articles[0].category)
                    }
                    alt={
                      articles[0].imageAlt ||
                      "A licensed fan-culture photograph"
                    }
                  />
                ) : (
                  <div className="abstract-story">
                    <span>
                      STORIES
                      <br />
                      WITHOUT
                      <br />
                      LIMITS.
                    </span>
                    <i />
                  </div>
                )}
              </div>
              <div className="feature-overlay">
                <span className="pill">THE DEEP DIVE</span>
                <span className="feature-credit">
                  {articles[0].imageKind === "official-trailer-thumbnail"
                    ? `Official trailer visual · ${articles[0].imageCredit}`
                    : "Source-led fandom feature"}
                </span>
                <p className="eyebrow">
                  {categoryFor(articles[0].category)?.name} / Original
                  commentary
                </p>
                <h3>{articles[0].title}</h3>
                <span className="text-link">
                  Read the story <Icon name="arrow" />
                </span>
              </div>
            </a>
          )}
          <div className="editorial-list">
            {articles.slice(1, 4).map((item, index) => (
              <article key={item.id}>
                <span className="editorial-number">0{index + 2}</span>
                <div>
                  <p
                    className="eyebrow"
                    style={{ color: categoryFor(item.category)?.color }}
                  >
                    {categoryFor(item.category)?.name} / Perspective
                  </p>
                  <h3>
                    <a href={itemLink(item)}>{item.title}</a>
                  </h3>
                  <p>{item.description}</p>
                  <a className="text-link" href={itemLink(item)}>
                    Go deeper
                    <Icon name="arrow" size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="trailer-band">
        <div className="container">
          <SectionHead
            eyebrow="03 / LIGHTS DOWN. WORLDS OPEN."
            title={
              <>
                Your next <em>great escape.</em>
              </>
            }
            description="Official previews and legally shared media. Always connected to the source."
            href="#/trailers"
            link="Enter the trailer room"
          />
          <div className="card-grid three">
            {featuredTrailers.map((item) => (
              <Card key={item.id} item={item} {...props} />
            ))}
          </div>
        </div>
      </section>
      <section className="events-section container">
        <div className="events-intro">
          <p className="eyebrow">04 / BE PART OF THE STORY</p>
          <h2>
            Out of the feed.
            <br />
            <em>Into the fandom.</em>
          </h2>
          <p>
            Conventions, gatherings and moments that brought these worlds
            together. Browse the archive and verified announcements.
          </p>
          <a className="button secondary" href="#/events">
            Discover events
            <Icon name="arrow" size={18} />
          </a>
        </div>
        <div className="event-list">
          {events.map((item) => (
            <a key={item.id} href={itemLink(item)}>
              <time dateTime={item.date}>
                <b>{item.date?.slice(8, 10)}</b>
                {item.date &&
                  new Date(`${item.date}T12:00:00`).toLocaleDateString(
                    "en-US",
                    { month: "short" },
                  )}
              </time>
              <div>
                <p className="eyebrow">
                  {categoryFor(item.category)?.name} · {getStatus(item)}
                </p>
                <h3>{item.title}</h3>
                <p>
                  <Icon name="pin" size={14} />
                  {item.location}
                </p>
              </div>
              <Icon name="diagonal" size={21} />
            </a>
          ))}
        </div>
      </section>
      <section className="collection-banner container">
        <Icon name="bookmark" size={35} />
        <div>
          <p className="eyebrow">MAKE THE VERSE YOURS</p>
          <h2>
            Keep the things that <em>move you.</em>
          </h2>
          <p>Save a story, collect a character, leave yourself a note.</p>
        </div>
        <a className="button secondary" href="#/bookmarks">
          Your collection
          <Icon name="arrow" size={18} />
        </a>
      </section>
    </>
  );
}

export function Catalog({
  category,
  mode = "explore",
  initialQuery = "",
  initialType = "",
  ...props
}) {
  const fixedType =
    {
      profiles: "profile",
      events: "event",
      trailers: "trailer",
      merchandise: "merchandise",
    }[mode] || "";
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    category: category || "",
    type: fixedType || initialType,
    tag: "",
    franchise: "",
    status: "",
    sort: "featured",
  });
  useEffect(() => {
    setFilters((previous) => ({
      ...previous,
      category: category || "",
      tag: "",
      franchise: "",
    }));
  }, [category]);
  useEffect(() => {
    setQuery(initialQuery);
    setFilters((previous) => ({ ...previous, type: fixedType || initialType }));
  }, [initialQuery, initialType, fixedType]);
  const world = categoryFor(category);
  const base =
    mode === "media"
      ? content.filter((item) =>
          ["trailer", "audio", "gallery"].includes(item.type),
        )
      : content;
  const options = base.filter(
    (item) => !filters.category || item.category === filters.category,
  );
  const tags = [...new Set(options.flatMap((item) => item.tags || []))].sort();
  const franchises = [
    ...new Set(options.map((item) => item.franchise).filter(Boolean)),
  ].sort();
  const results = useMemo(
    () => filterContent(base, { ...filters, query }),
    [base, filters, query],
  );
  const title =
    world?.name ||
    {
      profiles: "The faces of your fandom.",
      events: "Where worlds come together.",
      trailers: "The trailer room.",
      merchandise: "Bring a little fandom home.",
      media: "The media archive.",
      search: "Find your next obsession.",
    }[mode] ||
    "Seven doors. Endless discovery.";
  const desc =
    world?.description ||
    {
      events:
        "Real gatherings and historical highlights. Every date has a source.",
      merchandise:
        "Actual products. Official retailer links. A temporary cart for your wishlist.",
      profiles:
        "Meet authentic characters and artists. Filter by their world or franchise.",
      trailers:
        "Official previews, thoughtfully collected. Select a film to open its player or source.",
      media:
        "Licensed photography, authorized videos and audio. Explore by world and format.",
      search:
        "Search stories, characters, artists, events and more, across all seven worlds.",
    }[mode] ||
    "Follow a familiar world, or step into something completely new.";
  function update(key, value) {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
      ...(key === "category" ? { tag: "", franchise: "" } : {}),
    }));
  }
  function reset() {
    setQuery("");
    setFilters({
      category: category || "",
      type: fixedType,
      tag: "",
      franchise: "",
      status: "",
      sort: "featured",
    });
  }
  return (
    <div
      className="container catalog-page"
      style={{ "--world": world?.color || "#bd9aff" }}
    >
      <header className="page-heading image-heading">
        <HeadingVisual
          item={headingRecord(world ? worldHeadingIds[category] : collectionHeadingIds[mode] || collectionHeadingIds.explore)}
          context={mode === "merchandise" && !world ? "Naruto fandom visual · not a product photo" : ""}
        />
        <p className="eyebrow">
          {world
            ? `WORLD 0${categories.findIndex((c) => c.id === category) + 1} / ${world.eyebrow}`
            : "THE FANDOMVERSE COLLECTION"}
        </p>
        <h1>{title}</h1>
        <p>{desc}</p>
        {world && (
          <span className="world-heading-symbol" aria-hidden="true">
            {world.symbol}
          </span>
        )}
      </header>
      {mode === "explore" && !category && (
        <div className="world-pills">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#/world/${c.id}`}
              style={{ "--world": c.color }}
            >
              <span>{c.symbol}</span>
              {c.name}
              <Icon name="diagonal" size={14} />
            </a>
          ))}
        </div>
      )}
      <div className="filter-panel">
        <label className="catalog-search">
          <Icon name="search" />
          <span className="sr-only">Search this collection</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              category ? `Search ${world.name}…` : "Search across the verse…"
            }
          />
        </label>
        <div className="filter-row">
          {!category && (
            <label>
              World
              <select
                aria-label="World"
                value={filters.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="">All worlds</option>
                {categories.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {mode === "media" && (
            <label>
              Media format
              <select
                aria-label="Media format"
                value={filters.mediaKind || ""}
                onChange={(e) => update("mediaKind", e.target.value)}
              >
                <option value="">All media formats</option>
                {["trailer", "interview", "podcast", "fan content"].map(
                  (kind) => (
                    <option value={kind} key={kind}>
                      {kind}
                    </option>
                  ),
                )}
              </select>
            </label>
          )}
          {!fixedType && (
            <label>
              Content type
              <select
                aria-label="Content type"
                value={filters.type}
                onChange={(e) => update("type", e.target.value)}
              >
                <option value="">All types</option>
                {types
                  .filter(
                    (type) =>
                      mode !== "media" ||
                      ["trailer", "audio", "gallery"].includes(type),
                  )
                  .map((type) => (
                    <option key={type} value={type}>
                      {typeLabel(type)}
                    </option>
                  ))}
              </select>
            </label>
          )}
          <label>
            Sub-tag
            <select
              aria-label="Sub-tag"
              value={filters.tag}
              onChange={(e) => update("tag", e.target.value)}
            >
              <option value="">All tags</option>
              {tags.map((tag) => (
                <option key={tag}>{tag}</option>
              ))}
            </select>
          </label>
          {(filters.type === "profile" || mode === "profiles") && (
            <label>
              Franchise / group
              <select
                aria-label="Franchise / group"
                value={filters.franchise}
                onChange={(e) => update("franchise", e.target.value)}
              >
                <option value="">All franchises</option>
                {franchises.map((franchise) => (
                  <option key={franchise}>{franchise}</option>
                ))}
              </select>
            </label>
          )}
          {["trailers", "events"].includes(mode) && (
            <label>
              Status
              <select
                aria-label="Status"
                value={filters.status}
                onChange={(e) => update("status", e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value={mode === "events" ? "past" : "released"}>
                  {mode === "events" ? "Past events" : "Released / archive"}
                </option>
                <option value="unannounced">Unannounced</option>
                <option value="postponed">Postponed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          )}
          <label>
            Sort by
            <select
              aria-label="Sort by"
              value={filters.sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="featured">Editor’s picks</option>
              <option value="newest">Newest dated first</option>
              <option value="alphabetical">A to Z</option>
            </select>
          </label>
          <button className="reset-button" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
      <div className="results-meta" aria-live="polite">
        <span>{results.length} discoveries</span>
        <span>Curated, sourced, connected.</span>
      </div>
      {results.length ? (
        <div className="card-grid">
          {results.map((item) => (
            <Card key={item.id} item={item} {...props} />
          ))}
        </div>
      ) : (
        <Empty onReset={reset} />
      )}
      {world && (
        <section className="category-gallery">
          <SectionHead
            eyebrow="A CLOSER LOOK"
            title={`${world.name}, in pictures.`}
            description="Official online previews and credited, reusable fan-culture photography."
          />
          {content
            .filter(
              (item) => item.category === category && item.type === "gallery",
            )
            .map((item) => (
              <Gallery key={item.id} item={item} />
            ))}
          {!content.some(
            (item) => item.category === category && item.type === "gallery",
          ) && (
            <p className="notice">
              Gallery media is awaiting verified reuse permission. Official
              source links remain available on individual entries.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

export function Gallery({ item }) {
  const [index, setIndex] = useState(null);
  const images = item.gallery || [];
  const current = index === null ? null : images[index];
  useEffect(() => {
    if (index === null) return;
    const key = (event) => {
      if (event.key === "ArrowRight")
        setIndex((previous) => (previous + 1) % images.length);
      if (event.key === "ArrowLeft")
        setIndex((previous) => (previous + images.length - 1) % images.length);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, images.length]);
  return (
    <>
      <div className="gallery-grid">
        {images.map((image, i) => (
          <button
            key={image.src || i}
            className="gallery-thumb"
            onClick={() => setIndex(i)}
            aria-label={`Open image ${i + 1}: ${image.alt}`}
          >
            <Image src={image.src} alt={image.alt} />
            <span>
              {image.alt}
              <Icon name="plus" size={16} />
            </span>
          </button>
        ))}
      </div>
      {!images.length && (
        <p className="notice">
          No image has cleared reuse permission for this gallery yet. Follow the
          sources to view the original material.
        </p>
      )}
      {current && (
        <Modal wide title={item.title} onClose={() => setIndex(null)}>
          <div className="lightbox-image">
            <Image src={current.src} alt={current.alt} priority />
          </div>
          <div className="lightbox-controls">
            <button
              className="button secondary small"
              onClick={() =>
                setIndex((index + images.length - 1) % images.length)
              }
              aria-label="Previous image"
            >
              ← Previous
            </button>
            <span>
              {index + 1} / {images.length}
            </span>
            <button
              className="button secondary small"
              onClick={() => setIndex((index + 1) % images.length)}
              aria-label="Next image"
            >
              Next →
            </button>
          </div>
          <p>{current.alt}</p>
          <p className="small-text muted">
            {current.credit} · {current.license}{" "}
            {current.sourceUrl && (
              <a target="_blank" rel="noreferrer" href={current.sourceUrl}>
                Original & license
              </a>
            )}
          </p>
        </Modal>
      )}
    </>
  );
}

function MediaPlayer({ item }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const localVideo = item.videoMp4 || item.videoWebm;
  const audio = item.audioUrl;
  return (
    <section className="media-section">
      {audio ? (
        <>
          <audio
            controls
            preload="none"
            onError={() => setFailed(true)}
            src={audio}
          >
            Your browser cannot play this audio.
          </audio>
          {failed && (
            <p role="status">
              Audio unavailable. Please use the official source link below.
            </p>
          )}
        </>
      ) : (
        <button
          className="media-launch"
          onClick={() => {
            setFailed(false);
            setOpen(true);
          }}
        >
          {item.poster || item.image ? (
            <Image src={item.poster || item.image} alt="" />
          ) : (
            <span className="media-world" aria-hidden="true">
              {categoryFor(item.category)?.symbol}
            </span>
          )}
          <span className="media-launch-label">
            <span className="play-dot">
              <Icon name="play" size={28} />
            </span>
            {localVideo
              ? "Play licensed video"
              : item.embedUrl
                ? "Open official player"
                : "View media availability"}
          </span>
        </button>
      )}
      <p className="small-text muted">
        {localVideo || audio
          ? "Local licensed media. Playback works without an external player."
          : "Official external media requires an internet connection. Provider availability may vary."}
      </p>
      {(item.transcript || item.transcriptUrl) && (
        <details className="transcript">
          <summary>Transcript / accessible description</summary>
          {item.transcript && (
            <p>
              {Array.isArray(item.transcript)
                ? item.transcript.join("\n\n")
                : item.transcript}
            </p>
          )}
          {item.transcriptUrl && (
            <a href={item.transcriptUrl} target="_blank" rel="noreferrer">
              Read the source transcript
            </a>
          )}
        </details>
      )}
      {item.mediaUrl && (
        <a
          href={item.mediaUrl}
          className="text-link"
          target="_blank"
          rel="noreferrer"
        >
          Open official media source
          <Icon name="diagonal" size={16} />
        </a>
      )}
      {open && (
        <Modal wide title={item.title} onClose={() => setOpen(false)}>
          {localVideo ? (
            <video
              controls
              playsInline
              preload="metadata"
              poster={item.poster || item.image}
              onError={() => setFailed(true)}
            >
              {item.videoWebm && (
                <source src={item.videoWebm} type="video/webm" />
              )}
              {item.videoMp4 && <source src={item.videoMp4} type="video/mp4" />}
              {item.captionsUrl && (
                <track
                  kind="captions"
                  src={item.captionsUrl}
                  srcLang="en"
                  label="English"
                  default
                />
              )}
            </video>
          ) : item.embedUrl ? (
            <iframe
              className="video-frame"
              src={item.embedUrl}
              title={item.title}
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="empty">
              <Icon name="play" size={38} />
              <h3>Watch at the official source</h3>
              <p>
                Permission to download or embed this media has not been
                established. The official link lets you watch it where it was
                published.
              </p>
            </div>
          )}
          {failed && (
            <p role="alert">
              This media could not be loaded. Try the official source below.
            </p>
          )}
          <p className="small-text muted">
            If a provider restricts this player or captions are unavailable, use
            its official page. No sound plays automatically.
          </p>
          {item.mediaUrl && (
            <a
              className="button secondary"
              target="_blank"
              rel="noreferrer"
              href={item.mediaUrl}
            >
              Open official source
              <Icon name="diagonal" size={16} />
            </a>
          )}
        </Modal>
      )}
    </section>
  );
}

export function Detail({ item, ...props }) {
  const category = categoryFor(item.category);
  const worldTrailers = content
    .filter((other) => other.category === item.category && other.type === "trailer" && other.id !== item.id)
    .slice(0, 2);
  const related = content
    .filter(
      (other) =>
        other.category === item.category &&
        other.id !== item.id &&
        ["article", "profile", "gallery"].includes(other.type),
    )
    .slice(0, 3);
  const body = Array.isArray(item.body)
    ? item.body
    : typeof item.body === "string"
      ? [item.body]
      : [];
  return (
    <article
      className="container detail-page"
      style={{ "--world": category?.color }}
    >
      <header className="detail-heading image-heading">
        <HeadingVisual item={item} context={item.imageContext ? "Context image · see source" : ""} />
        <p className="eyebrow">
          {category?.name} / {typeLabel(item.type)}{" "}
          {getStatus(item) && ` / ${getStatus(item)}`}
        </p>
        <h1>{item.title}</h1>
        <p className="detail-deck">{item.description}</p>
        <div className="detail-meta">
          <span>{item.franchise || "FandomVerse editorial collection"}</span>
          <BookmarkButton
            item={item}
            saved={props.bookmarks.includes(item.id)}
            toggle={props.toggle}
          />
          <span>Save for later</span>
        </div>
      </header>
      <div className="detail-layout">
        <div className="detail-main">
          {item.image &&
            !["gallery", "trailer", "audio"].includes(item.type) && (
              <>
                <Image
                  className={`detail-image ${item.imageKind === "event-logo" ? "logo-art" : ""}`}
                  src={item.image}
                  alt={item.imageAlt || item.title}
                  style={{ objectPosition: item.imageFocus || "center" }}
                  priority
                />
                {item.imageCredit && (
                  <p className="image-credit small-text muted">
                    {item.imageContext
                      ? `${item.imageContext} Credit: ${item.imageCredit}.`
                      : item.imageKind === "official-trailer-thumbnail"
                      ? `Official trailer thumbnail supplied by ${item.imageCredit} through YouTube. Loads online; it is a preview of the linked video.`
                      : item.imageKind === "fan-cosplay"
                        ? `Fan cosplay photographed by ${item.imageCredit}. This is not official character artwork.`
                        : `Licensed image: ${item.imageCredit}. ${item.imageKind === "performer-photo" ? "The photograph shows the performer, not the character." : "See the source for license and context."}`}{" "}
                    <a
                      href={item.imageSourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.imageKind === "official-trailer-thumbnail"
                        ? "Watch at the official source"
                        : "Photo, license, and changes"}
                    </a>
                  </p>
                )}
              </>
            )}
          {item.type === "profile" && (
            <>
              <div className="profile-card">
                {!item.image && (
                  <div
                    className="profile-monogram"
                    aria-label="Character artwork reuse permission unavailable"
                  >
                    {item.title
                      .split(" ")
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
                <div>
                  <p className="eyebrow">{item.franchise}</p>
                  <h2>Meet {item.title}</h2>
                  <p>{item.biography || item.description}</p>
                </div>
              </div>
              {!item.image && (
                <p className="notice">
                  The official character artwork is protected. Reuse permission
                  was not established; view it through the official sources
                  below.
                </p>
              )}
              <h2>
                {item.category === "kpop"
                  ? "Verified attributes"
                  : "Character traits"}
              </h2>
              <div className="tags large">
                {item.traits?.map((trait) => (
                  <span key={trait}>{trait}</span>
                ))}
              </div>
            </>
          )}
          {item.type === "article" && (
            <div className="prose">
              {body.map((paragraph, index) =>
                typeof paragraph === "string" ? (
                  <p key={index}>{paragraph}</p>
                ) : (
                  <section key={index}>
                    <h2>{paragraph.heading}</h2>
                    <p>{paragraph.text}</p>
                  </section>
                ),
              )}
            </div>
          )}
          {["event", "release"].includes(item.type) && (
            <>
              <div className="event-facts">
                <div>
                  <Icon name="calendar" />
                  <span>
                    Date
                    <strong>
                      {dateLabel(item.date)}
                      {item.endDate && ` – ${dateLabel(item.endDate)}`}
                    </strong>
                  </span>
                </div>
                <div>
                  <Icon name="pin" />
                  <span>
                    {item.type === "release"
                      ? "Platform / location"
                      : "Location"}
                    <strong>
                      {item.location || item.platform || "See official source"}
                    </strong>
                  </span>
                </div>
                <div>
                  <Icon name="globe" />
                  <span>
                    Status<strong>{getStatus(item)}</strong>
                  </span>
                </div>
              </div>
              <p>{item.description}</p>
              {body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {getStatus(item) === "past" && (
                <p className="notice">
                  This is a past event, kept in our fandom archive. It is not a
                  current ticket offer.
                </p>
              )}
              {getStatus(item) === "upcoming" && (
                <p className="notice">
                  Confirmed announcement as checked on {item.verifiedAt}.
                  Schedules can change; check the organizer’s source before
                  making plans.
                </p>
              )}
            </>
          )}
          {item.type === "gallery" && <Gallery item={item} />}{" "}
          {["trailer", "audio", "video"].includes(item.type) && (
            <MediaPlayer key={item.id} item={item} />
          )}{" "}
          {item.type === "merchandise" && (
            <div className="product-info">
              <span className="product-price">
                {money(item.price, item.currency)}
              </span>
              <p>
                {item.variant || "Listed product variant"} · {item.currency}
              </p>
              <p className="small-text muted">
                Price checked {dateLabel(item.verifiedAt)}. Actual retailer
                prices may change.
              </p>
              {!item.image && (
                <p className="notice">
                  Product photography remains at the official retailer because
                  permission to republish it was not established.
                </p>
              )}
              <button className="button" onClick={() => props.addCart(item.id)}>
                <Icon name="plus" />
                Add to demo cart
              </button>
              <a
                className="button secondary"
                href={item.retailerUrl || item.sources?.[0]?.url}
                target="_blank"
                rel="noreferrer"
              >
                Visit official retailer
                <Icon name="diagonal" size={18} />
              </a>
              <p>{item.licensingNote}</p>
              <p className="notice">
                FandomVerse is an independent project, not an official retailer.
                No purchases, checkout, payment or stock guarantees are
                available here.
              </p>
            </div>
          )}
          <Sources item={item} />
        </div>
        <aside className="detail-sidebar">
          <p className="eyebrow">IN THIS ORBIT</p>
          <h2>A world worth exploring.</h2>
          <p>{category?.description}</p>
          <a className="text-link" href={`#/world/${item.category}`}>
            Explore {category?.name}
            <Icon name="arrow" size={16} />
          </a>
          <div className="tags">
            {item.tags?.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <hr />
          <p className="small-text muted">
            Sources are attached to each entry. All article commentary is
            original. Media credits document what can be reused.
          </p>
          <a className="text-link" href="#/credits">
            Media & source policy
            <Icon name="arrow" size={16} />
          </a>
        </aside>
      </div>
      <section className="related">
        <SectionHead eyebrow="KEEP EXPLORING" title="Stay in this world." />
        <div className="card-grid three">
          {related.map((other) => (
            <Card key={other.id} item={other} {...props} />
          ))}
        </div>
      </section>
      {worldTrailers.length > 0 && (
        <section className="related">
          <SectionHead eyebrow="WATCH THIS WORLD" title="Official trailers and videos." href="#/trailers" link="All trailers" />
          <div className="card-grid three">
            {worldTrailers.map((trailer) => <Card key={trailer.id} item={trailer} {...props} />)}
          </div>
        </section>
      )}
    </article>
  );
}

export function Bookmarks({ bookmarks, notes, updateNote, ...props }) {
  const saved = content.filter((item) => bookmarks.includes(item.id));
  function exportSaved() {
    const blob = new Blob([bookmarkExport(saved, notes)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "FandomVerse-bookmarks.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="container saved-page">
      <header className="page-heading image-heading">
        <HeadingVisual item={saved.find((item) => item.image) || headingRecord(collectionHeadingIds.explore)} context={saved.length ? "Saved collection image" : "Fandom community photo"} />
        <p className="eyebrow">YOUR PERSONAL ORBIT</p>
        <h1>Keep a little of every world.</h1>
        <p>
          Bookmarks stay on this browser. Personal notes live only in this tab’s
          session.
        </p>
      </header>
      <div className="results-meta">
        <span>{saved.length} saved discoveries</span>
        <button
          className="button secondary small"
          disabled={!saved.length}
          onClick={exportSaved}
        >
          <Icon name="download" size={16} />
          Export formatted list
        </button>
      </div>
      {saved.length ? (
        <div className="saved-grid">
          {saved.map((item) => (
            <div className="saved-item" key={item.id}>
              <Card item={item} {...props} bookmarks={bookmarks} />
              <label>
                Private session note
                <textarea
                  maxLength={2000}
                  rows={3}
                  value={notes[item.id] || ""}
                  onChange={(e) => updateNote(item.id, e.target.value)}
                  placeholder="What do you want to remember?"
                />
              </label>
              <small>
                Saved only in sessionStorage. A browser’s tab restore may
                restore a session; remove sensitive notes yourself.
              </small>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          title="Your collection starts with curiosity."
          text="Tap a bookmark on any story, profile, event or product, then find it here."
        />
      )}
    </div>
  );
}

export function Calendar(props) {
  const releases = content.filter((item) => item.type === "release");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [view, setView] = useState("calendar");
  const records = releases.filter(
    (item) => !category || item.category === category,
  );
  const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const inMonth = records.filter((item) => item.date?.startsWith(key));
  return (
    <div className="container calendar-page">
      <header className="page-heading image-heading">
        <HeadingVisual item={headingRecord(collectionHeadingIds.calendar)} context="Star Wars release context · see source" />
        <p className="eyebrow">WHAT’S ON THE HORIZON</p>
        <h1>Good things are worth the wait.</h1>
        <p>
          Verified release dates, with historical releases preserved. Unknown
          dates stay unannounced.
        </p>
      </header>
      <div className="calendar-toolbar">
        <label>
          World
          <select
            aria-label="World"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All worlds</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <div className="segmented">
          <button
            aria-pressed={view === "calendar"}
            onClick={() => setView("calendar")}
          >
            Calendar
          </button>
          <button
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            All releases
          </button>
        </div>
      </div>
      {view === "calendar" ? (
        <>
          <div className="month-heading">
            <button
              className="icon-button"
              aria-label="Previous month"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
            >
              ←
            </button>
            <h2>
              {month.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              className="icon-button"
              aria-label="Next month"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
              }
            >
              →
            </button>
            <button
              className="reset-button"
              onClick={() =>
                setMonth(
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                )
              }
            >
              Today
            </button>
          </div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
            {Array.from({ length: month.getDay() }, (_, index) => (
              <div className="day blank" key={`blank${index}`} />
            ))}
            {Array.from({ length: days }, (_, index) => {
              const date = `${key}-${String(index + 1).padStart(2, "0")}`;
              return (
                <div
                  className={`day ${date === new Date().toISOString().slice(0, 10) ? "today" : ""}`}
                  key={date}
                >
                  <time dateTime={date}>{index + 1}</time>
                  {inMonth
                    .filter((item) => item.date === date)
                    .map((item) => (
                      <a
                        href={itemLink(item)}
                        key={item.id}
                        style={{ "--world": categoryFor(item.category)?.color }}
                      >
                        {item.title}
                      </a>
                    ))}
                </div>
              );
            })}
          </div>
          {!inMonth.length && (
            <p className="notice">
              No verified release dates are in the collection for this month.
              Try “All releases” to explore the dated archive and upcoming
              announcements.
            </p>
          )}
        </>
      ) : (
        <div className="card-grid">
          {filterContent(records, { sort: "newest" }).map((item) => (
            <Card key={item.id} item={item} {...props} />
          ))}
        </div>
      )}
      <section className="upcoming">
        <SectionHead eyebrow="CONFIRMED DATES" title="Coming up next." />
        {records.some((item) => getStatus(item) === "upcoming") ? (
          <div className="card-grid three">
            {records
              .filter((item) => getStatus(item) === "upcoming")
              .map((item) => (
                <Card key={item.id} item={item} {...props} />
              ))}
          </div>
        ) : (
          <p className="notice">
            No future release dates have been verified in this collection yet.
            Follow the official sources for new announcements.
          </p>
        )}
      </section>
    </div>
  );
}

export function About() {
  return (
    <div className="container info-page">
      <header className="page-heading image-heading">
        <HeadingVisual item={headingRecord(collectionHeadingIds.about)} context="Fan community photo" />
        <p className="eyebrow">MADE FOR THE THINGS YOU LOVE</p>
        <h1>
          Different worlds.
          <br />A shared sense of wonder.
        </h1>
        <p>
          FandomVerse brings scattered fandom knowledge into one considered,
          accessible space.
        </p>
      </header>
      <div className="about-layout">
        <div className="prose">
          <h2>A portal, built with curiosity.</h2>
          <p>
            This independent Web Innovation Unleashed project connects seven
            fandom communities through sourced profiles, original articles,
            historical events, official previews and real merchandise. It is a
            place to discover a story and follow it back to its source.
          </p>
          <p>
            Each world has its own accent and personality, but a shared
            interface keeps exploration familiar. You can search, filter and
            bookmark content without creating an account.
          </p>
          <h2>Built to be understood.</h2>
          <p>
            The site is a React single page application. Its content lives in
            local JSON files. Bookmarks stay in your browser; personal notes
            last only for your current session. Orbit is an honest, scripted
            guide, powered by the same verified collection you browse.
          </p>
          <h2>The people behind the portal.</h2>
          {team.teamName ? (
            <>
              <h3>{team.teamName}</h3>
              <ul>
                {team.members.map((member, index) => (
                  <li key={index}>
                    {typeof member === "string"
                      ? member
                      : `${member.name} — ${member.role}`}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="notice">
              Participant and team information has not been configured. No names
              or identities have been invented.
            </p>
          )}
          <h2>AI acknowledgement.</h2>
          <p>
            OpenAI Codex assisted with research, design, implementation and
            testing. The competition participant must review, understand and
            meaningfully personalize the work before submission, in accordance
            with SRS page 14. The project includes a plain-language code guide
            and practice questions.
          </p>
        </div>
        <aside className="about-manifesto">
          <span>THE FANDOMVERSE PROMISE</span>
          <h2>
            Real worlds.
            <br />
            Real sources.
            <br />
            Room for everyone.
          </h2>
          <p>
            No invented news. No fabricated prices. No live AI pretending to
            know.
          </p>
          <a href="#/credits" className="text-link">
            Meet the sources
            <Icon name="arrow" />
          </a>
          <div className="world-pills">
            {categories.map((c) => (
              <a
                style={{ "--world": c.color }}
                key={c.id}
                href={`#/world/${c.id}`}
              >
                {c.name}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export function Contact() {
  const [location, setLocation] = useState(null);
  const [state, setState] = useState("");
  function locate() {
    if (!navigator.geolocation) {
      setState("Geolocation is unavailable in this browser.");
      return;
    }
    setState("Requesting your location…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setState(
          "Your location is shown only for this visit and is not stored.",
        );
      },
      (error) => {
        setState(
          error.code === 1
            ? "Location permission was denied. You can continue using the site without sharing your location."
            : error.code === 3
              ? "The location request timed out. Please try again."
              : "Your location could not be determined. Please try again when location services are available.",
        );
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false },
    );
  }
  return (
    <div className="container info-page">
      <header className="page-heading image-heading">
        <HeadingVisual item={headingRecord(collectionHeadingIds.contact)} context="Fandom community photo · not the team location" />
        <p className="eyebrow">LET’S CONNECT</p>
        <h1>
          Every conversation
          <br />
          opens a new world.
        </h1>
        <p>
          Find the team, explore the project location, or share your own
          location for this visit.
        </p>
      </header>
      <div className="contact-grid">
        <section className="contact-card">
          <Icon name="chat" size={30} />
          <h2>Get in touch.</h2>
          {team.email ? (
            <a className="text-link" href={`mailto:${team.email}`}>
              {team.email}
              <Icon name="diagonal" />
            </a>
          ) : (
            <p>Contact email is not configured.</p>
          )}
          <p>{team.teamName || "Team name is not configured."}</p>
          <a href="#/about" className="text-link">
            About this project
            <Icon name="arrow" />
          </a>
        </section>
        <section className="contact-card">
          <Icon name="pin" size={30} />
          <h2>Our corner of the world.</h2>
          <p>
            {team.locationLabel || "The team location has not been supplied."}
          </p>
          {team.mapQuery ? (
            <>
              <iframe
                title="Configured team location on Google Maps"
                className="map-frame"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(team.mapQuery)}&output=embed`}
              />
              <p className="small-text muted">
                Google Maps requires an internet connection.
              </p>
            </>
          ) : (
            <div className="map-unconfigured">
              <div className="map-lines" aria-hidden="true" />
              <Icon name="pin" size={36} />
              <span>Team map awaiting a real location</span>
            </div>
          )}
        </section>
        <section className="contact-card location-card">
          <div>
            <h2>Where are you exploring from?</h2>
            <p>
              Your browser will ask before sharing your location. Coordinates
              are never saved or sent to a FandomVerse server.
            </p>
          </div>
          <button
            className="button secondary"
            onClick={locate}
            disabled={state === "Requesting your location…"}
          >
            <Icon name="pin" size={18} />
            Use my location
          </button>
          <p role="status">{state}</p>
          {location && (
            <div>
              <p>
                Latitude {location.lat.toFixed(4)} · Longitude{" "}
                {location.lng.toFixed(4)}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Open my position on Google Maps
                <Icon name="diagonal" size={16} />
              </a>
              <p className="small-text muted">
                Opening this link shares those coordinates with Google Maps.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function Credits() {
  const galleries = content.filter((item) => item.type === "gallery");
  return (
    <div className="container info-page">
      <header className="page-heading image-heading">
        <HeadingVisual item={headingRecord(collectionHeadingIds.credits)} context="Credited manga culture photo" />
        <p className="eyebrow">A CLEAR TRAIL BACK TO THE SOURCE</p>
        <h1>Credits, context & care.</h1>
        <p>
          Real fandom content deserves honest sourcing and respect for its
          creators.
        </p>
      </header>
      <div className="prose">
        <h2>Our editorial approach.</h2>
        <p>
          Profiles, events, products and articles include source links. Articles
          are original summaries and commentary, not copied articles.
          Time-sensitive records include a verification date. Historical events
          stay labeled as past, and no rumor is treated as a confirmed
          announcement.
        </p>
        <h2>Artwork and photography.</h2>
        <p>
          Public availability is not a reuse license. Protected character and
          product artwork remains at its source unless reuse permission has been
          verified. Abstract backgrounds, portal graphics and the FandomVerse
          mark are original interface artwork; they do not depict franchise
          characters.
        </p>
        <p>
          Missing artwork is identified on profile and product pages. A cast
          photograph depicts the actual performer, not their fictional
          character. Event photographs document a fandom gathering, not a
          franchise scene.
        </p>
        <h2>Media attribution.</h2>
        {galleries.map((item) => (
          <section key={item.id}>
            <h3>{item.title}</h3>
            <ul>
              {item.gallery?.map((image, index) => (
                <li key={index}>
                  {image.alt} — {image.credit}. {image.license}.{" "}
                  <a href={image.sourceUrl} target="_blank" rel="noreferrer">
                    Source and license
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <h2>Trailers and audio.</h2>
        {content
          .filter((item) => item.type === "trailer" || item.type === "audio")
          .map((item) => (
            <p key={item.id}>
              <a href={itemLink(item)}>{item.title}</a> —{" "}
              {item.mediaPermission ||
                item.mediaPermissionNote ||
                "See the media page and official source for availability and permission details."}
            </p>
          ))}
        <h2>Independent fan project.</h2>
        <p>
          FandomVerse is not affiliated with franchise owners, artists or
          retailers. Names and trademarks identify the referenced works. Product
          links take you to the retailer; our demo cart cannot complete a
          purchase.
        </p>
        <h2>AI and software.</h2>
        <p>
          OpenAI Codex assisted this project. React and React DOM render the
          interface; Vite builds static files. Development tools support image
          conversion, browser testing, recording and packaging. Full research
          notes, licenses and test evidence are included in the project
          documentation.
        </p>
      </div>
    </div>
  );
}
