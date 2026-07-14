// ─── Admin login — checks the password, sets a secure cookie ───
export async function POST(request) {
  const { password } = await request.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ ok: false, error: "Galat password" }, { status: 401 });
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
    ].join("; ")
  );
  return res;
}
