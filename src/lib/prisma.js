// ------------------------------------------------------------
// Library: Prisma Client Initialization
// ------------------------------------------------------------
// This module creates and exports a single PrismaClient instance,
// ensuring a consistent database connection across the application.
//
// In development, the instance is cached globally to prevent
// multiple connections from being created during hot reloads.
// ------------------------------------------------------------

import { PrismaClient } from "@prisma/client";

// Create or reuse a global PrismaClient instance
// ------------------------------------------------------------
// - In production: always create a new Prisma client.
// - In development: reuse the existing global instance to avoid
//   connection limits caused by frequent restarts (e.g., with Nodemon).
const prisma = global.prisma || new PrismaClient();

// Cache Prisma client globally in non-production environments
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Export the Prisma client for use throughout the project
export default prisma;
