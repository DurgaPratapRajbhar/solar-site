// ─── Chat proxy — the browser posts here, we ask the ScriptDP app's AI ───
// Answers come from the shop's Knowledge in the ScriptDP app (same AI as WhatsApp).
// The API key stays on the server; the browser never sees it.
const MAX_QUESTION = 1000;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 500) {
    return Response.json({ error: "invalid-message" }, { status: 400 });
  }

  if (!process.env.SCRIPTDP_AI_URL || !process.env.SCRIPTDP_AI_KEY) {
    return Response.json({ reply: "", error: "ai-not-configured" }, { status: 503 });
  }

  try {
    const res = await fetch(process.env.SCRIPTDP_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-Api-Key": process.env.SCRIPTDP_AI_KEY || "" },
      body: JSON.stringify({ question: question(message, body.history) }),
      signal: AbortSignal.timeout(45000),
    });
    const data = await res.json();
    if (!res.ok || typeof data?.data?.answer !== "string") throw new Error("No answer");
    return Response.json({ reply: data.data.answer });
  } catch {
    // AI na chale tab bhi site na toote — widget WhatsApp ka raasta dikhata hai
    return Response.json({ reply: "", error: "ai-unavailable" }, { status: 502 });
  }
}

// Recent chat gives the AI context; older lines are dropped first to stay within the limit
function question(message, history) {
  let text = `Customer: ${message}`;
  const turns = Array.isArray(history) ? history.slice(-4) : [];
  for (const turn of turns.reverse()) {
    const line = `${turn?.role === "user" ? "Customer" : "Assistant"}: ${String(turn?.content ?? "")}`;
    if (line.length + 1 + text.length > MAX_QUESTION) break;
    text = `${line}\n${text}`;
  }
  return text.slice(-MAX_QUESTION);
}
