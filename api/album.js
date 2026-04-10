const ALBUMS = {
  naomi-is-two: {
    slug: "naomi-is-two",
    title: "Naomi is Two",
    subtitle: "A Special Celebration",
    label: "Sunshine Group",
    eventDate: "March 2026",
    quote: "Two years of sunshine, laughter, and love.",
    location: "Sunshine Group",
    albumUrl: "https://photos.app.goo.gl/USFhTJJsH99V5CRLA?_imcp=1"
  },
  spring-picnic: {
    slug: "spring-picnic",
    title: "Spring Picnic",
    subtitle: "Long Tables and Golden Light",
    label: "Park Gathering",
    eventDate: "Editorial Album",
    quote: "Afternoons made for grazing, games, and soft spring light.",
    location: "The Park",
    albumUrl: "https://photos.app.goo.gl/ne5c5c3Cn6vUZ91u8?_imcp=1"
  },
  sunshine-atelier: {
    slug: "sunshine-atelier",
    title: "Sunshine Atelier",
    subtitle: "Family Moments in the Park",
    label: "Outdoor Session",
    eventDate: "Editorial Album",
    quote: "Candid frames, playful details, and a beautifully paced day outdoors.",
    location: "The Park",
    albumUrl: "https://photos.app.goo.gl/xdYBakQRqKGq8Yh98?_imcp=1"
  },
  garden-stories: {
    slug: "garden-stories",
    title: "Garden Stories",
    subtitle: "Celebration Under the Trees",
    label: "Weekend Event",
    eventDate: "Editorial Album",
    quote: "An album built around easy conversation, children at play, and sunlight through leaves.",
    location: "The Park",
    albumUrl: "https://photos.app.goo.gl/Bw8PhnYcR1zskVLNA?_imcp=1"
  }
};

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
    albumUrl: url
  };
}

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

async function fetchAlbumPhotos(albumUrl) {
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
  const matches =
    html.match(
      /https:\\\/\\\/lh3\.googleusercontent\.com\\\/pw\\\/[^"\\]+|https:\/\/lh3\.googleusercontent\.com\/pw\/[^"'\\\s)]+/g
    ) ?? [];

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

export default async function handler(req, res) {
  try {
    const rawUrl = typeof req.query.url === "string" ? req.query.url : "";
    const slug = typeof req.query.slug === "string" ? req.query.slug : "naomi-is-two";
    const album = rawUrl ? buildCustomAlbum(normalizeAlbumUrl(rawUrl)) : ALBUMS[slug];

    if (!album) {
      res.status(404).json({ error: "Album not found." });
      return;
    }

    const photos = await fetchAlbumPhotos(album.albumUrl);
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({
      album: {
        ...album,
        cover: photos[0],
        photoCount: photos.length
      },
      photos
    });
  } catch (error) {
    res.status(500).json({
      error: "Unable to load album right now.",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
