// ─── The site's only door to data: the Python API (solar/api) ───
// The website never talks to the database; the API owns it.
// Admin calls send ADMIN_TOKEN (server side only — never reaches the browser).
const API_URL = process.env.API_URL || "http://localhost:8002";

export async function api(path, { method = "GET", body, admin = false } = {}) {
  const res = await fetch(API_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(admin ? { "X-Admin-Token": process.env.ADMIN_TOKEN || "" } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const error = new Error(`${method} ${path} failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return res.status === 204 ? null : res.json();
}
