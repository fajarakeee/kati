// ============================================================
// AdminDashboard.jsx — Hub navigasi utama admin KATI
// Route: /admin
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabase";
import { AdminLayout, C } from "./AdminLayout";

// ── Kartu menu utama ──────────────────────────────────────────
function MenuCard({ to, emoji, label, desc, color, count, countLabel }) {
  const [hover, setHover] = useState(false);
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        style={{
          background: "white", borderRadius: 16, padding: "24px",
          border: `1.5px solid ${hover ? color : C.border}`,
          cursor: "pointer", transition: "all 0.2s",
          transform: hover ? "translateY(-3px)" : "none",
          boxShadow: hover ? `0 8px 24px ${color}22` : "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            {emoji}
          </div>
          {count !== undefined && (
            <div style={{ background: `${color}15`, color, padding: "4px 12px", borderRadius: 50, fontSize: "0.78rem", fontWeight: 800 }}>
              {count} {countLabel}
            </div>
          )}
        </div>
        <div style={{ fontWeight: 800, fontSize: "1rem", color: C.brown, marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: "0.82rem", color: C.muted, lineHeight: 1.6 }}>{desc}</div>
        <div style={{ marginTop: 16, color, fontWeight: 700, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 4 }}>
          Kelola → 
        </div>
      </div>
    </Link>
  );
}

// ── Aktivitas terakhir ────────────────────────────────────────
function ActivityItem({ emoji, text, time, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
        {emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: C.brown, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</div>
        <div style={{ fontSize: "0.72rem", color: C.muted, marginTop: 2 }}>{time}</div>
      </div>
    </div>
  );
}

// ============================================================
export default function AdminDashboard() {
  // Statistik ringkasan dari semua tabel
  const [stats, setStats] = useState({
    artikel: 0, galeri: 0, programs: 0, events: 0, blogs: 0,
    artikelFeatured: 0, eventsUpcoming: 0,
  });
  const [recentArtikel, setRecentArtikel] = useState([]);
  const [recentGaleri,  setRecentGaleri]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      // Jalankan semua query paralel agar cepat
      const [
        { count: cArtikel },
        { count: cGaleri },
        { count: cPrograms },
        { count: cEvents },
        { count: cBlogs },
        { count: cFeatured },
        { count: cUpcoming },
        { data: dArtikel },
        { data: dGaleri },
      ] = await Promise.all([
        supabase.from("artikel").select("*",  { count: "exact", head: true }),
        supabase.from("galeri").select("*",   { count: "exact", head: true }),
        supabase.from("programs").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*",   { count: "exact", head: true }),
        supabase.from("blogs").select("*",    { count: "exact", head: true }),
        supabase.from("artikel").select("*",  { count: "exact", head: true }).eq("is_featured", true),
        supabase.from("events").select("*",   { count: "exact", head: true }).gte("event_date", today),
        supabase.from("artikel").select("id,judul,dibuat_pada,emoji,warna_kategori").order("dibuat_pada", { ascending: false }).limit(4),
        supabase.from("galeri").select("id,label,cat,created_at").order("created_at", { ascending: false }).limit(3),
      ]);

      setStats({
        artikel:        cArtikel   ?? 0,
        galeri:         cGaleri    ?? 0,
        programs:       cPrograms  ?? 0,
        events:         cEvents    ?? 0,
        blogs:          cBlogs     ?? 0,
        artikelFeatured: cFeatured ?? 0,
        eventsUpcoming:  cUpcoming ?? 0,
      });
      setRecentArtikel(dArtikel ?? []);
      setRecentGaleri(dGaleri   ?? []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <AdminLayout title="Dashboard" subtitle="Selamat datang di panel admin KATI">

      {/* ── Banner selamat datang ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.brown} 0%, #1a0d06 60%, #0d1a07 100%)`,
        borderRadius: 20, padding: "28px 32px", marginBottom: 28,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-40%", right: "5%", width: 200, height: 200, borderRadius: "50%", background: "rgba(111,157,54,0.08)" }}/>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ color: "white", fontWeight: 900, fontSize: "1.3rem", marginBottom: 8 }}>
            🌿 Kelola Konten KATI
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: 1.6 }}>
            Semua konten website — artikel, galeri, program, event, dan blog —<br/>bisa dikelola dari sini.
          </p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" style={{
          background: "rgba(111,157,54,0.2)", border: "1px solid rgba(111,157,54,0.3)",
          color: "#a8d840", padding: "10px 20px", borderRadius: 50,
          textDecoration: "none", fontSize: "0.82rem", fontWeight: 700, whiteSpace: "nowrap",
          position: "relative", zIndex: 1,
        }}>
          🌐 Buka Website →
        </a>
      </div>

      {/* ── Statistik ringkasan ── */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: C.muted }}>⏳ Memuat statistik...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 32 }}>
            {[
              { emoji: "✍️",  value: stats.artikel,   label: "Total Artikel",   color: C.green  },
              { emoji: "⭐",  value: stats.artikelFeatured, label: "Artikel Utama", color: C.orange },
              { emoji: "🖼️",  value: stats.galeri,    label: "Foto Galeri",     color: C.blue   },
              { emoji: "🌿",  value: stats.programs,  label: "Program Aktif",   color: C.leaf   },
              { emoji: "📅",  value: stats.eventsUpcoming, label: "Event Mendatang", color: C.purple },
              { emoji: "📰",  value: stats.blogs,     label: "Artikel Blog",    color: C.orange },
            ].map(s => (
              <div key={s.label} style={{ background: "white", borderRadius: 14, padding: "18px 16px", border: `1px solid ${C.border}`, textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{s.emoji}</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.72rem", color: C.muted, fontWeight: 600, marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Menu navigasi section ── */}
          <h2 style={{ fontWeight: 800, fontSize: "0.9rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            Kelola Konten
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
            <MenuCard to="/admin/artikel"  emoji="✍️"  label="Artikel Berita"  desc="Tulis, edit, dan kelola semua artikel berita KATI"          color={C.green}  count={stats.artikel}   countLabel="artikel" />
            <MenuCard to="/admin/galeri"   emoji="🖼️"  label="Galeri Foto"    desc="Upload dan kelola koleksi foto kegiatan KATI"               color={C.blue}   count={stats.galeri}    countLabel="foto"    />
            <MenuCard to="/admin/programs" emoji="🌿"  label="Program"        desc="Tambah dan edit program konservasi yang ditampilkan"         color={C.leaf}   count={stats.programs}  countLabel="program" />
            <MenuCard to="/admin/events"   emoji="📅"  label="Events"         desc="Jadwalkan kegiatan dan acara mendatang KATI"                 color={C.purple} count={stats.events}    countLabel="event"   />
            <MenuCard to="/admin/blogs"    emoji="📰"  label="Blog"           desc="Kelola artikel blog yang tampil di section Stories & Insights" color={C.orange} count={stats.blogs}   countLabel="post"    />
          </div>

          {/* ── Aktivitas terbaru ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Artikel terbaru */}
            <div style={{ background: "white", borderRadius: 16, padding: "22px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontWeight: 800, fontSize: "0.88rem", color: C.brown }}>✍️ Artikel Terbaru</h3>
                <Link to="/admin/artikel" style={{ fontSize: "0.75rem", color: C.green, textDecoration: "none", fontWeight: 600 }}>Lihat semua →</Link>
              </div>
              {recentArtikel.length === 0
                ? <p style={{ color: C.muted, fontSize: "0.82rem" }}>Belum ada artikel.</p>
                : recentArtikel.map(a => (
                    <ActivityItem key={a.id} emoji={a.emoji ?? "🌿"} text={a.judul} time={fmtDate(a.dibuat_pada)} color={a.warna_kategori ?? C.green} />
                  ))
              }
            </div>

            {/* Foto galeri terbaru */}
            <div style={{ background: "white", borderRadius: 16, padding: "22px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontWeight: 800, fontSize: "0.88rem", color: C.brown }}>🖼️ Foto Terbaru</h3>
                <Link to="/admin/galeri" style={{ fontSize: "0.75rem", color: C.green, textDecoration: "none", fontWeight: 600 }}>Lihat semua →</Link>
              </div>
              {recentGaleri.length === 0
                ? <p style={{ color: C.muted, fontSize: "0.82rem" }}>Belum ada foto.</p>
                : recentGaleri.map(g => (
                    <ActivityItem key={g.id} emoji="📷" text={g.label} time={`${g.cat} · ${fmtDate(g.created_at)}`} color={C.blue} />
                  ))
              }

              {/* Quick links */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Pintasan</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    { to: "/admin/artikel",  label: "+ Artikel Baru", color: C.green  },
                    { to: "/admin/galeri",   label: "+ Upload Foto",  color: C.blue   },
                    { to: "/admin/events",   label: "+ Event Baru",   color: C.purple },
                  ].map(l => (
                    <Link key={l.to} to={l.to} style={{
                      padding: "6px 14px", borderRadius: 50, fontSize: "0.75rem", fontWeight: 700,
                      background: `${l.color}12`, color: l.color, textDecoration: "none",
                      border: `1px solid ${l.color}30`,
                    }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}