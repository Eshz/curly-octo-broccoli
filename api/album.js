import {
  extractEventDate,
  extractLocation,
  fetchAlbumData,
  generateLabel,
  normalizeAlbumUrl,
  readAlbums,
} from "../lib/albums.js";

function buildCustomAlbum(url) {
  return {
    slug: "custom-preview",
    title: "Custom Album",
    subtitle: "One-Time Google Photos Preview",
    label: "Added by Link",
    eventDate: "Temporary Preview",
    quote: "Generated instantly from a Google Photos album link.",
    location: "Google Photos",
    sourceUrl: url,
    albumUrl: url,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const rawUrl = typeof req.query.url === "string" ? req.query.url : "";
    const slug = typeof req.query.slug === "string" ? req.query.slug : "naomi-is-two";
    const album = rawUrl
      ? buildCustomAlbum(normalizeAlbumUrl(rawUrl))
      : (await readAlbums()).find((a) => a.slug === slug);

    if (!album) {
      res.status(404).json({ error: "Album not found." });
      return;
    }

    const resolvedUrl = album.albumUrl.includes("photos.app.goo.gl")
      ? normalizeAlbumUrl(album.albumUrl)
      : album.albumUrl;
    const { photos, html } = await fetchAlbumData(resolvedUrl);

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({
      album: {
        ...album,
        label: album.label || generateLabel(album.title),
        eventDate: album.eventDate || extractEventDate(html),
        location: album.location || extractLocation(html),
        cover: photos[0],
        photoCount: photos.length,
      },
      photos,
    });
  } catch (error) {
    res.status(500).json({
      error: "Unable to load album right now.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
