// ------------------------------------------------------------
// Scraper: Steam News
// ------------------------------------------------------------
// Fetches the latest Dead by Daylight news from Steam's official
// RSS feed and returns an array of news items formatted to match
// the Prisma schema.
// ------------------------------------------------------------

import axios from "axios";
import { load } from "cheerio";

/**
 * Scrapes the latest Steam news for Dead by Daylight.
 * ------------------------------------------------------------
 * - Fetches RSS feed XML from Steam.
 * - Parses XML to extract the latest 5 news items.
 * - Cleans HTML content and returns structured news objects.
 *
 * @async
 * @function steamScraper
 * @returns {Promise<Array<Object>>} Array of news item objects
 * @property {string} source - Platform name ("Steam")
 * @property {string} title - News title
 * @property {string} content - News description or snippet
 * @property {string} url - Direct URL to the news post
 * @property {string|null} imageUrl - News image or thumbnail
 * @property {string} contentType - Type of content ("text")
 * @property {string|null} code - Optional field for platform-specific ID
 * @property {Date} publishedAt - Publication date
 */
export default async function steamScraper() {
  const STEAM_NEWS_URL = "https://store.steampowered.com/feeds/news/app/381210/";

  try {
    // Fetch the RSS feed XML
    const res = await axios.get(STEAM_NEWS_URL);
    const xml = res.data;

    // Load XML using Cheerio in XML mode
    const $ = load(xml, { xmlMode: true });

    // Extract the first 5 news items
    const items = $("item").slice(0, 5).map((_, el) => {
    const title = $(el).find("title").text();
    const link = $(el).find("link").text();
    const rawDescription = $(el).find("description").text();
    const pubDate = new Date($(el).find("pubDate").text());
    const imageUrl = $(el).find("enclosure").attr("url") || null;

    // Parse description HTML
    const desc$ = load(rawDescription);

    // --- Preserve section headers (.bb_h2 and .bb_h3) ---
    desc$(".bb_h2, .bb_h3").each((_, el) => {
      const text = desc$(el).text().trim();
      desc$(el).replaceWith(`<b>${text}</b>\n\n`);
    });

    // --- Convert list items into bullet points ---
    desc$("li").each((_, el) => {
      const text = desc$(el).text().trim();
      desc$(el).replaceWith(`- ${text}\n`);
    });

    // Extract modified HTML as text
    let htmlWithFormatting = desc$.html() || "";

    // --- Text cleanup rules ---
    htmlWithFormatting = htmlWithFormatting
      .replace(/\.([A-Z0-9])/g, ". $1") // add space after periods
      .replace(/^Content\s*/i, "") // removed redundant prefix
      .replace(/([a-z])The\s+([A-Z][a-z]+)/g, "$1. The $2"); // add missing period before capitalized The

    // --- Reload formatted HTML and process <b> tags as Markdown ---
    const $final = load(htmlWithFormatting);

    $final("b").each((_, el) => {
      $final(el).replaceWith(`**${$final(el).text().trim()}**\n\n`);
    });

    // --- Extract final text with headers and bullet points preserved ---
    let cleanText = $final.text()
      .replace(/\r?\n\s*\n/g, "\n\n") // normalize multiple newlines
      .replace(/\s+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

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

    // Log number of items scraped
    console.log(`Scraped ${items.length} Steam posts`);

    // Return structured array; saving is handled elsewhere
    return items;
  } catch (err) {
    console.error("Steam scrape failed:", err.message);
    return [];
  }
}
