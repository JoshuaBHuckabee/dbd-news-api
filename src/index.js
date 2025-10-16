import express from "express";
import newsRoutes from "./routes/news.js";
import youtubeScraper from "./scrapers/youtube.js";
import { saveData } from "./utils/saveData.js";

const app = express();
const PORT = 3000;

app.use("/api/news", newsRoutes);

app.get("/", (req, res) => {
  res.send("✅ DBD News API is running. Try /api/news");
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Scrape YouTube on startup
  try {
    const youtubeNews = await youtubeScraper();
    if (youtubeNews.length > 0) {
      await saveData(youtubeNews);
    }
  } catch (err) {
    console.error("❌ Startup scrape failed:", err.message);
  }
});
