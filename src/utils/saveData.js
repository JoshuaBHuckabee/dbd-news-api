// src/utils/saveData.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../db/data.json");

export async function saveData(newItems) {
  let existing = [];
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath));
  }

  // prevent duplicates by URL
  const urls = new Set(existing.map(i => i.url));
  const merged = [...existing];

  newItems.forEach(item => {
    if (!urls.has(item.url)) merged.push(item);
  });

  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
  console.log(`✅ Saved ${newItems.length} new items`);
}
