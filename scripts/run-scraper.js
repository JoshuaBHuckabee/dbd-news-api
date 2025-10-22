// Manual scraper runner
// Usage: node scripts/run-scrapers.js [source|all]

// Import scrapers
import youtubeScraper from "../src/scrapers/youtube.js";
import steamScraper from "../src/scrapers/steam.js"; // Add others as needed

// Mapping of available scrapers
const available = {
  youtube: youtubeScraper,
  steam: steamScraper,
  // future: add reddit, twitter, etc.
};

// Get the scraper name from command-line args
const arg = process.argv[2];

// Show help if invalid input
if (!arg || (!available[arg] && arg !== "all")) {
  console.log(`
Please specify a valid scraper name:
Usage: node scripts/run-scrapers.js [source|all]

Available scrapers:
  - youtube
  - steam

Or run all:
  node scripts/run-scrapers.js all
`);
  process.exit(1);
}

// Run all scrapers if 'all' is specified
if (arg === "all") {
  console.log("Running all scrapers...\n");

  for (const [name, scraper] of Object.entries(available)) {
    try {
      console.log(`Running '${name}' scraper...`);
      await scraper();
    } catch (err) {
      console.error(`${name} scraper failed:`, err.message);
    }
  }

  console.log("\nAll scrapers complete.");
  process.exit(0);
}

// Run a single scraper
console.log(`Running '${arg}' scraper...`);
try {
  await available[arg]();
  console.log(`'${arg}' scraper complete.`);
} catch (err) {
  console.error(`'${arg}' scraper failed:`, err.message);
}
