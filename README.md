# Dead by Daylight News API

An open-source aggregator API for tracking **Dead by Daylight** news updates across platforms — YouTube, Steam, social media, and more.

---

[![Node.js](https://img.shields.io/badge/node.js-18+-green?logo=node.js&logoColor=white)](https://nodejs.org/) 
[![Express](https://img.shields.io/badge/express-4.x-black?logo=express&logoColor=white)](https://expressjs.com/) 
[![Prisma](https://img.shields.io/badge/prisma-4.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/) 
[![SQLite](https://img.shields.io/badge/sqlite-3.41-blue?logo=sqlite&logoColor=white)](https://www.sqlite.org/index.html) 
[![Axios](https://img.shields.io/badge/axios-1.6.2-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/) 
[![Cheerio](https://img.shields.io/badge/cheerio-1.0.0-orange?logo=cheerio&logoColor=white)](https://cheerio.js.org/) 
[![dotenv](https://img.shields.io/badge/dotenv-latest-black?logo=dotenv&logoColor=white)](https://www.npmjs.com/package/dotenv)

---

[![YouTube](https://img.shields.io/badge/YouTube-news-red?logo=youtube&logoColor=white)](https://www.youtube.com/channel/UCaSgsFdGbwjfdawl3rOXiwQ) 
[![Steam](https://img.shields.io/badge/Steam-news-000000?logo=steam&logoColor=white)](https://store.steampowered.com/app/381210) 
[![Website](https://img.shields.io/badge/Dead_by_Daylight-website-FF4500?logo=ghost&logoColor=white)](https://deadbydaylight.com/news)



## Features

- Scrapes news from official platforms (YouTube, Steam, and DeadByDaylight official website)
- Stores structured news items in a **Neon PostgreSQL database** via Prisma
- Simple API to fetch, filter, and paginate news
- Run scrapers **manually** when needed — no auto-fetching
- Deduplicates based on `url` so no double posts
- Easy to extend with new platforms (Reddit, Instagram, etc.)

## Tech Stack

- Node.js + Express
- Prisma ORM + Neon PostgreSQL
- Axios, Cheerio, fast-xml-parser (scraping)
- dotenv for API keys

## Database


Powered by [Prisma](https://www.prisma.io/) and [Neon PostgreSQL](https://neon.com/).

Originally built with SQLite, now upgraded to a managed Postgres backend.

Each `newsItem` includes:

```ts
{
  id: Int,
  title: String,
  content: String,
  url: String,          // Unique
  imageUrl: String?,
  source: String,       // e.g. "YouTube", "Steam"
  contentType: String,  // e.g. "video", "text", "code"
  code: String?,        // Redeem code if present
  publishedAt: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## Setup Instructions

### 1. Clone the respository

```bash
git clone https://github.com/yourusername/dbd-news-api
cd dbd-news-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your environment

```env
YOUTUBE_API_KEY=your_api_key_here
DATABASE_URL=your_postgres_connection_string
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
```
Prisma client is available in `src/lib/prisma.js`
All scrapers save to DB via `src/utils/saveData.js`

---

## Manual Scraping

You control when scraping happens!

### Run a single scraper

```bash
node scripts/run-scrapers.js youtube
node scripts/run-scrapers.js steam
node scripts/run-scrapers.js website
```

### Run all scrapers

```bash
node scripts/run-scrapers.js all
```
All scrapers fetch news and then save to DB via `saveData.js`. Each scraper only returns an array of news items; the saving is handled centrally.

---

## API Usage

<b>GET</b> `/api/news`

Fetch news items from the database with optional pagination and filtering.

### Query Parameters
- `source` ( optional ) - Filter by source ( `YouTube`, `Steam`, etc )
- `type` ( optional ) - Filter by content type ( `video`, `text`, `code` )
- `page` ( optional, default: `1` ) - Page number for pagination
- `limit` ( optional, default: 10 ) - Number of items per page

### Example Request

```http
GET /api/news?source=Steam&type=text&page=1&limit=5
```

This would return the first 5 news items from Steam with content type "text".

---

<b>GET</b> `/api/news/latest`

Fetch the latest news items, sorted by most recent.

### Query Parameters

- `limit` ( optional, default: 5 ) - Number of items to fetch

### Example Request

```http
GET /api/news/latest?limit=3
```
Returns the 3 most recent news items.

---

<b>GET</b> `/api/news/source/:source`

Fetch news items filtered by source platform.

### URL Parameters
- `source` - The name of the source to filter by ( `YouTube`, `Steam`, etc )

### Query Parameters
- `limit` - ( optional, default: `10` ) - Number of items to fetch

### Example Request

```http
GET /api/news/source/YouTube?limit=5
```
Returns the 5 most recent news items from YouTube.

---

<b>GET</b> `/api/news/:id`

Fetch a single news item by its unique ID.

### URL Parameters

- `id` - The unique identifier of the news item

### Example Request

```http
GET /api/news/cmh56fnia0000uyk068jn2ome
```

Returns the news item matching the provided ID.

## Project Structure

<pre>
dbd-news-api/
├── prisma/               # Prisma schema & DB
├── scripts/              # CLI scripts (manual scraper runner)
├── src/
│   ├── index.js          # API server
│   ├── routes/           # Express routes
│   ├── scrapers/         # Per-platform scrapers
│   ├── utils/            # Shared helpers
├── README.md
</pre>

---

## TODO/Next Steps
- [ ] Add Reddit support
- [ ] Add input form or CLI for manual posts (e.g. Instagram)
- [ ] Add updatedAt tracking for edited posts
- [ ] Add webhook to post new content to Discord
- [x] Move to Neon PostgreSQL
- [x] Clean up content field from steam post
- [ ] Deploy to Render
