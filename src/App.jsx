import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ArticlePage from "./ArticlePage"; 
import AdminPage from "./AdminPage";
import LoginPage      from "./LoginPage";
import ProgramPage from "./ProgramPage";
import MitraPage from "./Mitrapage";
import AdminDashboard from "./AdminDashboard";
import AdminArtikel from "./AdminArtikel";
import React from 'react';

// Komponen Icon SVG Lokal (Biar gak nyari file keluar)
const MedalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Jalur utama (/) sekarang langsung memanggil KampusAlam */}
        <Route path="/" element={<KampusAlam />} />
        <Route path="/article" element={<ArticlePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/programpage" element={<ProgramPage />} />
        <Route path="/mitrapage" element={<MitraPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-artikel" element={<AdminArtikel />} />
      </Routes>
    </Router>
  );
}

const COLORS = {
  forestGreen: "#4E7D22",
  leafGreen: "#6F9D36",
  earthBrown: "#3D2415",
  natureBlue: "#2F6FC4",
  lightGray: "#D8D6D1",
  white: "#FFFFFF",
};


// --- SVG Icons ---
const IconLeaf = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconTree = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 22V13h3l-8-9-8 9h3v9h10z"/>
  </svg>
);

const IconHeart = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IconUsers = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconMapPin = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconCalendar = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconStar = ({ size = 20, color = "currentColor", filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconArrowRight = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconGlobe = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconMoon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const IconSun = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconMenu = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const IconX = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconMail = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconPhone = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconPlay = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconCheck = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconDroplets = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
  </svg>
);

const IconSeedling = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.74.44 3.37 1.21 4.79L12 22l8.79-5.21A9.96 9.96 0 0 0 22 12c0-5.52-4.48-10-10-10z"/>
    <path d="M12 2v20"/>
  </svg>
);

const IconBookOpen = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const IconAward = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const IconCamera = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const IconRecycle = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1.5 8.5 3.5 6.5 5.5 8.5"/>
    <path d="M3.5 6.5v3a2 2 0 0 0 2 2H10"/>
    <polyline points="22.5 15.5 20.5 17.5 18.5 15.5"/>
    <path d="M20.5 17.5v-3a2 2 0 0 0-2-2H14"/>
    <polyline points="8 1.5 10 3.5 8 5.5"/>
    <path d="M10 3.5H7a2 2 0 0 0-2 2v3.5"/>
    <polyline points="16 22.5 14 20.5 16 18.5"/>
    <path d="M14 20.5h3a2 2 0 0 0 2-2V15"/>
  </svg>
);

// --- Nature Forest SVG Scene ---
const ForestScene = () => (
  <svg viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 1 }} preserveAspectRatio="none">
    {/* Sky gradient handled by parent */}
    {/* Far mountains */}
    <path d="M0,280 L120,180 L240,220 L360,160 L480,200 L600,140 L720,180 L840,150 L960,190 L1080,130 L1200,170 L1320,150 L1440,180 L1440,400 L0,400 Z" fill="#1a3d08" opacity="0.6"/>
    {/* Mid mountains */}
    <path d="M0,320 L80,240 L160,270 L280,210 L400,260 L520,220 L640,270 L760,230 L880,260 L1000,220 L1120,250 L1240,220 L1360,260 L1440,230 L1440,400 L0,400 Z" fill="#245c10" opacity="0.7"/>
    {/* Foreground trees */}
    <path d="M0,400 L0,300 L20,280 L40,300 L40,400 Z" fill="#1a4008"/>
    <path d="M0,320 L20,270 L40,320 Z" fill="#1f5010"/>
    <path d="M20,290 L35,250 L50,290 Z" fill="#1f5010"/>
    
    <path d="M100,400 L100,310 L120,285 L140,310 L140,400 Z" fill="#1a4008"/>
    <path d="M100,330 L120,275 L140,330 Z" fill="#245c12"/>
    <path d="M110,305 L125,265 L140,305 Z" fill="#2d6f18"/>
    
    <path d="M220,400 L220,320 L245,295 L270,320 L270,400 Z" fill="#1a4008"/>
    <path d="M215,340 L245,290 L275,340 Z" fill="#245c12"/>
    <path d="M220,315 L245,270 L270,315 Z" fill="#2d6f18"/>
    
    <path d="M1200,400 L1200,310 L1220,285 L1240,310 L1240,400 Z" fill="#1a4008"/>
    <path d="M1195,330 L1220,275 L1245,330 Z" fill="#245c12"/>
    <path d="M1200,308 L1220,268 L1240,308 Z" fill="#2d6f18"/>
    
    <path d="M1320,400 L1320,320 L1345,295 L1370,320 L1370,400 Z" fill="#1a4008"/>
    <path d="M1315,340 L1345,290 L1375,340 Z" fill="#245c12"/>
    <path d="M1320,318 L1345,274 L1370,318 Z" fill="#2d6f18"/>
    
    <path d="M1400,400 L1400,300 L1420,275 L1440,300 L1440,400 Z" fill="#1a4008"/>
    <path d="M1398,320 L1420,270 L1442,320 Z" fill="#245c12"/>
    
    {/* Foreground grass */}
    <path d="M0,380 Q360,360 720,375 Q1080,390 1440,370 L1440,400 L0,400 Z" fill="#1e4d0a"/>
  </svg>
);

// --- Floating Particles ---
const FloatingLeaves = () => {
  const leaves = ["🍃", "🌿", "🍀", "🌱"];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="leaf-particle"
          style={{
            top: `${Math.random() * 80 + 5}%`,
            fontSize: `${Math.random() * 14 + 10}px`,
            animationDuration: `${Math.random() * 15 + 12}s`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: 0.6,
          }}
        >
          {leaves[i % leaves.length]}
        </div>
      ))}
    </div>
  );
};

// --- Counter Hook ---
function useCounter(target, isVisible, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);
  return count;
}

