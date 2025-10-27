// ------------------------------------------------------------
// Utility: saveData()
// ------------------------------------------------------------
// Responsible for saving scraped news items into the database.
// This function filters out outdated entries, prevents duplicates,
// and ensures only valid, recent news is stored.
// ------------------------------------------------------------

import { PrismaClient } from "@prisma/client";

// Initialize a Prisma client instance for database operations
const prisma = new PrismaClient();

/**
 * Save an array of news items to the database.
 * ------------------------------------------------------------
 * - Filters out items older than 30 days.
 * - Deduplicates entries based on `url` using Prisma's upsert().
 * - Tracks how many items were saved or skipped.
 *
 * @async
 * @function saveData
 * @param {Array<Object>} newsItems - List of news item objects to save.
 * @property {string} newsItems[].title - News item title
 * @property {string} newsItems[].content - Main content or description
 * @property {string} newsItems[].url - Unique URL for deduplication
 * @property {string} [newsItems[].imageUrl] - Optional thumbnail or image URL
 * @property {string} newsItems[].source - Source platform (e.g., "YouTube", "Steam")
 * @property {string} newsItems[].contentType - Type of content (e.g., "video", "article")
 * @property {string} [newsItems[].code] - Optional platform-specific code or ID
 * @property {string|Date} newsItems[].publishedAt - Publication timestamp
 */
export async function saveData(newsItems) {
  // Define time threshold: only keep news from the past 30 days
  const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
  const cutoffDate = Date.now() - ONE_MONTH_MS;

  // Counters for tracking saved and skipped items
  let savedCount = 0;
  let skippedCount = 0;

  // Process each news item individually
  for (const item of newsItems) {
    const publishedTime = new Date(item.publishedAt).getTime();

    // Skip items older than 30 days
    if (publishedTime < cutoffDate) {
      console.log(
        `Skipping old item: ${item.title} (${new Date(publishedTime).toDateString()})`
      );
      skippedCount++;
      continue;
    }

    try {
      // Upsert ensures no duplicate entries (based on unique `url`)
      await prisma.newsItem.upsert({
        where: { url: item.url },
        update: {}, // No updates performed if record already exists
        create: {
          title: item.title,
          content: item.content,
          url: item.url,
          imageUrl: item.imageUrl ?? null,
          source: item.source,
          contentType: item.contentType,
          code: item.code ?? null,
          publishedAt: new Date(item.publishedAt),
        },
      });

      savedCount++;
    } catch (err) {
      // Log errors without halting the entire save process
      console.error(`Failed to save item (${item.url}): ${err.message}`);
    }
  }

  // Summary log for the batch operation
  console.log(
    `Saved ${savedCount} new item(s), skipped ${skippedCount} old/duplicate item(s).`
  );

  // Disconnect Prisma to release the database connection
  await prisma.$disconnect();
}
