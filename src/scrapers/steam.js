import axios from "axios";
import { load } from "cheerio";        
import prisma from "../lib/prisma.js";

const STEAM_NEWS_URL = "https://store.steampowered.com/feeds/news/app/381210/";

export default async function steamScraper() {
  try {
    const res = await axios.get(STEAM_NEWS_URL);
    const xml = res.data;

    const $ = load(xml, { xmlMode: true });

    const items = $("item").slice(0, 5).map((_, el) => {
      const title = $(el).find("title").text();
      const link = $(el).find("link").text();
      const rawDescription = $(el).find("description").text();
      const pubDate = new Date($(el).find("pubDate").text());
      const imageUrl = $(el).find("enclosure").attr("url") || null;

      let decodedContent;
      try {
        decodedContent = JSON.parse(`"${rawDescription.replace(/"/g, '\\"')}"`);
      } catch {
        decodedContent = rawDescription;
      }

      const $$ = load(decodedContent);
      const cleanText = $$.text().trim();

      return {
        title,
        content: cleanText,
        url: link,
        imageUrl,
        publishedAt: pubDate,
        source: "Steam",
        contentType: "text",
        code: null,
      };
    }).get();

    console.log(`Scraped ${items.length} Steam posts`);

    for (const item of items) {
      try {
        await prisma.newsItem.upsert({
          where: { url: item.url },
          update: {},
          create: item,
        });
      } catch (err) {
        console.error("Failed to insert Steam post:", item.url, err.message);
      }
    }

    console.log(`Saved ${items.length} Steam items`);
  } catch (err) {
    console.error("Steam scrape failed:", err.message);
  }
}
