"use client";
// ─── "Sawaal poochein" chat — bottom-left (WhatsApp button stays bottom-right) ───
// Talks to /api/chat, which asks the ScriptDP app's AI (shop's Knowledge).
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/config";

const WELCOME = "Namaste! 🙏 Solar panel, battery, pump ya PM-KUSUM subsidy ke baare me kuch bhi poochiye.";

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  if (pathname?.startsWith("/admin")) return null;

  async function send(event) {
    event.preventDefault();
    const message = text.trim();
    if (!message || busy) return;

    const history = messages;
    setMessages([...history, { role: "user", content: message }]);
    setText("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error("No reply");
      setMessages((list) => [...list, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((list) => [
        ...list,
        { role: "assistant", content: "Abhi jawab nahi de pa rahe. Seedha WhatsApp par baat karein 👇", failed: true },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="chat-fab" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? "✕" : "💬 Sawaal poochein"}
      </button>

      {open && (
        <section className="chat-box" aria-label="Solar sahayak chat">
          <header className="chat-head">
            <b>☀️ Solar Sahayak</b>
            <span>Indian Solar Light Centre</span>
          </header>

          <div className="chat-list" ref={listRef}>
            <p className="chat-msg bot">{WELCOME}</p>
            {messages.map((m, i) => (
              <p key={i} className={`chat-msg ${m.role === "user" ? "me" : "bot"}`}>
                {m.content}
                {m.failed && SITE.whatsapp && (
                  <a className="chat-wa" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp karein
                  </a>
                )}
              </p>
            ))}
            {busy && <p className="chat-msg bot chat-typing">Likh rahe hain…</p>}
          </div>

          <form className="chat-form" onSubmit={send}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              placeholder="Apna sawaal likhein…"
              aria-label="Apna sawaal"
            />
            <button type="submit" disabled={busy || !text.trim()}>Bhejein</button>
          </form>
        </section>
      )}
    </>
  );
}
