# Dead by Daylight News API - TODO List

## Current Progress
- Basic Express server with `/news` endpoint
- YouTube scraper fetching latest videos from DBD official channel
- JSON file storage with deduplication
- Nodemon configured with ignore rules to prevent restart loops

## Planned Features

1. **Migrate JSON storage to a proper database**
   - Choose and set up SQLite / MongoDB / PostgreSQL
   - Define schema for news items with necessary indexes
   - Add data validation and timestamps

2. **Add more scrapers for news sources**
   - Official Dead by Daylight website RSS feed or updates page
   - Social media platforms: Twitter, Facebook, Instagram
   - Official game calendars, patch notes, or event pages

3. **Improve API features**
   - Filtering by source, date range, or type
   - Pagination support on `/news` endpoint
   - Serve media (images/thumbnails) efficiently

4. **Enhance error handling and logging**
   - Robust API key management and security
   - Handle rate limiting and retry logic for scrapers
   - Log scraping activities with timestamps

5. **Set up automated scraping pipeline**
   - Use cron jobs or serverless functions for periodic scrapes
   - Update database automatically with new content

6. **Write documentation and tests**
   - README with setup instructions and API usage docs
   - Unit and integration tests for scrapers and endpoints
   - Configure GitHub Actions for CI/CD

7. **Deploy the API**
   - Deploy to hosting services like Heroku, Vercel, AWS, or DigitalOcean
   - Manage environment variables securely (API keys, DB credentials)

---

## Notes

Feel free to update this TODO list as the project evolves.  
Pull requests and contributions are welcome!

