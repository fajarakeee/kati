import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 🆕 tambahkan useNavigate
import { supabase } from "./supabase"; // 🔌 sesuaikan path import-mu

// ─── WARNA ──────────────────────────────────────────────────────────────────
const C = {
  forestGreen: "#4E7D22",
  leafGreen:   "#6F9D36",
  earthBrown:  "#3D2415",
  natureBlue:  "#2F6FC4",
  lightGray:   "#D8D6D1",
  white:       "#FFFFFF",
};

const ALL_CATEGORIES = [
  "Semua","Konservasi","Air","Pendidikan",
  "Pertanian","Kepemimpinan Muda","Riset & Data","Umum"
];

// ─── SVG ICONS (tidak berubah) ───────────────────────────────────────────────
const IconSearch  = ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconClock   = ({s=14,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconEye     = ({s=14,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconLeaf    = ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
const IconArrow   = ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IconBack    = ({s=18,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const IconShare   = ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
// 🆕 Icon Plus untuk tombol Tambah Artikel
const IconPlus    = ({s=16,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

// ─── HELPER: ubah data Supabase → format yang dipakai UI ─────────────────────
function adaptArticle(raw) {
  return {
    id:            raw.id,
    slug:          String(raw.id),
    category:      raw.kategori      ?? "Umum",
    categoryColor: raw.warna_kategori ?? C.forestGreen,
    tag:           raw.tag            ?? "BERITA TERKINI",
    headline:      raw.judul,
    excerpt:       raw.konten?.slice(0, 200) + "...",
    author:        raw.penulis        ?? "Tim Redaksi",
    authorRole:    raw.peran_penulis  ?? "Kampus Alam",
    date:          new Date(raw.dibuat_pada).toLocaleDateString("id-ID", {
                     day:"2-digit", month:"long", year:"numeric"
                   }),
    readTime:      raw.waktu_baca     ?? "5 menit",
    views:         raw.views?.toLocaleString("id-ID") ?? "0",
    featured:      raw.is_featured    ?? false,
    emoji:         raw.emoji          ?? "🌿",
    bgGradient:    raw.bg_gradient    ?? "linear-gradient(160deg,#1a3d08 0%,#2d6f18 50%,#4e7d22 100%)",
    badge:         raw.badge          ?? null,
    kontenLengkap: raw.konten,
    gambarUrl:     raw.gambar_url,
  };
}

// ─── SKELETON LOADER ─────────────────────────────────────────────────────────
function SkeletonCard({ darkMode }) {
  const bg     = darkMode ? "#1a2a0e" : "#fff";
  const shimmer= darkMode ? "#2a3d1a" : "#eee";
  return (
    <div style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${shimmer}`, background: bg }}>
      <div style={{ height: 180, background: shimmer, animation: "pulse 1.5s ease-in-out infinite" }}/>
      <div style={{ padding: "20px 22px 24px" }}>
        {[100, 80, 60].map(w => (
          <div key={w} style={{ height: 14, borderRadius: 7, background: shimmer, marginBottom: 10, width: `${w}%`, animation: "pulse 1.5s ease-in-out infinite" }}/>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

// ─── ARTICLE DETAIL VIEW ──────────────────────────────────────────────────────
function ArticleDetail({ article, onBack, darkMode }) {
  const tx = darkMode ? "#e8f5d4" : C.earthBrown;
  const mt = darkMode ? "#8aad60" : "#7a6a5a";
  const bg = darkMode ? "#0d1a07" : "#fff";

  const paragraphs = (article.kontenLengkap ?? "")
    .split(/\n\n+/)
    .filter(Boolean);

  return (
    <article style={{ background: bg, minHeight: "100vh", color: tx }}>
      {/* Hero */}
      <div style={{ minHeight: 420, background: article.bgGradient, position: "relative", display: "flex", alignItems: "flex-end" }}>
        {article.gambarUrl && (
          <img src={article.gambarUrl} alt={article.headline}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }}
          />
        )}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7rem", opacity: 0.2 }}>
          {article.emoji}
        </div>
        <button onClick={onBack} style={{
          position: "absolute", top: 80, left: 32, display: "flex", alignItems: "center", gap: 8,
          background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8,
          color: "white", padding: "8px 16px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
          backdropFilter: "blur(8px)",
        }}>
          <IconBack s={16} c="white" /> Kembali ke Artikel
        </button>
        <div style={{ position: "relative", zIndex: 2, padding: "0 48px 40px", maxWidth: 860 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ background: article.categoryColor, color: "white", padding: "4px 14px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700 }}>{article.category}</span>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", padding: "4px 14px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em" }}>{article.tag}</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "white", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            {article.headline}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 28px", borderBottom: `1px solid ${darkMode?"#1a3008":"#e8e6e2"}`, marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${article.categoryColor}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
              {article.emoji}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{article.author}</div>
              <div style={{ fontSize: "0.78rem", color: mt }}>{article.authorRole}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, color: mt, fontSize: "0.82rem", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><IconClock s={14} c={mt} />{article.date}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><IconClock s={14} c={mt} />{article.readTime} baca</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><IconEye s={14} c={mt} />{article.views} pembaca</span>
            <button style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: `1px solid ${darkMode?"#2a3d1a":"#e0ddd8"}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", color: mt, fontSize: "0.82rem" }}>
              <IconShare s={14} c={mt} /> Bagikan
            </button>
          </div>
        </div>

        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: "1rem", lineHeight: 1.9, color: tx, marginBottom: 24, textAlign: "justify", opacity: 0.88 }}>
              {p}
            </p>
          ))
        ) : (
          <p style={{ color: mt, fontStyle: "italic" }}>Konten artikel belum tersedia.</p>
        )}
      </div>
    </article>
  );
}

// ─── ARTICLE CARD ─────────────────────────────────────────────────────────────
function ArticleCard({ article, featured, onRead, darkMode }) {
  const cardBg = darkMode ? "#1a2a0e" : "#fff";
  const border = darkMode ? "#2a3d1a" : "#e8e6e2";
  const mt     = darkMode ? "#8aad60" : "#7a6a5a";
  const tx     = darkMode ? "#e8f5d4" : C.earthBrown;

  if (featured) {
    return (
      <div onClick={() => onRead(article)}
        style={{ borderRadius: 24, overflow: "hidden", border: `1px solid ${border}`, cursor: "pointer", background: cardBg, display: "grid", gridTemplateColumns: "1fr 1fr", transition: "transform 0.25s, box-shadow 0.25s" }}
        onMouseOver={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 20px 48px rgba(78,125,34,0.12)"; }}
        onMouseOut={e  => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="none"; }}>
        <div style={{ background: article.bgGradient, minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {article.gambarUrl
            ? <img src={article.gambarUrl} alt={article.headline} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.6 }}/>
            : <span style={{ fontSize:"6rem", filter:"drop-shadow(0 8px 16px rgba(0,0,0,0.3))", zIndex:1 }}>{article.emoji}</span>
          }
          {article.badge && (
            <div style={{ position:"absolute",top:20,left:20,zIndex:2,background:"rgba(255,255,255,0.95)",color:article.categoryColor,padding:"5px 16px",borderRadius:50,fontSize:"0.7rem",fontWeight:800,letterSpacing:"0.08em" }}>
              {article.badge}
            </div>
          )}
        </div>
        <div style={{ padding:"36px 36px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            <span style={{ background:article.categoryColor,color:"white",padding:"4px 14px",borderRadius:50,fontSize:"0.7rem",fontWeight:700 }}>{article.category}</span>
            <span style={{ background:darkMode?"#1a3008":"#f0f7e8",color:mt,padding:"4px 14px",borderRadius:50,fontSize:"0.7rem",fontWeight:600,letterSpacing:"0.06em" }}>{article.tag}</span>
          </div>
          <h2 style={{ fontSize:"clamp(1.2rem,2vw,1.55rem)",fontWeight:800,lineHeight:1.3,color:tx,marginBottom:16,letterSpacing:"-0.01em" }}>{article.headline}</h2>
          <p style={{ fontSize:"0.92rem",lineHeight:1.8,color:mt,marginBottom:24 }}>{article.excerpt}</p>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:36,height:36,borderRadius:"50%",background:`${article.categoryColor}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem" }}>{article.emoji}</div>
              <div>
                <div style={{ fontWeight:700,fontSize:"0.82rem",color:tx }}>{article.author}</div>
                <div style={{ fontSize:"0.72rem",color:mt }}>{article.date}</div>
              </div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:6,color:article.categoryColor,fontWeight:700,fontSize:"0.85rem" }}>
              Baca Selengkapnya <IconArrow s={15} c={article.categoryColor} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => onRead(article)}
      style={{ borderRadius:18,overflow:"hidden",border:`1px solid ${border}`,cursor:"pointer",background:cardBg,transition:"transform 0.25s, box-shadow 0.25s" }}
      onMouseOver={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(78,125,34,0.1)"; }}
      onMouseOut={e  => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="none"; }}>
      <div style={{ height:180,background:article.bgGradient,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>
        {article.gambarUrl
          ? <img src={article.gambarUrl} alt={article.headline} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.7 }}/>
          : <span style={{ fontSize:"4rem",filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>{article.emoji}</span>
        }
        <div style={{ position:"absolute",top:14,left:14,display:"flex",gap:6,zIndex:1 }}>
          <span style={{ background:article.categoryColor,color:"white",padding:"3px 12px",borderRadius:50,fontSize:"0.68rem",fontWeight:700 }}>{article.category}</span>
          {article.badge && <span style={{ background:"rgba(255,255,255,0.9)",color:article.categoryColor,padding:"3px 12px",borderRadius:50,fontSize:"0.68rem",fontWeight:800 }}>{article.badge}</span>}
        </div>
      </div>
      <div style={{ padding:"20px 22px 24px" }}>
        <span style={{ fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",color:mt,textTransform:"uppercase" }}>{article.tag}</span>
        <h3 style={{ fontSize:"1rem",fontWeight:700,lineHeight:1.45,color:tx,margin:"8px 0 10px",letterSpacing:"-0.01em" }}>{article.headline}</h3>
        <p style={{ fontSize:"0.83rem",lineHeight:1.7,color:mt,marginBottom:16,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{article.excerpt}</p>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:`1px solid ${border}` }}>
          <div style={{ display:"flex",gap:14,alignItems:"center" }}>
            <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:"0.75rem",color:mt }}><IconClock s={12} c={mt}/>{article.readTime}</span>
            <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:"0.75rem",color:mt }}><IconEye s={12} c={mt}/>{article.views}</span>
          </div>
          <span style={{ fontSize:"0.75rem",fontWeight:600,color:mt }}>{article.date}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function ArticlePage() {
  const navigate = useNavigate(); // 🆕 hook untuk navigasi programatik

  const [darkMode,        setDarkMode]        = useState(false);
  const [scrolled,        setScrolled]        = useState(false);
  const [activeCategory,  setActiveCategory]  = useState("Semua");
  const [search,          setSearch]          = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [articles,  setArticles]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: sbError } = await supabase
          .from("artikel")
          .select("*")
          .order("dibuat_pada", { ascending: false });

        if (sbError) throw sbError;
        setArticles((data ?? []).map(adaptArticle));
      } catch (err) {
        console.error("Gagal mengambil artikel:", err);
        setError("Gagal memuat artikel. Periksa koneksi dan konfigurasi Supabase.");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const filtered = articles.filter(a => {
    const matchCat    = activeCategory === "Semua" || a.category === activeCategory;
    const matchSearch = !search ||
      a.headline.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredArticle = filtered.find(a => a.featured);
  const restArticles    = filtered.filter(a => !a.featured);

  const bg     = darkMode ? "#0d1a07" : "#f7f5f1";
  const tx     = darkMode ? "#e8f5d4" : C.earthBrown;
  const mt     = darkMode ? "#8aad60" : "#7a6a5a";
  const cardBg = darkMode ? "#1a2a0e" : "#fff";
  const border = darkMode ? "#2a3d1a" : "#e8e6e2";
  const navBg  = scrolled ? (darkMode?"rgba(13,26,7,0.96)":"rgba(255,255,255,0.96)") : "transparent";

  // ── Detail view ──
  if (selectedArticle) {
    return (
      <div style={{ background: darkMode?"#0d1a07":"#fff", minHeight:"100vh" }}>
        <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",background:darkMode?"rgba(13,26,7,0.95)":"rgba(255,255,255,0.95)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${border}` }}>
          <Link to="/" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}>
            <div style={{ width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#4E7D22,#6F9D36)",display:"flex",alignItems:"center",justifyContent:"center" }}><IconLeaf s={18} c="white"/></div>
            <div>
              <div style={{ fontSize:"0.95rem",fontWeight:700,color:darkMode?"#c8e6a0":C.forestGreen,lineHeight:1 }}>Kampus Alam</div>
              <div style={{ fontSize:"0.6rem",color:C.leafGreen,letterSpacing:"0.08em" }}>TEGAL SARI INDONESIA</div>
            </div>
          </Link>
          <button onClick={() => setDarkMode(d=>!d)} style={{ background:darkMode?"#1a3008":"#f0eee9",border:"none",borderRadius:8,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:tx }}>
            {darkMode?"☀️":"🌙"}
          </button>
        </nav>
        <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} darkMode={darkMode}/>
      </div>
    );
  }

  // ── List view ──
  return (
    <div style={{ background:bg,color:tx,minHeight:"100vh",fontFamily:"'Plus Jakarta Sans', sans-serif" }}>

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:scrolled?"12px 0":"20px 0",background:navBg,backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${border}`:"none",transition:"all 0.4s" }}>
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <Link to="/" style={{ display:"flex",alignItems:"center",gap:12,textDecoration:"none" }}>
            <div style={{ width:40,height:40,borderRadius:10,background:"linear-gradient(135deg,#4E7D22,#6F9D36)",display:"flex",alignItems:"center",justifyContent:"center" }}><IconLeaf s={20} c="white"/></div>
            <div>
              <div style={{ fontSize:"1rem",fontWeight:700,color:scrolled?(darkMode?"#c8e6a0":C.forestGreen):"white",lineHeight:1.1 }}>Kampus Alam</div>
              <div style={{ fontSize:"0.6rem",color:C.leafGreen,letterSpacing:"0.08em" }}>TEGAL SARI INDONESIA</div>
            </div>
          </Link>
          <div style={{ display:"flex",alignItems:"center",gap:24 }}>
            <Link to="/" style={{ color:scrolled?(darkMode?"#c8e6a0":C.earthBrown):"rgba(255,255,255,0.9)",textDecoration:"none",fontSize:"0.88rem",fontWeight:500 }}>Beranda</Link>
            <span style={{ color:scrolled?(darkMode?C.leafGreen:C.forestGreen):"rgba(255,255,255,0.9)",fontSize:"0.88rem",fontWeight:700 }}>Artikel</span>
            <button onClick={() => setDarkMode(d=>!d)} style={{ background:scrolled?(darkMode?"#1a3008":"#f0eee9"):"rgba(255,255,255,0.15)",border:"none",borderRadius:8,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:scrolled?(darkMode?"#c8e6a0":C.earthBrown):"white" }}>
              {darkMode?"☀️":"🌙"}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background:`linear-gradient(160deg,${C.earthBrown} 0%,#1a0d06 40%,#0d1a07 100%)`,padding:"140px 32px 72px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18rem",opacity:0.04,pointerEvents:"none",userSelect:"none" }}>🌿</div>
        <div style={{ position:"relative",zIndex:1,maxWidth:760,margin:"0 auto" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(111,157,54,0.15)",border:"1px solid rgba(111,157,54,0.3)",borderRadius:50,padding:"7px 18px",marginBottom:24 }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:C.leafGreen,display:"inline-block" }}/>
            <span style={{ color:C.leafGreen,fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.1em" }}>PORTAL BERITA & ARTIKEL</span>
          </div>
          <h1 style={{ fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:900,color:"white",lineHeight:1.1,marginBottom:20,letterSpacing:"-0.02em" }}>
            Kisah Nyata dari{" "}
            <span style={{ fontStyle:"italic",background:"linear-gradient(135deg,#6F9D36,#a8d840)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
              Garis Terdepan
            </span>{" "}
            Konservasi
          </h1>
          <p style={{ fontSize:"1rem",color:"rgba(255,255,255,0.65)",lineHeight:1.8,maxWidth:580,margin:"0 auto 36px" }}>
            Laporan lapangan, analisis ilmiah, dan kisah inspiratif dari komunitas yang memilih untuk berpihak kepada alam.
          </p>

          {/* Search bar */}
          <div style={{ display:"flex",alignItems:"center",gap:12,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:50,padding:"12px 20px",maxWidth:480,margin:"0 auto",backdropFilter:"blur(10px)" }}>
            <IconSearch s={18} c="rgba(255,255,255,0.6)"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari artikel, topik, atau kata kunci..."
              style={{ background:"transparent",border:"none",outline:"none",color:"white",fontSize:"0.9rem",flex:1 }}/>
          </div>

          {/* 🆕 ─── TOMBOL TAMBAH ARTIKEL ─────────────────────────────────── */}
          {/* Ditempatkan di bawah search bar dengan jarak yang nyaman */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => navigate("/admin")}
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            8,
                padding:        "11px 26px",
                borderRadius:   50,
                border:         "none",
                background:     `linear-gradient(135deg, ${C.forestGreen}, ${C.leafGreen})`,
                color:          "white",
                fontSize:       "0.88rem",
                fontWeight:     700,
                cursor:         "pointer",
                fontFamily:     "inherit",
                letterSpacing:  "0.02em",
                boxShadow:      `0 6px 24px ${C.forestGreen}55, 0 0 0 1px rgba(255,255,255,0.1)`,
                transition:     "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform  = "translateY(-3px) scale(1.03)";
                e.currentTarget.style.boxShadow  = `0 12px 32px ${C.forestGreen}70, 0 0 0 1px rgba(255,255,255,0.15)`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform  = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow  = `0 6px 24px ${C.forestGreen}55, 0 0 0 1px rgba(255,255,255,0.1)`;
              }}
            >
              <IconPlus s={15} c="white" />
              Tambah Artikel
            </button>
          </div>
          {/* ─────────────────────────────────────────────────────────────── */}
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div style={{ background:cardBg,borderBottom:`1px solid ${border}`,position:"sticky",top:64,zIndex:100 }}>
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"0 32px",display:"flex",gap:4,overflowX:"auto",alignItems:"stretch" }}>
          {ALL_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding:"14px 20px",border:"none",borderBottom:activeCategory===cat?`3px solid ${C.forestGreen}`:"3px solid transparent",
              background:"transparent",color:activeCategory===cat?C.forestGreen:mt,fontWeight:activeCategory===cat?700:500,
              fontSize:"0.85rem",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s",
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* ARTICLES */}
      <div style={{ maxWidth:1280,margin:"0 auto",padding:"56px 32px 80px" }}>

        {loading && (
          <div>
            <div style={{ height:16,width:140,borderRadius:8,background:darkMode?"#1a2a0e":"#eee",marginBottom:20 }}/>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24 }}>
              {[1,2,3].map(i => <SkeletonCard key={i} darkMode={darkMode}/>)}
            </div>
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign:"center",padding:"64px 0" }}>
            <div style={{ fontSize:"3rem",marginBottom:16 }}>⚠️</div>
            <div style={{ fontSize:"1.1rem",fontWeight:600,color:"#c0392b",marginBottom:8 }}>Terjadi Kesalahan</div>
            <div style={{ fontSize:"0.9rem",color:mt,maxWidth:400,margin:"0 auto" }}>{error}</div>
            <button onClick={() => window.location.reload()} style={{ marginTop:24,padding:"10px 28px",borderRadius:50,background:C.forestGreen,color:"white",border:"none",cursor:"pointer",fontWeight:600 }}>
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign:"center",padding:"64px 0",color:mt }}>
            <div style={{ fontSize:"3rem",marginBottom:16 }}>
              {articles.length === 0 ? "📭" : "🔍"}
            </div>
            <div style={{ fontSize:"1.1rem",fontWeight:600 }}>
              {articles.length === 0
                ? "Belum ada artikel yang dipublikasikan"
                : "Tidak ada artikel ditemukan"}
            </div>
            <div style={{ fontSize:"0.9rem",marginTop:8 }}>
              {articles.length === 0
                ? "Tambahkan artikel pertama melalui halaman Admin."
                : "Coba kata kunci atau kategori lain"}
            </div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            {featuredArticle && (
              <div style={{ marginBottom:48 }}>
                <p style={{ color:C.leafGreen,fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16 }}>Artikel Utama</p>
                <ArticleCard article={featuredArticle} featured onRead={setSelectedArticle} darkMode={darkMode}/>
              </div>
            )}
            {restArticles.length > 0 && (
              <>
                <p style={{ color:C.leafGreen,fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:20 }}>
                  {featuredArticle?"Artikel Lainnya":"Semua Artikel"} · {restArticles.length} artikel
                </p>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24 }}>
                  {restArticles.map(a => (
                    <ArticleCard key={a.id} article={a} featured={false} onRead={setSelectedArticle} darkMode={darkMode}/>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* NEWSLETTER */}
      <div style={{ background:`linear-gradient(135deg,${C.forestGreen} 0%,#3a6010 100%)`,padding:"56px 32px",textAlign:"center" }}>
        <div style={{ maxWidth:560,margin:"0 auto" }}>
          <div style={{ fontSize:"2rem",marginBottom:12 }}>📰</div>
          <h2 style={{ fontSize:"1.6rem",fontWeight:800,color:"white",marginBottom:12 }}>Langganan Newsletter</h2>
          <p style={{ color:"rgba(255,255,255,0.75)",lineHeight:1.7,marginBottom:28,fontSize:"0.95rem" }}>Dapatkan ringkasan artikel terbaru dan update kegiatan Kampus Alam langsung di kotak masuk Anda.</p>
          <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
            <input type="email" placeholder="email@anda.com" style={{ flex:1,minWidth:200,maxWidth:280,padding:"12px 20px",borderRadius:50,border:"none",background:"rgba(255,255,255,0.15)",color:"white",fontSize:"0.9rem",outline:"none" }}/>
            <button style={{ padding:"12px 28px",borderRadius:50,background:"white",color:C.forestGreen,fontWeight:700,border:"none",cursor:"pointer",fontSize:"0.9rem" }}>Berlangganan</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background:C.earthBrown,padding:"24px 32px",textAlign:"center" }}>
        <p style={{ color:"rgba(255,255,255,0.5)",fontSize:"0.8rem" }}>© 2026 Kampus Alam Tegal Sari Volunteers · Semua hak dilindungi</p>
      </div>
    </div>
  );
}