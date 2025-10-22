import prisma from '../lib/prisma.js';
import axios from "axios";                     // For HTTP requests
import dotenv from "dotenv";                   // To load env vars from .env file
dotenv.config();                              // Initialize dotenv

// Load YouTube API key from environment variables
const API_KEY = process.env.YOUTUBE_API_KEY;

// Behaviour Interactive's official Dead by Daylight YouTube channel ID
const CHANNEL_ID = "UCaSgsFdGbwjfdawl3rOXiwQ";

export default async function youtubeScraper() {
  try {
    // Make GET request to YouTube Data API to fetch latest videos from channel
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          key: API_KEY,
          channelId: CHANNEL_ID,
          part: "snippet,id",    // Specify the data parts we want
          type: "video",         // Only fetch videos (not playlists, channels, etc)
          order: "date",         // Sort by newest first
          maxResults: 5,         // Limit to 5 videos per request
        }
      }
    );

    // Map the API response into your NewsItem-compatible format
    const videos = res.data.items.map(item => ({
      source: "YouTube",                              // Source platform
      title: item.snippet.title,                      // Video title
      content: item.snippet.description,              // Video description
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`, // Direct URL to video
      publishedAt: new Date(item.snippet.publishedAt), // Published date, converted to Date object
      imageUrl: item.snippet.thumbnails?.high?.url ?? null, // Video thumbnail (if available)
      contentType: "video",                           // Type of content
      code: null,                                     // Optional promo code field (none here)
    }));

    console.log(`Scraped ${videos.length} YouTube videos`);

    // Loop through each scraped video and insert into DB with deduplication using upsert
    for (const video of videos) {
      try {
        await prisma.newsItem.upsert({
          where: { url: video.url }, // Use URL as unique key to prevent duplicates
          update: {},                // No updates if already exists (optional: add update fields here)
          create: video,             // Create new record if it doesn’t exist
        });
      } catch (dbErr) {
        // Log DB errors individually without stopping the entire scraper
        console.error(`Failed to insert video ${video.url}:`, dbErr.message);
      }
    }

    // Disconnect Prisma client to free up DB connections and prevent hanging
    await prisma.$disconnect();

    // Return the scraped videos array for potential further processing
    return videos;

  } catch (err) {
    // Handle and log request or other unexpected errors
    console.error("YouTube scrape failed:", err.message);

    // Ensure Prisma client disconnects even if scraping fails
    await prisma.$disconnect();

    return []; // Return empty array on failure
  }
}
