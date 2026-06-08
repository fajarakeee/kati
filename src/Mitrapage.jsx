import { useState, useEffect, useRef } from "react";

// ─── Color System ───────────────────────────────────────────────
const C = {
  forest: "#2D5016",
  leaf:   "#5A8A28",
  jade:   "#7DB842",
  sage:   "#B8D98A",
  mist:   "#EBF3DC",
  earth:  "#1C1208",
  bark:   "#3A2410",
  clay:   "#6B4C2A",
  gold:   "#C9A227",
  amber:  "#E8B84B",
  cream:  "#F8F4EC",
  blue:   "#1A4B8C",
  sky:    "#2E6FC4",
};

// ─── Partners Data ───────────────────────────────────────────────
const PARTNERS = {
  platinum: [
    { id: "klhk",  name: "Kementerian LHK", short: "KLHK",   sector: "Pemerintah",     country: "Indonesia", since: "2021", icon: "🏛️", projects: 8,  tagline: "Kementerian Lingkungan Hidup & Kehutanan" },
    { id: "brin",  name: "BRIN",             short: "BRIN",   sector: "Riset & Sains",  country: "Indonesia", since: "2022", icon: "🔬", projects: 5,  tagline: "Badan Riset & Inovasi Nasional" },
    { id: "undp",  name: "UNDP Indonesia",   short: "UNDP",   sector: "Internasional",  country: "Global",    since: "2020", icon: "🌍", projects: 6,  tagline: "United Nations Development Programme" },
    { id: "wwf",   name: "WWF Indonesia",    short: "WWF-ID", sector: "LSM Global",     country: "Indonesia", since: "2021", icon: "🐆", projects: 4,  tagline: "World Wide Fund for Nature" },
  ],
  gold: [
    { id: "ub",    name: "Universitas Brawijaya", short: "UB",    sector: "Akademik",   country: "Indonesia", since: "2022", icon: "🎓", projects: 7,  tagline: "Fakultas Pertanian & Kehutanan" },
    { id: "gef",   name: "Global Env. Facility",  short: "GEF",   sector: "Pendanaan",  country: "Global",    since: "2023", icon: "🌱", projects: 3,  tagline: "Global Environment Facility" },
    { id: "lipi",  name: "LIPI / BRIN",            short: "LIPI",  sector: "Riset",      country: "Indonesia", since: "2021", icon: "⚗️", projects: 5,  tagline: "Lembaga Ilmu Pengetahuan Indonesia" },
    { id: "telkom",name: "Telkom Indonesia",        short: "Telkom",sector: "Teknologi",  country: "Indonesia", since: "2023", icon: "📡", projects: 2,  tagline: "Platform Digital & IoT Lingkungan" },
    { id: "pln",   name: "PT. PLN (Persero)",      short: "PLN",   sector: "Energi",     country: "Indonesia", since: "2022", icon: "⚡", projects: 3,  tagline: "Transisi Energi Hijau" },
    { id: "iucn",  name: "IUCN",                   short: "IUCN",  sector: "Konservasi", country: "Global",    since: "2022", icon: "🌊", projects: 4,  tagline: "Intl. Union for Conservation of Nature" },
  ],
  silver: [
    { id: "walhi",  name: "WALHI",              short: "Walhi",      sector: "LSM Nasional", country: "Indonesia", since: "2020", icon: "🤝", projects: 6 },
    { id: "kemendik",name:"Kemendikbudristek",  short: "Kemendikbud",sector: "Pemerintah",   country: "Indonesia", since: "2023", icon: "🌺", projects: 2 },
    { id: "cifor", name: "CIFOR-ICRAF",         short: "CIFOR",      sector: "Riset Global", country: "Indonesia", since: "2022", icon: "🌳", projects: 3 },
    { id: "yagasu",name: "Yagasu",              short: "Yagasu",     sector: "LSM Lokal",    country: "Indonesia", since: "2021", icon: "🦺", projects: 5 },
    { id: "kehati", name: "KEHATI Foundation",  short: "KEHATI",     sector: "Filantropi",   country: "Indonesia", since: "2022", icon: "🦋", projects: 4 },
    { id: "pertamina",name:"Pertamina",         short: "Pertamina",  sector: "Energi",       country: "Indonesia", since: "2023", icon: "🏭", projects: 2 },
    { id: "btn",   name: "BTN Syariah",         short: "BTN",        sector: "Keuangan",     country: "Indonesia", since: "2023", icon: "🏦", projects: 1 },
    { id: "unfao", name: "UN-FAO Indonesia",    short: "FAO-ID",     sector: "Internasional",country: "Global",    since: "2022", icon: "🌾", projects: 3 },
  ],
};

