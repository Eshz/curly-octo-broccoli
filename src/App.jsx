import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const CONTACT_EMAIL = "hello@sunshinegroup.photos";
const SAVE_ALBUM_EMAIL = "eshchar.zych@gmail.com";

const ALBUMS = [
  {
    slug: "naomi-is-two",
    title: "Naomi is Two",
    subtitle: "A Special Celebration",
    label: "Sunshine Group",
    eventDate: "March 2026",
    quote: "Two years of sunshine, laughter, and love.",
    location: "Sunshine Group"
  },
  {
    slug: "spring-picnic",
    title: "Spring Picnic",
    subtitle: "Long Tables and Golden Light",
    label: "Park Gathering",
    eventDate: "Editorial Album",
    quote: "Afternoons made for grazing, games, and soft spring light.",
    location: "The Park"
  },
  {
    slug: "sunshine-atelier",
    title: "Sunshine Atelier",
    subtitle: "Family Moments in the Park",
    label: "Outdoor Session",
    eventDate: "Editorial Album",
    quote: "Candid frames, playful details, and a beautifully paced day outdoors.",
    location: "The Park"
  },
  {
    slug: "garden-stories",
    title: "Garden Stories",
    subtitle: "Celebration Under the Trees",
    label: "Weekend Event",
    eventDate: "Editorial Album",
    quote: "An album built around easy conversation, children at play, and sunlight through leaves.",
    location: "The Park"
  },
  {
    slug: "shared-moments",
    title: "Shared Moments",
    subtitle: "A New Google Photos Collection",
    label: "New Album",
    eventDate: "Editorial Album",
    quote: "A fresh set of candid frames and park-day memories, added directly from Google Photos.",
    location: "The Park"
  }
];

const stylePatterns = [
  {
    cols: "col-span-3 md:col-span-2",
    rows: "md:row-span-2",
    aspect: "aspect-[4/5] md:aspect-auto",
    filter: "grayscale contrast-125 brightness-90",
    label: "grayscale"
  },
  {
    cols: "col-span-3 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[4/5] md:aspect-auto",
    filter: "",
    label: ""
  },
  {
    cols: "col-span-3 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[4/5] md:aspect-auto",
    filter: "sepia-[0.5] contrast-90",
    label: "sepia"
  },
  {
    cols: "col-span-3 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[4/5] md:aspect-auto",
    filter: "sepia-[0.2] saturate-150 hue-rotate-[-10deg]",
    label: "warm"
  },
  {
    cols: "col-span-3 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[4/5] md:aspect-auto",
    filter: "",
    label: ""
  },
  {
    cols: "col-span-3 md:col-span-1",
    rows: "md:row-span-3",
    aspect: "aspect-[4/5] md:aspect-auto",
    filter: "grayscale contrast-125 brightness-90",
    label: "grayscale"
  },
  {
    cols: "col-span-3 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[4/5] md:aspect-auto",
    filter: "hue-rotate-[10deg] saturate-110 brightness-105",
    label: "cool"
  },
  {
    cols: "col-span-3 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[4/5] md:aspect-auto",
    filter: "saturate-150 contrast-110",
    label: "vibrant"
  }
];

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M15 3h6v6" />
      <path d="m21 3-7 7" />
      <path d="m3 21 7-7" />
      <path d="M9 21H3v-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-10 w-10 transition-transform group-hover:-translate-x-1">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-10 w-10 transition-transform group-hover:translate-x-1">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.15,
        ...options
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, options]);

  return [ref, isVisible];
}

