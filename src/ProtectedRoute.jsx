import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./supabase"; // 🔌 sesuaikan path import-mu

// ─── DESIGN TOKENS (konsisten dengan seluruh project) ────────────────────────
const C = {
  forestGreen: "#4E7D22",
  leafGreen:   "#6F9D36",
  earthBrown:  "#3D2415",
};

// ─── LOADING SCREEN ──────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${C.earthBrown} 0%, #1a0d06 40%, #0d1a07 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      gap: 24,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${C.forestGreen}18 0%, transparent 70%)`,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: "breathe 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Leaf logo mark */}
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 18,
        background: `linear-gradient(135deg, ${C.forestGreen}, ${C.leafGreen})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
        boxShadow: `0 12px 40px ${C.forestGreen}50`,
        animation: "floatIcon 2.5s ease-in-out infinite",
      }}>
        🌿
      </div>

      {/* Spinner ring */}
      <div style={{ position: "relative", width: 44, height: 44 }}>
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `3px solid ${C.forestGreen}22`,
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `3px solid transparent`,
          borderTopColor: C.leafGreen,
          animation: "spin 0.9s linear infinite",
        }} />
      </div>

      {/* Text */}
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <p style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: "0.95rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          margin: 0,
        }}>
          Memeriksa keamanan portal...
        </p>
        <p style={{
          color: C.leafGreen,
          fontSize: "0.72rem",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 8,
          opacity: 0.8,
        }}>
          Kampus Alam · Admin Portal
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin       { to { transform: rotate(360deg); } }
        @keyframes breathe    { 0%,100%{opacity:0.4;transform:translate(-50%,-50%) scale(1)} 50%{opacity:0.7;transform:translate(-50%,-50%) scale(1.15)} }
        @keyframes floatIcon  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}

// ─── PROTECTED ROUTE GUARD ────────────────────────────────────────────────────
// Analogi: ini seperti satpam di pintu masuk — ia cek kartu akses dulu
// sebelum memperbolehkan seseorang masuk ke area admin.
export default function ProtectedRoute({ children }) {
  // null  = belum selesai cek (loading)
  // false = tidak terautentikasi
  // true  = terautentikasi
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    // Langkah 1: Cek sesi yang sudah ada (dari localStorage/cookie Supabase)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthStatus(!!session);
    });

    // Langkah 2: Dengarkan perubahan auth secara real-time
    // (misalnya: user logout di tab lain, token expired, dsb.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthStatus(!!session);
      }
    );

    // Cleanup: hentikan listener saat komponen di-unmount
    return () => subscription.unsubscribe();
  }, []);

  // ── Masih mengecek sesi ──
  if (authStatus === null) {
    return <LoadingScreen />;
  }

  // ── Tidak terautentikasi → redirect ke halaman login ──
  if (authStatus === false) {
    return <Navigate to="/login" replace />;
  }

  // ── Terautentikasi → tampilkan konten yang dilindungi ──
  return children;
}