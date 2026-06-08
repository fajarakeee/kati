import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabase";

// ─── WARNA ───────────────────────────────────────────────────
const C = {
  forest:  "#4E7D22",
  leaf:    "#6F9D36",
  earth:   "#3D2415",
  blue:    "#2F6FC4",
  amber:   "#d4820e",
  purple:  "#9c3dba",
  red:     "#c0392b",
  bg:      "#f3f0eb",
  card:    "#ffffff",
  muted:   "#7a6a5a",
  border:  "#e2ddd8",
};

function ProgramPageFetch() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("semua");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("is_active", true)
        .order("urutan");
      if (!error) setPrograms(data || []);
      setLoading(false);
    };
    fetch();
  }, []);}
  
// ─── LIGHTBOX ─────────────────────────────────────────────────
function Lightbox({ item, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: item.bg,
          borderRadius: 24,
          width: "min(520px, 90vw)",
          aspectRatio: "4/3",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* tutup */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.15)", border: "none",
            borderRadius: 50, width: 36, height: 36,
            cursor: "pointer", color: "white", fontSize: "1.1rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
        >✕</button>

        <span style={{ fontSize: "7rem", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))", marginBottom: 24 }}>
          {item.emoji}
        </span>
        <div style={{
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
          borderRadius: 50, padding: "8px 24px",
        }}>
          <span style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}>
            {item.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── GALLERY GRID ─────────────────────────────────────────────
function GalleryGrid({ items }) {
  const [active, setActive] = useState(null);
  return (
    <>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
      }}>
        {items.map((item, i) => (
          <GalleryThumb key={i} item={item} onClick={() => setActive(item)} />
        ))}
      </div>
      {active && <Lightbox item={active} onClose={() => setActive(null)} />}
    </>
  );
}

function GalleryThumb({ item, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: item.bg,
        borderRadius: 14,
        aspectRatio: "1/1",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        position: "relative", overflow: "hidden",
        transform: hov ? "scale(1.04)" : "scale(1)",
        transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: hov ? "0 12px 32px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <span style={{ fontSize: "2.2rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
        {item.emoji}
      </span>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)",
        padding: "20px 10px 8px",
        opacity: hov ? 1 : 0,
        transition: "opacity 0.25s",
      }}>
        <p style={{ color: "white", fontSize: "0.68rem", fontWeight: 600, textAlign: "center", margin: 0 }}>
          {item.label}
        </p>
      </div>
      {/* zoom icon */}
      <div style={{
        position: "absolute", top: 8, right: 8,
        background: "rgba(255,255,255,0.2)", borderRadius: 6,
        width: 24, height: 24,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: hov ? 1 : 0,
        transition: "opacity 0.2s",
        fontSize: "0.75rem",
      }}>🔍</div>
    </div>
  );
}

