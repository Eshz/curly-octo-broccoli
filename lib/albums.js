import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Redis } from "@upstash/redis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, "..");
const ALBUMS_FILE = path.join(ROOT_DIR, "data", "albums.json");

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function readAlbums() {
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

export async function writeAlbums(albums) {
  if (redis) {
    await redis.set("albums", albums);
    return;
  }

  fs.writeFileSync(ALBUMS_FILE, JSON.stringify(albums, null, 2));
}

export function requireAdmin(req, res) {
  const password = req.headers["x-admin-password"] || req.body?.password;
  if (password === ADMIN_PASSWORD) return true;

  res.status(401).json({ error: "Unauthorized" });
  return false;
}

export function normalizeAlbumUrl(rawUrl) {
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

export async function fetchAlbumData(albumUrl) {
  const response = await fetch(albumUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) throw new Error(`Google Photos responded with ${response.status}`);

  const html = await response.text();
  const matches =
    html.match(
      /https:\\\/\\\/lh3\.googleusercontent\.com\\\/pw\\\/[^"\\]+|https:\/\/lh3\.googleusercontent\.com\/pw\/[^"'\\\s)]+/g
    ) ?? [];

  const photos = [...new Set(matches.map((m) => m.replaceAll("\\/", "/")).map(normalizePhotoUrl))];
  if (photos.length === 0) throw new Error("No photos found in the shared album page.");

  return { photos, html };
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "is",
  "it",
  "its",
  "as",
  "are",
  "was",
  "be",
  "this",
  "that",
  "my",
  "our",
  "your",
  "their",
  "we",
  "i",
  "you",
  "he",
  "she",
  "they",
  "have",
  "had",
  "has",
  "do",
  "did",
  "not",
]);

export function generateLabel(title) {
  const words = title.split(/\s+/).filter((w) => {
    const lower = w.toLowerCase().replace(/[^a-z]/g, "");
    return lower.length > 2 && !STOP_WORDS.has(lower);
  });
  return words.slice(0, 2).join(" ");
}

export function cleanTitle(raw) {
  return raw
    .replace(/\s*[-–—]\s*Google Photos\s*$/i, "")
    .replace(/\s*[-–—]\s*Album\s*$/i, "")
    .replace(/\s*\(\d{4}\)\s*$/, "")
    .replace(/\s*,?\s*\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\s*$/, "")
    .replace(/\s*,?\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*$/i, "")
    .replace(/\s*,?\s*\d{4}\s*$/, "")
    .trim();
}

export async function translateToEnglish(text) {
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

export function extractEventDate(html) {
  const arrayMatches = [...html.matchAll(/\[(\d{4}),(\d{1,2}),\d{1,2}\]/g)];
  for (const m of arrayMatches) {
    const year = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    if (year >= 2000 && year <= 2100 && month >= 1 && month <= 12) {
      const monthName = new Date(year, month - 1, 1).toLocaleString("en", { month: "long" });
      return `${monthName} ${year}`;
    }
  }

  const isoMatch = html.match(/"(\d{4})-(\d{2})-\d{2}T/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    if (year >= 2000 && year <= 2100 && month >= 1 && month <= 12) {
      const monthName = new Date(year, month - 1, 1).toLocaleString("en", { month: "long" });
      return `${monthName} ${year}`;
    }
  }

  const yearMatch = html.match(/content="[^"]*?(20\d{2})[^"]*"/);
  if (yearMatch) return yearMatch[1];

  return "";
}

export function extractLocation(html) {
  const descMatch =
    html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i) ||
    html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:description"/i);

  if (descMatch) {
    const desc = descMatch[1];
    const locationPart = desc.split("·")[0].trim();
    if (locationPart && locationPart.length < 60 && !/^\d/.test(locationPart)) {
      return locationPart;
    }
  }

  const locJsonMatch = html.match(/"location"\s*:\s*"([^"]{2,60})"/i);
  if (locJsonMatch) return locJsonMatch[1];

  return "";
}

export async function getAlbumMeta(rawUrl) {
  const albumUrl = normalizeAlbumUrl(rawUrl);
  const response = await fetch(albumUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) throw new Error(`Google Photos responded with ${response.status}`);

  const html = await response.text();
  const titleMatch =
    html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i) ||
    html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/i);
  const rawTitle = titleMatch ? titleMatch[1] : "";
  const cleaned = cleanTitle(rawTitle);
  const translated = cleaned ? await translateToEnglish(cleaned) : "";

  return {
    title: translated || cleaned,
    label: generateLabel(translated || cleaned),
    eventDate: extractEventDate(html),
    location: extractLocation(html),
  };
}
