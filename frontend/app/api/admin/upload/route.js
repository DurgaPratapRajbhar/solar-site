// ─── Gallery upload — photo ya video, dono isi ek route se ───
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function isAdmin() {
  const c = await cookies();
  return c.get("solar_admin")?.value === process.env.ADMIN_TOKEN;
}

const IMAGE_EXT = ["png", "jpg", "jpeg", "webp", "gif"];
const VIDEO_EXT = ["mp4", "webm", "mov"];

export async function POST(request) {
  if (!(await isAdmin())) return Response.json({ ok: false, error: "no" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!file || !file.name) return Response.json({ ok: false, error: "File chuno" }, { status: 400 });

  const ext = (file.name.split(".").pop() || "").toLowerCase().slice(0, 5);
  const isImage = IMAGE_EXT.includes(ext);
  const isVideo = VIDEO_EXT.includes(ext);
  if (!isImage && !isVideo) {
    return Response.json({ ok: false, error: "Sirf photo (jpg/png/webp) ya video (mp4) chalega" }, { status: 400 });
  }

  const name = `gallery-${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    return Response.json({ ok: true, url: `/api/media/${name}`, media_type: isVideo ? "video" : "image" });
  } catch (e) {
    return Response.json({ ok: false, error: `Upload fail: ${e.message}` }, { status: 500 });
  }
}
