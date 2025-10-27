// Import the Prisma client to interact with the database
import prisma from '../src/lib/prisma.js';

// Number of days to keep news items in the database
const DAYS_TO_KEEP = 30;

// Calculate the cutoff date: anything older than this will be deleted
const cutoff = new Date(Date.now() - DAYS_TO_KEEP * 24 * 60 * 60 * 1000);

/**
 * Deletes old news items from the database
 * - Only items with publishedAt < cutoff are removed
 * - Logs how many items were deleted
 * - Disconnects Prisma after completion
 */
async function cleanup() {
  // Delete all news items older than the cutoff date
  const deleted = await prisma.newsItem.deleteMany({
    where: {
      publishedAt: { lt: cutoff } // lt = less than
    }
  });

  // Log the number of deleted items for monitoring purposes
  console.log(`Deleted ${deleted.count} old news items (older than ${DAYS_TO_KEEP} days)`);

  // Disconnect Prisma to close database connections
  await prisma.$disconnect();
}

// Run the cleanup function and catch any errors
cleanup().catch(e => {
  // Log the error if something goes wrong
  console.error(e);

  // Ensure Prisma disconnects even if an error occurs
  prisma.$disconnect();
});
