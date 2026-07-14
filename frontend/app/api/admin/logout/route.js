// ─── Admin logout — clears the cookie ───
export async function POST() {
  const res = Response.json({ ok: true });
  res.headers.set("Set-Cookie", "solar_admin=; Path=/; HttpOnly; Max-Age=0");
  return res;
}
