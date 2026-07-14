// ─── Admin login page ───
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login fail");
      }
    } catch {
      setError("Server se baat nahi ho payi");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.loginWrap}>
      <form className={styles.loginCard} onSubmit={submit}>
        <div className={styles.loginLogo}>☀️</div>
        <h1 className={styles.loginTitle}>Solar Admin</h1>
        <p className={styles.loginSub}>Apna password daalo</p>

        {error && <div className={styles.loginError}>{error}</div>}

        <input
          type="password"
          className={styles.loginInput}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <button type="submit" className={styles.loginBtn} disabled={busy}>
          {busy ? "Ruko..." : "Login 🔑"}
        </button>
      </form>
    </div>
  );
}
