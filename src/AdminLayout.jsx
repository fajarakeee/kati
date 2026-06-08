// ============================================================
// AdminLayout.jsx — Shared layout & komponen reusable
// Dipakai oleh: AdminDashboard, AdminGaleri, AdminPrograms,
//               AdminEvents, AdminBlogs
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "./supabase"; // sesuaikan path

// ── Palet warna ──────────────────────────────────────────────
export const C = {
  green:   "#4E7D22",
  leaf:    "#6F9D36",
  brown:   "#3D2415",
  blue:    "#2F6FC4",
  red:     "#c0392b",
  orange:  "#d4820e",
  purple:  "#9c3dba",
  muted:   "#7a6a5a",
  border:  "#e8e6e2",
  gray:    "#f7f5f1",
};

// ── Menu navigasi sidebar ────────────────────────────────────
export const NAV_ITEMS = [
  { path: "/admin",          label: "Dashboard",  emoji: "🏠" },
  { path: "/admin/artikel",  label: "Artikel",    emoji: "✍️"  },
  { path: "/admin/galeri",   label: "Galeri",     emoji: "🖼️"  },
  { path: "/admin/programs", label: "Program",    emoji: "🌿"  },
  { path: "/admin/events",   label: "Events",     emoji: "📅"  },
  { path: "/admin/blogs",    label: "Blog",       emoji: "📰"  },
];

// ============================================================
// KOMPONEN: AdminLayout — wrapper dengan sidebar + topbar
// ============================================================
export function AdminLayout({ children, title, subtitle }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [email, setEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data?.user?.email ?? "");
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.gray, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: sidebarOpen ? 220 : 64,
        background: `linear-gradient(180deg, ${C.brown} 0%, #1a0d06 100%)`,
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>🌿</div>
          {sidebarOpen && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "white", fontWeight: 800, fontSize: "0.88rem", lineHeight: 1.1, whiteSpace: "nowrap" }}>KATI Admin</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>KAMPUS ALAM</div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, marginBottom: 4,
                  background: active ? "rgba(111,157,54,0.2)" : "transparent",
                  border: active ? "1px solid rgba(111,157,54,0.3)" : "1px solid transparent",
                  transition: "all 0.18s",
                  cursor: "pointer",
                }}
                  onMouseOver={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseOut={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{item.emoji}</span>
                  {sidebarOpen && (
                    <span style={{ color: active ? "#a8d840" : "rgba(255,255,255,0.7)", fontWeight: active ? 700 : 500, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {sidebarOpen && email && (
            <div style={{ padding: "8px 12px", marginBottom: 8, color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", wordBreak: "break-all" }}>
              👤 {email}
            </div>
          )}
          <button onClick={handleLogout} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 10, border: "none",
            background: "rgba(192,57,43,0.15)", color: "#ff8a7a",
            cursor: "pointer", fontSize: "0.82rem", fontWeight: 600,
          }}>
            <span style={{ flexShrink: 0 }}>🚪</span>
            {sidebarOpen && "Keluar"}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          background: "white", borderBottom: `1px solid ${C.border}`,
          padding: "0 28px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)", flexShrink: 0,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Toggle sidebar */}
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: C.muted, padding: 4 }}>
              {sidebarOpen ? "◀" : "▶"}
            </button>
            <div>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 800, color: C.brown, lineHeight: 1 }}>{title}</h1>
              {subtitle && <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: 2 }}>{subtitle}</p>}
            </div>
          </div>
          <a href="/" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: C.muted, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
            🌐 Lihat Website →
          </a>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ============================================================
// KOMPONEN REUSABLE — dipakai di semua tab admin
// ============================================================

// ── Toast notifikasi ──────────────────────────────────────────
export function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = { success: C.green, error: C.red, info: C.blue }[type] ?? C.green;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: bg, color: "white", padding: "14px 24px", borderRadius: 12,
      fontWeight: 600, fontSize: "0.9rem", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      display: "flex", alignItems: "center", gap: 10, animation: "slideUp 0.3s ease",
    }}>
      {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"} {msg}
      <style>{`@keyframes slideUp { from { transform:translateY(16px);opacity:0 } to { transform:translateY(0);opacity:1 } }`}</style>
    </div>
  );
}

