// ------------------------------------------------------------
// Utility: detectContentType
// ------------------------------------------------------------
// Determines the type of content (e.g., patch, event, general)
// based on the title and the source platform.
// Used by scrapers to assign a consistent `contentType` before
// saving to the database.
// ------------------------------------------------------------

/**
 * Detects the content type of a scraped news item based on its
 * title and source platform.
 *
 * @function detectContentType
 * @param {string} title - The title of the news item.
 * @param {string} source - The platform the news came from
 *                          (e.g., "Steam", "Website").
 * @returns {string} The detected content type. Possible values:
 *                   "patch", "text", "event", or "general".
 *
 * @example
 * detectContentType("Dead by Daylight Patch Notes 8.2.0", "Steam");
 * // => "patch"
 *
 * detectContentType("Lunar New Year Event Announcement", "Website");
 * // => "event"
 */
export function detectContentType(title, source) {
  const lower = title.toLowerCase();

  // --- Steam logic ---
  // Identify patch or update notes from the title.
  if (source === "Steam") {
    const patchKeywords = ["patch", "update", "hotfix", "release notes"];
    if (patchKeywords.some(k => lower.includes(k))) {
      return "patch";
    }
    return "text"; // Default for general Steam posts
  }

  // --- Website logic ---
  // Tag event-related posts, otherwise mark as general.
  if (source === "Website") {
    const eventKeywords = [
        "event",
        "haunted by daylight",
        "lunar new year",
        "anniversary",
        "2v8",
        "2 v 8",
        "game mode",
        "limited-time-mode",
        "limited time mode",
        "the void realm",
        "void realm",
        "festival",
        "celebration",
        "holiday"
    ];
    
    if (eventKeywords.some(k => lower.includes(k))) return "event";
    return "general";
  }

  // --- Fallback ---
  // Default type if no match found or unrecognized source.
  return "text";
}
