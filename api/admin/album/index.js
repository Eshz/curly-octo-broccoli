import { readAlbums, requireAdmin, writeAlbums } from "../../../lib/albums.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!requireAdmin(req, res)) return;

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
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
