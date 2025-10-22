// src/scrapers/steam.js

import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function steamScraper() {
  try {
    const res = await axios.get("https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/", {
      params: {
        appid: 381210, // DBD App ID
        count: 5,
        maxlength: 1000,
        format: "json"
      }
    });

    const newsItems = res.data.appnews.newsitems;

    const formatted = newsItems.map(item => ({
      title: item.title,
      content: item.contents,
      url: item.url,
      imageUrl: null, // Steam doesn't provide image directly
      source: "Steam",
      contentType: "text", // or 'update'
      publishedAt: new Date(item.date * 1000), // Convert Unix timestamp
      code: null
    }));

    console.log(`📰 Scraped ${formatted.length} Steam posts`);

    // Save to DB using upsert
    for (const item of formatted) {
      try {
        await prisma.newsItem.upsert({
          where: { url: item.url },
          update: {},
          create: item
        });
      } catch (err) {
        console.error("Failed to save Steam post:", item.url, err.message);
      }
    }

    await prisma.$disconnect();
    console.log(`Saved ${formatted.length} Steam items`);
  } catch (err) {
    console.error("Steam scrape failed:", err.message);
  }
}
