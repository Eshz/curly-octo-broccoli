import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const APP_NAME = "Real Moments";

// ─────────────────────────────────────────────────────────────
// Style patterns for the masonry grid
// ─────────────────────────────────────────────────────────────
const stylePatterns = [
  { cols: "col-span-4 md:col-span-2", rows: "",          aspect: "aspect-[16/9]",    filter: "grayscale contrast-125 brightness-90" },
  { cols: "col-span-2 md:col-span-1", rows: "",          aspect: "aspect-[3/4]",     filter: "" },
  { cols: "col-span-2 md:col-span-1", rows: "",          aspect: "aspect-square",    filter: "sepia-[0.5] contrast-90" },
  { cols: "col-span-2 md:col-span-1", rows: "",          aspect: "aspect-[3/4]",     filter: "sepia-[0.2] saturate-150 hue-rotate-[-10deg]" },
  { cols: "col-span-2 md:col-span-1", rows: "",          aspect: "aspect-[3/4]",     filter: "" },
  { cols: "col-span-2 md:col-span-1", rows: "row-span-2", aspect: "aspect-[3/5]",   filter: "grayscale contrast-125 brightness-90" },
  { cols: "col-span-2 md:col-span-1", rows: "",          aspect: "aspect-[3/4]",     filter: "hue-rotate-[10deg] saturate-110 brightness-105" },
  { cols: "col-span-4 md:col-span-2", rows: "",          aspect: "aspect-[16/9]",    filter: "saturate-150 contrast-110" },
];

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────
function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M15 3h6v6" /><path d="m21 3-7 7" /><path d="m3 21 7-7" /><path d="M9 21H3v-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
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

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M12 5v14" /><path d="M5 12h14" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[18px] w-[18px]">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo
// ─────────────────────────────────────────────────────────────
function Logo({ className = "" }) {
  return (
    <button type="button" onClick={() => navigate("/")}
      className={["font-sans text-[11px] font-medium uppercase tracking-[0.35em] text-charcoal transition-opacity hover:opacity-60", className].join(" ")}>
      {APP_NAME}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────
function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getRoute() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname.startsWith("/album/")) return { page: "album", slug: pathname.replace("/album/", "") };
  if (pathname === "/admin") return { page: "admin" };
  return { page: "home" };
}

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

