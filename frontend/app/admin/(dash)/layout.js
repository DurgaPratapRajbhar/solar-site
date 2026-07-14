// ─── Protected admin layout ───
// Runs on the server BEFORE any dashboard page renders. Checks the cookie
// against ADMIN_TOKEN — wrong/missing → kicks you to the login page.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import styles from "../admin.module.css";

export default async function DashLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("solar_admin")?.value;

  if (token !== process.env.ADMIN_TOKEN) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>☀️ Admin</div>
        <nav className={styles.nav}>
          <Link href="/admin/gallery">📸 Humara Kaam</Link>
          <a href="/" target="_blank">🌐 Site dekho</a>
        </nav>
        <LogoutButton />
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