function ScrollReveal({ children, className = "", delay = 0 }) {
  const [ref, isVisible] = useInView();

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      ].join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function RevealImage({ src, alt, wrapperClassName = "", className = "", referrerPolicy = "no-referrer" }) {
  const [ref, isVisible] = useInView();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div ref={ref} className={["relative overflow-hidden bg-[#e5e2dd]", wrapperClassName].join(" ")}>
      <div
        className={[
          "absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.42),rgba(229,226,221,0.88),rgba(255,255,255,0.42))] bg-[length:200%_100%] transition-opacity duration-500",
          loaded ? "opacity-0" : "animate-pulse opacity-100"
        ].join(" ")}
      />
      {isVisible && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy={referrerPolicy}
          onLoad={() => setLoaded(true)}
          className={[
            "h-full w-full object-cover transition-all duration-1000 ease-out",
            loaded ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
            className
          ].join(" ")}
        />
      )}
    </div>
  );
}

function assignPhotoStyle(index) {
  return stylePatterns[index % stylePatterns.length];
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getRoute() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/contact") return { page: "contact" };
  if (pathname === "/demo") return { page: "demo" };
  if (pathname.startsWith("/album/")) return { page: "album", slug: pathname.replace("/album/", "") };

  return { page: "home" };
}

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

async function fetchAlbumPayload({ slug, url }) {
  const params = new URLSearchParams();

  if (slug) params.set("slug", slug);
  if (url) params.set("url", url);

  const response = await fetch(`/api/album?${params.toString()}`);
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("The album service returned an unexpected response.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.details || data.error || "Failed to load album");
  }

  if (!data.album || !Array.isArray(data.photos)) {
    throw new Error("The album response was incomplete.");
  }

  return data;
}

function buildAlbumData(album, photos) {
  return {
    album,
    photos: photos.map((url, index) => ({
      url,
      alt: `${album.title} - ${index + 1}`,
      style: assignPhotoStyle(index)
    }))
  };
}

function buildCustomAlbumFromPayload(data, url, sequence) {
  const fallbackTitle = data.album.title || `Custom Album ${sequence}`;
  const slugBase = slugify(fallbackTitle) || `custom-album-${sequence}`;
  const slug = `${slugBase}-${Date.now()}`;
  const album = {
    ...data.album,
    slug,
    title: fallbackTitle,
    subtitle: data.album.subtitle || "Generated from Google Photos",
    label: data.album.label || "Added by Link",
    eventDate: data.album.eventDate || "Temporary Preview",
    quote: data.album.quote || "Generated instantly from a Google Photos album link.",
    location: data.album.location || "Google Photos",
    sourceUrl: url
  };

  return buildAlbumData(album, data.photos);
}

function getSaveAlbumMailto(album) {
  const subject = encodeURIComponent(`Save my Google Photos album - ${album.title}`);
  const body = encodeURIComponent(
    [
      "Hi,",
      "",
      "I'd like to save this Google Photos album as a permanent Park Lens album.",
      "",
      `Album title: ${album.title}`,
      `Google Photos link: ${album.sourceUrl || ""}`,
      "",
      "Please let me know the next steps."
    ].join("\n")
  );

  return `mailto:${SAVE_ALBUM_EMAIL}?subject=${subject}&body=${body}`;
}

function Header({ compact = false, onAddAlbum, showDemoLink = true }) {
  return (
    <nav className="pointer-events-none fixed left-0 top-0 z-50 flex w-full items-center justify-between px-5 py-6 md:px-12 md:py-8">
      <button
        type="button"
        className="pointer-events-auto font-serif text-2xl font-light tracking-tight md:text-3xl"
        onClick={() => navigate("/")}
      >
        Park <span className="italic">Lens</span>
      </button>
      <div className="pointer-events-auto flex items-center gap-4 md:gap-8">
        {!compact && (
          <div className="hidden items-center space-x-2 opacity-40 md:flex">
            <CameraIcon />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Digital Albums</span>
          </div>
        )}
        {showDemoLink && (
          <button
            type="button"
            className="rounded-full border border-charcoal/10 bg-white/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-70 shadow-[0_10px_30px_rgba(26,26,26,0.06)] transition hover:-translate-y-0.5 hover:opacity-100"
            onClick={() => navigate("/demo")}
          >
            Demo
          </button>
        )}
        {onAddAlbum && (
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-charcoal/10 bg-charcoal px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-parchment shadow-[0_12px_36px_rgba(26,26,26,0.16)] transition hover:-translate-y-0.5 hover:bg-charcoal/92"
            onClick={onAddAlbum}
          >
            <PlusIcon />
            Add Album
          </button>
        )}
        <button
          type="button"
          className="rounded-full px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-100 transition hover:opacity-100"
          onClick={() => navigate("/")}
        >
          Portfolio
        </button>
        <button
          type="button"
          className="rounded-full px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-60 transition hover:opacity-100"
          onClick={() => navigate("/contact")}
        >
          Contact
        </button>
      </div>
    </nav>
  );
}

