// Import necessary modules from Express and Prisma
import { Router } from "express";
import prisma from '../lib/prisma.js';

// Create a new Express router instance
const router = Router();

/**
 * GET /api/news
 * Fetch news items from the database with optional pagination and filtering
 * by source and content type.
 * 
 * Query Parameters:
 *  - source: Filter by source platform (e.g., "YouTube")
 *  - type: Filter by content type (e.g., "video", "article")
 *  - limit: Number of items per page (default = 10)
 *  - page: Page number for pagination (default = 1)
 */
router.get("/", async (req, res) => {
  // Destructure query parameters with default values for pagination
  const { source, type, page = 1, limit = 10 } = req.query;

  try {
    // Initialize an empty filter object to store dynamic conditions
    const filters = {};

    // Add optional filters if query parameters are provided
    if (source) filters.source = source;
    if (type) filters.contentType = type;

    // Calculate how many records to skip based on the current page
    const skip = (page - 1) * limit;

    // Fetch news items from the database using Prisma ORM
    const items = await prisma.newsItem.findMany({
      where: filters,                  // Apply optional filters
      orderBy: { publishedAt: "desc" }, // Sort results by most recent
      skip: parseInt(skip),             // Skip items from previous pages
      take: parseInt(limit),            // Limit results to the requested page size
    });

    // Return the fetched items as a JSON response
    res.json(items);
  } catch (err) {
    // Log any errors and send a 500 Internal Server Error response
    console.error("Failed to fetch news:", err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

/**
 * GET /api/news/latest
 * ------------------------------------------------------------
 * Fetch the latest news item(s) from the database.
 * Query Parameters (optional):
 *  - limit: Number of items to fetch (default = 5)
 * 
 * Response:
 *  - 200: Array of news items sorted by most recent
 *  - 500: Internal server error
 */
router.get("/latest", async (req, res) => {
  // Parse limit from query string and default to 5
  const limit = parseInt(req.query.limit) || 5;

  try {
    // Fetch the most recent news items, limited by `limit`
    const latestNews = await prisma.newsItem.findMany({
      orderBy: { publishedAt: "desc" },  // sort newest first
      take: limit,                       // only take N items
    });

    res.json(latestNews);
  } catch (err) {
    console.error("Failed to fetch latest news:", err.message);
    res.status(500).json({ error: "Failed to fetch latest news" });
  }
});


/**
 * GET /api/news/source/:source
 * ------------------------------------------------------------
 * Fetch news items filtered by source platform (YouTube, Steam, etc.).
 * 
 * URL Parameters:
 *  - source: The name of the source to filter by
 * Query Parameters (optional):
 *  - limit: Number of items to fetch (default = 10)
 * 
 * Response:
 *  - 200: Array of news items matching the source
 *  - 404: If no items are found for the given source
 *  - 500: Internal server error
 */
router.get("/source/:source", async (req, res) => {
  const { source } = req.params;
  const { limit = 10 } = req.query;

  try {
    const items = await prisma.newsItem.findMany({
      where: { source },
      orderBy: { publishedAt: "desc" },
      take: parseInt(limit),
    });

    if (!items.length) {
      return res.status(404).json({ error: `No news found for source: ${source}` });
    }

    res.json(items);
  } catch (err) {
    console.error(`Failed to fetch news by source ${source}:`, err.message);
    res.status(500).json({ error: "Failed to fetch news by source" });
  }
});

/**
 * GET /api/news/:id
 * ------------------------------------------------------------
 * Fetch a single news item by its unique ID.
 * 
 * URL Parameters:
 *  - id: The unique identifier of the news item
 * 
 * Response:
 *  - 200: JSON object containing the news item
 *  - 404: If no news item with the given ID is found
 *  - 500: Internal server error
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const newsItem = await prisma.newsItem.findUnique({
      where: { id },
    });

    if (!newsItem) {
      return res.status(404).json({ error: "News item not found" });
    }

    res.json(newsItem);
  } catch (err) {
    console.error(`Failed to fetch news item ${id}:`, err.message);
    res.status(500).json({ error: "Failed to fetch news item" });
  }
});

// Export the router to be used in the main server setup
export default router;
