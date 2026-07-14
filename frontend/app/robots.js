// ─── robots.txt — Google/Bing ko batata hai kya crawl karna hai ───
const SITE_URL = process.env.SITE_URL || "https://solarlc.com";

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
