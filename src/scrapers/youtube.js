import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Load YouTube API key from environment variables
const API_KEY = process.env.YOUTUBE_API_KEY;

// Behaviour Interactive's official Dead by Daylight YouTube channel ID
const CHANNEL_ID = "UCaSgsFdGbwjfdawl3rOXiwQ";

/**
 * Scrapes the latest YouTube videos from Behaviour Interactive's channel.
 * Returns an array of news items matching the Prisma schema.
 */
export default async function youtubeScraper() {
  try {
    const res = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        key: API_KEY,
        channelId: CHANNEL_ID,
        part: "snippet,id",
        type: "video",
        order: "date",
        maxResults: 5,
      },
    });

    const videos = res.data.items.map(item => ({
      source: "YouTube",
      title: item.snippet.title,
      content: item.snippet.description,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      publishedAt: new Date(item.snippet.publishedAt),
      imageUrl: item.snippet.thumbnails?.high?.url ?? null,
      contentType: "video",
      code: null,
    }));

    console.log(`Scraped ${videos.length} YouTube videos`);
    return videos; // <-- just return array, don't save to DB
  } catch (err) {
    console.error("YouTube scrape failed:", err.message);
    return [];
  }
}
