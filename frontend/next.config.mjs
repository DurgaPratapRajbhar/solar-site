// Next.js config — loads ALL settings from the PROJECT ROOT .env
// (solar/.env is the single source of truth)
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// Resolve ../.env RELATIVE TO THIS CONFIG FILE (not the working directory),
// so it loads correctly no matter how the dev server is started.
const here = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(here, "..", ".env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SITE_URL: process.env.SITE_URL || "https://solarlc.com",
    WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || "916392554283",
    PHONE_1: process.env.PHONE_1 || "+91 63925 54283",
    PHONE_2: process.env.PHONE_2 || "+91 87267 90180",
    EMAIL: process.env.EMAIL || "info@solarlc.com",
    ADDRESS: process.env.ADDRESS || "Saraihazi, Sonwara Mod, Rani ki Sarai, Azamgarh, Uttar Pradesh 276207",
    GA_ID: process.env.GA_ID || "",
  },
};

export default nextConfig;
