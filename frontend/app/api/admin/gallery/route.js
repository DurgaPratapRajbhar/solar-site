// ─── "Humara Kaam" gallery — admin CRUD ───
// GET    = list all items
// POST   = add new (image or video)
// DELETE = remove
import { cookies } from "next/headers";
import { getGallery, addGalleryItem, deleteGalleryItem } from "@/lib/gallery";

async function isAdmin() {
  const c = await cookies();
  return c.get("solar_admin")?.value === process.env.ADMIN_TOKEN;
}

export async function GET() {
  if (!(await isAdmin())) return Response.json({ ok: false, error: "Not allowed" }, { status: 401 });
  return Response.json({ ok: true, items: await getGallery() });
}

export async function POST(request) {
  if (!(await isAdmin())) return Response.json({ ok: false, error: "Not allowed" }, { status: 401 });
  const body = await request.json();
  if (!body.url) return Response.json({ ok: false, error: "Pehle file upload karo" }, { status: 400 });
  try {
    await addGalleryItem(body);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: `Save fail: ${e.message}` }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAdmin())) return Response.json({ ok: false, error: "Not allowed" }, { status: 401 });
  const { id } = await request.json();
  if (!id) return Response.json({ ok: false, error: "id zaroori hai" }, { status: 400 });
  try {
    await deleteGalleryItem(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Delete fail" }, { status: 500 });
  }
}
