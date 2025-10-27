// Run this script with `node scripts/add-manual-post.js`
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 👇 Replace with your actual manual post data
const manualPost = {
  title: "Galaxies Autumn Showcase",
  content: "We hope you enjoyed the Galaxies Autumn Showcase./nIf you had trouble claiming your drop yesterday, you can now redeem it by entering the code GALAXIES in the in-game Store before October 27, 1PM ET.",
  url: "https://www.facebook.com/photo?fbid=1374011457415236&set=a.728706308612424",
  imageUrl: "https://scontent-dfw5-1.xx.fbcdn.net/v/t39.30808-6/571147629_1374011460748569_8619950560978014544_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=fLdnhqQnFnYQ7kNvwGM2NnZ&_nc_oc=AdnRqHVO_b57Gk-Ns0aGhZXDQqtrdaLykoc5qp7pT6U_yFvCghHgEroddy2RYO2e54JIh0zsIAmu0AXrecrdBBkG&_nc_zt=23&_nc_ht=scontent-dfw5-1.xx&_nc_gid=fKRa0ARcUh6FyuS9UB9Esw&oh=00_AfeYmQfHnSzgPqDn_S5a2PY8CjFDb2q_-FcXX1lkgZaV_A&oe=6902163F", // optional
  source: "Facebook",
  contentType: "code", // e.g. 'video', 'text', 'code', 'event'
  publishedAt: new Date("2025-10-24T12:00:00Z"),
  code: "GALAXIES", // optional
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
