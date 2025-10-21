# Dead by Daylight News API — Refactored TODO List

## Current Progress
 - Basic Express server with /news endpoint
 - YouTube scraper fetching latest videos
 - JSON file storage (soon to be replaced)
 - Nodemon for dev

## 1. Design and Set Up Unified Data Model
 - Choose DB (SQLite for now via Prisma)
 - Define unified schema for NewsItem (see above)
 - Create migration & test insert/query logic
 - Write wrapper functions: addNewsItem(), getNews(), etc.

## 2. Scrapers (One Module Per Source)

| Source        | Status       | Tasks                                                                 |
|---------------|--------------|------------------------------------------------------------------------|
| **YouTube**   | ✅ Basic     | - [ ] Add thumbnails<br>- [ ] Regex for codes                          |
| **Twitter**   | ⏳ Planned   | - [ ] Choose API/scraper<br>- [ ] Parse tweets                         |
| **Instagram** | ⏳ Planned   | - [ ] Puppeteer/cheerio script                                         |
| **Official Site** | ⏳ Planned | - [ ] RSS or static scraper                                           |
| **Steam/Forum**   | ⏳ Planned | - [ ] Use RSS or cheerio                                              |
| **Reddit**    | ⏳ Planned   | - [ ] Pushshift / Reddit API                                          |
| **Event Pages** | ⏳ Bonus    | - [ ] Scrape calendar if public                                       |

---

- Each scraper should return an array of **`NewsItem`-compatible objects**.
- Deduplication is handled via the `url` field in the database (`@unique` constraint).


## 3. Database Migration and Cleanup
 - Replace JSON file system with DB-only storage
 - Migrate existing data if needed
 - Add indexes (e.g., by code, source, publishedAt)

## 4. Improve /news API
 - Filter by source, code, date, type
 - Pagination (?page=1&limit=10)
 - Add /codes endpoint (only entries with codes)
 - Add /sources endpoint (list available sources)

## 5. Security & Resilience
 - Handle rate limiting (e.g., with axios-retry)
 - Centralized error logging per scraper
 - .env for API keys and secrets
 - Mask or redact codes in public if needed

## 6. Automation
 - Add node-cron job to run scrapers hourly
 - Write runAllScrapers() to orchestrate jobs
 - Log new items or detected codes

## 7. Testing & Documentation
 - Unit test each scraper (mock HTML/API)
 - Integration test /news endpoint
 - Markdown docs: README.md, API.md, SCRAPERS.md
 - Optional: Swagger/OpenAPI spec

## 8. Deployment
 - Choose host (Render / Railway / Fly.io / Vercel)
 - Store .env securely
 - Set up database and cron tasks in production

## Final Touches (for Thesis)
 - Add a dashboard or UI (basic React app?)
 - Export data as CSV or RSS feed
 - Timeline view of patch notes / codes / events

## Notes

Feel free to update this TODO list as the project evolves.  
Pull requests and contributions are welcome!