const SECTORS = ["Semua", "Pemerintah", "Akademik", "Internasional", "Riset & Sains", "LSM Global", "LSM Nasional", "Teknologi", "Energi", "Konservasi"];

const STATS = [
  { value: "24+",  label: "Mitra Aktif",         icon: "🤝", color: C.jade },
  { value: "7",    label: "Negara Terlibat",      icon: "🌍", color: C.sky },
  { value: "12",   label: "Proyek Kolaborasi",    icon: "🌱", color: C.gold },
  { value: "Rp 4,2M", label: "Dana Kemitraan",   icon: "💰", color: C.amber },
  { value: "98%",  label: "Tingkat Kepuasan",     icon: "⭐", color: C.jade },
];

const TESTIMONIALS = [
  { name: "Dr. Siti Nurbaya", role: "Menteri LHK RI", quote: "KATI adalah contoh nyata bagaimana akademisi, komunitas, dan pemerintah dapat bergerak bersama untuk kelestarian alam Indonesia.", org: "KLHK" },
  { name: "Prof. Ahmad Sulaeman", role: "Dekan, UB Malang", quote: "Kolaborasi riset bersama KATI membuka dimensi baru dalam ilmu konservasi berbasis kearifan lokal yang selama ini belum tersentuh.", org: "UB" },
  { name: "Maria Lam", role: "Country Director", quote: "Few organizations bridge science and community as effectively as KATI. Their model deserves international recognition and replication.", org: "WWF-ID" },
];

// ─── Hooks ───────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCounter(target, run, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    const isNum = !isNaN(parseFloat(target));
    if (!isNum) { setVal(target); return; }
    const end = parseFloat(target);
    let start = 0;
    const step = end / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [run, target, duration]);
  return val;
}

// ─── Components ──────────────────────────────────────────────────

