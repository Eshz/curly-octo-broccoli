import { readAlbums, requireAdmin, writeAlbums } from "../../../lib/albums.js";

export default async function handler(req, res) {
  if (!["PUT", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "PUT, DELETE");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!requireAdmin(req, res)) return;

  try {
    const slug = req.query.slug;
    const albums = await readAlbums();
    const index = albums.findIndex((a) => a.slug === slug);

    if (index === -1) {
      res.status(404).json({ error: "Album not found." });
      return;
    }

    if (req.method === "DELETE") {
      await writeAlbums(albums.filter((a) => a.slug !== slug));
      res.status(200).json({ success: true });
      return;
    }

    albums[index] = { ...albums[index], ...req.body, slug };
    await writeAlbums(albums);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
