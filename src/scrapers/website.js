import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";

/**
 * Scrapes the latest Dead by Daylight news articles from the official website.
 * Returns an array of news items matching the Prisma schema.
 */
export default async function websiteScraper() {
  const sitemapUrl = "https://deadbydaylight.com/sitemap/sitemap-0.xml";

  try {
    console.log("Fetching sitemap...");
    const res = await axios.get(sitemapUrl);
    const parser = new XMLParser();
    const parsed = parser.parse(res.data);

    const urls = Array.isArray(parsed.urlset.url)
      ? parsed.urlset.url.map(entry => entry.loc)
      : [parsed.urlset.url.loc];

    const limitedUrls = urls.slice(0, 5); // limit to latest 5
    console.log(`Found ${limitedUrls.length} article URLs`);

    const results = [];

    for (const url of limitedUrls) {
      try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        // JSON-LD first
        let jsonLdData;
        const jsonLd = $('script[type="application/ld+json"]').first().html();
        if (jsonLd) {
          try { jsonLdData = JSON.parse(jsonLd); } catch { jsonLdData = null; }
        }

        const title = jsonLdData?.headline ||
          $("h1").first().text().trim() ||
          $('meta[property="og:title"]').attr("content") ||
          "Untitled";

        const publishedAtRaw = jsonLdData?.datePublished ||
          $("time").attr("datetime") ||
          $('meta[property="article:published_time"]').attr("content") ||
          null;

        const imageUrl = jsonLdData?.image ||
          $('meta[property="og:image"]').attr("content") ||
          null;

        const snippet = $('meta[name="description"]').attr("content") ||
          jsonLdData?.description ||
          $("p").first().text().trim() ||
          "";

        const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();

        results.push({
          source: "DeadByDaylight Website",
          title,
          content: snippet,
          url,
          imageUrl,
          contentType: "text",
          code: null,
          publishedAt,
        });

        console.log(`Scraped: ${title}`);
      } catch (err) {
        console.error(`Failed to scrape ${url}:`, err.message);
      }
    }

    console.log(`Scraped ${results.length} website articles successfully.`);
    return results; // <-- just return array, don't save
  } catch (err) {
    console.error("Website scrape failed:", err.message);
    return [];
  }
}
