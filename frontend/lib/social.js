// ─── YouTube / Instagram / Facebook post links → how to show them ───
// Used by the admin (to detect the type and preview) and by the gallery (to embed).
// Returns null for a link we cannot embed.

const YOUTUBE = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/;
const INSTAGRAM = /instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/;
const FACEBOOK = /^https:\/\/(?:(?:www|m|web)\.)?(?:facebook\.com|fb\.watch)\//;

export const SOCIAL_TYPES = ["youtube", "instagram", "facebook"];

export const SOCIAL_LABELS = { youtube: "YouTube", instagram: "Instagram", facebook: "Facebook" };

export function parseSocial(url) {
  const link = String(url || "").trim();
  if (!link.startsWith("https://")) return null;

  const yt = link.match(YOUTUBE);
  if (yt) {
    const id = yt[1];
    return {
      type: "youtube",
      vertical: link.includes("/shorts/"),
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
    };
  }

  const ig = link.match(INSTAGRAM);
  if (ig) {
    return { type: "instagram", vertical: true, embed: `https://www.instagram.com/${ig[1]}/${ig[2]}/embed` };
  }

  if (FACEBOOK.test(link)) {
    const isVideo = /\/videos\/|\/reel\/|\/watch|fb\.watch/.test(link);
    const plugin = isVideo ? "video" : "post";
    return {
      type: "facebook",
      vertical: link.includes("/reel/"),
      embed: `https://www.facebook.com/plugins/${plugin}.php?href=${encodeURIComponent(link)}&show_text=false&width=500`,
    };
  }

  return null;
}
