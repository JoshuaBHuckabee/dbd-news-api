// Manual scraper runner
// Usage: node scripts/run-scrapers.js [source|all]
// website: 'https://deadbydaylight.com/news'

import youtubeScraper from "../src/scrapers/youtube.js";
import steamScraper from "../src/scrapers/steam.js";
import websiteScraper from "../src/scrapers/website.js";
import { saveData } from "../src/utils/saveData.js"; // import saveData

const available = {
  youtube: youtubeScraper,
  steam: steamScraper,
  website: websiteScraper,
};

const arg = process.argv[2];

if (!arg || (!available[arg] && arg !== "all")) {
  console.log(`
Please specify a valid scraper name:
Usage: node scripts/run-scrapers.js [source|all]

Available scrapers:
  - youtube
  - steam
  - website

Or run all:
  node scripts/run-scrapers.js all
`);
  process.exit(1);
}

async function runScraper(name) {
  console.log(`Running '${name}' scraper...`);
  const items = await available[name](); // scraper returns array
  await saveData(items);                // save all items through saveData
  console.log(`'${name}' scraper complete.\n`);
}

(async () => {
  if (arg === "all") {
    for (const name of Object.keys(available)) {
      try {
        await runScraper(name);
      } catch (err) {
        console.error(`${name} scraper failed:`, err.message);
      }
    }
    console.log("All scrapers complete.");
  } else {
    try {
      await runScraper(arg);
    } catch (err) {
      console.error(`${arg} scraper failed:`, err.message);
    }
  }
})();
