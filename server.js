import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "dist");
const albumUrl = "https://photos.app.goo.gl/USFhTJJsH99V5CRLA?_imcp=1";

function normalizePhotoUrl(url) {
  return `${url.replace(/=w\d+-h\d+[^"]*$/, "").replace(/=s\d+[^"]*$/, "")}=w1600-h1200`;
}

async function fetchAlbumPhotos() {
  const response = await fetch(albumUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml"
    }
  });

  if (!response.ok) {
    throw new Error(`Google Photos responded with ${response.status}`);
  }

  const html = await response.text();
  const matches = html.match(/https:\\\/\\\/lh3\.googleusercontent\.com\\\/pw\\\/[^"\\]+|https:\/\/lh3\.googleusercontent\.com\/pw\/[^"'\\\s)]+/g) ?? [];
  const unique = [
    ...new Set(
      matches
        .map((match) => match.replaceAll("\\/", "/"))
        .map(normalizePhotoUrl)
    )
  ];

  if (unique.length === 0) {
    throw new Error("No album photos were found in the shared page HTML.");
  }

  return unique;
}

app.get("/api/album", async (_req, res) => {
  try {
    const photos = await fetchAlbumPhotos();
    res.json({ photos });
  } catch (error) {
    res.status(500).json({
      error: "Unable to load album right now.",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));

  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Album server listening on http://localhost:${PORT}`);
});
