import prisma from '../src/lib/prisma.js';

const DAYS_TO_KEEP = 30;
const cutoff = new Date(Date.now() - DAYS_TO_KEEP * 24 * 60 * 60 * 1000);

async function cleanup() {
  const deleted = await prisma.newsItem.deleteMany({
    where: {
      publishedAt: { lt: cutoff }
    }
  });

  console.log(`Deleted ${deleted.count} old news items (older than ${DAYS_TO_KEEP} days)`);
  await prisma.$disconnect();
}

cleanup().catch(e => {
  console.error(e);
  prisma.$disconnect();
});