function AddAlbumModal({ open, onClose, onSubmit, title, description, submitLabel, error, busy }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!open) setValue("");
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] flex items-center justify-center bg-charcoal/30 px-5 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-xl rounded-[2rem] border border-charcoal/10 bg-parchment p-6 shadow-luxe md:p-8"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Google Photos Link</p>
              <h2 className="mt-3 font-serif text-4xl">{title}</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-charcoal/70">{description}</p>
            </div>
            <button type="button" className="p-2 transition-opacity hover:opacity-50" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <label className="mt-8 block">
            <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">Album Link</span>
            <input
              className="mt-3 w-full rounded-2xl border border-charcoal/10 bg-white/60 px-4 py-4 outline-none transition focus:border-charcoal/30"
              placeholder="https://photos.app.goo.gl/..."
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </label>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-end">
            <button
              type="button"
              className="rounded-full border border-charcoal/10 bg-white/60 px-6 py-3 text-[11px] uppercase tracking-[0.28em] shadow-[0_12px_32px_rgba(26,26,26,0.05)] transition hover:-translate-y-0.5 hover:bg-white/85"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-full bg-charcoal px-6 py-3 text-[11px] uppercase tracking-[0.28em] text-parchment shadow-[0_14px_38px_rgba(26,26,26,0.16)] transition hover:-translate-y-0.5 hover:bg-charcoal/92 disabled:opacity-50"
              disabled={busy || !value.trim()}
              onClick={() => onSubmit(value.trim())}
            >
              {busy ? "Preparing..." : submitLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Lightbox({ album, photos, currentIndex, onClose, onNavigate }) {
  const [touchStart, setTouchStart] = useState(null);
  const photo = photos[currentIndex];

  useEffect(() => {
    function handleKeydown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate(1);
      if (event.key === "ArrowLeft") onNavigate(-1);
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose, onNavigate]);

  if (!photo) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-parchment text-charcoal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between px-5 py-5 md:p-10">
        <div className="flex items-center space-x-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            {currentIndex + 1} / {photos.length}
          </span>
          <div className="h-4 w-px bg-charcoal/20" />
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">
            {photo.style.label || "editorial"} edit
          </span>
        </div>
        <button className="p-2 transition-opacity hover:opacity-50" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-4 md:p-12">
        <motion.img
          key={photo.url}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onTouchStart={(event) => setTouchStart(event.changedTouches[0].clientX)}
          onTouchEnd={(event) => {
            if (touchStart === null) return;
            const delta = event.changedTouches[0].clientX - touchStart;
            if (Math.abs(delta) > 50) onNavigate(delta > 0 ? -1 : 1);
            setTouchStart(null);
          }}
          className={`max-h-full max-w-full object-contain shadow-2xl ${photo.style.filter}`.trim()}
          src={photo.url}
          alt={photo.alt}
          referrerPolicy="no-referrer"
        />
        <button
          className="group absolute left-1 top-1/2 rounded-full p-3 transition-all hover:bg-white/10 md:left-10 md:p-4"
          onClick={() => onNavigate(-1)}
        >
          <ChevronLeftIcon />
        </button>
        <button
          className="group absolute right-1 top-1/2 rounded-full p-3 transition-all hover:bg-white/10 md:right-10 md:p-4"
          onClick={() => onNavigate(1)}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <motion.div
        className="px-5 py-8 text-center md:p-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <p className="font-serif text-xl italic opacity-80">
          {album.title}, {album.location}
        </p>
        <p className="mt-2 text-[9px] uppercase tracking-[0.3em] opacity-40">Professional Curation</p>
      </motion.div>
    </motion.div>
  );
}

