import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const navMeta = ["Birthday Celebration", "Sunshine Group"];

const stylePatterns = [
  {
    cols: "col-span-4 md:col-span-2",
    rows: "md:row-span-2",
    aspect: "aspect-[16/9] md:aspect-auto",
    filter: "grayscale contrast-125 brightness-90",
    label: "grayscale"
  },
  {
    cols: "col-span-2 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[3/4] md:aspect-auto",
    filter: "",
    label: ""
  },
  {
    cols: "col-span-2 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-square md:aspect-auto",
    filter: "sepia-[0.5] contrast-90",
    label: "sepia"
  },
  {
    cols: "col-span-2 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[3/4] md:aspect-auto",
    filter: "sepia-[0.2] saturate-150 hue-rotate-[-10deg]",
    label: "warm"
  },
  {
    cols: "col-span-2 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[3/4] md:aspect-auto",
    filter: "",
    label: ""
  },
  {
    cols: "col-span-2 md:col-span-1",
    rows: "md:row-span-3",
    aspect: "aspect-[3/5] md:aspect-auto",
    filter: "grayscale contrast-125 brightness-90",
    label: "grayscale"
  },
  {
    cols: "col-span-2 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[3/4] md:aspect-auto",
    filter: "hue-rotate-[10deg] saturate-110 brightness-105",
    label: "cool"
  },
  {
    cols: "col-span-2 md:col-span-1",
    rows: "md:row-span-2",
    aspect: "aspect-[3/4] md:aspect-auto",
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

function assignPhotoStyle(index) {
  return stylePatterns[index % stylePatterns.length];
}

function Lightbox({ photos, currentIndex, onClose, onNavigate }) {
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
        <p className="font-serif text-xl italic opacity-80">Naomi&apos;s 2nd Birthday, Sunshine Group</p>
        <p className="mt-2 text-[9px] uppercase tracking-[0.3em] opacity-40">Professional Curation</p>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    async function loadAlbum() {
      try {
        const response = await fetch("/api/album");
        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error("The album service returned an unexpected response.");
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || "Failed to load album");
        }

        setPhotos(
          data.photos.map((url, index) => ({
            url,
            alt: `Naomi is Two - ${index + 1}`,
            style: assignPhotoStyle(index)
          }))
        );
        setStatus("ready");
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load album");
        setStatus("error");
      }
    }

    loadAlbum();
  }, []);

  function moveLightbox(direction) {
    setActiveIndex((current) => {
      if (current === null || photos.length === 0) return current;
      return (current + direction + photos.length) % photos.length;
    });
  }

  return (
    <div className="min-h-screen bg-parchment text-charcoal selection:bg-charcoal selection:text-white">
      <nav className="pointer-events-none fixed left-0 top-0 z-50 flex w-full items-center justify-between px-5 py-6 md:px-12 md:py-8">
        <div className="pointer-events-auto">
          <h1 className="font-serif text-2xl font-light tracking-tight md:text-3xl">Naomi&apos;s 2nd</h1>
        </div>
        <div className="pointer-events-auto hidden items-center space-x-8 md:flex">
          <div className="flex items-center space-x-2 opacity-40">
            <CameraIcon />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Sunshine Group</span>
          </div>
          <div className="h-px w-12 bg-charcoal opacity-20" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-60">
            {navMeta[0]}
          </span>
        </div>
      </nav>

      <header className="relative flex h-[90vh] flex-col items-center justify-center overflow-hidden px-5 text-center md:px-12">
        <motion.div
          className="z-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-6 text-[11px] uppercase tracking-[0.4em] opacity-60">A Special Celebration</p>
          <h2 className="font-serif text-6xl font-light leading-tight md:text-8xl lg:text-9xl">
            Naomi is <br /> <span className="italic md:pl-24">Two</span>
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-12 md:space-y-0">
            <div className="flex items-center space-x-2 opacity-70">
              <CalendarIcon />
              <span className="text-xs uppercase tracking-wider">March 2026</span>
            </div>
            <div className="flex items-center space-x-2 opacity-70">
              <MapPinIcon />
              <span className="text-xs uppercase tracking-wider">Sunshine Group</span>
            </div>
          </div>
        </motion.div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
          <div className="h-full w-full rounded-full border border-charcoal" />
        </div>
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
          <div className="grid auto-rows-min grid-cols-6 grid-flow-dense gap-2 md:grid-cols-3 md:auto-rows-[92px] md:gap-6 lg:grid-cols-4 xl:grid-cols-6">
            {photos.map((photo, index) => (
              <motion.button
                key={`${photo.url}-${index}`}
                type="button"
                className={[
                  "group relative block w-full cursor-pointer overflow-hidden bg-[#e5e2dd] text-left align-top",
                  photo.style.cols,
                  photo.style.rows,
                  photo.style.aspect
                ].join(" ")}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.015, 0.35) }}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  referrerPolicy="no-referrer"
                  className={[
                    "h-full w-full object-cover transition-all duration-1000 ease-out group-hover:scale-110",
                    photo.style.filter
                  ].join(" ")}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/20">
                  <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 text-white backdrop-blur-md">
                      <ExpandIcon />
                    </div>
                  </div>
                </div>
                {photo.style.label && (
                  <div className="absolute left-4 top-4 opacity-0 transition-opacity duration-500 group-hover:opacity-40">
                    <span className="rounded-full border border-white/30 px-2 py-1 text-[8px] uppercase tracking-widest text-white">
                      {photo.style.label}
                    </span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-charcoal/10 px-5 py-16 text-center md:px-12 md:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="mb-10 font-serif text-3xl italic leading-relaxed">
            &quot;Two years of sunshine, laughter, and love.&quot;
          </p>
          <div className="mx-auto mb-10 h-px w-16 bg-charcoal opacity-20" />
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40">
            Naomi&apos;s 2nd Birthday • Sunshine Group • 2026
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            photos={photos}
            currentIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNavigate={moveLightbox}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
