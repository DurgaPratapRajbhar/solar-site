// ─── "Humara Kaam" gallery — real install photos + videos ───
// Admin panel se add/delete hote hain, homepage inhi ko ISR ke saath dikhata hai.
// Data Python API (solar/api) ke paas hai — website DB ko seedha nahi chhooti.
import { api } from "./api";

export async function getGallery() {
  try {
    return await api("/gallery");
  } catch (error) {
    // API na chale tab bhi page na toote — gallery bas khaali dikhegi
    console.error("[gallery] API unreachable:", error.message);
    return [];
  }
}

export async function addGalleryItem({ media_type, url, poster, caption }) {
  await api("/admin/gallery", {
    method: "POST",
    body: { media_type: media_type || "image", url, poster: poster || null, caption: caption || "" },
    admin: true,
  });
}

// Already gone counts as deleted
export async function deleteGalleryItem(id) {
  try {
    await api(`/admin/gallery/${id}`, { method: "DELETE", admin: true });
  } catch (error) {
    if (error.status !== 404) throw error;
  }
}
