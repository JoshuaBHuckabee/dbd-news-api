// ------------------------------------------------------------
// Scraper: YouTube
// ------------------------------------------------------------
// Fetches the latest videos from Behaviour Interactive's official
// Dead by Daylight YouTube channel and transforms them into
// a standardized format compatible with the Prisma news schema.
// ------------------------------------------------------------

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Load YouTube API key from environment variables
const API_KEY = process.env.YOUTUBE_API_KEY;

// Behaviour Interactive's official Dead by Daylight YouTube channel ID
const CHANNEL_ID = "UCaSgsFdGbwjfdawl3rOXiwQ";

/**
 * Scrapes the latest YouTube videos from Behaviour Interactive's channel.
 * ------------------------------------------------------------
 * - Fetches the 5 most recent videos.
 * - Maps results to the Prisma newsItem schema.
 * - Does not save to the database; only returns structured array.
 *
 * @async
 * @function youtubeScraper
 * @returns {Promise<Array<Object>>} Array of news item objects
 * @property {string} source - Platform name ("YouTube")
 * @property {string} title - Video title
 * @property {string} content - Video description
 * @property {string} url - Direct YouTube URL
 * @property {Date} publishedAt - Publication date
 * @property {string|null} imageUrl - Thumbnail URL if available
 * @property {string} contentType - Type of content ("video")
 * @property {string|null} code - Optional field for platform-specific ID
 */
export default async function youtubeScraper() {
  try {
    // Call YouTube Data API to fetch recent videos
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

    // Transform API response into standardized news item objects
    const videos = res.data.items.map((item) => ({
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
    return videos;
  } catch (err) {
    // Log errors and return empty array to prevent crash
    console.error("YouTube scrape failed:", err.message);
    return [];
  }
}
