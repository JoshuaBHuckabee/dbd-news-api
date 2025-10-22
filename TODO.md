# 🎯 Dead by Daylight News API – TODO List

A unified news aggregator for Dead by Daylight events, patch notes, codes, and media across all major platforms.

---

## Current Progress

- Express server with `/api/news` endpoint
- YouTube scraper (Prisma DB + upsert logic)
- Twitter scraper working and saving to DB
- Pagination, filtering by `source`, `type`
- Prisma database + schema implemented
- Nodemon for auto-reload in dev
- `.env` used for API keys (YouTube, Twitter, etc.)
- Prisma migrations tracked in Git

---

## Features by Area

### 1. Database: Unified Schema

**Model: `NewsItem`**

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| title | String | Short title |
| content | String? | Description or body |
| url | String (unique) | Original link |
| imageUrl | String? | Thumbnail or preview |
| source | String | "YouTube", "Twitter", etc. |
| contentType | String | "video", "code", "update", etc. |
| code | String? | Promo/redeem code, if present |
| publishedAt | DateTime | Original publish timestamp |
| createdAt | DateTime | DB timestamp |

- Implemented via Prisma schema  
- Deduplication by `url` using `.upsert()`  
- Auto timestamps

---

### 2. Scrapers (One Module Per Source)

Each scraper returns an array of `NewsItem`-compatible objects.

| Source         | Status       | Tasks |
|----------------|--------------|-------|
| **YouTube**    | ✅ Working   | [ ] Regex for codes in video descriptions |
| **Twitter**    | ✅ Working   | [ ] Improve code parsing |
| **Instagram**  | 🕐 Planned   | [ ] Puppeteer/cheerio scraper |
| **Official Site** | 🕐 Planned | [ ] RSS or cheerio scraping |
| **Steam/Forums** | 🕐 Planned | [ ] RSS or static scraper |
| **Reddit**     | 🕐 Planned   | [ ] Pushshift or Reddit API |
| **Event Calendar Pages** | 🕐 Bonus | [ ] Scrape upcoming events/timers |

All scrapers save to DB using the shared `saveData()` utility.

---

### 3. API Features

**Endpoint:** `/api/news`

| Feature | Status |
|--------|--------|
| GET all news | ✅ |
| Filter by `source` | ✅ |
| Filter by `type` | ✅ |
| Pagination (`page`, `limit`) | ✅ |
| Sort by newest first | ✅ |
| Add API docs | 🔜 Planned |
| Add `/api/news/:id` | 🔜 Optional |

---

### 4. Developer Experience

| Task | Status |
|------|--------|
| `.env` and dotenv config | ✅ |
| Prisma + SQLite local DB | ✅ |
| Modular folder structure | ✅ |
| Dev server with Nodemon | ✅ |
| Reusable `saveData()` for all scrapers | ✅ |
| Prisma client re-used via `/lib/prisma.js` | ✅ |

---

### 5. Infrastructure & Automation

| Feature | Status |
|---------|--------|
| Periodic scraping (cron or schedule) | 🔜 Planned |
| GitHub Actions for lint/test/CI | 🔜 Planned |
| Deploy API to Vercel / Fly.io / Render | 🔜 Planned |
| Protect `.env` and secrets | ✅ |
| Add `prisma/dev.db` to `.gitignore` | ✅ |

---

### 6. Testing

| Task | Status |
|------|--------|
| Write scraper unit tests | 🕐 Not started |
| Test database saving / deduplication | 🕐 |
| Integration tests for `/api/news` | 🕐 |
| Mocking external APIs | 🕐 |

---

### 7. Docs

| Task | Status |
|------|--------|
| Update `README.md` with setup + usage | 🔄 In Progress |
| Add example API responses | 🕐 |
| Scraper dev guide | 🕐 |
| Deployment instructions | 🕐 |

---

## Next Actions (Suggestion)

1. Final cleanup: remove any unused `fs`, `data.json`, old logic
2. Finalize README.md with current usage
3. Test DB-saving from each scraper
4. Add Steam or Website scraper
5. Set up a scraping schedule (cron or interval)
6. Prepare for deployment

---

