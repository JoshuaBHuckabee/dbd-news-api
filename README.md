# Dead by Daylight News API

An open-source aggregator API for tracking **Dead by Daylight** news updates across platforms — YouTube, Steam, social media, and more.

---

## Features

- Scrapes news from official platforms (YouTube, Steam)
- Stores structured news items in a **SQLite database**
- Simple API to fetch, filter, and paginate news
- Run scrapers **manually** when needed — no auto-fetching
- Deduplicates based on `url` so no double posts
- Easy to extend with new platforms (Reddit, Instagram, etc.)

## Tech Stack

- Node.js + Express
- Prisma ORM + SQLite (local dev)
- Axios, Cheerio (scraping)
- dotenv for API keys

## Database

Powered by [Prisma](https://www.prisma.io/) and SQLite.

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
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
```

---

## Manual Scraping

You control when scraping happens!

### Run a single scraper

```bash
node scripts/run-scrapers.js youtube
node scripts/run-scrapers.js steam
```

### Run all scrapers

```bash
node scripts/run-scrapers.js all
```

---

## API Usage

<b>GET</b> `/api/news`

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
- [ ] Deploy to Vercel / Railway / Fly.io