function HomePage({ albums, albumPreviews, onAddAlbum, onSelectAlbum }) {
  return (
    <>
      <Header onAddAlbum={onAddAlbum} />
      <main className="min-h-screen bg-parchment px-5 pb-24 pt-28 text-charcoal md:px-12 md:pb-32 md:pt-32">
        <section className="mx-auto max-w-6xl">
          <header className="mb-16 md:mb-20">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="mb-4 text-[11px] uppercase tracking-[0.4em] opacity-60">Portfolio</p>
              <h1 className="font-serif text-5xl font-light md:text-7xl">
                Selected <span className="italic">Works</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-charcoal/70 md:text-base">
                Capturing the essence of moments in the park. From intimate birthday celebrations to
                golden-hour gatherings, each album is curated as a story of light, people, and place.
              </p>
            </motion.div>
          </header>

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {albums.map((album, index) => {
              const preview = albumPreviews[album.slug];
              return (
                <ScrollReveal key={album.slug} delay={index * 60}>
                  <button
                    type="button"
                    className="group h-full cursor-pointer rounded-[1.75rem] border border-charcoal/10 bg-white/45 p-3 text-left shadow-[0_22px_60px_rgba(26,26,26,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(26,26,26,0.1)]"
                    onClick={() => onSelectAlbum(album.slug)}
                  >
                    <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-[1.2rem]">
                      {preview?.cover ? (
                        <RevealImage
                          src={preview.cover}
                          alt={album.title}
                          wrapperClassName="h-full w-full"
                          className="group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#e5e2dd]/50">
                          <div className="h-12 w-12 animate-pulse rounded-full border border-charcoal/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/8" />
                      <div className="absolute bottom-4 right-4 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/85 text-charcoal shadow-xl backdrop-blur">
                          <ArrowRightIcon />
                        </div>
                      </div>
                    </div>
                    <div className="px-1 pb-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="mb-2 text-[9px] uppercase tracking-[0.32em] text-charcoal/45">{album.label}</p>
                          <h2 className="font-serif text-[1.7rem] leading-[0.95] md:text-[1.95rem]">{album.title}</h2>
                        </div>
                        <span className="pt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-charcoal/40">
                          {album.eventDate}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[9px] uppercase tracking-[0.26em] text-charcoal/45">
                        <span>{preview?.photoCount ? `${preview.photoCount} Frames` : "Curated Album"}</span>
                        <span>{album.location}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-charcoal/68">{album.quote}</p>
                    </div>
                  </button>
                </ScrollReveal>
              );
            })}
          </section>

          <section className="border-t border-charcoal/10 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-4xl font-light md:text-5xl">
                Want to capture your <span className="italic">own</span> story?
              </h2>
              <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-charcoal/70">
                I photograph birthdays, family gatherings, and outdoor celebrations in the park, then
                shape them into a polished digital album with an editorial feel.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                <button
                  type="button"
                  className="rounded-full bg-charcoal px-8 py-3 text-[11px] uppercase tracking-[0.28em] text-white shadow-[0_14px_38px_rgba(26,26,26,0.16)] transition hover:-translate-y-0.5 hover:bg-charcoal/92"
                  onClick={() => navigate("/contact")}
                >
                  Book a Session
                </button>
                <button
                  type="button"
                  className="rounded-full border border-charcoal/10 bg-white/60 px-8 py-3 text-[11px] uppercase tracking-[0.28em] shadow-[0_12px_32px_rgba(26,26,26,0.05)] transition hover:-translate-y-0.5 hover:bg-white/85"
                  onClick={() => navigate("/demo")}
                >
                  Try the Demo
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

function AlbumPage({ album, photos, status, error, onOpen, footerCta }) {
  return (
    <>
      <Header />
      <header className="relative flex h-[85vh] flex-col items-center justify-center overflow-hidden px-5 text-center md:px-12">
        <motion.div
          className="z-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-6 text-[11px] uppercase tracking-[0.4em] opacity-60">{album.subtitle}</p>
          <h1 className="font-serif text-6xl font-light leading-tight md:text-8xl lg:text-9xl">
            {album.title.split(" ").slice(0, -1).join(" ")}
            <br />
            <span className="italic">{album.title.split(" ").slice(-1)}</span>
          </h1>
          <div className="mt-8 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-12 md:space-y-0">
            <div className="flex items-center space-x-2 opacity-70">
              <CalendarIcon />
              <span className="text-xs uppercase tracking-wider">{album.eventDate}</span>
            </div>
            <div className="flex items-center space-x-2 opacity-70">
              <MapPinIcon />
              <span className="text-xs uppercase tracking-wider">{album.location}</span>
            </div>
          </div>
          {footerCta && (
            <div className="mt-10">
              <a
                href={footerCta.href}
                className="rounded-full bg-charcoal px-8 py-3 text-[11px] uppercase tracking-[0.28em] text-parchment shadow-[0_14px_38px_rgba(26,26,26,0.16)] transition hover:-translate-y-0.5 hover:bg-charcoal/92"
              >
                {footerCta.label}
              </a>
            </div>
          )}
        </motion.div>
      </header>

      <main className="px-2 pb-24 md:px-12">
        {status === "loading" && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-14 w-14 animate-spin rounded-full border-2 border-charcoal/15 border-t-charcoal" />
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-charcoal/10 bg-white/40 p-8 text-center shadow-luxe">
            <p className="font-serif text-3xl">The album couldn&apos;t be prepared.</p>
            <p className="mt-3 text-charcoal/70">{error}</p>
          </div>
        )}

        {status === "ready" && (
          <div className="grid auto-rows-min grid-cols-6 grid-flow-dense gap-3 md:grid-cols-3 md:auto-rows-[82px] md:gap-4 lg:grid-cols-4 lg:auto-rows-[90px] xl:grid-cols-6">
            {photos.map((photo, index) => (
              <button
                key={`${photo.url}-${index}`}
                type="button"
                className={[
                  "group relative block w-full cursor-pointer overflow-hidden rounded-[1.4rem] border border-charcoal/8 bg-[#e5e2dd] text-left align-top shadow-[0_18px_45px_rgba(26,26,26,0.05)] transition-transform duration-500 hover:-translate-y-1",
                  photo.style.cols,
                  photo.style.rows,
                  photo.style.aspect
                ].join(" ")}
                onClick={() => onOpen(index)}
              >
                <RevealImage
                  src={photo.url}
                  alt={photo.alt}
                  wrapperClassName="h-full w-full"
                  className={["group-hover:scale-105", photo.style.filter].join(" ")}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/18">
                  <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/12 text-white backdrop-blur-md">
                      <ExpandIcon />
                    </div>
                  </div>
                </div>
                {photo.style.label && (
                  <div className="absolute left-4 top-4 opacity-0 transition-opacity duration-500 group-hover:opacity-50">
                    <span className="rounded-full border border-white/30 bg-black/10 px-2 py-1 text-[8px] uppercase tracking-widest text-white backdrop-blur-md">
                      {photo.style.label}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-charcoal/10 px-5 py-16 text-center md:px-12 md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="mb-10 font-serif text-3xl italic leading-relaxed">&quot;{album.quote}&quot;</p>
          <div className="mx-auto mb-10 h-px w-16 bg-charcoal opacity-20" />
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40">
            {album.title} • {album.location}
          </p>
          {footerCta && (
            <div className="mt-10">
              <a
                href={footerCta.href}
                className="rounded-full border border-charcoal/10 bg-white/60 px-8 py-3 text-[11px] uppercase tracking-[0.28em] shadow-[0_12px_32px_rgba(26,26,26,0.05)] transition hover:-translate-y-0.5 hover:bg-white/85"
              >
                {footerCta.label}
              </a>
            </div>
          )}
        </div>
      </footer>
    </>
  );
}

function DemoPage({ demoAlbum, status, error, onOpen, onStart }) {
  const footerCta = demoAlbum
    ? {
        label: "Save This Album",
        href: getSaveAlbumMailto(demoAlbum.album)
      }
    : null;

  if (!demoAlbum && status !== "loading") {
    return (
      <>
        <Header compact showDemoLink={false} />
        <main className="min-h-screen bg-parchment px-5 pb-24 pt-28 text-charcoal md:px-12 md:pt-32">
          <section className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">
            <motion.div
              className="w-full rounded-[2.25rem] border border-charcoal/10 bg-white/50 p-8 text-center shadow-luxe md:p-14"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[11px] uppercase tracking-[0.4em] opacity-50">One-Time Demo</p>
              <h1 className="mt-5 font-serif text-5xl font-light md:text-7xl">
                Turn a Google Photos link
                <br />
                into an <span className="italic">album</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-charcoal/70">
                Paste a shared Google Photos album link and I&apos;ll generate a one-time editorial album
                preview in this same experience. Refresh the page and it resets back to empty.
              </p>
              {error && <p className="mx-auto mt-6 max-w-xl text-sm text-red-700">{error}</p>}
              <button
                type="button"
                className="mt-10 rounded-full bg-charcoal px-10 py-4 font-serif text-xl text-white transition hover:bg-charcoal/90"
                onClick={onStart}
              >
                Add Google Photos Link
              </button>
            </motion.div>
          </section>
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-parchment text-charcoal selection:bg-charcoal selection:text-white">
      <AlbumPage
        album={demoAlbum?.album || { title: "Demo Album", subtitle: "One-Time Preview", eventDate: "Temporary", location: "Google Photos", quote: "Generated from a Google Photos link." }}
        photos={demoAlbum?.photos || []}
        status={status}
        error={error}
        onOpen={onOpen}
        footerCta={footerCta}
      />
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    eventType: "",
    eventDate: "",
    message: ""
  });

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Photography Inquiry from ${form.name || "New Client"}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name || ""}`,
        `Email: ${form.email || ""}`,
        `Event Type: ${form.eventType || ""}`,
        `Preferred Date: ${form.eventDate || ""}`,
        "",
        form.message || "I would love to book a park event photography session and receive a digital album."
      ].join("\n")
    );

    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }, [form]);

  return (
    <>
      <Header compact />
      <main className="min-h-screen bg-parchment px-5 pb-16 pt-28 text-charcoal md:px-12 md:pb-24 md:pt-32">
        <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.4em] opacity-60">Book an Event</p>
            <h1 className="font-serif text-5xl font-light leading-none md:text-7xl">
              Let&apos;s create
              <br />
              <span className="italic">your album</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-charcoal/70 md:text-lg">
              If you&apos;re planning a birthday, picnic, family gathering, or any celebration in the
              park, I can photograph the day and deliver it as a polished digital album.
            </p>
            <div className="rounded-[2rem] border border-charcoal/10 bg-white/40 p-6 shadow-luxe md:p-8">
              <p className="text-[10px] uppercase tracking-[0.35em] opacity-50">What&apos;s Included</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-charcoal/75">
                <li>Park event photography with candid and editorial coverage.</li>
                <li>Curated online album with high-resolution images.</li>
                <li>Visual direction that feels warm, elevated, and personal.</li>
              </ul>
            </div>
          </div>

          <form className="rounded-[2rem] border border-charcoal/10 bg-white/50 p-6 shadow-luxe md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">Name</span>
                <input
                  className="mt-3 w-full rounded-2xl border border-charcoal/10 bg-parchment px-4 py-3 outline-none transition focus:border-charcoal/30"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">Email</span>
                <input
                  className="mt-3 w-full rounded-2xl border border-charcoal/10 bg-parchment px-4 py-3 outline-none transition focus:border-charcoal/30"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">Event Type</span>
                <input
                  className="mt-3 w-full rounded-2xl border border-charcoal/10 bg-parchment px-4 py-3 outline-none transition focus:border-charcoal/30"
                  placeholder="Birthday, picnic, family day..."
                  value={form.eventType}
                  onChange={(event) => setForm((current) => ({ ...current, eventType: event.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">Preferred Date</span>
                <input
                  className="mt-3 w-full rounded-2xl border border-charcoal/10 bg-parchment px-4 py-3 outline-none transition focus:border-charcoal/30"
                  value={form.eventDate}
                  onChange={(event) => setForm((current) => ({ ...current, eventDate: event.target.value }))}
                />
              </label>
            </div>
            <label className="mt-5 block">
              <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">Tell me about the event</span>
              <textarea
                className="mt-3 min-h-[180px] w-full rounded-[1.5rem] border border-charcoal/10 bg-parchment px-4 py-4 outline-none transition focus:border-charcoal/30"
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              />
            </label>
            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Direct Contact</p>
                <p className="mt-2 font-serif text-2xl">{CONTACT_EMAIL}</p>
              </div>
              <a
                href={mailtoHref}
                className="rounded-full bg-charcoal px-6 py-3 text-center text-[11px] uppercase tracking-[0.28em] text-parchment shadow-[0_14px_38px_rgba(26,26,26,0.16)] transition hover:-translate-y-0.5 hover:bg-charcoal/92"
              >
                Send Inquiry
              </a>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => getRoute());
  const [albumData, setAlbumData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [albumPreviews, setAlbumPreviews] = useState({});
  const [customAlbums, setCustomAlbums] = useState([]);
  const [customAlbumMap, setCustomAlbumMap] = useState({});
  const [customSequence, setCustomSequence] = useState(1);
  const [demoAlbum, setDemoAlbum] = useState(null);
  const [demoStatus, setDemoStatus] = useState("idle");
  const [demoError, setDemoError] = useState("");
  const [modalState, setModalState] = useState({ open: false, mode: "home", busy: false, error: "" });

  const albums = useMemo(() => [...customAlbums, ...ALBUMS], [customAlbums]);

  useEffect(() => {
    function onPopState() {
      setRoute(getRoute());
      setActiveIndex(null);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (route.page === "contact") {
      setStatus("idle");
      setError("");
      return;
    }

    if (route.page === "home") {
      const missing = ALBUMS.filter((album) => !albumPreviews[album.slug]);

      if (missing.length === 0) return;

      Promise.all(
        missing.map(async (album) => {
          try {
            const data = await fetchAlbumPayload({ slug: album.slug });
            return [album.slug, data.album];
          } catch {
            return null;
          }
        })
      )
        .then((entries) => {
          const validEntries = entries.filter(Boolean);
          if (validEntries.length === 0) return;

          setAlbumPreviews((current) => ({
            ...current,
            ...Object.fromEntries(validEntries)
          }));
        })
        .catch(() => {});

      return;
    }

    if (route.page === "album") {
      if (customAlbumMap[route.slug]) {
        setAlbumData(customAlbumMap[route.slug]);
        setStatus("ready");
        setError("");
        return;
      }

      async function loadAlbum() {
        setStatus("loading");
        setError("");

        try {
          const data = await fetchAlbumPayload({ slug: route.slug });
          setAlbumData(buildAlbumData(data.album, data.photos));
          setStatus("ready");
        } catch (requestError) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load album");
          setStatus("error");
        }
      }

      loadAlbum();
    }
  }, [route, albumPreviews, customAlbumMap]);

  async function handleAddAlbum(url, mode) {
    setModalState((current) => ({ ...current, busy: true, error: "" }));

    try {
      const data = await fetchAlbumPayload({ url });
      const nextSequence = customSequence;
      const customAlbumData = buildCustomAlbumFromPayload(data, url, nextSequence);

      if (mode === "demo") {
        setDemoAlbum(customAlbumData);
        setDemoStatus("ready");
        setDemoError("");
        navigate("/demo");
      } else {
        setCustomSequence((current) => current + 1);
        setCustomAlbums((current) => [customAlbumData.album, ...current]);
        setCustomAlbumMap((current) => ({ ...current, [customAlbumData.album.slug]: customAlbumData }));
        setAlbumPreviews((current) => ({ ...current, [customAlbumData.album.slug]: customAlbumData.album }));
        navigate(`/album/${customAlbumData.album.slug}`);
      }

      setModalState({ open: false, mode: "home", busy: false, error: "" });
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to load album";
      setModalState((current) => ({ ...current, busy: false, error: message }));

      if (mode === "demo") {
        setDemoStatus("idle");
        setDemoError(message);
      }
    }
  }

  function openModal(mode) {
    setModalState({ open: true, mode, busy: false, error: "" });
  }

  function moveLightbox(direction) {
    const photos = route.page === "demo" ? demoAlbum?.photos : albumData?.photos;

    setActiveIndex((current) => {
      if (current === null || !photos?.length) return current;
      return (current + direction + photos.length) % photos.length;
    });
  }

  const album = albumData?.album || albums.find((entry) => entry.slug === route.slug) || ALBUMS[0];
  const photos = albumData?.photos || [];
  const lightboxAlbum = route.page === "demo" ? demoAlbum?.album : album;
  const lightboxPhotos = route.page === "demo" ? demoAlbum?.photos || [] : photos;

  return (
    <>
      {route.page === "contact" && <ContactPage />}
      {route.page === "home" && (
        <HomePage
          albums={albums}
          albumPreviews={albumPreviews}
          onAddAlbum={() => openModal("home")}
          onSelectAlbum={(slug) => navigate(`/album/${slug}`)}
        />
      )}
      {route.page === "demo" && (
        <DemoPage
          demoAlbum={demoAlbum}
          status={demoStatus}
          error={demoError}
          onOpen={setActiveIndex}
          onStart={() => openModal("demo")}
        />
      )}
      {route.page === "album" && (
        <div className="min-h-screen bg-parchment text-charcoal selection:bg-charcoal selection:text-white">
          <AlbumPage album={album} photos={photos} status={status} error={error} onOpen={setActiveIndex} />
        </div>
      )}

      <AnimatePresence>
        {activeIndex !== null && lightboxAlbum && (
          <Lightbox
            album={lightboxAlbum}
            photos={lightboxPhotos}
            currentIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNavigate={moveLightbox}
          />
        )}
      </AnimatePresence>

      <AddAlbumModal
        open={modalState.open}
        onClose={() => setModalState({ open: false, mode: "home", busy: false, error: "" })}
        onSubmit={(url) => handleAddAlbum(url, modalState.mode)}
        title={modalState.mode === "demo" ? "Generate a Demo Album" : "Add a New Album"}
        description={
          modalState.mode === "demo"
            ? "Paste a shared Google Photos link to generate a one-time album preview. Refreshing the page clears it."
            : "Paste a shared Google Photos album link and it will appear in your portfolio for this session."
        }
        submitLabel={modalState.mode === "demo" ? "Generate Album" : "Add Album"}
        error={modalState.error}
        busy={modalState.busy}
      />
    </>
  );
}
