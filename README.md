# 🔥 Dead by Daylight News API

A Node.js + Prisma project that aggregates Dead by Daylight news from multiple official sources like YouTube and Twitter. Designed for Discord bots, dashboards, and fan sites.

---

## 🚀 Features

- ✅ Scrapes latest YouTube videos from Behaviour's official channel
- ✅ Pulls tweets from DBD Twitter (e.g. promo codes)
- ✅ Stores all news in a clean, deduplicated database (SQLite via Prisma)
- ✅ `/api/news` endpoint with filtering and pagination
- ✅ Unified data format across all sources

---

## 📦 Tech Stack

- Node.js + Express
- Prisma ORM + SQLite (local dev)
- Axios, Cheerio (scraping)
- dotenv for API keys

---

## 🧠 Data Model

All news items follow this schema:

```ts
NewsItem {
  id          Int
  title       String
  content     String
  url         String (unique)
  imageUrl    String?
  source      String  // e.g. YouTube, Twitter
  contentType String  // e.g. video, code, event
  code        String? // promo code if available
  publishedAt Date
}
