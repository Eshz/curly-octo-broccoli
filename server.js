import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { Redis } from "@upstash/redis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALBUMS_FILE = path.join(__dirname, "data", "albums.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "4523";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || ADMIN_PASSWORD;
const ADMIN_SESSION_COOKIE = "real_moments_admin";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;
const PORT = process.env.PORT || 3001;

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

// ─────────────────────────────────────────────────────────────
// Storage helpers (Redis in production, JSON file locally)
// ─────────────────────────────────────────────────────────────
async function readAlbums() {
  try {
    if (redis) {
      const albums = await redis.get("albums");
      if (Array.isArray(albums)) return albums;
    }

    return JSON.parse(fs.readFileSync(ALBUMS_FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeAlbums(albums) {
  if (redis) {
    await redis.set("albums", albums);
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Persistent album storage is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.");
  }

  fs.writeFileSync(ALBUMS_FILE, JSON.stringify(albums, null, 2));
}

// ─────────────────────────────────────────────────────────────
// Express setup
// ─────────────────────────────────────────────────────────────
const app = express();
const distPath = path.join(__dirname, "dist");

app.use(express.json());

// ─────────────────────────────────────────────────────────────
// Admin auth helpers
// ─────────────────────────────────────────────────────────────
function safeEqual(a, b) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

function signSession(payload) {
  return crypto.createHmac("sha256", ADMIN_SESSION_SECRET).update(payload).digest("base64url");
}

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ role: "admin", expiresAt })).toString("base64url");
  return `${payload}.${signSession(payload)}`;
}

function verifyAdminSession(token) {
  if (!token || !ADMIN_SESSION_SECRET) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, signSession(payload))) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.role === "admin" && Number(session.expiresAt) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function adminCookieOptions(maxAge) {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge};${secure}`;
}

function requireAdmin(req, res, next) {
  if (!verifyAdminSession(getCookie(req, ADMIN_SESSION_COOKIE))) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// ─────────────────────────────────────────────────────────────
// Photo URL helpers
// ─────────────────────────────────────────────────────────────
function normalizeAlbumUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  if (!parsed.hostname.includes("photos.app.goo.gl")) {
    throw new Error("Please provide a valid Google Photos shared album link.");
  }
  if (!parsed.searchParams.has("_imcp")) {
    parsed.searchParams.set("_imcp", "1");
  }
  return parsed.toString();
}

function normalizePhotoUrl(url) {
  return `${url.replace(/=w\d+-h\d+[^"]*$/, "").replace(/=s\d+[^"]*$/, "")}=w1600-h1200`;
}

async function fetchAlbumData(albumUrl) {
  const response = await fetch(albumUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) throw new Error(`Google Photos responded with ${response.status}`);

  const html = await response.text();
  const matches =
    html.match(/https:\\\/\\\/lh3\.googleusercontent\.com\\\/pw\\\/[^"\\]+|https:\/\/lh3\.googleusercontent\.com\/pw\/[^"'\\\s)]+/g) ?? [];

  const photos = [...new Set(matches.map((m) => m.replaceAll("\\/", "/")).map(normalizePhotoUrl))];
  if (photos.length === 0) throw new Error("No photos found in the shared album page.");
  return { photos, html };
}

// ─────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────

app.post("/api/admin/login", (req, res) => {
  const password = req.body?.password || "";
  if (!ADMIN_PASSWORD) {
    res.status(500).json({ error: "ADMIN_PASSWORD is not configured." });
    return;
  }

  if (!safeEqual(password, ADMIN_PASSWORD)) {
    res.status(401).json({ error: "Incorrect password." });
    return;
  }

  res.setHeader(
    "Set-Cookie",
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(createAdminSession())}; ${adminCookieOptions(ADMIN_SESSION_TTL_SECONDS)}`
  );
  res.json({ success: true });
});

app.post("/api/admin/logout", (_req, res) => {
  res.setHeader("Set-Cookie", `${ADMIN_SESSION_COOKIE}=; ${adminCookieOptions(0)}`);
  res.json({ success: true });
});

app.get("/api/admin/session", (req, res) => {
  res.json({ authenticated: verifyAdminSession(getCookie(req, ADMIN_SESSION_COOKIE)) });
});

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by",
  "from","is","it","its","as","are","was","be","this","that","my","our","your",
  "their","we","i","you","he","she","they","have","had","has","do","did","not",
]);

function generateLabel(title) {
  const words = title.split(/\s+/).filter((w) => {
    const lower = w.toLowerCase().replace(/[^a-z]/g, "");
    return lower.length > 2 && !STOP_WORDS.has(lower);
  });
  return words.slice(0, 2).join(" ");
}

function cleanTitle(raw) {
  return raw
    .replace(/\s*[-–—]\s*Google Photos\s*$/i, "")
    .replace(/\s*[-–—]\s*Album\s*$/i, "")
    .replace(/\s*\(\d{4}\)\s*$/, "")
    .replace(/\s*,?\s*\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\s*$/, "")
    .replace(/\s*,?\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*$/i, "")
    .replace(/\s*,?\s*\d{4}\s*$/, "")
    .trim();
}

async function translateToEnglish(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return text;
    const json = await r.json();
    const translated = json?.[0]?.map((part) => part?.[0]).filter(Boolean).join("") || text;
    return translated.trim() || text;
  } catch {
    return text;
  }
}

