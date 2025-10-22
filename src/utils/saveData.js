import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveData(newsItems) {
  let savedCount = 0;

  for (const item of newsItems) {
    try {
      await prisma.newsItem.upsert({
        where: { url: item.url }, // deduplicate based on unique URL
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

  console.log(`Saved ${savedCount} new item(s)`);
}
