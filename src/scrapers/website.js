// ------------------------------------------------------------
// Scraper: Official Dead by Daylight Website
// ------------------------------------------------------------
// Fetches the latest news articles from the official DBD website
// by parsing the sitemap and extracting content from each page.
// Returns an array of news items formatted to match the Prisma schema.
// ------------------------------------------------------------

import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";

/**
 * Scrapes the latest Dead by Daylight news articles from the official website.
 * ------------------------------------------------------------
 * - Fetches sitemap XML to get recent article URLs.
 * - Loads each article page and extracts content via JSON-LD or HTML selectors.
 * - Returns an array of news items compatible with Prisma schema.
 *
 * @async
 * @function websiteScraper
 * @returns {Promise<Array<Object>>} Array of news item objects
 * @property {string} source - Platform name ("DeadByDaylight Website")
 * @property {string} title - Article title
 * @property {string} content - Article snippet or description
 * @property {string} url - Direct URL to the article
 * @property {string|null} imageUrl - Article image or thumbnail
 * @property {string} contentType - Type of content ("text")
 * @property {string|null} code - Optional field for platform-specific ID
 * @property {Date} publishedAt - Publication date
 */
export default async function websiteScraper() {
  const sitemapUrl = "https://deadbydaylight.com/sitemap/";

  try {
    console.log("Fetching sitemap...");
    const { data: sitemapData, headers } = await axios.get(sitemapUrl);

    let urls = [];

    
    // Detect if sitemap is XML or HTML
    const isXml =
      headers["content-type"]?.includes("xml") ||
      sitemapData.trim().startsWith("<?xml");

    if (isXml) {
      // Parse XML sitemap
      const parser = new XMLParser();
      const parsed = parser.parse(sitemapData);
      urls = Array.isArray(parsed.urlset?.url)
        ? parsed.urlset.url.map((entry) => entry.loc)
        : parsed.urlset?.url?.loc
        ? [parsed.urlset.url.loc]
        : [];
    } else {
      // Parse HTML sitemap page
      const $ = cheerio.load(sitemapData);

      // Likely structure: <a href="https://deadbydaylight.com/news/...">Title</a>
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (href && href.includes("/news/")) {
          // Normalize relative URLs
          const fullUrl = href.startsWith("http")
            ? href
            : `https://deadbydaylight.com${href}`;
          urls.push(fullUrl);
        }
      });
    }

    // Deduplicate and limit
    urls = [...new Set(urls)].slice(0, 5);
    console.log(`Found ${urls.length} article URLs`);

    const results = [];

    // Scrape each article page
    for (const url of urls) {
      try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        // Attempt to extract metadata via JSON-LD
        let jsonLdData;
        const jsonLd = $('script[type="application/ld+json"]').first().html();
        if (jsonLd) {
          try {
            jsonLdData = JSON.parse(jsonLd);
          } catch {
            jsonLdData = null;
          }
        }

        // Extract fields with fallbacks
        const title =
          jsonLdData?.headline ||
          $("h1").first().text().trim() ||
          $('meta[property="og:title"]').attr("content") ||
          "Untitled";

        // Skip static “Latest News” link
        if (/^latest news$/i.test(title.trim())) {
          console.log(`Skipping static page: ${title}`);
          continue;
        }

        const publishedAtRaw =
          jsonLdData?.datePublished ||
          $("time").attr("datetime") ||
          $('meta[property="article:published_time"]').attr("content") ||
          null;

        const imageUrl =
          jsonLdData?.image ||
          $('meta[property="og:image"]').attr("content") ||
          null;

        const snippet =
          $('meta[name="description"]').attr("content") ||
          jsonLdData?.description ||
          $("p").first().text().trim() ||
          "";

        const publishedAt = publishedAtRaw
          ? new Date(publishedAtRaw)
          : new Date();

        // Push structured item
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

    console.log(`✅ Scraped ${results.length} website articles successfully.`);
    return results;
  } catch (err) {
    console.error("❌ Website scrape failed:", err.message);
    return [];
  }
}
