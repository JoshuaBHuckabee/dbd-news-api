// ------------------------------------------------------------
// Entry Point: Dead by Daylight News API
// ------------------------------------------------------------
// This file initializes and runs the Express.js server.
// It registers API routes, connects to the database, and
// starts the application on the defined port.
// ------------------------------------------------------------

import express from "express";
import newsRoutes from "./routes/news.js";
import prisma from "./lib/prisma.js"; 

// Create an Express application instance
const app = express();

// Define the port number for the server to listen on
const PORT = 3000;

/**
 * API Routes
 * ------------------------------------------------------------
 * Mounts route handlers under specific paths.
 * 
 * /api/news - Handles fetching and filtering of news items
 */
app.use("/api/news", newsRoutes);

/**
 * GET /
 * ------------------------------------------------------------
 * Root route for quick API status check.
 * Responds with a simple message to confirm the server is running.
 */
app.get("/", (req, res) => {
  res.send("DBD News API is running. Try /api/news");
});

/**
 * Server Startup
 * ------------------------------------------------------------
 * Begins listening for incoming HTTP requests
 * on the defined PORT (default: 3000).
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/**
 * Shutdown Handler
 * ------------------------------------------------------------
 * Ensures that all active database connections are properly
 * closed before terminating the process. This prevents
 * resource leaks and avoids hanging Prisma connections.
 */
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit();
});
