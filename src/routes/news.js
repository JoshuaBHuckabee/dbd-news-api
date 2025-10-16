import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Router } from "express";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../db/data.json");

console.log("🧭 __dirname:", __dirname);
console.log("🧭 filePath:", filePath);
console.log("🧭 file exists:", fs.existsSync(filePath));

router.get("/", (req, res) => {
  if (!fs.existsSync(filePath)) {
    console.log("⚠️ Creating missing file at", filePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "[]");
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(data);
});

export default router;
