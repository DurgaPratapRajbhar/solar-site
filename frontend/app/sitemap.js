// ─── sitemap.xml — Google ke liye ───
const SITE_URL = process.env.SITE_URL || "https://solarlc.com";

export const revalidate = 3600;

export default function sitemap() {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/gallery`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
