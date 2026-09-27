import { useEffect, useRef, useState } from "react";
import {
  categoryFor,
  dateLabel,
  getStatus,
  money,
  typeLabel,
} from "../lib/catalog";
import Icon from "./Icon";

export function Image({
  src,
  alt = "",
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 92vw, 40vw",
  ...props
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed)
    return (
      <div
        className={`image-unavailable ${className}`}
        role="img"
        aria-label={alt || "Artwork not available for reuse"}
      >
        <Icon name="spark" size={36} />
        <span>{failed ? "Image unavailable" : "Artwork rights reserved"}</span>
      </div>
    );
  // Only generated variants are advertised. Original arbitrary URLs remain valid.
  const optimized = src.endsWith("-960.webp");
  return (
    <picture className={className}>
      {optimized && (
        <source
          type="image/avif"
          srcSet={`${src.replace("-960.webp", "-480.avif")} 480w, ${src.replace(".webp", ".avif")} 960w`}
          sizes={sizes}
        />
      )}
      <img
        src={src}
        srcSet={
          optimized
            ? `${src.replace("-960.webp", "-480.webp")} 480w, ${src} 960w`
            : undefined
        }
        sizes={optimized ? sizes : undefined}
        alt={alt}
        width="960"
        height="640"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onError={() => setFailed(true)}
        {...props}
      />
    </picture>
  );
}
export function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
  const returnFocus = useRef(document.activeElement);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = old;
      returnFocus.current?.focus?.();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      aria-labelledby="modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="modal-top">
        <h2 id="modal-title">{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function BookmarkButton({ item, saved, toggle }) {
  return (
    <button
      className={`icon-button save-button ${saved ? "is-saved" : ""}`}
      aria-label={`${saved ? "Remove bookmark for" : "Bookmark"} ${item.title}`}
      aria-pressed={saved}
      onClick={() => toggle(item.id)}
    >
      <Icon name="bookmark" />
    </button>
  );
}
export function Card({ item, bookmarks, toggle, addCart }) {
  const category = categoryFor(item.category);
  const status = getStatus(item);
  return (
    <article
      className={`content-card ${item.type === "event" ? "event-card" : ""} ${item.type === "profile" ? "profile-card" : ""}`}
      style={{ "--world": category?.color }}
    >
      <a
        href={`#/item/${item.id}`}
        className={`card-art ${item.imageKind === "event-logo" ? "logo-art" : ""}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        {item.image ? (
          <Image src={item.image} alt="" style={{ objectPosition: item.imageFocus || "center" }} />
        ) : (
          <div className="type-art">
            <span>{category?.symbol}</span>
            <b>
              {item.type === "event" && item.date
                ? new Date(`${item.date}T12:00:00`).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "2-digit" },
                  )
                : category?.word}
            </b>
            <small>
              {item.type === "profile"
                ? "Profile • artwork rights reserved"
                : typeLabel(item.type)}
            </small>
          </div>
        )}
        {item.imageContext ? (
          <span className="card-photo-label">
            {item.type === "merchandise"
              ? item.imageKind === "official-trailer-thumbnail"
                ? "Official trailer · not product photo"
                : "Fan cosplay · not product photo"
              : item.imageKind === "fan-cosplay"
                ? "Fan cosplay · context image"
                : "Licensed context photo"}
          </span>
        ) : item.imageKind === "official-trailer-thumbnail" ? (
          <span className="card-photo-label">Official trailer visual</span>
        ) : null}
        {item.type === "profile" && item.imageCredit && item.imageKind !== "official-trailer-thumbnail" && (
          <span className="card-photo-label">{item.imageKind === "fan-cosplay" ? "Fan cosplay" : item.imageKind === "performer-photo" ? "Performer photo" : "Licensed photo"}</span>
        )}
        {item.type === "trailer" && (
          <span className="play-dot">
            <Icon name="play" />
          </span>
        )}
      </a>
      <div className="card-body">
        <div className="card-meta">
          <span>{category?.name}</span>
          <span>{typeLabel(item.type)}</span>
          {status && <span className="status">{status}</span>}
        </div>
        <h3>
          <a href={`#/item/${item.id}`}>{item.title}</a>
        </h3>
        <p>{item.description}</p>
        <div className="card-bottom">
          <span>
            {item.type === "merchandise"
              ? money(item.price, item.currency)
              : item.type === "event" || item.type === "release"
                ? dateLabel(item.date)
                : item.franchise || item.tags?.[0]}
          </span>
          <BookmarkButton
            item={item}
            saved={bookmarks.includes(item.id)}
            toggle={toggle}
          />
        </div>
        {item.type === "merchandise" && (
          <button
            className="button small secondary full"
            onClick={() => addCart(item.id)}
          >
            <Icon name="plus" size={16} /> Add to demo cart
          </button>
        )}
      </div>
    </article>
  );
}
export function SectionHead({
  eyebrow,
  title,
  description,
  href,
  link = "View all",
}) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <a className="text-link" href={href}>
          {link}
          <Icon name="arrow" size={18} />
        </a>
      )}
    </div>
  );
}
export function Empty({
  title = "No discoveries here yet.",
  text = "Try another search or clear your filters.",
  onReset,
}) {
  return (
    <div className="empty">
      <Icon name="search" size={36} />
      <h2>{title}</h2>
      <p>{text}</p>
      {onReset && (
        <button className="button secondary" onClick={onReset}>
          Clear filters
        </button>
      )}
    </div>
  );
}
export function Sources({ item }) {
  return (
    <section className="source-box">
      <h2>Follow the source</h2>
      <p>
        Original editorial text grounded in the references below.{" "}
        {item.verifiedAt && `Checked ${dateLabel(item.verifiedAt)}.`}
      </p>
      <ul>
        {item.sources?.map((source, index) => (
          <li key={index}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.label || new URL(source.url).hostname}
              <Icon name="diagonal" size={15} />
            </a>
          </li>
        ))}
      </ul>
      {item.mediaPermissionNote && <p>{item.mediaPermissionNote}</p>}
    </section>
  );
}
