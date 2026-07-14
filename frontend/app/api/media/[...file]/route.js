// ─── Serves uploaded photos/videos from public/uploads at runtime ───
// Next.js production server sirf BUILD-time wali public/ files serve karta
// hai — admin se baad me upload hui file 404 deti thi. Ye route disk se
// seedha padhta hai, isliye nayi uploads turant chalti hain (blog wala pattern).
import { readFile } from "fs/promises";
import path from "path";

const TYPES = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", gif: "image/gif", svg: "image/svg+xml",
  mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
};

export async function GET(_request, { params }) {
  const { file } = await params;
  // sirf filename lo — path-traversal (../..) block
  const name = path.basename((file || []).join("/"));
  if (!name) return new Response("Not found", { status: 404 });

  try {
    const buf = await readFile(path.join(process.cwd(), "public", "uploads", name));
    const ext = (name.split(".").pop() || "").toLowerCase();
    return new Response(buf, {
      headers: {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
