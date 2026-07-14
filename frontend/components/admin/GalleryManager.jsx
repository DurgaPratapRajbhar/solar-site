// ─── "Humara Kaam" gallery manager — photo/video upload, caption, delete ───
"use client";
import { useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(null); // { url, media_type } — upload hui, caption ka wait
  const [msg, setMsg] = useState(null);

  const load = async () => {
    try {
      const r = await fetch("/api/admin/gallery");
      const d = await r.json();
      setItems(d.items || []);
    } catch { /* ignore */ }
  };
  useEffect(() => { load(); }, []);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true); setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (d.ok) setPending({ url: d.url, media_type: d.media_type });
      else setMsg({ ok: false, text: d.error || "Upload fail" });
    } catch { setMsg({ ok: false, text: "Upload nahi hua" }); }
    finally { setUploading(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!pending) return;
    setMsg(null);
    try {
      const r = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pending, caption }),
      });
      const d = await r.json();
      if (d.ok) {
        setMsg({ ok: true, text: "Gallery me add ho gaya ✅ — 1 minute me site pe dikhega" });
        setPending(null); setCaption(""); load();
      } else setMsg({ ok: false, text: d.error || "Save fail" });
    } catch { setMsg({ ok: false, text: "Server se baat nahi ho payi" }); }
  };

  const remove = async (id) => {
    if (!confirm("Ye site se hat jayega. Pakka delete karein?")) return;
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>📸 Humara Kaam</h1>
      <p className={styles.muted} style={{ marginTop: -8, marginBottom: 18 }}>
        Yahan se photo/video daalo — homepage ki gallery me 1 minute ke andar dikh jaayega.
      </p>

      {msg && <div className={msg.ok ? styles.success : styles.warn}>{msg.text}</div>}

      <form className={styles.form} onSubmit={save}>
        <label>
          Photo ya Video chuno
          <label className={styles.uploadBtn}>
            {uploading ? "Upload ho raha..." : pending ? "✅ Upload ho gaya — dobara chunne ke liye click karo" : "📁 File chuno (jpg/png ya mp4)"}
            <input
              type="file"
              accept="image/*,video/mp4,video/webm"
              hidden
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </label>
        </label>

        {pending && (
          <div style={{ maxWidth: 320 }}>
            {pending.media_type === "video"
              ? <video src={pending.url} controls style={{ width: "100%", borderRadius: 12 }} />
              : <img src={pending.url} alt="preview" style={{ width: "100%", borderRadius: 12 }} />}
          </div>
        )}

        <label>
          Caption (kahan ka install hai)
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="🏠 Chhat pe panel array — Sathiaon" />
        </label>

        <button type="submit" className={styles.loginBtn} disabled={!pending} style={{ maxWidth: 220 }}>
          Gallery me add karo
        </button>
      </form>

      <div className={styles.galGrid}>
        {items.map((it) => (
          <div key={it.id} className={styles.galCard}>
            {it.media_type === "video"
              ? <video src={it.url} className={styles.thumb} muted />
              : <img src={it.url} alt={it.caption} className={styles.thumb} />}
            <div className={styles.galMeta}>
              <p>{it.caption || "(bina caption)"}</p>
              <button className={styles.delBtn} onClick={() => remove(it.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
