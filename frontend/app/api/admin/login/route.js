// ─── Admin login — checks username + password, sets a secure cookie ───
import { timingSafeEqual } from "crypto";

// Same answer time whether the first or the last character is wrong
function same(given, expected) {
  const a = Buffer.from(String(given || ""));
  const b = Buffer.from(String(expected || ""));
  return a.length === b.length && b.length > 0 && timingSafeEqual(a, b);
}

export async function POST(request) {
  const { username, password } = await request.json();

  const userOk = same(username, process.env.ADMIN_USER || "admin");
  const passOk = same(password, process.env.ADMIN_PASSWORD);
  if (!userOk || !passOk) {
    return Response.json({ ok: false, error: "Galat user ya password" }, { status: 401 });
  }

  const res = Response.json({ ok: true });
  res.headers.set(
    "Set-Cookie",
    [
      `solar_admin=${process.env.ADMIN_TOKEN}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=604800", // 7 days
      ...(process.env.NODE_ENV === "production" ? ["Secure"] : []),
    ].join("; ")
  );
  return res;
}
