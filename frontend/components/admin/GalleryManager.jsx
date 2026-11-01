// ─── "Humara Kaam" gallery manager — photo/video upload or a social post link, caption, delete ───
"use client";
import { useEffect, useState } from "react";
import { parseSocial, SOCIAL_LABELS } from "@/lib/social";
import styles from "@/app/admin/admin.module.css";

const TYPE_LABELS = { image: "Photo", video: "Video", ...SOCIAL_LABELS };

// Small preview of any item: file, YouTube thumbnail or the social embed
function Preview({ item, className }) {
  const social = parseSocial(item.url);
  if (item.media_type === "video") return <video src={item.url} className={className} muted controls />;
  if (item.media_type === "image") return <img src={item.url} alt={item.caption || "preview"} className={className} />;
  if (social?.thumb) return <img src={social.thumb} alt={item.caption || "YouTube video"} className={className} />;
  if (social) return <iframe src={social.embed} title={item.caption || "post"} className={className} loading="lazy" />;
  return null;
}

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("file"); // file | link
  const [caption, setCaption] = useState("");
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(null); // { url, media_type } waiting for "Add"
  const [msg, setMsg] = useState(null);

  const load = async () => {
    try {
      const r = await fetch("/api/admin/gallery");
      const d = await r.json();
      setItems(d.items || []);
    } catch { /* ignore */ }
  };
  useEffect(() => { load(); }, []);

  const switchMode = (next) => {
    setMode(next); setPending(null); setLink(""); setMsg(null);
  };

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

  // A pasted link is checked right away: the type comes from the link itself
  const onLink = (value) => {
    setLink(value);
    const social = parseSocial(value);
    setPending(social ? { url: value.trim(), media_type: social.type } : null);
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
        setMsg({ ok: true, text: "Gallery me add ho gaya. Site par turant dikhega." });
        setPending(null); setCaption(""); setLink(""); load();
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
      <h1 className={styles.pageTitle}>Humara Kaam</h1>
      <p className={styles.muted} style={{ marginTop: -8, marginBottom: 18 }}>
        Photo/video upload karein, ya YouTube, Instagram, Facebook post ka link daalein. Site ki gallery me turant dikhega.
      </p>

      {msg && <div className={msg.ok ? styles.success : styles.warn}>{msg.text}</div>}

      <div className={styles.tabs} role="tablist">
        <button type="button" role="tab" aria-selected={mode === "file"} className={mode === "file" ? styles.tabOn : styles.tab} onClick={() => switchMode("file")}>
          Photo / Video upload
        </button>
        <button type="button" role="tab" aria-selected={mode === "link"} className={mode === "link" ? styles.tabOn : styles.tab} onClick={() => switchMode("link")}>
          YouTube / Instagram / Facebook link
        </button>
      </div>

      <form className={styles.form} onSubmit={save}>
        {mode === "file" ? (
          <label>
            Photo ya video chunein
            <label className={styles.uploadBtn}>
              {uploading ? "Upload ho raha hai..." : pending ? "Upload ho gaya. Badalne ke liye dobara chunein" : "File chunein (jpg/png ya mp4)"}
              <input type="file" accept="image/*,video/mp4,video/webm" hidden onChange={(e) => upload(e.target.files?.[0])} />
            </label>
          </label>
        ) : (
          <label>
            Post ka link
            <input value={link} onChange={(e) => onLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=... ya instagram.com/reel/..." />
            <span className={styles.hint}>
              {link && !pending ? "Ye link pehchana nahi gaya. YouTube, Instagram ya Facebook post ka poora https link daalein."
                : pending ? `${TYPE_LABELS[pending.media_type]} post mila` : "Post kholein, Share → Copy link, phir yahan paste karein."}
            </span>
          </label>
        )}

        {pending && (
          <div className={styles.previewBox}>
            <Preview item={pending} className={styles.previewMedia} />
          </div>
        )}

        <label>
          Caption (kahan ka kaam hai)
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Chhat par 3 kW system, Sathiaon" />
        </label>

        <button type="submit" className={styles.loginBtn} disabled={!pending} style={{ maxWidth: 220 }}>
          Gallery me add karein
        </button>
      </form>

      <div className={styles.galGrid}>
        {items.map((it) => (
          <div key={it.id} className={styles.galCard}>
            <Preview item={it} className={styles.thumb} />
            <div className={styles.galMeta}>
              <span className={styles.typeTag}>{TYPE_LABELS[it.media_type] || it.media_type}</span>
              <p>{it.caption || "(bina caption)"}</p>
              <button className={styles.delBtn} onClick={() => remove(it.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
