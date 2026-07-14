// ─── Logout button (clears the admin cookie) ───
"use client";
import { useRouter } from "next/navigation";
import styles from "../../app/admin/admin.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <button className={styles.logoutBtn} onClick={logout}>
      🚪 Logout
    </button>
  );
}
