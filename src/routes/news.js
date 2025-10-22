// src/routes/news.js

import { Router } from "express";
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /news
 * Fetch news items from the database with optional pagination and filtering.
 * Query parameters:
 *  - source: filter by source platform (e.g. "YouTube")
 *  - limit: number of items per page (default 10)
 *  - page: page number (default 1)
 */
router.get("/", async (req, res) => {
  const { source, type, page = 1, limit = 10 } = req.query;

  try {
    const filters = {};

    if (source) filters.source = source;
    if (type) filters.contentType = type;

    const skip = (page - 1) * limit;

    const items = await prisma.newsItem.findMany({
      where: filters,
      orderBy: { publishedAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    res.json(items);
  } catch (err) {
    console.error("Failed to fetch news:", err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
