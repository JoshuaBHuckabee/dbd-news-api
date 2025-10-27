// ------------------------------------------------------------
// Manual scraper runner
// Usage: node scripts/run-scraper.js [source|all]
// Example: node scripts/run-scraper.js youtube
// Example: node scripts/run-scraper.js all
//
// This script imports individual scrapers (YouTube, Steam, Website)
// and runs them either individually or all at once. Results are saved
// using the `saveData` utility.
// ------------------------------------------------------------

import youtubeScraper from "../src/scrapers/youtube.js";
import steamScraper from "../src/scrapers/steam.js";
import websiteScraper from "../src/scrapers/website.js";
import { saveData } from "../src/utils/saveData.js"; // utility to save scraped data

// Map of available scrapers by name
const available = {
  youtube: youtubeScraper,
  steam: steamScraper,
  website: websiteScraper,
};

// Get the command-line argument for the scraper name
const arg = process.argv[2];

// Validate the input argument
if (!arg || (!available[arg] && arg !== "all")) {
  console.log(`
Please specify a valid scraper name:
Usage: node scripts/run-scraper.js [source|all]

Available scrapers:
  - youtube
  - steam
  - website

Or run all:
  node scripts/run-scraper.js all
`);
  process.exit(1);
}

/**
 * Runs a specific scraper and saves its results.
 * @param {string} name - The name of the scraper to run
 */
async function runScraper(name) {
  console.log(`Running '${name}' scraper...`);

  // Execute the scraper function (returns an array of news items)
  const items = await available[name]();

  // Save the scraped items using the centralized saveData utility
  await saveData(items);

  console.log(`'${name}' scraper complete.\n`);
}

// Immediately-invoked async function to handle execution
(async () => {
  if (arg === "all") {
    // Run all scrapers sequentially
    for (const name of Object.keys(available)) {
      try {
        await runScraper(name);
      } catch (err) {
        console.error(`${name} scraper failed:`, err.message);
      }
    }
    console.log("All scrapers complete.");
  } else {
    // Run only the specified scraper
    try {
      await runScraper(arg);
    } catch (err) {
      console.error(`${arg} scraper failed:`, err.message);
    }
  }
})();
