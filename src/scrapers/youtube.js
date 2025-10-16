// src/scrapers/youtube.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UCaSgsFdGbwjfdawl3rOXiwQ"; // Behaviour's official channel

export default async function youtubeScraper() {
  try {
    const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`, {
            params: {
                key: API_KEY,
                channelId: CHANNEL_ID,
                part: "snippet,id",
                type: "video",
                order: "date",
                maxResults: 5,
            }
        }
    );

    const videos = res.data.items.map(item => ({
      source: "YouTube",
      title: item.snippet.title,
      content: item.snippet.description,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      published_at: item.snippet.publishedAt,
      media_url: item.snippet.thumbnails?.high?.url,
      type: "update",
    }));

    console.log(`📰 Scraped ${videos.length} YouTube videos`);
    return videos;
  } catch (err) {
    console.error("❌ YouTube scrape failed:", err.message);
    return [];
  }
}