// ── Modal wrapper ────────────────────────────────────────────
export function Modal({ title, onClose, children, maxWidth = 560 }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 5000,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "white", borderRadius: 20, padding: "32px",
        width: "100%", maxWidth, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: C.brown }}>{title}</h3>
          <button onClick={onClose} style={{ background: C.gray, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: "1rem", color: C.muted }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Tombol ───────────────────────────────────────────────────
export function Btn({ onClick, color = C.green, children, disabled, small, outline, fullWidth }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? "white" : (disabled ? "#ccc" : color),
      color: outline ? color : "white",
      border: outline ? `1.5px solid ${color}` : "none",
      borderRadius: 8, padding: small ? "7px 14px" : "10px 20px",
      fontSize: small ? "0.78rem" : "0.88rem", fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", gap: 6,
      transition: "opacity 0.15s", width: fullWidth ? "100%" : "auto",
      justifyContent: "center",
    }}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.opacity = "0.82"; }}
      onMouseOut={e => e.currentTarget.style.opacity = "1"}
    >
      {children}
    </button>
  );
}

// ── Form field wrapper ───────────────────────────────────────
export function Field({ label, children, half }) {
  return (
    <div style={{ marginBottom: 14, gridColumn: half ? "span 1" : "auto" }}>
      <label style={{ display: "block", fontWeight: 700, fontSize: "0.75rem", color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Input teks ───────────────────────────────────────────────
export function Input({ value, onChange, type = "text", placeholder, style: sx = {} }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: "0.88rem", outline: "none", background: "#fafaf8", color: C.brown, boxSizing: "border-box", fontFamily: "inherit", ...sx }}
      onFocus={e => e.target.style.borderColor = C.green}
      onBlur={e  => e.target.style.borderColor = C.border}
    />
  );
}

// ── Textarea ─────────────────────────────────────────────────
export function Textarea({ value, onChange, rows = 3, placeholder }) {
  return (
    <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
      style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: "0.88rem", outline: "none", background: "#fafaf8", color: C.brown, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
      onFocus={e => e.target.style.borderColor = C.green}
      onBlur={e  => e.target.style.borderColor = C.border}
    />
  );
}

// ── Select dropdown ──────────────────────────────────────────
export function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange}
      style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: "0.88rem", outline: "none", background: "#fafaf8", color: C.brown, boxSizing: "border-box", fontFamily: "inherit" }}
      onFocus={e => e.target.style.borderColor = C.green}
      onBlur={e  => e.target.style.borderColor = C.border}
    >
      {children}
    </select>
  );
}

// ── Badge status aktif/nonaktif ──────────────────────────────
export function StatusBadge({ active }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700,
      background: active ? "#e8f5d4" : "#fde8e8",
      color: active ? C.green : C.red,
    }}>
      {active ? "✅ Aktif" : "❌ Nonaktif"}
    </span>
  );
}

// ── Card statistik ───────────────────────────────────────────
export function StatCard({ emoji, value, label, color }) {
  return (
    <div style={{ background: "white", borderRadius: 14, padding: "20px", border: `1px solid ${C.border}`, textAlign: "center" }}>
      <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontSize: "1.6rem", fontWeight: 900, color: color ?? C.green, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.78rem", color: C.muted, fontWeight: 600, marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────
export function EmptyState({ emoji = "📭", title, desc, action }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 32px", background: "white", borderRadius: 16, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: "3rem", marginBottom: 12 }}>{emoji}</div>
      <div style={{ fontWeight: 700, fontSize: "1rem", color: C.brown, marginBottom: 8 }}>{title}</div>
      {desc && <div style={{ fontSize: "0.85rem", color: C.muted, marginBottom: 20 }}>{desc}</div>}
      {action}
    </div>
  );
}

// ── Modal konfirmasi hapus ────────────────────────────────────
export function DeleteConfirm({ label, onConfirm, onCancel }) {
  return (
    <Modal title="Konfirmasi Hapus" onClose={onCancel} maxWidth={420}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🗑️</div>
        <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
          Yakin ingin menghapus <strong>"{label}"</strong>?<br/>
          <span style={{ fontSize: "0.82rem" }}>Tindakan ini tidak bisa dibatalkan.</span>
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Btn onClick={onCancel} color={C.muted} outline>Batal</Btn>
          <Btn onClick={onConfirm} color={C.red}>🗑️ Ya, Hapus</Btn>
        </div>
      </div>
    </Modal>
  );
}

// ── useToast hook ─────────────────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const show = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3200);
  };
  return [toast, show];
}