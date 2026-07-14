// ─── "Humara Kaam" gallery — real install photos + videos ───
// Admin panel se add/delete hote hain, homepage inhi ko ISR ke saath dikhata hai.
// Photos aur videos ALAG-ALAG dikhte hain (getGalleryGrouped) — public gallery
// page dono section banata hai.
import { query, exec } from "./db";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS gallery (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  media_type ENUM('image','video') NOT NULL DEFAULT 'image',
  url        VARCHAR(500) NOT NULL,
  poster     VARCHAR(500) DEFAULT NULL,
  caption    VARCHAR(200) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`;

// Table pehle se bani ho (poster column ke bina) tab bhi upgrade ho jaye —
// "Duplicate column" error aaye to chhupchap ignore (matlab already lag chuka hai).
async function ensurePosterColumn() {
  try {
    await exec("ALTER TABLE gallery ADD COLUMN poster VARCHAR(500) DEFAULT NULL");
  } catch (error) {
    if (!/duplicate column/i.test(error.message)) {
      console.error("[gallery] poster column check:", error.message);
    }
  }
}

// Pehli baar table banne par asli install photos/video seed ho jaate hain
// (already public/uploads me copy kiye hue) — taaki site turant "kaam" dikhaye.
// Admin panel se aage jo bhi add/delete hoga, wahi asli source of truth hai.
const SEED = [
  { media_type: "image", url: "/uploads/chhat-install.jpg", poster: null, caption: "🏠 Chhat pe panel array — install complete" },
  { media_type: "image", url: "/uploads/bada-array.jpg", poster: null, caption: "⚡ Bada array — fitting ke waqt" },
  { media_type: "image", url: "/uploads/structure-kaam.jpg", poster: null, caption: "👷 Structure ka kaam — hum khud lagate hain" },
  { media_type: "image", url: "/uploads/dukaan.jpg", poster: null, caption: "🏪 Hamari dukaan — panel, light, sab stock me" },
  { media_type: "video", url: "/uploads/kaam-video.mp4", poster: "/uploads/kaam-poster.jpg", caption: "▶ Kaam chalte hue — live video" },
  { media_type: "video", url: "/uploads/vid-panel-array.mp4", poster: "/uploads/vid-panel-array-poster.jpg", caption: "Poora panel array — roof se view" },
  { media_type: "video", url: "/uploads/vid-panel-angle.mp4", poster: "/uploads/vid-panel-angle-poster.jpg", caption: "Panel angle set karte hue" },
  { media_type: "video", url: "/uploads/vid-structure-start.mp4", poster: "/uploads/vid-structure-start-poster.jpg", caption: "Structure lagana — kaam shuru se" },
  { media_type: "video", url: "/uploads/vid-panels-ready.mp4", poster: "/uploads/vid-panels-ready-poster.jpg", caption: "Panels ready — fitting complete" },
  { media_type: "video", url: "/uploads/vid-inverter-setup.mp4", poster: "/uploads/vid-inverter-setup-poster.jpg", caption: "Inverter ka asli setup — battery aur display" },
  { media_type: "video", url: "/uploads/vid-team-work.mp4", poster: "/uploads/vid-team-work-poster.jpg", caption: "Team chhat pe kaam karte hue" },
  { media_type: "video", url: "/uploads/vid-farm-site.mp4", poster: "/uploads/vid-farm-site-poster.jpg", caption: "Structure ka kaam — khet/dukaan ke paas" },
  { media_type: "video", url: "/uploads/vid-final-fitting.mp4", poster: "/uploads/vid-final-fitting-poster.jpg", caption: "Aakhri fitting touch" },
];

let ready = false;
async function ensureTable() {
  if (ready) return;
  await exec(CREATE_TABLE);
  await ensurePosterColumn();
  // Sirf pehli baar (khaali table) hi nahi — jab bhi naye SEED items jode
  // jaayen (jaise ye 8 naye videos), purane test-chal-chuke DB me bhi
  // MISSING wale hi jud jaate hain — already-mojood urls dobara nahi aate.
  const existing = await query("SELECT url FROM gallery");
  const have = new Set(existing.map((r) => r.url));
  const missing = SEED.filter((s) => !have.has(s.url));
  for (let i = 0; i < missing.length; i++) {
    const s = missing[i];
    await query(
      "INSERT INTO gallery (media_type, url, poster, caption, sort_order) VALUES (?, ?, ?, ?, ?)",
      [s.media_type, s.url, s.poster, s.caption, SEED.length - SEED.indexOf(s)]
    );
  }
  ready = true;
}

export async function getGallery() {
  try {
    await ensureTable();
    return await query("SELECT * FROM gallery ORDER BY sort_order DESC, id DESC");
  } catch (error) {
    // MySQL na chale/na milе tab bhi site khali na dikhe — asli seed photos
    // fallback ke taur pe dikhte hain (blog ke leads.json jaisa hi pattern).
    console.error("[gallery] DB unreachable, using seed fallback:", error.message);
    return SEED;
  }
}

export async function addGalleryItem({ media_type, url, poster, caption }) {
  await ensureTable();
  const [row] = await query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM gallery");
  await query(
    "INSERT INTO gallery (media_type, url, poster, caption, sort_order) VALUES (?, ?, ?, ?, ?)",
    [media_type, url, poster || null, caption || "", row.n]
  );
}

export async function deleteGalleryItem(id) {
  await ensureTable();
  await query("DELETE FROM gallery WHERE id = ?", [id]);
}
