import prisma from "../lib/prisma.js";

export default async function twitterScraper() {
  
  // Static tweets for now, while I figure out the API situation.
  const tweets = [
    {
      title: "New Rift Coming!",
      content: "Check out the new Tome and cosmetics.",
      url: "https://twitter.com/DeadByBHVR/status/1234567890",
      imageUrl: null, // or a tweet image if available
      source: "Twitter",
      contentType: "post",
      code: null,
      publishedAt: new Date("2025-10-21T14:30:00Z"),
    },
    {
      title: "Promo Code Drop!",
      content: "Use code SCARYSURVIVOR for 200k BP!",
      url: "https://twitter.com/DeadByBHVR/status/9876543210",
      imageUrl: null,
      source: "Twitter",
      contentType: "code",
      code: "SCARYSURVIVOR",
      publishedAt: new Date("2025-10-20T17:45:00Z"),
    },
  ];

  console.log(`Scraped ${tweets.length} Twitter post(s)`);
  return tweets;
}
