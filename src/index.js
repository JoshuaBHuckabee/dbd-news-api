import express from "express";
import newsRoutes from "./routes/news.js";
import youtubeScraper from "./scrapers/youtube.js";
import twitterScraper from "./scrapers/twitter.js";
import { saveData } from "./utils/saveData.js";
import prisma from "./lib/prisma.js"; 

const app = express();
const PORT = 3000;

// Routes
app.use("/api/news", newsRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("DBD News API is running. Try /api/news");
});

// TEST ONLY: List all news
app.get("/all", async (req, res) => {
  const allNews = await prisma.newsItem.findMany({
    orderBy: { publishedAt: "desc" },
  });
  res.json(allNews);
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Scrape YouTube on startup
  try {
    const youtubeNews = await youtubeScraper();
    if (youtubeNews.length > 0) {
      await saveData(youtubeNews);
    }
  } catch (err) {
    console.error("Startup scrape failed:", err.message);
  }

  // Scrape Twitter
  try {
    const twitterNews = await twitterScraper();
    if (twitterNews.length > 0) {
      await saveData(twitterNews);
    }
  } catch (err) {
    console.error("Twitter scrape failed:", err.message);
  }
});

// Graceful shutdown to prevent hanging DB connections
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit();
});
