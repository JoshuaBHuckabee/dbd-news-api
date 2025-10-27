// ------------------------------------------------------------
// Scraper: Twitter (Static / Placeholder)
// ------------------------------------------------------------
// Provides a temporary set of tweets from Behaviour Interactive's
// official Dead by Daylight Twitter account. Returns an array of
// news items formatted to match the Prisma schema.
// ------------------------------------------------------------

import prisma from "../lib/prisma.js";

/**
 * Scrapes the latest Twitter posts.
 * ------------------------------------------------------------
 * - Currently uses static example tweets while API integration
 *   is being determined.
 * - Returns an array of news items compatible with the Prisma schema.
 *
 * @async
 * @function twitterScraper
 * @returns {Promise<Array<Object>>} Array of news item objects
 * @property {string} source - Platform name ("Twitter")
 * @property {string} title - Tweet headline or title
 * @property {string} content - Tweet content or description
 * @property {string} url - Direct URL to the tweet
 * @property {string|null} imageUrl - Tweet image if available
 * @property {string} contentType - Type of content ("post" or "code")
 * @property {string|null} code - Promo code if applicable
 * @property {Date} publishedAt - Publication date
 */
export default async function twitterScraper() {
  // Static tweets used as placeholders while API integration is in progress
  const tweets = [
    {
      title: "New Rift Coming!",
      content: "Check out the new Tome and cosmetics.",
      url: "https://twitter.com/DeadByBHVR/status/1234567890",
      imageUrl: null, // Add image URL if available
      source: "Twitter",
      contentType: "post",
      code: null,
      publishedAt: new Date("2025-10-21T14:30:00Z"),
    },
    {
      title: "Promo Code Drop!",
      content: "Use code SCARYSURVIVOR for 200k BP!",
      url: "https://twitter.com/DeadByBHVR/status/9876543210",
      imageUrl: null,
      source: "Twitter",
      contentType: "code",
      code: "SCARYSURVIVOR",
      publishedAt: new Date("2025-10-20T17:45:00Z"),
    },
  ];

  // Log number of tweets "scraped"
  console.log(`Scraped ${tweets.length} Twitter post(s)`);

  // Return structured array; saving is handled elsewhere
  return tweets;
}
