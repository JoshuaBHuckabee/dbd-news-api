// scripts/add-manual-post.js
// Run this script with `node scripts/add-manual-post.js`
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 👇 Replace with your actual manual post data
const manualPost = {
  title: "New Bloodpoint Code from Instagram",
  content: "Use code SPOOKY200K for 200,000 BP!",
  url: "https://instagram.com/dbd_official/post/abc123",
  imageUrl: "https://instagram.com/dbd_official/image123.jpg", // optional
  source: "Instagram",
  contentType: "code", // e.g. 'video', 'text', 'code', 'event'
  publishedAt: new Date("2025-10-21T12:00:00Z"),
  code: "SPOOKY200K", // optional
};

async function main() {
  try {
    const result = await prisma.newsItem.upsert({
      where: { url: manualPost.url }, // prevent duplicate
      update: {},
      create: manualPost,
    });

    console.log("Manual post added:", result.title);
  } catch (err) {
    console.error("Failed to insert post:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