function StatCard({ stat, run }) {
  const isNum = !isNaN(parseFloat(stat.value));
  const count = useCounter(isNum ? parseFloat(stat.value) : stat.value, run);
  const suffix = stat.value.replace(/[0-9.,]/g, "");
  const prefix = stat.value.startsWith("Rp") ? "Rp " : "";
  return (
    <div style={{
      background: "rgba(255,255,255,0.035)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 20,
      padding: "28px 24px",
      textAlign: "center",
      backdropFilter: "blur(12px)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.25), 0 0 0 1px ${stat.color}44`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />
      <div style={{ fontSize: "2rem", marginBottom: 8 }}>{stat.icon}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.1rem", fontWeight: 700, color: "#fff", lineHeight: 1, marginBottom: 6 }}>
        {prefix}{isNum ? count : stat.value}{!isNum ? "" : suffix}
      </div>
      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{stat.label}</div>
    </div>
  );
}

function PartnerCard({ partner, tier }) {
  const [hovered, setHovered] = useState(false);
  const tierAccent = tier === "platinum" ? C.amber : tier === "gold" ? C.jade : C.sky;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? tierAccent + "55" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 18,
        padding: "28px 24px",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-6px) scale(1.015)" : "none",
        boxShadow: hovered ? `0 20px 48px rgba(0,0,0,0.3), 0 0 0 1px ${tierAccent}33` : "none",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${tierAccent}${hovered ? "cc" : "44"}, transparent)`, transition: "all 0.3s" }} />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${tierAccent}22, ${tierAccent}08)`,
          border: `1px solid ${tierAccent}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.6rem",
          transition: "transform 0.3s ease",
          transform: hovered ? "scale(1.1) rotate(-3deg)" : "none",
        }}>
          {partner.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "#fff", marginBottom: 2, lineHeight: 1.2 }}>
            {partner.short}
          </div>
          {partner.tagline && (
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>{partner.tagline}</div>
          )}
        </div>
        <div style={{
          padding: "3px 10px", borderRadius: 6,
          background: `${tierAccent}18`, border: `1px solid ${tierAccent}33`,
          fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
          color: tierAccent, whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}>
          {partner.sector}
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", gap: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Bergabung</div>
          <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{partner.since}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Proyek</div>
          <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{partner.projects} Bersama</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Negara</div>
          <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{partner.country}</div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ partners, reverse = false, speed = 32 }) {
  const doubled = [...partners, ...partners];
  return (
    <div style={{ overflow: "hidden", position: "relative", padding: "8px 0",
      maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
    }}>
      <div style={{
        display: "flex", gap: 12, width: "max-content",
        animation: `marquee${reverse ? "Rev" : ""} ${speed}s linear infinite`,
      }}>
        {doubled.map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "12px 20px",
            whiteSpace: "nowrap", cursor: "default",
            transition: "all 0.3s ease",
            filter: "grayscale(60%) opacity(0.5)",
          }}
            onMouseEnter={e => { e.currentTarget.style.filter = "grayscale(0%) opacity(1)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.filter = "grayscale(60%) opacity(0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "none"; }}
          >
            <span style={{ fontSize: "1.3rem" }}>{p.icon}</span>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.04em" }}>{p.short}</div>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)" }}>{p.sector}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TierBadge({ tier }) {
  const cfg = {
    platinum: { label: "Platinum", color: C.amber, bg: `${C.amber}18` },
    gold:     { label: "Gold",     color: C.jade,  bg: `${C.jade}18` },
    silver:   { label: "Silver",   color: C.sky,   bg: `${C.sky}18` },
  }[tier];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.color}40` }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
      <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function MitraPage() {
  const [activeSector, setActiveSector] = useState("Semua");
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [heroRef, heroInView] = useInView(0.1);
  const [statsRef, statsInView] = useInView(0.3);
  const [formData, setFormData] = useState({ org: "", name: "", email: "", type: "akademik", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const allPartners = [...PARTNERS.platinum, ...PARTNERS.gold, ...PARTNERS.silver];
  const filtered = activeSector === "Semua"
    ? allPartners
    : allPartners.filter(p => p.sector === activeSector);

  const getTier = (p) =>
    PARTNERS.platinum.find(x => x.id === p.id) ? "platinum" :
    PARTNERS.gold.find(x => x.id === p.id) ? "gold" : "silver";

  return (
    <div style={{ background: C.earth, minHeight: "100vh", fontFamily: "'Raleway', sans-serif", color: "#fff", overflowX: "hidden" }}>

      {/* ── CSS ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=Raleway:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes marquee    { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marqueeRev { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        @keyframes fadeUp     { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:none; } }
        @keyframes shimmer    { 0%,100% { opacity:0.4; } 50% { opacity:0.9; } }
        @keyframes spin-slow  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-dot  { 0%,100% { box-shadow: 0 0 0 0 ${C.jade}66; } 60% { box-shadow: 0 0 0 10px transparent; } }

        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.22s; }
        .fade-up-3 { animation-delay: 0.34s; }
        .fade-up-4 { animation-delay: 0.46s; }

        .sector-btn {
          padding: 8px 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
          background: transparent; color: rgba(255,255,255,0.55); font-family: 'Raleway', sans-serif;
          font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
          letter-spacing: 0.03em; white-space: nowrap;
        }
        .sector-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
        .sector-btn.active { background: ${C.jade}22; border-color: ${C.jade}55; color: ${C.jade}; }

        .cta-input {
          width: 100%; padding: 13px 16px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04);
          color: #fff; font-family: 'Raleway', sans-serif; font-size: 0.9rem; outline: none;
          transition: border-color 0.2s ease;
        }
        .cta-input:focus { border-color: ${C.jade}88; }
        .cta-input::placeholder { color: rgba(255,255,255,0.25); }

        .cta-input option { background: ${C.bark}; color: #fff; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.earth}; }
        ::-webkit-scrollbar-thumb { background: ${C.leaf}55; border-radius: 99px; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 48px 80px", overflow: "hidden" }}>

        {/* Background grid */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#6F9D36" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>

        {/* Orbs */}
        <div style={{ position: "absolute", top: "15%", right: "8%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.leaf}18, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.blue}14, transparent 70%)`, pointerEvents: "none" }} />

        {/* Rotating badge */}
        <div style={{ position: "absolute", top: "12%", right: "12%", width: 140, height: 140, opacity: 0.12, animation: "spin-slow 30s linear infinite" }}>
          <svg viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" fill="none" stroke={C.jade} strokeWidth="1" strokeDasharray="4 8"/>
            <text style={{ font: "bold 9px 'Raleway', sans-serif", fill: C.jade, letterSpacing: "4px" }}>
              <textPath href="#circ">KATI · MITRA STRATEGIS · KATI · MITRA STRATEGIS · </textPath>
            </text>
            <defs><path id="circ" d="M70 10 a60 60 0 1 1 -0.001 0"/></defs>
          </svg>
        </div>

        {/* Nav hint */}
        <div style={{ position: "absolute", top: 32, left: 48, display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = C.jade}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
            ← Beranda
          </a>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
          <span style={{ color: C.jade, fontSize: "0.8rem", fontWeight: 600 }}>Mitra Strategis</span>
        </div>

        <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%" }}>
          <div className={heroInView ? "fade-up" : ""} style={{ marginBottom: 20 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 99, border: `1px solid ${C.jade}44`, background: `${C.jade}10`, marginBottom: 32 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.jade, animation: "pulse-dot 2.5s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.jade }}>
                Ekosistem Kolaborasi Nasional & Internasional
              </span>
            </div>
          </div>

          <h1 className={heroInView ? "fade-up fade-up-1" : ""} style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(3rem, 6.5vw, 5.8rem)",
            fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.025em",
            marginBottom: 32, maxWidth: 900,
          }}>
            Bersatu dalam{" "}
            <span style={{ fontStyle: "italic", color: C.jade }}>Misi</span>
            <br />
            Merawat{" "}
            <span style={{ fontStyle: "italic", color: C.amber }}>Bumi Indonesia</span>
          </h1>

          <p className={heroInView ? "fade-up fade-up-2" : ""} style={{
            fontSize: "1.05rem", lineHeight: 1.85, color: "rgba(255,255,255,0.55)",
            maxWidth: 580, marginBottom: 52,
          }}>
            KATI membangun jejaring kemitraan yang kokoh dengan institusi pemerintah, akademisi, LSM global, dan sektor swasta — bersama mendorong perubahan nyata untuk alam dan masyarakat.
          </p>

          {/* Stat strip */}
          <div className={heroInView ? "fade-up fade-up-3" : ""} style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[
              { v: "24+", l: "Mitra Aktif" },
              { v: "7",   l: "Negara" },
              { v: "12",  l: "Proyek Bersama" },
            ].map((s, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${C.jade}55`, paddingLeft: 18 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee strip at bottom */}
        <div className={heroInView ? "fade-up fade-up-4" : ""} style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingBottom: 32 }}>
          <MarqueeRow partners={allPartners} speed={36} />
        </div>
      </section>

      {/* ── STATS SECTION ────────────────────────────────────── */}
      <section ref={statsRef} style={{ padding: "80px 48px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {STATS.map((s, i) => <StatCard key={i} stat={s} run={statsInView} />)}
          </div>
        </div>
      </section>

      {/* ── PLATINUM PARTNERS ─────────────────────────────────── */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <TierBadge tier="platinum" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, marginTop: 20, marginBottom: 14, letterSpacing: "-0.02em" }}>
              Mitra Platinum
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.93rem", lineHeight: 1.75, maxWidth: 520 }}>
              Institusi-institusi ini adalah pilar utama ekosistem kemitraan KATI — dengan komitmen jangka panjang dan dampak terluas di lapangan.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {PARTNERS.platinum.map(p => <PartnerCard key={p.id} partner={p} tier="platinum" />)}
          </div>
        </div>
      </section>

      {/* ── MARQUEE INTERLUDE ─────────────────────────────────── */}
      <div style={{ padding: "40px 0", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.15)" }}>
        <MarqueeRow partners={[...PARTNERS.gold, ...PARTNERS.silver]} reverse speed={28} />
      </div>

      {/* ── GOLD PARTNERS ─────────────────────────────────────── */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
            <div>
              <TierBadge tier="gold" />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, marginTop: 20, letterSpacing: "-0.02em" }}>
                Mitra Gold
              </h2>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", maxWidth: 380, lineHeight: 1.7 }}>
              Akademisi, lembaga riset, dan organisasi internasional yang memperkuat basis ilmiah dan jaringan global KATI.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {PARTNERS.gold.map(p => <PartnerCard key={p.id} partner={p} tier="gold" />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ padding: "80px 48px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 48 }}>
            Apa Kata Mitra Kami
          </div>

          <div style={{ position: "relative", minHeight: 220 }}>
            <div key={testimonialIdx} style={{ animation: "fadeUp 0.5s ease both" }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                fontStyle: "italic", fontWeight: 600,
                color: "rgba(255,255,255,0.85)", lineHeight: 1.65,
                marginBottom: 36,
              }}>
                "{TESTIMONIALS[testimonialIdx].quote}"
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${C.jade}44, ${C.amber}33)`, border: `1px solid ${C.jade}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                  🌿
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>{TESTIMONIALS[testimonialIdx].name}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{TESTIMONIALS[testimonialIdx].role} · {TESTIMONIALS[testimonialIdx].org}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)} style={{
                width: i === testimonialIdx ? 28 : 8, height: 8, borderRadius: 4,
                background: i === testimonialIdx ? C.jade : "rgba(255,255,255,0.15)",
                border: "none", cursor: "pointer", transition: "all 0.3s ease",
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SILVER / ALL PARTNERS FILTERED ────────────────────── */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <TierBadge tier="silver" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, marginTop: 20, marginBottom: 32, letterSpacing: "-0.02em" }}>
              Mitra Silver & Komunitas
            </h2>

            {/* Sector filter */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SECTORS.map(s => (
                <button key={s} className={`sector-btn${activeSector === s ? " active" : ""}`} onClick={() => setActiveSector(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {filtered.map(p => (
              <PartnerCard key={p.id} partner={p} tier={getTier(p)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.25)", fontSize: "1rem" }}>
              Belum ada mitra di sektor ini.
            </div>
          )}
        </div>
      </section>

      {/* ── IMPACT MAP VISUAL ─────────────────────────────────── */}
      <section style={{ padding: "80px 48px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.jade, marginBottom: 16 }}>Jangkauan Global</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Dampak yang Melampaui{" "}
                <span style={{ fontStyle: "italic", color: C.amber }}>Batas Wilayah</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.85, marginBottom: 36, fontSize: "0.93rem" }}>
                Jaringan mitra kami tersebar di 7 negara — dari kantor-kantor PBB di Geneva hingga komunitas petani di lereng Semeru. Setiap kemitraan dirancang untuk menciptakan dampak yang terukur dan berkelanjutan.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Asia Tenggara", pct: 72, color: C.jade },
                  { label: "Mitra Internasional PBB", pct: 48, color: C.sky },
                  { label: "Sektor Swasta (ESG)", pct: 35, color: C.amber },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>{item.label}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: item.color }}>{item.pct}%</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                      <div style={{ height: "100%", borderRadius: 99, width: `${item.pct}%`, background: `linear-gradient(90deg, ${item.color}88, ${item.color})`, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual map placeholder */}
            <div style={{ position: "relative", height: 400 }}>
              <svg viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", opacity: 0.7 }}>
                {/* Decorative globe wireframe */}
                <ellipse cx="240" cy="190" rx="180" ry="170" fill="none" stroke={`${C.jade}30`} strokeWidth="1"/>
                <ellipse cx="240" cy="190" rx="120" ry="170" fill="none" stroke={`${C.jade}20`} strokeWidth="0.5"/>
                <ellipse cx="240" cy="190" rx="60" ry="170" fill="none" stroke={`${C.jade}15`} strokeWidth="0.5"/>
                <line x1="60" y1="190" x2="420" y2="190" stroke={`${C.jade}25`} strokeWidth="0.5"/>
                <line x1="80" y1="130" x2="400" y2="130" stroke={`${C.jade}18`} strokeWidth="0.5"/>
                <line x1="80" y1="250" x2="400" y2="250" stroke={`${C.jade}18`} strokeWidth="0.5"/>
                {/* Hotspots */}
                {[
                  { x: 290, y: 210, label: "Malang", main: true },
                  { x: 250, y: 195, label: "Jakarta" },
                  { x: 160, y: 150, label: "Geneva" },
                  { x: 170, y: 170, label: "Brussels" },
                  { x: 320, y: 180, label: "Kuala Lumpur" },
                  { x: 380, y: 200, label: "Tokyo" },
                  { x: 200, y: 220, label: "Nairobi" },
                ].map((pt, i) => (
                  <g key={i}>
                    {pt.main && <circle cx={pt.x} cy={pt.y} r="20" fill={`${C.jade}15`} style={{ animation: "shimmer 2.5s ease-in-out infinite" }} />}
                    <circle cx={pt.x} cy={pt.y} r={pt.main ? 8 : 5} fill={pt.main ? C.jade : `${C.jade}66`} />
                    <circle cx={pt.x} cy={pt.y} r={pt.main ? 4 : 2} fill="#fff" />
                    {pt.main && (
                      <>
                        {[0, 1, 2, 3, 4, 5].map(j => (
                          <line key={j} x1={pt.x} y1={pt.y}
                            x2={[160, 170, 200, 320, 380, 250][j]}
                            y2={[150, 170, 220, 180, 200, 195][j]}
                            stroke={`${C.jade}40`} strokeWidth="0.8" strokeDasharray="3 4"/>
                        ))}
                      </>
                    )}
                    <text x={pt.x + (pt.main ? 12 : 8)} y={pt.y - 6} fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="Raleway">
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── JOIN / CTA ────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px", background: `linear-gradient(160deg, ${C.forest}cc 0%, ${C.earth} 60%)`, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "start" }}>

            {/* Left copy */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${C.jade})` }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.jade }}>Bergabung sebagai Mitra</span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 24, letterSpacing: "-0.02em" }}>
                Bersama Kita{" "}
                <span style={{ fontStyle: "italic", color: C.amber }}>Bisa Lebih</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.85, marginBottom: 40, fontSize: "0.95rem" }}>
                Apakah institusi Anda memiliki visi untuk alam dan masyarakat yang lebih baik? Mari bergabung dalam ekosistem kemitraan KATI dan wujudkan dampak yang tak bisa dicapai sendiri.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { icon: "🔬", t: "Riset Kolaboratif", d: "Akses ke 45+ lokasi riset lapangan dan data ekologi" },
                  { icon: "🌐", t: "Jaringan Global", d: "Terhubung dengan 24+ mitra di 7 negara" },
                  { icon: "📊", t: "Dampak Terukur", d: "Laporan dampak triwulanan berbasis ESG & SDG" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.jade}15`, border: `1px solid ${C.jade}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff", marginBottom: 4 }}>{item.t}</div>
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              {submitted ? (
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 48, textAlign: "center" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>🤝</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: C.jade, marginBottom: 12 }}>
                    Terima Kasih!
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
                    Tim Partnership KATI akan menghubungi Anda dalam 2–3 hari kerja untuk mendiskusikan peluang kolaborasi lebih lanjut.
                  </p>
                </div>
              ) : (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 40 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, marginBottom: 28, color: "#fff" }}>
                    Formulir Pendaftaran Mitra
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    {[
                      { key: "org",  label: "Nama Institusi / Organisasi", ph: "Universitas / Lembaga Anda" },
                      { key: "name", label: "Nama Penanggung Jawab", ph: "Nama lengkap" },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{f.label}</label>
                        <input type="text" placeholder={f.ph} className="cta-input"
                          value={formData[f.key]} onChange={e => setFormData(d => ({...d, [f.key]: e.target.value}))} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Email Resmi</label>
                    <input type="email" placeholder="nama@institusi.ac.id" className="cta-input"
                      value={formData.email} onChange={e => setFormData(d => ({...d, email: e.target.value}))} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Tipe Kemitraan</label>
                    <select className="cta-input" value={formData.type} onChange={e => setFormData(d => ({...d, type: e.target.value}))}>
                      <option value="akademik">Riset & Akademik</option>
                      <option value="pemerintah">Pemerintah & Regulasi</option>
                      <option value="ngo">LSM & Filantropi</option>
                      <option value="swasta">Korporasi & CSR</option>
                      <option value="media">Media & Komunikasi</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Pesan & Tujuan Kolaborasi</label>
                    <textarea rows={4} placeholder="Ceritakan visi dan tujuan kemitraan Anda bersama KATI..." className="cta-input"
                      style={{ resize: "vertical" }} value={formData.message}
                      onChange={e => setFormData(d => ({...d, message: e.target.value}))} />
                  </div>
                  <button onClick={() => setSubmitted(true)} style={{
                    width: "100%", padding: "15px", borderRadius: 12, border: "none",
                    background: `linear-gradient(135deg, ${C.leaf}, ${C.jade})`,
                    color: "#fff", fontFamily: "'Raleway', sans-serif", fontSize: "0.95rem",
                    fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em",
                    transition: "all 0.3s ease",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${C.jade}55`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                    Ajukan Permohonan Kemitraan →
                  </button>
                  <p style={{ textAlign: "center", fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", marginTop: 14, lineHeight: 1.6 }}>
                    🔒 Data Anda aman. Kami tidak berbagi informasi dengan pihak ketiga.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ padding: "40px 48px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.forest}, ${C.jade})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>🌿</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Kampus Alam Tegalsari Indonesia</div>
            <div style={{ fontSize: "0.65rem", color: C.jade, letterSpacing: "0.08em", textTransform: "uppercase" }}>Mitra Strategis</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {["Beranda", "Program", "Artikel", "Volunteer", "Kontak"].map(item => (
            <a key={item} href="#" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.jade}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
              {item}
            </a>
          ))}
        </div>
        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>
          © 2026 KATI · All rights reserved
        </div>
      </footer>

    </div>
  );
}