// --- useInView Hook ---
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// --- Scroll Reveal Hook ---
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// --- STAT COUNTER COMPONENT ---
function StatCounter({ target, suffix = "", prefix = "", label, icon, isVisible }) {
  const count = useCounter(target, isVisible);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
        {icon}
        <span className="font-display" style={{ fontSize: '2.5rem', fontWeight: 700, color: COLORS.leafGreen, lineHeight: 1 }}>
          {prefix}{count.toLocaleString()}{suffix}
        </span>
      </div>
      <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{label}</p>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
 function KampusAlam() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("ID");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("forest");
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [donationAmount, setDonationAmount] = useState(150000);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [statsRef, statsVisible] = useInView(0.3);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', program: 'volunteer', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useScrollReveal();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // [TAMBAH] Fungsi untuk mengambil data galeri dari Supabase
// Dipanggil sekali saat komponen pertama kali dimuat (on mount)
useEffect(() => {
  const fetchGallery = async () => {
    try {
      setIsGalleryLoading(true);

      const { data, error } = await supabase
        .from('galeri')       // nama tabel di Supabase
        .select('*')          // ambil semua kolom: id, cat, label, image_url, span, h
        .order('created_at', { ascending: false }); // urutkan terbaru di atas (opsional)

      if (error) {
        // Jika ada error dari Supabase, tampilkan di console
        console.error('Gagal mengambil data galeri:', error.message);
        return;
      }

      // Set data ke state, komponen otomatis re-render
      setGalleryItems(data || []);
    } catch (err) {
      console.error('Terjadi kesalahan tidak terduga:', err);
    } finally {
      setIsGalleryLoading(false);
    }
  };

  fetchGallery();
}, []); // [] = hanya jalan sekali saat mount, tidak perlu dependency apapun

  const t = (id, en, id_) => lang === "EN" ? en : id_;
  const bg = darkMode ? { background: '#0d1a07' } : { background: '#fff' };
  const textColor = darkMode ? '#e8f5d4' : COLORS.earthBrown;
  const cardBg = darkMode ? '#1a2a0e' : '#fff';
  const mutedText = darkMode ? '#8aad60' : '#7a6a5a';
  const borderColor = darkMode ? '#2a3d1a' : '#e8e6e2';

  // Data
  const [programs, setPrograms] = useState([]);

useEffect(() => {
  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("urutan");
    if (!error) setPrograms(data || []);
  };
  fetchPrograms();
}, []);

  const projects = [];

  const testimonials = [
    { name: 'Siti Rahayu', role: t('', 'Community Leader, Tegal Sari', 'Ketua Komunitas, Tegal Sari'), stars: 5, quote: t('', 'Kampuas Alam has completely transformed our village. We now have clean water, thriving trees, and empowered youth. They are true agents of change.', 'Kampuas Alam telah mengubah desa kami sepenuhnya. Kini kami memiliki air bersih, pohon yang subur, dan pemuda yang berdaya. Mereka adalah agen perubahan sejati.'), avatar: '👩‍🌾' },
    { name: 'Ahmad Fauzi', role: t('', 'Local Farmer & Volunteer', 'Petani Lokal & Relawan'), stars: 5, quote: t('', 'The organic farming training changed my life. My harvest doubled and I earn a premium price for sustainable produce. This organization truly cares.', 'Pelatihan pertanian organik mengubah hidup saya. Hasil panen dua kali lipat dan harga premium untuk produk berkelanjutan. Organisasi ini benar-benar peduli.'), avatar: '👨‍🌾' },
    { name: 'Dr. Rina Kusumawati', role: t('', 'Environmental Scientist, UNDIP', 'Ilmuwan Lingkungan, UNDIP'), stars: 5, quote: t('', 'Their scientific approach to conservation combined with deep community engagement makes them stand out. A model for grassroots environmental action.', 'Pendekatan ilmiah mereka dalam konservasi dikombinasikan dengan keterlibatan komunitas yang mendalam membuat mereka menonjol. Model tindakan lingkungan akar rumput.'), avatar: '👩‍🔬' },
    { name: 'Bambang Sutrisno', role: t('', 'School Principal, SDN Tegal Sari', 'Kepala Sekolah, SDN Tegal Sari'), stars: 5, quote: t('', 'Our students are now proud environmental stewards. The eco-education program created a generation that truly loves and protects their natural heritage.', 'Siswa kami kini menjadi pelindung lingkungan yang bangga. Program ekologi menciptakan generasi yang benar-benar mencintai warisan alam mereka.'), avatar: '👨‍🏫' },
  ];

  const events = [];

  
  const [galleryItems, setGalleryItems] = useState([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);

  const blogs = [];

  const donationTiers = [
    { amount: 50000, label: t('', 'Seedling', 'Bibit'), impact: t('', 'Plants 2 trees', 'Tanam 2 pohon'), icon: '🌱' },
    { amount: 150000, label: t('', 'Sapling', 'Kecambah'), impact: t('', 'Funds 1 day of education', 'Mendanai 1 hari pendidikan'), icon: '🌿' },
    { amount: 500000, label: t('', 'Guardian', 'Penjaga'), impact: t('', 'Supports 5 volunteers', 'Mendukung 5 relawan'), icon: '🌳' },
    { amount: 1500000, label: t('', 'Champion', 'Juara'), impact: t('', 'Funds a full conservation program', 'Mendanai program konservasi penuh'), icon: '🏆' },
  ];

  const filteredGallery = galleryFilter === 'all' ? galleryItems : galleryItems.filter(g => g.cat === galleryFilter);

  return (
    <div style={{ ...bg, color: textColor, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ====== NAVIGATION ====== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '12px 0' : '20px 0',
        transition: 'all 0.4s ease',
        background: scrolled
          ? (darkMode ? 'rgba(13,26,7,0.96)' : 'rgba(255,255,255,0.96)')
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${darkMode ? '#1a3008' : '#e8e6e2'}` : 'none',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.08)' : 'none',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* INI KODE GAMBAR LOGO KAMU */}
            <img 
              src="/Logo KATI.png" 
              alt="Logo Kampus Alam" 
              style={{ width: '44px', height: '44px', objectFit: 'contain' }} 
            />
            <div>
              <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.1, color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.forestGreen) : 'white' }}>Kampus Alam</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.08em', color: scrolled ? (darkMode ? '#8aad60' : COLORS.leafGreen) : 'rgba(255,255,255,0.8)' }}>TEGAL SARI INDONESIA</div>
            </div>
          </div>

          {/* Desktop Nav */}
<div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
  {[
    [t('','Home','Beranda'), '#Home'],
    [t('','Projects','Program'), '/ProgramPage'],
    [t('','News','Berita'), '#News'],
    [t('','Articels','Artikel'), '/article'], // Ubah href-nya menjadi /article
    [t('','Contact','Mitra'), '/mitrapage'],
  ].map(([label, href]) => {

if (href === '/mitrapage') {
  return (
    <Link 
      key={label} 
      to={href} 
      className="nav-link" 
      style={{ color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.earthBrown) : 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.9rem' }}
    >
      {label}
    </Link>
  );
}

    // Jika menu adalah Artikel, gunakan komponen Link dari react-router-dom
    if (href === '/article') {
      return (
        <Link 
          key={label} 
          to={href} 
          className="nav-link" 
          style={{ color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.earthBrown) : 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.9rem' }}
        >
          {label}
        </Link>
      );
    }
    // Menu lainnya tetap menggunakan tag anchor biasa
    return (
      <a 
        key={label} 
        href={href} 
        className="nav-link" 
        style={{ color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.earthBrown) : 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.9rem' }}
      >
        {label}
      </a>
    );
  })}

</div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Language */}
            <button onClick={() => setLang(l => l === 'ID' ? 'EN' : 'ID')} style={{
              background: 'transparent', border: `1px solid ${scrolled ? (darkMode ? '#3a5a1a' : '#d0ccc6') : 'rgba(255,255,255,0.4)'}`,
              borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.earthBrown) : 'white', fontSize: '0.8rem', fontWeight: 600,
            }}>
              <IconGlobe size={14} color="currentColor"/>{lang}
            </button>
            {/* Dark Mode */}
            <button onClick={() => setDarkMode(d => !d)} style={{
              background: scrolled ? (darkMode ? '#1a3008' : '#f0eee9') : 'rgba(255,255,255,0.15)',
              border: 'none', borderRadius: 8, width: 36, height: 36, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.earthBrown) : 'white',
            }}>
              {darkMode ? <IconSun size={16}/> : <IconMoon size={16}/>}
            </button>
            {/* CTA */}
            <a href="#volunteer" className="btn-primary" style={{ fontSize: '0.85rem', padding: '10px 22px', textDecoration: 'none' }}>
              {t('','Join Us','Bergabung')} <IconArrowRight size={14}/>
            </a>
            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(o => !o)} style={{
              display: 'none', background: 'transparent', border: 'none', cursor: 'pointer',
              color: scrolled ? (darkMode ? '#c8e6a0' : COLORS.earthBrown) : 'white',
            }} className="mobile-menu-btn">
              {mobileOpen ? <IconX/> : <IconMenu/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ padding: '16px 32px', borderTop: `1px solid ${darkMode ? '#1a3008' : '#e8e6e2'}`, background: darkMode ? '#0d1a07' : '#fff' }}>
            {[t('Home','Home'), t('','Programs','Program'), t('','News','Berita'), t('','Articles','Artikel'), t('','Partners','Mitra')].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ display: 'block', padding: '12px 0', color: textColor, textDecoration: 'none', fontWeight: 500, borderBottom: `1px solid ${borderColor}` }} onClick={() => setMobileOpen(false)}>
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ====== HERO SECTION ====== */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Hero Background */}
        <div className="hero-gradient" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '60vw', background: 'radial-gradient(ellipse, rgba(111,157,54,0.15) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}/>
          <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(ellipse, rgba(47,111,196,0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}/>
        </div>

        {/* Stars */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          {[...Array(60)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() > 0.8 ? '3px' : '2px',
              height: Math.random() > 0.8 ? '3px' : '2px',
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '50%',
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite`,
            }}/>
          ))}
        </div>

        <FloatingLeaves/>
        <ForestScene/>

        {/* Hero Content - SUDAH RATA TENGAH DAN DIJAMIN TIDAK EROR */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '120px 32px 80px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(111,157,54,0.15)', border: '1px solid rgba(111,157,54,0.3)', borderRadius: 50, padding: '8px 18px', marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.leafGreen, display: 'inline-block', animation: 'pulse-ring 2s infinite', boxShadow: '0 0 0 0 rgba(111,157,54,0.4)' }}/>
              <span style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                {t('','EST. 2026 · MALANG, EAST JAVA','EST. 2026 · MALANG, JAWA TIMUR')}
              </span>
            </div>

            {/* Judul Utama */}
            <h1 className="font-display hero-title" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, color: 'white', marginBottom: 24, letterSpacing: '-0.02em' }}>
              {t('','Listening to the song of','Mendengar Kidung')}{' '}
              <span style={{ fontStyle: 'italic', background: 'linear-gradient(135deg, #6F9D36, #a8d840)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {t('','The Universe','Semesta')}{' '}
              </span>
              <br/>
              {t('','Nurturing The, Labyrinth of Life','Merawat Labirin Kehidupan')}
            </h1>

            {/* Paragraf Deskripsi */}
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: 40, maxWidth: 680 }}>
              {t(
                '',
                'More than just a place of learning, KATI is a place where technology bows to cultural wisdom, and nature becomes a grand laboratory. Join us as we step beyond the confines of the classroom to become eternal guardians of this earth.',
                'Lebih dari sekadar tempat belajar, KATI adalah tempat di mana teknologi tunduk pada kearifan budaya, dan alam menjadi laboratorium agung. Bergabunglah bersama kami melangkah melampaui batas ruang kelas untuk menjadi penjaga abadi bumi ini.'
              )}
            </p>

            {/* Tombol Aksi */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#volunteer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.95rem', padding: '14px 32px', textDecoration: 'none', borderRadius: 50, background: COLORS.leafGreen, color: 'white', fontWeight: 600 }}>
                {t('','Become a Volunteer','Menjadi Relawan')} <IconArrowRight size={16}/>
              </a>
              <a href="/ProgramPage" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.95rem', padding: '14px 32px', textDecoration: 'none', borderRadius: 50, border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: 600 }}>
                <IconPlay size={14} color="white"/> {t('','Our Programs','Program Kami')}
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* ====== ABOUT / MISSION ====== */}
      <section id="about" style={{ padding: '100px 32px', maxWidth: 1280, margin: '0 auto' }}>
        
        {/* Header Rata Tengah */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            color: COLORS.leafGreen, 
            textTransform: 'uppercase', 
            letterSpacing: '0.15em',
            display: 'block',
            marginBottom: '8px'
          }}>
            {t('', 'ABOUT US', 'TENTANG KAMI')}
          </span>
          <h2 className="font-display" style={{ 
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', 
            fontWeight: 800, 
            color: darkMode ? 'white' : COLORS.earthBrown,
            lineHeight: 1.2,
            marginBottom: '16px'
          }}>
            {t('', 'Getting to Know KATI, Closer', 'Mengenal KATI, Lebih Dekat')}
          </h2>
          <div style={{ width: '60px', height: '4px', background: COLORS.leafGreen, margin: '0 auto', borderRadius: '2px' }}></div>
          <div class="flex flex-col items-center justify-center text-center">
          </div>
        </div>

        {/* Grid Wadah 3 Kartu */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '32px',
          alignItems: 'stretch'
        }}>
          
          {/* KARTU 01: Tentang Kami */}
          <div style={{ 
            background: cardBg, 
            border: `1px solid ${borderColor}`, 
            borderRadius: '24px', 
            padding: '40px 32px', 
            position: 'relative',
            boxShadow: '0 12px 40px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            {/* Badge Angka Progresif */}
            <div style={{ 
              position: 'absolute', top: 0, right: 0, 
              background: COLORS.natureBlue, color: 'white', 
              padding: '10px 24px', borderBottomLeftRadius: '24px',
              fontWeight: 700, fontSize: '1.1rem' 
            }}>01</div>

            {/* Bulatan Ikon */}
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', 
              background: 'rgba(47, 111, 196, 0.1)', 
              display: 'flex', alignItems: 'center', justifyCentent: 'center',
              justifyContent: 'center', marginBottom: '28px', color: COLORS.natureBlue
            }}>
              <IconUsers size={26} />
            </div>

            <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: darkMode ? 'white' : COLORS.earthBrown }}>
              {t('', 'About Us', 'Tentang Kami')}
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: mutedText, margin: 0 }}>
              Kampus Alam Tegalsari Indonesia (KATI) adalah lembaga pendidikan nonformal berbasis konservasi alam yang berada di bawah naungan Yayasan Pendidikan Sosial Tegalsari Sejahtera, Desa Sidodadi, Malang. "KATI hadir sebagai “kampus tanpa dinding” yang menjadikan alam sebagai ruang belajar, masyarakat sebagai dosen, dan tantangan lokal sebagai laboratorium. KATI berfokus pada tridarma: pendidikan, penelitian, dan pengabdian, dengan visi menjadi pusat rujukan nasional pendidikan konservasi berbasis alam, budaya, dan teknologi."
            </p>
          </div>

          {/* KARTU 02: Visi */}
          <div style={{ 
            background: cardBg, 
            border: `1px solid ${borderColor}`, 
            borderRadius: '24px', 
            padding: '40px 32px', 
            position: 'relative',
            boxShadow: '0 12px 40px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            {/* Badge Angka Progresif */}
            <div style={{ 
              position: 'absolute', top: 0, right: 0, 
              background: '#9c3dba', color: 'white', 
              padding: '10px 24px', borderBottomLeftRadius: '24px',
              fontWeight: 700, fontSize: '1.1rem' 
            }}>02</div>

            {/* Bulatan Ikon */}
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', 
              background: 'rgba(156, 61, 186, 0.1)', 
              display: 'flex', alignItems: 'center', 
              justifyContent: 'center', marginBottom: '28px', color: '#9c3dba'
            }}>
              <IconSeedling size={26} />
            </div>

            <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: darkMode ? 'white' : COLORS.earthBrown }}>
              {t('', 'Vision', 'Visi')}
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: mutedText, margin: 0 }}>
              "Menjadi pusat pendidikan  konservasiberbasis alam, budaya, dan teknologi, yang melahirkan generasi hijau berdaya saing global"
            </p>
          </div>

          {/* KARTU 03: Misi */}
          <div style={{ 
            background: cardBg, 
            border: `1px solid ${borderColor}`, 
            borderRadius: '24px', 
            padding: '40px 32px', 
            position: 'relative',
            boxShadow: '0 12px 40px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            {/* Badge Angka Progresif */}
            <div style={{ 
              position: 'absolute', top: 0, right: 0, 
              background: COLORS.leafGreen, color: 'white', 
              padding: '10px 24px', borderBottomLeftRadius: '24px',
              fontWeight: 700, fontSize: '1.1rem' 
            }}>03</div>

            {/* Bulatan Ikon */}
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', 
              background: 'rgba(111, 157, 54, 0.1)', 
              display: 'flex', alignItems: 'center', 
              justifyContent: 'center', marginBottom: '28px', color: COLORS.leafGreen
            }}>
              <IconCheck size={22} />
            </div>

            <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px', color: darkMode ? 'white' : COLORS.earthBrown }}>
              {t('', 'Mission', 'Misi')}
            </h3>
            
            {/* Daftar List Misi dengan Nomor Hijau Bulat */}
            <ul style={{ 
              padding: 0, margin: 0, listStyle: 'none', 
              display: 'flex', flexDirection: 'column', gap: '14px' 
            }}>
              {[
                'Menyelenggarakan pendidikan konservasi alam berbasis pengalaman langsung (experiential learning).',
                'Mengembangkan riset lapangan yang aplikatif dan berkontribusi pada pembangunan berkelanjutan.',
                'Menggerakkan pengabdian masyarakat melalui aksi konservasi yang terukur dan regeneratif.',
                'Mencetak kader pemimpin muda desa yang berkarakter, peduli lingkungan, dan berdaya saing global.',
                'Membangun jejaring kemitraan dengan kampus, pemerintah, komunitas, dan dunia usaha untuk mendukung konservasi'
                
              ].map((misi, index) => (
                <li key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ 
                    background: COLORS.leafGreen, color: 'white', 
                    borderRadius: '50%', width: '22px', height: '22px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, marginTop: '2px'
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ fontSize: '0.92rem', lineHeight: 1.5, color: mutedText }}>
                    {misi}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Tombol Aksi di Bawah Kartu (Opsional) */}
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <a href="#volunteer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', padding: '12px 28px', textDecoration: 'none' }}>
            {t('', 'Learn Our Story', 'Pelajari Kisah Kami')} <IconArrowRight size={14}/>
          </a>
        </div>
      </section>

      {/* ====== PROGRAMS ====== */}
      <section id="programs" style={{ background: darkMode ? '#141f0a' : '#f7f5f1', padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-divider"/>
            <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              {t('','What We Do','Visi ')}
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('','Our Core Programs','Program Utama Kami')}
            </h2>
            <p style={{ color: mutedText, maxWidth: 560, margin: '16px auto 0', lineHeight: 1.8 }}>
              {t('','Five interconnected pillars driving measurable environmental and social transformation across Central Java.','Lima pilar yang saling terhubung mendorong transformasi lingkungan dan sosial yang terukur di seluruh Jawa Tengah.')}
            </p>
          </div>

          {/* Container Flexbox untuk Layout 3 di atas, 2 di tengah bawah */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
            {programs.slice(0, 5).map((p, i) => (
              <div key={i} className="card-hover program-card reveal" style={{
  flex: "1 1 calc(33.333% - 24px)",
  minWidth: "300px", maxWidth: "380px",
  animationDelay: `${i * 0.1}s`,
  background: cardBg, borderRadius: 20, padding: 32,
  border: `1px solid ${borderColor}`,
  cursor: "pointer", position: "relative", overflow: "hidden"
}}>
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
    background: `linear-gradient(90deg, ${p.color}, ${p.color}aa)` }}/>
  <div className="program-icon" style={{ width: 64, height: 64, borderRadius: 16,
    background: `${p.color}18`, display: "flex", alignItems: "center",
    justifyContent: "center", marginBottom: 20, fontSize: "2rem" }}>
    {p.icon_emoji}
  </div>
  <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12 }}>
    {p.title}
  </h3>
  <p style={{ color: mutedText, lineHeight: 1.7, fontSize: "0.9rem", marginBottom: 20 }}>
    {p.desc_id}
  </p>
  <a href="/Programpage" style={{ color: p.color, fontWeight: 600, fontSize: "0.85rem",
    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
    {t("", "Learn More", "Pelajari Lebih")} <IconArrowRight size={14} color={p.color}/>
    {programs.length === 0 && (
  <div style={{ textAlign: "center", padding: 48, color: mutedText, width: "100%" }}>
    Belum ada program aktif. Tambahkan melalui Admin.
  </div>
)}
  </a>
</div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PROJECTS ====== */}
      <section id="projects" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-divider"/>
            <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              {t('','Our Impact','Dampak Kami')}
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('','Featured Projects','Proyek Unggulan')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {projects.map((proj, i) => (
              <div key={i} className="card-hover reveal reveal-scale" style={{ borderRadius: 24, overflow: 'hidden', border: `1px solid ${borderColor}` }}>
                {/* Visual */}
                <div style={{ height: 200, background: proj.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '4rem' }}>{['🌳','💧','🏫','🌾'][i]}</span>
                  <div style={{ position: 'absolute', top: 16, left: 16 }}>
                    <span style={{ background: proj.tagColor, color: 'white', padding: '4px 14px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>{proj.tag}</span>
                  </div>
                  <div style={{ position: 'absolute', top: 16, right: 16 }}>
                    <span style={{ background: 'rgba(0,0,0,0.3)', color: 'white', padding: '4px 12px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 600 }}>{proj.year}</span>
                  </div>
                </div>
                {/* Content */}
                <div style={{ padding: '24px', background: cardBg }}>
                  <h3 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8 }}>{proj.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: mutedText, fontSize: '0.82rem', marginBottom: 16 }}>
                    <IconMapPin size={14} color={COLORS.leafGreen}/> {proj.location}
                  </div>
                  <div style={{ background: darkMode ? '#243a14' : '#f0f7e8', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <IconCheck size={16} color={COLORS.forestGreen}/>
                    <span style={{ color: COLORS.forestGreen, fontWeight: 600, fontSize: '0.85rem' }}>{proj.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="#contact" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              {t('','View All Projects','Lihat Semua Proyek')} <IconArrowRight size={18}/>
            </a>
          </div>
        </div>
      </section>

      {/* ====== IMPACT VISUAL ====== */}
      <section style={{ background: `linear-gradient(160deg, ${COLORS.earthBrown} 0%, #1a0d06 50%, #0d1a07 100%)`, padding: '80px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(78,125,34,0.1) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 64, alignItems: 'center' }}>
            <div className="reveal-left">
              <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>{t('','Progress Report','Laporan Kemajuan')}</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 20 }}>
                {t('','Measurable Change,','Perubahan Terukur,')} <span style={{ color: COLORS.leafGreen }}>{t('','Real Results','Hasil Nyata')}</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {t('','Our evidence-based approach ensures every action creates documented, lasting change for people and planet.','Pendekatan berbasis bukti kami memastikan setiap aksi menciptakan perubahan yang terdokumentasi dan berkelanjutan.')}
              </p>
            </div>
            <div className="reveal-right" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { label: t('','Forest Coverage Restored','Tutupan Hutan Dipulihkan'), pct: 78, color: COLORS.leafGreen },
                { label: t('','Water Quality Improved','Kualitas Air Meningkat'), pct: 91, color: COLORS.natureBlue },
                { label: t('','Youth Engaged','Pemuda Terlibat'), pct: 85, color: '#d4820e' },
                { label: t('','SDG Goals Aligned','Target SDG Tercapai'), pct: 94, color: '#9c3dba' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700, fontSize: '0.9rem' }}>{item.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.pct}%`, background: `linear-gradient(90deg, ${item.color}88, ${item.color})` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section style={{ padding: '100px 32px', background: darkMode ? '#141f0a' : '#f7f5f1' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-divider"/>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('','Community Voices','Suara Komunitas')}
            </h2>
          </div>

          <div style={{ position: 'relative' }}>
            <div key={testimonialIdx} className="testimonial-active" style={{ background: cardBg, borderRadius: 28, padding: '48px', border: `1px solid ${borderColor}`, textAlign: 'center', position: 'relative' }}>
              {/* Quote mark */}
              <div className="font-display" style={{ fontSize: '6rem', lineHeight: 0.5, color: `${COLORS.leafGreen}30`, position: 'absolute', top: 32, left: 40, fontWeight: 900 }}>"</div>
              
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{testimonials[testimonialIdx].avatar}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 20 }}>
                {[...Array(testimonials[testimonialIdx].stars)].map((_, i) => <IconStar key={i} size={18} color="#f59e0b"/>)}
              </div>
              <p className="font-display" style={{ fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.8, color: textColor, marginBottom: 24, maxWidth: 680, margin: '0 auto 24px', position: 'relative', zIndex: 1 }}>
                "{testimonials[testimonialIdx].quote}"
              </p>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{testimonials[testimonialIdx].name}</div>
              <div style={{ color: mutedText, fontSize: '0.85rem' }}>{testimonials[testimonialIdx].role}</div>
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 28 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} style={{
                  width: i === testimonialIdx ? 28 : 10, height: 10, borderRadius: 5,
                  background: i === testimonialIdx ? COLORS.forestGreen : (darkMode ? '#2a3d1a' : '#d0ccc6'),
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                }}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== EVENTS ====== */}
      <section id="events" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div className="reveal-left">
              <div className="section-divider-left"/>
              <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                {t('','Upcoming','Mendatang')}
              </p>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
                {t('','Events & Activities','Acara & Kegiatan')}
              </h2>
              <p style={{ color: mutedText, lineHeight: 1.8, marginBottom: 32 }}>
                {t('','Join us in the field, classroom, and community. Every action counts towards a greener future.','Bergabunglah di lapangan, kelas, dan komunitas. Setiap tindakan berarti menuju masa depan yang lebih hijau.')}
              </p>
              <a href="#volunteer" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                {t('','Register for an Event','Daftar Acara')} <IconArrowRight size={18}/>
              </a>
            </div>

            <div className="reveal-right" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {events.map((ev, i) => (
                <div key={i} className="card-hover" style={{ background: cardBg, borderRadius: 18, padding: '20px 24px', border: `1px solid ${borderColor}`, display: 'flex', gap: 20, alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ minWidth: 56, height: 56, borderRadius: 14, background: `${ev.color}18`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <IconCalendar size={22} color={ev.color}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ background: ev.color, color: 'white', padding: '2px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 700 }}>{ev.type}</span>
                      <span style={{ color: mutedText, fontSize: '0.78rem' }}>{ev.date}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{ev.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: mutedText, fontSize: '0.8rem' }}>
                      <IconMapPin size={12} color={mutedText}/> {ev.loc}
                    </div>
                  </div>
                  <IconArrowRight size={18} color={ev.color}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== GALLERY ====== */}
      <section id="gallery" style={{ padding: '100px 32px', background: darkMode ? '#141f0a' : '#f7f5f1' }}>
  <div style={{ maxWidth: 1280, margin: '0 auto' }}>
    <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
      <div className="section-divider"/>
      <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 24 }}>
        {t('','Photo Gallery','Galeri Foto')}
      </h2>
      {/* Filter Tabs — TIDAK DIUBAH, tetap berfungsi */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        {[
          ['all',       t('','All','Semua')],
          ['forest',    t('','Forest','Hutan')],
          ['water',     t('','Water','Air')],
          ['community', t('','Community','Komunitas')],
          ['education', t('','Education','Edukasi')],
        ].map(([val, lbl]) => (
          <button key={val} onClick={() => setGalleryFilter(val)} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            background: galleryFilter === val ? COLORS.forestGreen : (darkMode ? '#1a2a0e' : '#e8e6e2'),
            color: galleryFilter === val ? 'white' : textColor,
            transition: 'all 0.25s',
          }}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
 
    {/* ── KONDISI LOADING ── */}
    {isGalleryLoading ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            height: 240, borderRadius: 16,
            background: darkMode
              ? 'linear-gradient(90deg, #1a2a0e 25%, #243a14 50%, #1a2a0e 75%)'
              : 'linear-gradient(90deg, #e8e6e2 25%, #d8d6d1 50%, #e8e6e2 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}/>
        ))}
      </div>
 
    /* ── KONDISI KOSONG ── */
    ) : filteredGallery.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '64px 32px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🖼️</div>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: textColor }}>
          {galleryFilter === 'all' ? 'Galeri masih kosong' : 'Tidak ada foto untuk kategori ini'}
        </h3>
        <p style={{ color: mutedText, fontSize: '0.9rem' }}>
          Tambahkan foto melalui halaman Admin untuk menampilkannya di sini.
        </p>
      </div>
 
    /* ── KONDISI ADA DATA ── */
    ) : (
      <div className="hp-icon-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filteredGallery.slice(0, 6).map((item, i) => (
          <div
            key={item.id /* gunakan id dari Supabase, bukan index */}
            className="gallery-item hp-icon-item"
            style={{
              gridColumn: item.span === '2' ? 'span 2' : 'span 1', // kolom dari field `span`
              height: item.h || 240,                                 // tinggi dari field `h`
            }}
          >
            <div style={{
              width: '100%', height: '100%',
              position: 'relative', borderRadius: 16, overflow: 'hidden',
              background: '#1a3d08', // fallback jika gambar gagal load
            }}>
              {/* Gambar dari Supabase Storage (field image_url) */}
              <img
                src={item.image_url}
                alt={item.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  // Fallback jika URL gambar rusak
                  e.target.style.display = 'none';
                }}
              />
              {/* Overlay gradien + label (field `label`) */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                padding: '24px 20px 16px', borderRadius: '0 0 16px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{item.label}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

      {/* ====== VOLUNTEER REGISTRATION ====== */}
      <section id="volunteer" style={{ padding: '100px 32px', background: `linear-gradient(160deg, #f0f7e8 0%, #e8f5d4 100%)`, ...(darkMode && { background: 'linear-gradient(160deg, #1a2a0e 0%, #0d1a07 100%)' }) }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'start' }}>
            <div className="reveal-left">
              <div className="section-divider-left"/>
              <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                {t('','Join the Movement','Bergabung dengan Gerakan')}
              </p>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.02em' }}>
                {t('','Become a Volunteer','Jadilah Relawan')}
              </h2>
              <p style={{ color: mutedText, lineHeight: 1.8, marginBottom: 32 }}>
                {t('','Your skills, passion, and time can make a real difference. Join thousands of volunteers creating meaningful environmental and social change.','Keterampilan, semangat, dan waktu Anda dapat membuat perbedaan nyata. Bergabunglah dengan ribuan relawan yang menciptakan perubahan lingkungan dan sosial yang berarti.')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '🌿', t: t('','Field Conservation','Konservasi Lapangan'), d: t('','Planting, river cleanups, wildlife monitoring','Penanaman, bersih sungai, pemantauan satwa') },
                  { icon: '📚', t: t('','Education & Training','Pendidikan & Pelatihan'), d: t('','Teaching, workshops, curriculum development','Mengajar, workshop, pengembangan kurikulum') },
                  { icon: '💻', t: t('','Digital Advocacy','Advokasi Digital'), d: t('','Content creation, research, communications','Pembuatan konten, penelitian, komunikasi') },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.6rem', minWidth: 40 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.t}</div>
                      <div style={{ color: mutedText, fontSize: '0.85rem' }}>{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Form */}
            <div className="reveal-right">
              {submitted ? (
                <div style={{ background: cardBg, borderRadius: 28, padding: 48, border: `1px solid ${borderColor}`, textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
                  <h3 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: COLORS.forestGreen, marginBottom: 12 }}>
                    {t('','Welcome to the Team!','Selamat Bergabung!')}
                  </h3>
                  <p style={{ color: mutedText, lineHeight: 1.7 }}>
                    {t('','We\'ll contact you within 2 business days with next steps. Thank you for caring about our planet!','Kami akan menghubungi Anda dalam 2 hari kerja dengan langkah selanjutnya. Terima kasih telah peduli pada bumi kita!')}
                  </p>
                </div>
              ) : (
                <div style={{ background: cardBg, borderRadius: 28, padding: 40, border: `1px solid ${borderColor}`, boxShadow: '0 24px 64px rgba(78,125,34,0.08)' }}>
                  <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 28, color: COLORS.forestGreen }}>
                    {t('','Register Now','Daftar Sekarang')}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    {[
                      { key: 'name', label: t('','Full Name','Nama Lengkap'), type: 'text', placeholder: t('','Your name','Nama Anda') },
                      { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder} value={formData[f.key]} onChange={e => setFormData(d => ({...d, [f.key]: e.target.value}))}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }}
                          onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                          onBlur={e => e.target.style.borderColor = borderColor}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{t('','Phone Number','Nomor Telepon')}</label>
                    <input type="tel" placeholder="+62 xxx-xxxx-xxxx" value={formData.phone} onChange={e => setFormData(d => ({...d, phone: e.target.value}))}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                      onBlur={e => e.target.style.borderColor = borderColor}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{t('','Area of Interest','Bidang Minat')}</label>
                    <select value={formData.program} onChange={e => setFormData(d => ({...d, program: e.target.value}))}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none' }}>
                      <option value="volunteer">{t('','Field Volunteer','Relawan Lapangan')}</option>
                      <option value="education">{t('','Education Program','Program Pendidikan')}</option>
                      <option value="digital">{t('','Digital Advocacy','Advokasi Digital')}</option>
                      <option value="research">{t('','Research','Penelitian')}</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{t('','Message (Optional)','Pesan (Opsional)')}</label>
                    <textarea rows={3} placeholder={t('','Tell us about yourself...','Ceritakan tentang diri Anda...')} value={formData.message} onChange={e => setFormData(d => ({...d, message: e.target.value}))}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                      onBlur={e => e.target.style.borderColor = borderColor}
                    />
                  </div>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px' }} onClick={() => setSubmitted(true)}>
                    {t('','Submit Application','Kirim Pendaftaran')} <IconArrowRight size={18}/>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====== DONATION ====== */}
      <section id="donate" style={{ padding: '100px 32px', background: darkMode ? '#141f0a' : '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-divider"/>
            <p style={{ color: COLORS.leafGreen, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              {t('','Support Our Work','Dukung Kami')}
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('','Fund the Future of Nature','Danai Masa Depan Alam')}
            </h2>
            <p style={{ color: mutedText, maxWidth: 520, margin: '16px auto 0', lineHeight: 1.8 }}>
              {t('','Every donation directly funds conservation, education, and community programs on the ground.','Setiap donasi langsung mendanai program konservasi, pendidikan, dan komunitas di lapangan.')}
            </p>
          </div>

          {/* Donation Tiers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
            {donationTiers.map((tier, i) => (
              <div key={i} className="donation-card card-hover" onClick={() => setDonationAmount(tier.amount)}
                style={{ borderRadius: 20, padding: '28px 24px', border: `2px solid ${donationAmount === tier.amount ? COLORS.forestGreen : borderColor}`, background: donationAmount === tier.amount ? (darkMode ? '#1a3008' : '#f0f7e8') : cardBg, cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s', position: 'relative' }}>
                {i === 2 && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: COLORS.forestGreen, color: 'white', padding: '4px 16px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{t('','Most Popular','Terpopuler')}</div>}
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{tier.icon}</div>
                <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: COLORS.forestGreen, marginBottom: 4 }}>
                  Rp {tier.amount.toLocaleString('id-ID')}
                </div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{tier.label}</div>
                <div style={{ color: mutedText, fontSize: '0.82rem' }}>{tier.impact}</div>
              </div>
            ))}
          </div>

          {/* Custom Amount + CTA */}
          <div className="reveal" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: mutedText, fontWeight: 600, fontSize: '0.9rem' }}>Rp</span>
                <input type="number" value={donationAmount} onChange={e => setDonationAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: 12, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#f8f6f2', color: textColor, fontSize: '1rem', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                  onBlur={e => e.target.style.borderColor = borderColor}
                />
              </div>
              <button className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '14px 28px' }}>
                <IconHeart size={16}/> {t('','Donate','Donasi')}
              </button>
            </div>
            <p style={{ color: mutedText, fontSize: '0.8rem' }}>
              🔒 {t('','Secured by','Diamankan oleh')} SSL · {t('','Tax deductible','Dapat dikurangkan pajak')} · 100% {t('','transparent','transparan')}
            </p>
          </div>
        </div>
      </section>

      {/* ====== BLOG ====== */}
      <section id="blog" style={{ padding: '100px 32px', background: darkMode ? '#0d1a07' : '#f7f5f1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="section-divider-left"/>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                {t('','Stories & Insights','Kisah & Wawasan')}
              </h2>
            </div>
            <a href="#" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              {t('','All Articles','Semua Artikel')} <IconArrowRight size={18}/>
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {blogs.map((b, i) => (
              <div key={i} className="card-hover reveal" style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${borderColor}`, background: cardBg }}>
                {/* Image Placeholder */}
                <div style={{ height: 180, background: `linear-gradient(135deg, ${b.color}22, ${b.color}55)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', position: 'relative' }}>
                  {['🌿','👥','📊'][i]}
                  <div style={{ position: 'absolute', top: 16, left: 16 }}>
                    <span style={{ background: b.color, color: 'white', padding: '4px 14px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>{b.tag}</span>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4, marginBottom: 16 }}>{b.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: mutedText, fontSize: '0.8rem' }}>{b.date}</span>
                    <span style={{ color: b.color, fontSize: '0.8rem', fontWeight: 600 }}>{b.read} read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CONTACT ====== */}
      <section id="contact" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-divider"/>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {t('','Get in Touch','Hubungi Kami')}
            </h2>
            <p style={{ color: mutedText, maxWidth: 480, margin: '16px auto 0', lineHeight: 1.8 }}>
              {t('','Questions, partnerships, or media inquiries? We\'d love to hear from you.','Pertanyaan, kemitraan, atau media? Kami ingin mendengar dari Anda.')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'start' }}>
            {/* Contact Info */}
            <div className="reveal-left">
              {[
                { icon: <IconMapPin size={20} color={COLORS.forestGreen}/>, label: t('','Address','Alamat'), value: 'Jl. Tegal Sari No. 88, Tegal\nJawa Tengah, Indonesia 52100' },
                { icon: <IconPhone size={20} color={COLORS.forestGreen}/>, label: t('','Phone','Telepon'), value: '+62 283-xxx-xxxx' },
                { icon: <IconMail size={20} color={COLORS.forestGreen}/>, label: 'Email', value: 'info@kampuasalam.org' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 32, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${COLORS.forestGreen}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: mutedText, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{item.value}</div>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['Instagram', 'YouTube', 'Facebook', 'LinkedIn'].map(soc => (
                  <a key={soc} href="#" style={{ padding: '8px 18px', borderRadius: 8, background: darkMode ? '#1a2a0e' : '#f0eee9', color: textColor, textDecoration: 'none', fontWeight: 600, fontSize: '0.82rem', border: `1px solid ${borderColor}`, transition: 'all 0.2s' }}
                    onMouseOver={e => { e.target.style.background = COLORS.forestGreen; e.target.style.color = 'white'; e.target.style.borderColor = COLORS.forestGreen; }}
                    onMouseOut={e => { e.target.style.background = darkMode ? '#1a2a0e' : '#f0eee9'; e.target.style.color = textColor; e.target.style.borderColor = borderColor; }}>
                    {soc}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="reveal-right" style={{ background: cardBg, borderRadius: 24, padding: 36, border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[t('','Name','Nama'), 'Email'].map(lbl => (
                  <div key={lbl}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{lbl}</label>
                    <input type="text" placeholder={lbl} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                      onBlur={e => e.target.style.borderColor = borderColor}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>{t('','Subject','Subjek')}</label>
                <input type="text" placeholder={t('','How can we help?','Bagaimana kami bisa membantu?')} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                  onBlur={e => e.target.style.borderColor = borderColor}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, color: mutedText }}>Message</label>
                <textarea rows={5} placeholder={t('','Your message...','Pesan Anda...')} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: darkMode ? '#0d1a07' : '#fafaf8', color: textColor, fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = COLORS.forestGreen}
                  onBlur={e => e.target.style.borderColor = borderColor}
                />
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1rem' }}>
                {t('','Send Message','Kirim Pesan')} <IconArrowRight size={18}/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====== NEWSLETTER CTA ====== */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.forestGreen} 0%, #3a6010 50%, #1a3d08 100%)`, padding: '72px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}/>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🌱</div>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
            {t('','Stay Connected with Nature','Tetap Terhubung dengan Alam')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 36, fontSize: '1rem' }}>
            {t('','Get monthly updates on our conservation impact, volunteer opportunities, and environmental education resources.','Dapatkan pembaruan bulanan tentang dampak konservasi kami, peluang relawan, dan sumber daya pendidikan lingkungan.')}
          </p>
          <div style={{ display: 'flex', gap: 12, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input type="email" placeholder={t('','Your email address','Alamat email Anda')} style={{ flex: 1, minWidth: 220, padding: '14px 20px', borderRadius: 50, border: 'none', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.95rem', outline: 'none', backdropFilter: 'blur(10px)' }}/>
            <button style={{ background: 'white', color: COLORS.forestGreen, padding: '14px 28px', borderRadius: 50, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', whiteSpace: 'nowrap', transition: 'all 0.3s' }}
              onMouseOver={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
              onMouseOut={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}>
              {t('','Subscribe','Berlangganan')} →
            </button>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer style={{ background: darkMode ? '#060f03' : COLORS.earthBrown, color: 'rgba(255,255,255,0.75)', padding: '64px 32px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #4E7D22, #6F9D36)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconLeaf size={24} color="white"/>
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', lineHeight: 1.1 }}>Kampuas Alam</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.08em', color: COLORS.leafGreen }}>TEGAL SARI VOLUNTEERS</div>
                </div>
              </div>
              <p style={{ lineHeight: 1.8, fontSize: '0.88rem', maxWidth: 300, marginBottom: 24 }}>
                {t('','Uniting communities through environmental education, conservation action, and sustainable development since 2018.','Menyatukan komunitas melalui pendidikan lingkungan, aksi konservasi, dan pembangunan berkelanjutan sejak 2018.')}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['🌿', '💧', '🌍', '🤝'].map((e, i) => (
                  <span key={i} style={{ fontSize: '1.2rem' }}>{e}</span>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: t('','Programs','Program'),
                links: [t('','Forest Conservation','Konservasi Hutan'), t('','Water Stewardship','Pengelolaan Air'), t('','Eco-Education','Ekologi-Edukasi'), t('','Organic Farming','Pertanian Organik'), t('','Zero Waste','Zero Sampah')]
              },
              {
                title: t('','Get Involved','Terlibat'),
                links: [t('','Volunteer','Relawan'), t('','Donate','Donasi'), t('','Events','Acara'), t('','Partner','Mitra'), t('','Internship','Magang')]
              },
              {
                title: t('','Organization','Organisasi'),
                links: [t('','About Us','Tentang Kami'), t('','Our Team','Tim Kami'), t('','Annual Report','Laporan Tahunan'), t('','Media Kit','Kit Media'), t('','Contact','Kontak')]
              },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: 20, letterSpacing: '0.02em' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                      onMouseOver={e => e.target.style.color = COLORS.leafGreen}
                      onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
              © 2026 Kampuas Alam Tegal Sari Volunteers · {t('','All rights reserved','Semua hak dilindungi')}
            </p>
            <div style={{ display: 'flex', gap: 24 }}>
              {[t('','Privacy Policy','Kebijakan Privasi'), t('','Terms of Use','Ketentuan Penggunaan'), 'Sitemap'].map(item => (
                <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
                  onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 768px) {
          section > div, section { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </div>
  );
}
