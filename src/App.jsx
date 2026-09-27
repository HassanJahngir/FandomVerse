import { useEffect, useRef, useState } from "react";
import Icon from "./components/Icon";
import { Modal, Empty } from "./components/UI";
import Chatbot from "./components/Chatbot";
import {
  Home,
  Catalog,
  Detail,
  Bookmarks,
  Calendar,
  About,
  Contact,
  Credits,
} from "./pages";
import {
  categories,
  content,
  categoryFor,
  cartTotals,
  money,
} from "./lib/catalog";
import { readStorage, writeStorage } from "./lib/storage";

function currentRoute() {
  return window.location.hash.slice(1) || "/";
}
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <time dateTime={time.toISOString()}>
      {time.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
      <br />
      {time.toLocaleTimeString("en-US")}
    </time>
  );
}
export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = readStorage("localStorage", "fv.bookmarks", []);
    return Array.isArray(saved)
      ? saved.filter((id) => typeof id === "string")
      : [];
  });
  const [notes, setNotes] = useState(() => {
    const saved = readStorage("sessionStorage", "fv.notes", {});
    return saved && !Array.isArray(saved) && typeof saved === "object"
      ? saved
      : {};
  });
  const [cart, setCart] = useState({});
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [menu, setMenu] = useState(false);
  const [paused, setPaused] = useState(() =>
    readStorage("localStorage", "fv.motionPaused", false),
  );
  const [visits, setVisits] = useState(1);
  const first = useRef(true);
  const visitorStarted = useRef(false);
  const main = useRef(null);
  const path = route.split("?")[0];
  const world = path.startsWith("/world/")
    ? categoryFor(path.split("/")[2])
    : null;
  const item = path.startsWith("/item/")
    ? content.find((item) => item.id === path.split("/")[2])
    : null;
  const pageName =
    world?.name ||
    item?.title ||
    {
      "/": "Home",
      "/explore": "Explore the worlds",
      "/search": "Search",
      "/profiles": "Characters & artists",
      "/events": "Events",
      "/releases": "Release calendar",
      "/trailers": "Trailer room",
      "/media": "Media archive",
      "/merchandise": "The collection",
      "/bookmarks": "Your saved collection",
      "/about": "About",
      "/contact": "Contact",
      "/credits": "Sources & credits",
    }[path] ||
    "Page not found";
  useEffect(() => {
    const handler = () => setRoute(currentRoute());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  useEffect(() => {
    const shortcut = (event) => {
      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) &&
        !document.querySelector("dialog[open]")
      ) {
        event.preventDefault();
        window.location.hash = "/search";
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(() => {
    document.title = `${pageName} — FandomVerse`;
    setMenu(false);
    setModal(null);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!first.current) main.current?.focus({ preventScroll: true });
    first.current = false;
  }, [route, pageName]);
  useEffect(() => {
    if (visitorStarted.current) return;
    visitorStarted.current = true;
    const previous = Number(readStorage("localStorage", "fv.visits", 0));
    const next =
      (Number.isFinite(previous) && previous >= 0 ? previous : 0) + 1;
    setVisits(next);
    writeStorage("localStorage", "fv.visits", next);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "active";
    writeStorage("localStorage", "fv.motionPaused", paused);
  }, [paused]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) =>
          entry.target.classList.toggle("in-view", entry.isIntersecting),
        ),
      { threshold: 0.06 },
    );
    document
      .querySelectorAll(".ambient-motion")
      .forEach((el) => observer.observe(el));
    const visibility = () => {
      document.documentElement.dataset.hidden = document.hidden ? "yes" : "no";
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [route]);
  function toggle(id) {
    const next = bookmarks.includes(id)
      ? bookmarks.filter((saved) => saved !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    const ok = writeStorage("localStorage", "fv.bookmarks", next);
    setToast(
      ok
        ? next.includes(id)
          ? "Saved to your collection"
          : "Removed from your collection"
        : "Browser storage unavailable. Saved for this visit only.",
    );
  }
  function updateNote(id, text) {
    const next = { ...notes, [id]: text };
    setNotes(next);
    if (!writeStorage("sessionStorage", "fv.notes", next))
      setToast("Session storage unavailable. Note kept in memory only.");
  }
  function addCart(id) {
    setCart((previous) => ({
      ...previous,
      [id]: Math.min((previous[id] || 0) + 1, 99),
    }));
    setToast("Added to your demo cart");
  }
  function quantity(id, value) {
    setCart((previous) => {
      const next = { ...previous };
      if (value <= 0) delete next[id];
      else next[id] = Math.min(99, value);
      return next;
    });
  }
  const shared = { bookmarks, toggle, addCart };
  let page;
  if (path === "/")
    page = <Home {...shared} paused={paused} setPaused={setPaused} />;
  else if (world) page = <Catalog {...shared} category={world.id} />;
  else if (item) page = <Detail {...shared} item={item} />;
  else if (path === "/bookmarks")
    page = <Bookmarks {...shared} notes={notes} updateNote={updateNote} />;
  else if (path === "/releases") page = <Calendar {...shared} />;
  else if (path === "/about") page = <About />;
  else if (path === "/contact") page = <Contact />;
  else if (path === "/credits") page = <Credits />;
  else if (
    [
      "/explore",
      "/search",
      "/profiles",
      "/events",
      "/trailers",
      "/media",
      "/merchandise",
    ].includes(path)
  )
    page = (
      <Catalog
        key={path}
        {...shared}
        mode={path.slice(1)}
        initialQuery={
          new URLSearchParams(route.split("?")[1] || "").get("q") || ""
        }
        initialType={
          new URLSearchParams(route.split("?")[1] || "").get("type") || ""
        }
      />
    );
  else
    page = (
      <Empty
        title="This portal hasn’t been mapped."
        text="The address doesn’t match an item in this collection."
      />
    );
  const totalItems = Object.values(cart).reduce((sum, n) => sum + n, 0);
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          main.current.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#/">
          <span className="brand-mark" aria-hidden="true">
            f<span>v</span>
          </span>
          fandom<span>verse</span>
          <i aria-hidden="true" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a
            className={world || path === "/explore" ? "active" : ""}
            href="#/explore"
          >
            Explore
            <Icon name="chevron" size={12} />
          </a>
          <a className={path === "/events" ? "active" : ""} href="#/events">
            Events
          </a>
          <a className={path === "/trailers" ? "active" : ""} href="#/trailers">
            Trailers
          </a>
          <a
            className={path === "/merchandise" ? "active" : ""}
            href="#/merchandise"
          >
            Merch
          </a>
        </nav>
        <div className="header-actions">
          <a
            className="search-trigger"
            href="#/search"
            aria-label="Search the verse across all worlds"
          >
            <Icon name="search" size={18} />
            <span>Search the verse</span>
            <kbd>/</kbd>
          </a>
          <a
            className="icon-button"
            href="#/bookmarks"
            aria-label={`Bookmarks, ${bookmarks.length} saved`}
          >
            <Icon name="bookmark" />
            {bookmarks.length > 0 && (
              <span className="count-dot">{bookmarks.length}</span>
            )}
          </a>
          <button
            className="icon-button"
            onClick={() => setModal("cart")}
            aria-label={`Open demo cart, ${totalItems} items`}
          >
            <Icon name="cart" />
            {totalItems > 0 && <span className="count-dot">{totalItems}</span>}
          </button>
          <button className="login-button" onClick={() => setModal("login")}>
            Log in <Icon name="diagonal" size={15} />
          </button>
          <button
            className="icon-button menu-button"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle navigation"
            aria-expanded={menu}
          >
            <Icon name={menu ? "close" : "menu"} />
          </button>
        </div>
      </header>
      {menu && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {[
            ["Explore", "explore"],
            ["Search", "search"],
            ["Events", "events"],
            ["Trailers", "trailers"],
            ["Merchandise", "merchandise"],
            ["Saved", "bookmarks"],
            ["About", "about"],
            ["Contact", "contact"],
          ].map(([label, href]) => (
            <a href={`#/${href}`} key={href}>
              {label}
              <Icon name="arrow" size={16} />
            </a>
          ))}
          <button
            onClick={() => {
              setMenu(false);
              setModal("login");
            }}
          >
            Demo login / signup
          </button>
        </nav>
      )}
      <div className="world-strip">
        <span>
          <i className="online-dot" /> YOUR NEXT OBSESSION IS HERE
        </span>
        <nav aria-label="Seven worlds">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#/world/${category.id}`}
              style={{ "--world": category.color }}
              className={world?.id === category.id ? "active" : ""}
            >
              {category.name}
            </a>
          ))}
        </nav>
        <span className="strip-end">
          EST. 2026 <Icon name="globe" size={13} />
        </span>
      </div>
      <main id="main" ref={main} tabIndex="-1">
        {path !== "/" && (
          <nav className="breadcrumbs container" aria-label="Breadcrumb">
            <a href="#/">Home</a>
            <Icon name="chevron" size={12} />
            {item && (
              <>
                <a href={`#/world/${item.category}`}>
                  {categoryFor(item.category)?.name}
                </a>
                <Icon name="chevron" size={12} />
              </>
            )}
            <span aria-current="page">{pageName}</span>
          </nav>
        )}
        <div key={path} className="route-view">
          {page}
        </div>
      </main>
      <footer className="site-footer container">
        <div className="footer-main">
          <div>
            <a className="brand" href="#/">
              <span className="brand-mark">
                f<span>v</span>
              </span>
              fandom<span>verse</span>
            </a>
            <p>
              A little curiosity. A whole new universe.
              <br />
              An independent fan discovery project.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#/about">About the project</a>
            <a href="#/contact">Contact & location</a>
            <a href="#/profiles">Characters & artists</a>
            <a href="#/releases">Release calendar</a>
            <a href="#/media">Media archive</a>
            <a href="#/credits">Sources & credits</a>
          </nav>
          <div className="footer-clock">
            <span className="eyebrow">RIGHT HERE, RIGHT NOW</span>
            <LiveClock />
            <small>
              {visits.toLocaleString()} local visit{visits === 1 ? "" : "s"} ·
              simulated counter
            </small>
          </div>
        </div>
        <div className="footer-bottom">
          <span>FandomVerse · Web Innovation Unleashed</span>
          <span>Fan-made. Source-led. Always curious.</span>
          <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
            <Icon name={paused ? "play" : "pause"} size={14} />
            {paused ? "Resume decorative motion" : "Pause decorative motion"}
          </button>
        </div>
      </footer>
      <Chatbot />
      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        {toast && (
          <>
            <Icon name="check" size={17} />
            {toast}
          </>
        )}
      </div>
      {modal === "cart" && (
        <Modal title="Your demo cart" onClose={() => setModal(null)}>
          <p className="notice">
            A temporary collection, with no checkout or payment. Prices were
            checked on the dates shown; retailer prices may change.
          </p>
          {totalItems === 0 ? (
            <Empty
              title="Room for your next favorite."
              text="Explore the merchandise collection to add an item."
            />
          ) : (
            <>
              <div className="cart-items">
                {Object.entries(cart).map(([id, q]) => {
                  const product = content.find((item) => item.id === id);
                  return (
                    product && (
                      <div className="cart-item" key={id}>
                        <div>
                          <a href={`#/item/${id}`}>{product.title}</a>
                          <small>
                            {product.variant} ·{" "}
                            {money(product.price, product.currency)} each
                          </small>
                          <small>Checked {product.verifiedAt}</small>
                        </div>
                        <div className="quantity">
                          <button
                            className="icon-button"
                            onClick={() => quantity(id, q - 1)}
                            aria-label={`Decrease ${product.title} quantity`}
                          >
                            <Icon name="minus" size={14} />
                          </button>
                          <span aria-label="Quantity">{q}</span>
                          <button
                            className="icon-button"
                            onClick={() => quantity(id, q + 1)}
                            aria-label={`Increase ${product.title} quantity`}
                          >
                            <Icon name="plus" size={14} />
                          </button>
                        </div>
                        <strong>
                          {money(product.price * q, product.currency)}
                        </strong>
                        <button
                          className="icon-button"
                          aria-label={`Remove ${product.title} from cart`}
                          onClick={() => quantity(id, 0)}
                        >
                          <Icon name="close" size={16} />
                        </button>
                      </div>
                    )
                  );
                })}
              </div>
              {Object.entries(cartTotals(cart)).map(([currency, cents]) => (
                <div className="cart-total" key={currency}>
                  <span>Subtotal / total ({currency})</span>
                  <strong>{money(cents / 100, currency)}</strong>
                </div>
              ))}
              <p className="muted small-text">
                No shipping, tax or discounts are estimated. Quantities are for
                demonstration and do not imply stock availability. Cart resets
                when the page reloads.
              </p>
            </>
          )}
          <a
            className="button full"
            href="#/merchandise"
            onClick={() => setModal(null)}
          >
            Explore the collection
            <Icon name="arrow" />
          </a>
        </Modal>
      )}
      {(modal === "login" || modal === "signup") && (
        <Modal
          title={
            modal === "login"
              ? "Welcome back, explorer."
              : "Find your place in the verse."
          }
          onClose={() => setModal(null)}
        >
          <p className="notice">
            Interface demo only. No account is created and no passwords are
            collected or stored.
          </p>
          <form
            className="demo-form"
            onSubmit={(event) => {
              event.preventDefault();
              setToast(
                "Demo complete. No account was created and no information was saved.",
              );
              setModal(null);
            }}
          >
            <label>
              Display name
              <input
                name="name"
                placeholder="Your explorer name"
                autoComplete="off"
                required
                maxLength={40}
              />
            </label>
            <label>
              Demo email
              <input
                type="email"
                name="email"
                placeholder="explorer@example.com"
                autoComplete="off"
                required
              />
            </label>
            <div className="password-demo">
              Password entry is disabled in this demonstration.
            </div>
            <button className="button full">
              Preview {modal === "login" ? "login" : "signup"}
            </button>
          </form>
          <button
            className="text-link"
            onClick={() => setModal(modal === "login" ? "signup" : "login")}
          >
            {modal === "login"
              ? "New here? Preview signup"
              : "Already exploring? Preview login"}
            <Icon name="arrow" size={16} />
          </button>
        </Modal>
      )}
    </>
  );
}