// ─── PROGRAM CARD ─────────────────────────────────────────────
function ProgramCard({ prog, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(prog)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.card,
        borderRadius: 20,
        border: `1.5px solid ${hov ? prog.color + "55" : C.border}`,
        padding: "28px 24px",
        cursor: "pointer",
        position: "relative", overflow: "hidden",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hov
          ? `0 20px 48px ${prog.color}1a, 0 4px 16px rgba(0,0,0,0.06)`
          : "0 2px 10px rgba(0,0,0,0.04)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg,${prog.color},${prog.color}66)`,
      }} />

      {/* glow */}
      <div style={{
        position: "absolute", top: "-30%", right: "-15%",
        width: 140, height: 140, borderRadius: "50%",
        background: `radial-gradient(ellipse,${prog.color}12 0%,transparent 70%)`,
        opacity: hov ? 1 : 0, transition: "opacity 0.4s",
        pointerEvents: "none",
      }} />

      {/* icon */}
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: `${prog.color}18`,
        border: `1px solid ${prog.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.8rem", marginBottom: 16,
        transform: hov ? "scale(1.1) rotate(-4deg)" : "scale(1)",
        transition: "transform 0.3s",
      }}>
        {prog.emoji}
      </div>

      <h3 style={{
        fontFamily: "'Playfair Display',Georgia,serif",
        fontSize: "1.1rem", fontWeight: 700, marginBottom: 8,
        color: hov ? prog.color : C.earth,
        transition: "color 0.2s",
      }}>
        {prog.title}
      </h3>

      <p style={{ color: C.muted, lineHeight: 1.65, fontSize: "0.85rem", marginBottom: 18 }}>
        {prog.tagline}
      </p>

      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18,
      }}>
        {prog.stats.map((s, i) => (
          <div key={i} style={{
            background: `${prog.color}10`,
            borderRadius: 8, padding: "5px 12px", textAlign: "center",
          }}>
            <div style={{ color: prog.color, fontWeight: 800, fontSize: "0.95rem" }}>{s.val}</div>
            <div style={{ color: C.muted, fontSize: "0.68rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <span style={{
        color: prog.color, fontWeight: 600, fontSize: "0.82rem",
        display: "inline-flex", alignItems: "center", gap: hov ? 10 : 6,
        transition: "gap 0.2s",
      }}>
        Lihat Detail
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
          stroke={prog.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: hov ? "translateX(3px)" : "none", transition: "transform 0.2s" }}>
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </span>
    </div>
  );
}

// ─── PROGRAM DETAIL MODAL ────────────────────────────────────
function ProgramDetail({ prog, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 5000,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 28,
          width: "min(860px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
          animation: "scaleIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Hero */}
        <div style={{
          background: `linear-gradient(160deg, ${prog.gradFrom} 0%, ${prog.gradTo} 100%)`,
          borderRadius: "28px 28px 0 0",
          padding: "48px 48px 40px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", bottom: "-30%", right: "-5%",
            width: 280, height: 280, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }} />
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 20, right: 20,
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: 50, width: 40, height: 40,
              cursor: "pointer", color: "white", fontSize: "1.1rem",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>

          <span style={{ fontSize: "3.5rem", display: "block", marginBottom: 16 }}>{prog.emoji}</span>
          <h2 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(1.8rem,4vw,2.4rem)", fontWeight: 800,
            color: "white", marginBottom: 10, lineHeight: 1.2,
          }}>
            {prog.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 560 }}>
            {prog.desc}
          </p>

          {/* stats */}
          <div style={{ display: "flex", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
            {prog.stats.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                borderRadius: 14, padding: "14px 20px",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                <div style={{ color: "white", fontWeight: 800, fontSize: "1.4rem", lineHeight: 1 }}>{s.val}</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75rem", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div style={{ padding: "40px 48px 48px" }}>
          <h3 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "1.3rem", fontWeight: 700,
            color: C.earth, marginBottom: 20,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: "1.1rem" }}>📸</span>
            Galeri Program
            <span style={{
              background: `${prog.color}18`, color: prog.color,
              borderRadius: 50, padding: "2px 12px", fontSize: "0.78rem", fontWeight: 600,
            }}>
              Klik foto untuk perbesar
            </span>
          </h3>
          <GalleryGrid items={prog.gallery} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function ProgramPage() {
  // 1. KODE INI YANG HILANG (Wajib ada agar 'programs' dikenali)
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("semua");

  // 2. FUNGSI INI JUGA HILANG (Wajib ada untuk ambil data dari Supabase)
  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("is_active", true)
        .order("urutan");
      if (!error) setPrograms(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  // 3. Kategori dan Map Anda yang sudah ada
  const categories = ["semua", "alam", "komunitas", "pendidikan"];
  const catMap = {
    "konservasi-hutan": "alam",
    "pengelolaan-air": "alam",
    "pertanian-organik": "alam",
    "pendidikan-lingkungan": "pendidikan",
    "zero-sampah": "komunitas",
    "kepemimpinan-muda": "komunitas",
  };

  // 4. Logika filter yang sekarang sudah aman karena 'programs' sudah didefinisikan di atas
  const visible = filter === "semua"
    ? programs
    : programs.filter(p => catMap[p.id] === filter);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.88) } to { opacity:1; transform:scale(1) } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        .prog-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .prog-card-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .prog-card-grid { grid-template-columns: 1fr; }
          .page-hero-inner { padding: 80px 20px 60px !important; }
          .page-content { padding: 48px 20px !important; }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c0b8b0; border-radius: 4px; }
      `}</style>

      {/* ── NAVBAR mini ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(243,240,235,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "14px 40px",
        display: "flex", alignItems: "center", gap: 12,
        animation: "slideDown 0.4s ease",
      }}>
        <Link to="/" style={{
          color: C.muted, textDecoration: "none", fontSize: "0.85rem",
          display: "flex", alignItems: "center", gap: 6, fontWeight: 500,
        }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Beranda
        </Link>
        <span style={{ color: C.border }}>/</span>
        <span style={{ color: C.forest, fontWeight: 700, fontSize: "0.85rem" }}>Program</span>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        background: `linear-gradient(160deg, ${C.earth} 0%, #1a0d06 45%, #0d1a07 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        {/* decorative circles */}
        {[
          { top: "-10%", right: "5%",  size: 400, opacity: 0.06 },
          { top:  "40%", left: "-5%", size: 300, opacity: 0.05 },
        ].map((d, i) => (
          <div key={i} style={{
            position: "absolute", top: d.top, left: d.left, right: d.right,
            width: d.size, height: d.size, borderRadius: "50%",
            border: "1px solid rgba(111,157,54,0.3)",
            background: `rgba(111,157,54,${d.opacity})`,
            pointerEvents: "none",
          }} />
        ))}

        {/* floating emojis */}
        {["🌿","🌳","💧","🌱","♻️","🦋"].map((em, i) => (
          <span key={i} style={{
            position: "absolute", fontSize: `${1.2 + (i % 3) * 0.4}rem`,
            top: `${15 + i * 13}%`,
            left: i % 2 === 0 ? `${5 + i * 4}%` : undefined,
            right: i % 2 !== 0 ? `${3 + i * 3}%` : undefined,
            opacity: 0.25,
            animation: `float ${4 + i * 0.8}s ease-in-out ${i * 0.5}s infinite`,
            pointerEvents: "none",
          }}>{em}</span>
        ))}

        <div className="page-hero-inner" style={{
          maxWidth: 900, margin: "0 auto",
          padding: "100px 40px 80px",
          textAlign: "center", position: "relative", zIndex: 1,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(111,157,54,0.15)",
            border: "1px solid rgba(111,157,54,0.3)",
            borderRadius: 50, padding: "7px 18px", marginBottom: 28,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: C.leaf, display: "inline-block",
              boxShadow: "0 0 0 0 rgba(111,157,54,0.5)",
              animation: "pulse 2s infinite",
            }} />
            <span style={{ color: C.leaf, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em" }}>
              6 PROGRAM UNGGULAN · KATI 2026
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(2.4rem,6vw,4rem)", fontWeight: 800,
            color: "white", lineHeight: 1.1, marginBottom: 20,
            letterSpacing: "-0.02em",
          }}>
            Program <span style={{
              fontStyle: "italic",
              background: "linear-gradient(135deg,#6F9D36,#a8d840)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Utama</span> Kami
          </h1>

          <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.85, fontSize: "1.05rem", maxWidth: 620, margin: "0 auto" }}>
            Lima pilar yang saling terhubung mendorong transformasi lingkungan dan sosial yang terukur di seluruh Jawa Tengah.
          </p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="page-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 40px 100px" }}>

        {/* Filter tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 52, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "9px 22px", borderRadius: 50, border: "none",
                cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                fontFamily: "inherit",
                background: filter === cat ? C.forest : "white",
                color: filter === cat ? "white" : C.earth,
                boxShadow: filter === cat
                  ? `0 4px 16px ${C.forest}33`
                  : "0 1px 4px rgba(0,0,0,0.06)",
                border: filter === cat ? "none" : `1px solid ${C.border}`,
                transition: "all 0.25s",
                textTransform: "capitalize",
              }}
            >
              {cat === "semua" ? "🌍 Semua" :
               cat === "alam" ? "🌿 Alam" :
               cat === "komunitas" ? "🤝 Komunitas" : "📚 Pendidikan"}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="prog-card-grid">
          {visible.map((prog) => (
            <ProgramCard key={prog.id} prog={prog} onClick={setSelected} />
          ))}
        </div>

        {/* CTA bottom */}
        <div style={{ textAlign: "center", marginTop: 72 }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.forest}15, ${C.leaf}10)`,
            border: `1px solid ${C.forest}25`,
            borderRadius: 24, padding: "48px 40px",
            maxWidth: 600, margin: "0 auto",
          }}>
            <span style={{ fontSize: "2.5rem", display: "block", marginBottom: 16 }}>🌱</span>
            <h3 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "1.6rem", fontWeight: 700, color: C.earth, marginBottom: 12,
            }}>
              Ingin Bergabung?
            </h3>
            <p style={{ color: C.muted, lineHeight: 1.75, marginBottom: 28, fontSize: "0.95rem" }}>
              Jadilah bagian dari gerakan perubahan nyata. Daftar sebagai relawan dan mulai perjalananmu bersama KATI.
            </p>
            <Link to="/#volunteer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: C.forest, color: "white",
              padding: "13px 32px", borderRadius: 50,
              fontWeight: 700, textDecoration: "none", fontSize: "0.9rem",
              boxShadow: `0 6px 20px ${C.forest}44`,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 28px ${C.forest}55`; }}
              onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 6px 20px ${C.forest}44`; }}
            >
              Daftar Relawan
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <ProgramDetail prog={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