async function readApiJson(res) {
  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Server returned ${res.status} ${res.statusText || "non-JSON response"}. Check that the API route is deployed.`);
  }

  if (!res.ok || data.error) {
    throw new Error(data.details || data.error || `Request failed with ${res.status}`);
  }

  return data;
}

// ─────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: "0px 0px 400px 0px", threshold: 0, ...options }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, options]);
  return [ref, isVisible];
}

// ─────────────────────────────────────────────────────────────
// RevealImage
// ─────────────────────────────────────────────────────────────
function RevealImage({ src, alt, wrapperClassName = "", className = "", onImageLoad }) {
  const [ref, isVisible] = useInView();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(false); }, [src]);
  const ready = isVisible && loaded;
  return (
    <div ref={ref} className={["relative overflow-hidden", wrapperClassName].join(" ")}>
      {isVisible && (
        <img src={src} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer"
          onLoad={(e) => { setLoaded(true); onImageLoad?.(e.currentTarget); }}
          className={["w-full h-full object-cover transition-[opacity,transform] duration-700 ease-out",
            ready ? "scale-100 opacity-100" : "scale-95 opacity-0", className].join(" ")}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────────────────────
function Lightbox({ album, photos, currentIndex, onClose, onNavigate }) {
  const [touchStart, setTouchStart] = useState(null);
  const [videoMode, setVideoMode] = useState(false);
  const photo = photos[currentIndex];

  useEffect(() => { setVideoMode(false); }, [currentIndex]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate]);

  if (!photo) return null;

  const videoSrc = `/api/video-proxy?url=${encodeURIComponent(photo.url)}`;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-parchment text-charcoal"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between px-5 py-5 md:p-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{currentIndex + 1} / {photos.length}</span>
        <button className="p-2 transition-opacity hover:opacity-50" onClick={onClose}><CloseIcon /></button>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-4 md:p-12">
        {videoMode ? (
          <motion.video
            key={`${photo.url}-video`}
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            src={videoSrc}
            controls autoPlay
            className="max-h-full max-w-full object-contain shadow-2xl"
          />
        ) : photo.isVideo ? (
          <button
            type="button"
            className="group relative flex max-h-full max-w-full cursor-pointer items-center justify-center"
            onClick={() => setVideoMode(true)}
            onTouchStart={(e) => setTouchStart(e.changedTouches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const delta = e.changedTouches[0].clientX - touchStart;
              if (Math.abs(delta) > 50) onNavigate(delta > 0 ? -1 : 1);
              else setVideoMode(true);
              setTouchStart(null);
            }}
          >
            <motion.img
              key={photo.url}
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3, ease: "easeOut" }}
              className={`max-h-full max-w-full object-contain shadow-2xl ${photo.style.filter}`.trim()}
              src={photo.url} alt={photo.alt} referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-white/20 text-white backdrop-blur-md">
                <PlayIcon />
              </div>
            </div>
          </button>
        ) : (
          <motion.img
            key={photo.url}
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3, ease: "easeOut" }}
            onTouchStart={(e) => setTouchStart(e.changedTouches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const delta = e.changedTouches[0].clientX - touchStart;
              if (Math.abs(delta) > 50) onNavigate(delta > 0 ? -1 : 1);
              setTouchStart(null);
            }}
            className={`max-h-full max-w-full object-contain shadow-2xl ${photo.style.filter}`.trim()}
            src={photo.url} alt={photo.alt} referrerPolicy="no-referrer"
          />
        )}
        <button className="group absolute left-1 top-1/2 rounded-full p-3 transition-all hover:bg-white/10 md:left-10 md:p-4" onClick={() => onNavigate(-1)}>
          <ChevronLeftIcon />
        </button>
        <button className="group absolute right-1 top-1/2 rounded-full p-3 transition-all hover:bg-white/10 md:right-10 md:p-4" onClick={() => onNavigate(1)}>
          <ChevronRightIcon />
        </button>
      </div>
      <div className="px-5 py-8 text-center md:p-12">
        <p className="font-serif text-xl italic opacity-80">{album.title}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Album Page (public, shareable)
// ─────────────────────────────────────────────────────────────
function AlbumPage() {
  const slug = window.location.pathname.replace("/album/", "");
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const title = album?.title || "Album";
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/album?slug=${encodeURIComponent(slug)}`);
        const data = await readApiJson(res);
        setAlbum(data.album);
        setPhotos(
          data.photos.map((photo, i) => ({
            url: photo.url,
            isVideo: photo.isVideo || false,
            alt: `${data.album.title} — ${i + 1}`,
            style: stylePatterns[i % stylePatterns.length],
          }))
        );
        setStatus("ready");
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    }
    load();
  }, [slug]);

  function moveIndex(dir) {
    setActiveIndex((c) => (c === null ? null : (c + dir + photos.length) % photos.length));
  }

  return (
    <div className="min-h-screen bg-parchment text-charcoal selection:bg-charcoal selection:text-white">
      {/* Minimal header — brand + share */}
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-5 py-6 md:px-12 md:py-8">
        <Logo />
        {status === "ready" && album && (
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-charcoal/50 transition-all hover:text-charcoal"
            title="Share album"
          >
            {copied ? (
              <>
                <CheckIcon />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <ShareIcon />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        )}
      </nav>

      {/* Hero */}
      <header className="flex h-[85vh] flex-col items-center justify-center px-5 text-center md:px-12">
        {status === "loading" && (
          <div className="h-14 w-14 animate-spin rounded-full border-2 border-charcoal/15 border-t-charcoal" />
        )}
        {(status === "ready" || status === "error") && album && (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="mb-6 text-[11px] uppercase tracking-[0.4em] opacity-60">
              {album.subtitle || "Here are your moments"}
            </p>
            <h1 className="font-serif text-4xl font-light leading-tight md:text-6xl lg:text-7xl">
              {album.title.split(" ").map((word, i) => (
                <span key={i} className={i % 2 === 1 ? "italic" : ""}>{i > 0 ? " " : ""}{word}</span>
              ))}
            </h1>
            <div className="mt-8 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-12 md:space-y-0">
              {album.eventDate && (
                <div className="flex items-center space-x-2 opacity-70">
                  <CalendarIcon />
                  <span className="text-xs uppercase tracking-wider">{album.eventDate}</span>
                </div>
              )}
              {album.photoCount > 0 && (
                <div className="flex items-center space-x-2 opacity-70">
                  <CameraIcon />
                  <span className="text-xs uppercase tracking-wider">{album.photoCount} photos</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* Photo grid */}
      <main className="px-2 pb-24 md:px-12">
        {status === "error" && (
          <div className="mx-auto max-w-2xl border border-charcoal/10 bg-white/40 p-8 text-center">
            <p className="font-serif text-3xl">The album couldn&apos;t be prepared.</p>
            <p className="mt-3 text-charcoal/70">{error}</p>
          </div>
        )}
        {status === "ready" && (
          <div className="grid auto-rows-min grid-flow-dense grid-cols-6 gap-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-6">
            {photos.map((photo, index) => (
              <button
                key={`${photo.url}-${index}`}
                type="button"
                className={["group relative cursor-pointer overflow-hidden bg-parchment",
                  photo.style.cols, photo.style.rows, photo.style.aspect].join(" ")}
                onClick={() => setActiveIndex(index)}
              >
                <RevealImage src={photo.url} alt={photo.alt} wrapperClassName="h-full w-full"
                  className={["group-hover:scale-110", photo.style.filter].join(" ")} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/20">
                  <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/12 text-white backdrop-blur-md">
                      <ExpandIcon />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      {status === "ready" && album && (
        <footer className="border-t border-charcoal/10 px-5 py-16 text-center md:px-12 md:py-24">
          {album.quote && <p className="mb-10 font-serif text-3xl italic leading-relaxed">&quot;{album.quote}&quot;</p>}
          <div className="mx-auto mb-6 h-px w-16 bg-charcoal opacity-20" />
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40">{album.title}</p>
        </footer>
      )}

      <AnimatePresence>
        {activeIndex !== null && album && (
          <Lightbox album={album} photos={photos} currentIndex={activeIndex}
            onClose={() => setActiveIndex(null)} onNavigate={moveIndex} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Landing Page
// ─────────────────────────────────────────────────────────────
const MAILTO_SUBJECT = encodeURIComponent("Album Request");
const MAILTO_BODY = encodeURIComponent(
  "Hi,\n\nI'd like to get an album for this link:\n[PASTE YOUR GOOGLE PHOTOS ALBUM LINK HERE]\n\nThank you!"
);
const MAILTO = `mailto:eshchar.zych@gmail.com?subject=${MAILTO_SUBJECT}&body=${MAILTO_BODY}`;

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-parchment px-6 text-charcoal">
      <motion.div
        className="w-full max-w-lg text-center"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
      >
        <p className="mb-20 font-sans text-[11px] font-medium uppercase tracking-[0.35em] opacity-40">{APP_NAME}</p>

        {/* Primary path */}
        <p className="font-serif text-3xl font-light leading-relaxed md:text-4xl">
          Want your Google Photos<br />in a designed album?
        </p>
        <p className="mt-5 text-sm leading-relaxed text-charcoal/50">
          Send your shared album link and I&apos;ll put together<br className="hidden md:block" /> something beautiful for you.
        </p>
        <a
          href={MAILTO}
          className="mt-8 inline-block border border-charcoal/15 bg-charcoal px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-parchment transition hover:bg-charcoal/85"
        >
          Reach Out
        </a>

        {/* Divider */}
        <div className="mx-auto my-14 h-px w-10 bg-charcoal/15" />

        {/* Secondary path */}
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="text-[10px] uppercase tracking-[0.3em] text-charcoal/35 transition hover:text-charcoal/60"
        >
          Admin
        </button>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Admin — album form
// ─────────────────────────────────────────────────────────────
const EMPTY_FORM = { slug: "", title: "", subtitle: "", label: "", eventDate: "", quote: "", location: "", albumUrl: "" };

function AdminAlbumForm({ initial, onSave, onCancel, busy, error }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const isEdit = !!initial;

  useEffect(() => {
    if (form.title) setForm((c) => ({ ...c, slug: slugify(form.title) }));
  }, [form.title]);

  function set(key, val) { setForm((c) => ({ ...c, [key]: val })); }

  async function handleUrlBlur() {
    if (!form.albumUrl.trim() || form.title.trim()) return;
    setFetchingMeta(true);
    try {
      const res = await fetch(`/api/album-meta?url=${encodeURIComponent(form.albumUrl)}`);
      const data = await readApiJson(res);
      setForm((c) => ({
        ...c,
        title: data.title && !c.title.trim() ? data.title : c.title,
        label: data.label && !c.label.trim() ? data.label : c.label,
        eventDate: data.eventDate && !c.eventDate.trim() ? data.eventDate : c.eventDate,
        location: data.location && !c.location.trim() ? data.location : c.location,
      }));
    } catch {
      // silently ignore — user can type name manually
    } finally {
      setFetchingMeta(false);
    }
  }

  const inp = "mt-2 w-full border border-charcoal/10 bg-white/60 px-3 py-2.5 text-sm outline-none transition focus:border-charcoal/30";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">Google Photos URL *</span>
          <input className={inp} value={form.albumUrl}
            onChange={(e) => set("albumUrl", e.target.value)}
            onBlur={handleUrlBlur}
            placeholder="https://photos.app.goo.gl/..." />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">
            Name *{fetchingMeta && <span className="ml-2 opacity-40">fetching…</span>}
          </span>
          <input className={inp} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="My Trip to Georgia" />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">Website name (auto)</span>
          <input className={inp + " opacity-70"} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="my-trip-to-georgia" />
        </label>
      </div>
      {error && <p className="bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button"
          className="border border-charcoal/10 bg-white/60 px-5 py-2 text-[11px] uppercase tracking-[0.28em] transition hover:bg-white/85"
          onClick={onCancel}>Cancel</button>
        <button type="button"
          disabled={busy || !form.title.trim() || !form.albumUrl.trim()}
          className="bg-charcoal px-5 py-2 text-[11px] uppercase tracking-[0.28em] text-parchment transition hover:bg-charcoal/90 disabled:opacity-40"
          onClick={() => onSave(form)}>
          {busy ? "Saving…" : isEdit ? "Save Changes" : "Add Album"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Admin Page (serves as the homepage at /)
// ─────────────────────────────────────────────────────────────
function AdminPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [mode, setMode] = useState(null); // null | "add" | { edit: album }
  const [formBusy, setFormBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session");
        const data = await readApiJson(res);
        setAuthed(Boolean(data.authenticated));
      } catch {
        setAuthed(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkSession();
  }, []);

  useEffect(() => { if (authed) loadAlbums(); }, [authed]);

  async function loadAlbums() {
    setLoadingAlbums(true);
    setLoadError("");
    try {
      const res = await fetch("/api/albums");
      const data = await readApiJson(res);
      setAlbums(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoadingAlbums(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      await readApiJson(res);
      setPassword("");
      setAuthed(true);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setAuthed(false);
      setAlbums([]);
      setMode(null);
    }
  }

  async function handleSave(formData) {
    setFormBusy(true);
    setFormError("");
    try {
      const isEdit = mode !== "add";
      const slug = isEdit ? mode.edit.slug : formData.slug || slugify(formData.title);
      const album = { ...formData, slug };
      let res;
      try {
        res = await fetch(
          isEdit ? `/api/admin/album/${slug}` : "/api/admin/album",
          { method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(album) }
        );
      } catch {
        throw new Error("Could not reach the server. Make sure it is running (npm run dev).");
      }
      await readApiJson(res);
      await loadAlbums();
      setMode(null);
    } catch (err) {
      if (err.message === "Unauthorized") setAuthed(false);
      setFormError(err.message);
    } finally {
      setFormBusy(false);
    }
  }

  async function handleDelete(album) {
    if (!window.confirm(`Delete "${album.title}"? This cannot be undone.`)) return;
    setActionError("");
    try {
      let res;
      try {
        res = await fetch(`/api/admin/album/${album.slug}`, {
          method: "DELETE",
        });
      } catch {
        throw new Error("Could not reach the server. Make sure it is running (npm run dev).");
      }
      await readApiJson(res);
      setAlbums((prev) => prev.filter((a) => a.slug !== album.slug));
    } catch (err) {
      if (err.message === "Unauthorized") setAuthed(false);
      setActionError(err.message);
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment text-charcoal">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-charcoal/15 border-t-charcoal" />
      </div>
    );
  }

  // ── Login screen ───────────────────────────────────────────
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment px-5 text-charcoal">
        <motion.div
          className="w-full max-w-sm border border-charcoal/10 bg-white/50 p-8 shadow-luxe"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.35em]">{APP_NAME}</p>
          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">Password</span>
              <input
                type="password"
                className="mt-3 w-full border border-charcoal/10 bg-white/60 px-4 py-3 outline-none transition focus:border-charcoal/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </label>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button type="submit"
              disabled={loginBusy || !password.trim()}
              className="w-full bg-charcoal py-3 text-[11px] uppercase tracking-[0.28em] text-parchment shadow-[0_14px_38px_rgba(26,26,26,0.16)] transition hover:bg-charcoal/90 disabled:opacity-40">
              {loginBusy ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-parchment px-5 pb-24 pt-10 text-charcoal md:px-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.35em]">{APP_NAME}</p>
          <div className="flex items-center gap-3">
            <button type="button"
              className="border border-charcoal/10 bg-white/60 px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition hover:bg-white/85"
              onClick={loadAlbums}>Refresh</button>
            <button type="button"
              className="border border-charcoal/10 bg-white/60 px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition hover:bg-white/85"
              onClick={handleLogout}>Sign Out</button>
            <button type="button"
              className="flex items-center gap-2 bg-charcoal px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-parchment transition hover:bg-charcoal/90"
              onClick={() => { setMode("add"); setFormError(""); }}>
              <PlusIcon /> Add Album
            </button>
          </div>
        </div>

        {/* Add form */}
        {mode === "add" && (
          <motion.div
            className="mb-8 border border-charcoal/10 bg-white/50 p-6 shadow-luxe md:p-8"
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="mb-6 font-serif text-2xl">Add New Album</h2>
            <AdminAlbumForm onSave={handleSave} onCancel={() => setMode(null)} busy={formBusy} error={formError} />
          </motion.div>
        )}

        {actionError && (
          <div className="mb-6 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>
        )}

        {/* Album list */}
        {loadingAlbums ? (
          <div className="flex min-h-[20vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-charcoal/15 border-t-charcoal" />
          </div>
        ) : loadError ? (
          <div className="border border-charcoal/10 bg-white/40 p-8 text-center">
            <p className="font-serif text-2xl text-red-700">Could not load albums</p>
            <p className="mt-3 text-sm text-charcoal/60">{loadError}</p>
          </div>
        ) : albums.length === 0 ? (
          <div className="border border-charcoal/10 bg-white/40 p-10 text-center">
            <p className="font-serif text-2xl opacity-50">No albums yet.</p>
            <p className="mt-3 text-sm text-charcoal/40">Click "Add Album" to create your first entry.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {albums.map((album) => (
              <div key={album.slug}>
                {mode?.edit?.slug === album.slug ? (
                  <motion.div
                    className="border border-charcoal/10 bg-white/50 p-6 shadow-luxe md:p-8"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  >
                    <h2 className="mb-6 font-serif text-2xl">Edit — {album.title}</h2>
                    <AdminAlbumForm initial={album} onSave={handleSave}
                      onCancel={() => setMode(null)} busy={formBusy} error={formError} />
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-4 border border-charcoal/8 bg-white/45 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-lg">{album.title}</p>
                      <p className="mt-0.5 truncate text-[11px] text-charcoal/40">
                        {album.slug}{album.eventDate ? ` · ${album.eventDate}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <a href={`/album/${album.slug}`} target="_blank" rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center border border-charcoal/10 bg-white/60 opacity-60 transition hover:opacity-100"
                        title="Open album">
                        <ExternalLinkIcon />
                      </a>
                      <button type="button"
                        className="flex h-8 w-8 items-center justify-center border border-charcoal/10 bg-white/60 opacity-60 transition hover:opacity-100"
                        title="Edit" onClick={() => { setMode({ edit: album }); setFormError(""); }}>
                        <PencilIcon />
                      </button>
                      <button type="button"
                        className="flex h-8 w-8 items-center justify-center border border-red-200 bg-red-50 text-red-600 opacity-60 transition hover:opacity-100"
                        title="Delete" onClick={() => handleDelete(album)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [route, setRoute] = useState(() => getRoute());

  useEffect(() => {
    function onPop() { setRoute(getRoute()); }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (route.page === "album") return <AlbumPage />;
  if (route.page === "admin") return <AdminPage />;
  return <LandingPage />;
}
