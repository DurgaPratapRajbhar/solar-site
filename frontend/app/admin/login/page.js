// ─── Admin login page ───
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
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
        body: JSON.stringify({ username, password }),
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
        <img src="/logo.jpg" alt="Indian Solar Light Centre" className={styles.loginLogo} />
        <h1 className={styles.loginTitle}>Solar Admin</h1>
        <p className={styles.loginSub}>User aur password daalein</p>

        {error && <div className={styles.loginError}>{error}</div>}

        <input
          type="text"
          className={styles.loginInput}
          placeholder="User"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          className={styles.loginInput}
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={styles.loginBtn} disabled={busy}>
          {busy ? "Ruko..." : "Login"}
        </button>
      </form>
    </div>
  );
}
