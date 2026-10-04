"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SERVICES = [
  { href: "/add", icon: "📝", label: "Add a conversation", sub: "Notes, live recording, photos & files" },
  { href: "/brief", icon: "🔊", label: "Daily voice brief", sub: "Hear your open promises" },
  { href: "/accounts", icon: "🗂️", label: "All accounts", sub: "Every customer at a glance" },
  { href: "/", icon: "🌙", label: "Ask Twilight", sub: "Ask questions by text or voice" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState<"" | "accounts" | "services">("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(Array.isArray(d) ? d : []))
      .catch(() => {});
    setMenu("");
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu("");
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const cls = (active: boolean) => `nav-link ${active ? "nav-link-active" : ""}`;
  const onServices = ["/add", "/brief", "/services"].includes(pathname);

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">💫 Ask Twilight</Link>

      <div className="nav-links" ref={ref}>
        <Link href="/" className={cls(pathname === "/")}> Home</Link>

        <div style={{ position: "relative" }}>
          <button className={cls(pathname.startsWith("/accounts"))} onClick={() => setMenu(menu === "accounts" ? "" : "accounts")}>
             Accounts ▾
          </button>
          {menu === "accounts" && (
            <div className="dropdown">
              {accounts.length === 0 && <p className="opacity-70 p-2 text-sm">No accounts yet 🌱</p>}
              {accounts.map((a) => (
                <Link key={a.id} href={`/accounts/${a.id}`} className="dropdown-item">
                  <span className="avatar" style={{ width: "1.8rem", height: "1.8rem", fontSize: ".9rem" }}>
                    {a.name?.[0]}
                  </span>
                  {a.name}
                </Link>
              ))}
              <Link href="/accounts" className="dropdown-item" style={{ color: "#ffd98a", fontWeight: 700 }}>
                View all accounts →
              </Link>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button className={cls(onServices)} onClick={() => setMenu(menu === "services" ? "" : "services")}>
             Services ▾
          </button>
          {menu === "services" && (
            <div className="dropdown" style={{ minWidth: "290px", left: "auto", right: 0 }}>
              {SERVICES.map((s) => (
                <Link key={s.href} href={s.href} className="dropdown-item">
                  <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
                  <span>
                    <b>{s.label}</b>
                    <span className="block text-xs opacity-70">{s.sub}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/about" className={cls(pathname === "/about")}> About</Link>
      </div>
    </nav>
  );
}
