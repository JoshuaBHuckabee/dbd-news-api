import axios from "axios";
import { load } from "cheerio";

/**
 * Scrapes the latest Steam news for Dead by Daylight.
 * Returns an array of news items matching the Prisma schema.
 */
export default async function steamScraper() {
  const STEAM_NEWS_URL = "https://store.steampowered.com/feeds/news/app/381210/";

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

      // Decode HTML entities
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
    return items; // <-- just return array, don't save
  } catch (err) {
    console.error("Steam scrape failed:", err.message);
    return [];
  }
}