function extractEventDate(html) {
  // Pattern 1: JS array [year, month, day] embedded in page data
  const arrayMatches = [...html.matchAll(/\[(\d{4}),(\d{1,2}),\d{1,2}\]/g)];
  for (const m of arrayMatches) {
    const year = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    if (year >= 2000 && year <= 2100 && month >= 1 && month <= 12) {
      const monthName = new Date(year, month - 1, 1).toLocaleString("en", { month: "long" });
      return `${monthName} ${year}`;
    }
  }
  // Pattern 2: ISO-ish date strings "2025-05-..." in JSON blobs
  const isoMatch = html.match(/"(\d{4})-(\d{2})-\d{2}T/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    if (year >= 2000 && year <= 2100 && month >= 1 && month <= 12) {
      const monthName = new Date(year, month - 1, 1).toLocaleString("en", { month: "long" });
      return `${monthName} ${year}`;
    }
  }
  // Pattern 3: og:description or title containing a year
  const yearMatch = html.match(/content="[^"]*?(20\d{2})[^"]*"/);
  if (yearMatch) return yearMatch[1];
  return "";
}

function extractLocation(html) {
  // Google Photos sometimes puts location in og:description
  const descMatch = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i)
    || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:description"/i);
  if (descMatch) {
    const desc = descMatch[1];
    // Description often looks like "Location · Month Year · N items"
    const locationPart = desc.split("·")[0].trim();
    if (locationPart && locationPart.length < 60 && !/^\d/.test(locationPart)) {
      return locationPart;
    }
  }
  // Look for a "location" key in embedded JSON data
  const locJsonMatch = html.match(/"location"\s*:\s*"([^"]{2,60})"/i);
  if (locJsonMatch) return locJsonMatch[1];
  return "";
}

// Public: fetch album title metadata from a Google Photos URL
app.get("/api/album-meta", async (req, res) => {
  try {
    const rawUrl = typeof req.query.url === "string" ? req.query.url : "";
    if (!rawUrl) { res.status(400).json({ error: "url parameter required" }); return; }
    const albumUrl = normalizeAlbumUrl(rawUrl);
    const response = await fetch(albumUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) throw new Error(`Google Photos responded with ${response.status}`);
    const html = await response.text();
    const titleMatch = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)
      || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/i);
    const rawTitle = titleMatch ? titleMatch[1] : "";
    const cleaned = cleanTitle(rawTitle);
    const translated = cleaned ? await translateToEnglish(cleaned) : "";
    const label = generateLabel(translated || cleaned);
    const eventDate = extractEventDate(html);
    const location = extractLocation(html);
    res.json({ title: translated || cleaned, label, eventDate, location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: list all albums
app.get("/api/albums", async (_req, res) => {
  res.json(await readAlbums());
});

// Public: load a single album with photos
app.get("/api/album", async (req, res) => {
  try {
    const rawUrl = typeof req.query.url === "string" ? req.query.url : "";
    const slug = typeof req.query.slug === "string" ? req.query.slug : "";

    let album;
    if (rawUrl) {
      album = {
        slug: "custom-preview",
        title: "Custom Album",
        subtitle: "One-Time Google Photos Preview",
        label: "Added by Link",
        eventDate: "Temporary Preview",
        quote: "Generated instantly from a Google Photos album link.",
        location: "Google Photos",
        sourceUrl: rawUrl,
        albumUrl: normalizeAlbumUrl(rawUrl),
      };
    } else {
      album = (await readAlbums()).find((a) => a.slug === slug);
      if (!album) {
        res.status(404).json({ error: "Album not found." });
        return;
      }
    }

    const resolvedUrl = album.albumUrl.includes("photos.app.goo.gl")
      ? normalizeAlbumUrl(album.albumUrl)
      : album.albumUrl;
    const { photos, html } = await fetchAlbumData(resolvedUrl);

    // Auto-enrich fields that are missing
    const label = album.label || generateLabel(album.title);
    const eventDate = album.eventDate || extractEventDate(html);
    const location = album.location || extractLocation(html);

    res.json({ album: { ...album, label, eventDate, location, cover: photos[0], photoCount: photos.length }, photos });
  } catch (err) {
    res.status(500).json({ error: "Unable to load album right now.", details: err.message });
  }
});

// Admin: add album
app.post("/api/admin/album", requireAdmin, async (req, res) => {
  try {
    const albums = await readAlbums();
    const album = req.body;
    if (!album.slug || !album.title) {
      res.status(400).json({ error: "slug and title are required." });
      return;
    }
    if (albums.find((a) => a.slug === album.slug)) {
      res.status(409).json({ error: `An album with slug "${album.slug}" already exists.` });
      return;
    }
    albums.push(album);
    await writeAlbums(albums);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: update album
app.put("/api/admin/album/:slug", requireAdmin, async (req, res) => {
  try {
    const albums = await readAlbums();
    const index = albums.findIndex((a) => a.slug === req.params.slug);
    if (index === -1) {
      res.status(404).json({ error: "Album not found." });
      return;
    }
    albums[index] = { ...albums[index], ...req.body, slug: req.params.slug };
    await writeAlbums(albums);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete album
app.delete("/api/admin/album/:slug", requireAdmin, async (req, res) => {
  try {
    const albums = await readAlbums();
    const filtered = albums.filter((a) => a.slug !== req.params.slug);
    if (filtered.length === albums.length) {
      res.status(404).json({ error: "Album not found." });
      return;
    }
    await writeAlbums(filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// Production: serve React SPA
// ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
