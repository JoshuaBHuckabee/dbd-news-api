import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Save an array of news items to the database.
 * Filters out items older than 30 days.
 * @param {Array} newsItems - Array of news item objects
 */
export async function saveData(newsItems) {
  const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
  const cutoffDate = Date.now() - ONE_MONTH_MS;

  let savedCount = 0;
  let skippedCount = 0;

  for (const item of newsItems) {
    const publishedTime = new Date(item.publishedAt).getTime();

    // Skip items older than 30 days
    if (publishedTime < cutoffDate) {
      console.log(`Skipping old item: ${item.title} (${new Date(publishedTime).toDateString()})`);
      skippedCount++;
      continue;
    }

    try {
      // Upsert the news item to avoid duplicates
      await prisma.newsItem.upsert({
        where: { url: item.url },
        update: {}, // do nothing if already exists
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
      console.error(`Failed to save item (${item.url}): ${err.message}`);
    }
  }

  console.log(`Saved ${savedCount} new item(s), skipped ${skippedCount} old/duplicate item(s).`);

  // Close Prisma connection
  await prisma.$disconnect();
}
