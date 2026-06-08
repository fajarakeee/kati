import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabase"; // 🔌 sesuaikan path import-mu

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  forestGreen: "#4E7D22",
  leafGreen:   "#6F9D36",
  earthBrown:  "#3D2415",
  natureBlue:  "#2F6FC4",
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconLeaf  = ({ s = 20, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);
const IconMail  = ({ s = 18, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock  = ({ s = 18, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye   = ({ s = 18, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = ({ s = 18, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconArrowLeft = ({ s = 16, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconCheck = ({ s = 18, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ─── DECORATIVE LEAF SHAPES ───────────────────────────────────────────────────
function FloatingLeaf({ style }) {
  return (
    <div style={{
      position: "absolute",
      opacity: 0.12,
      fontSize: "4rem",
      userSelect: "none",
      pointerEvents: "none",
      animation: "floatLeaf 8s ease-in-out infinite",
      ...style,
    }}>🌿</div>
  );
}

// ─── MAIN LOGIN PAGE ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [success,     setSuccess]     = useState(false);

  // Fokus state untuk styling input aktif
  const [focusField,  setFocusField]  = useState(null);

  // ── Submit handler ──
  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email:    email.trim(),
        password: password,
      });

      if (authError) throw authError;

      // Login berhasil
      setSuccess(true);

      // Tunda 1 detik agar user membaca feedback sukses, lalu redirect
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err) {
      // Terjemahkan pesan error Supabase ke Bahasa Indonesia
      const msg = err.message?.toLowerCase() ?? "";
      if (msg.includes("invalid login credentials")) {
        setError("Email atau password salah. Silakan coba lagi.");
      } else if (msg.includes("email not confirmed")) {
        setError("Email belum dikonfirmasi. Periksa kotak masuk Anda.");
      } else if (msg.includes("too many requests")) {
        setError("Terlalu banyak percobaan. Tunggu beberapa menit.");
      } else {
        setError(err.message ?? "Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Input style helper ──
  function inputWrapStyle(field) {
    const focused = focusField === field;
    return {
      display: "flex",
      alignItems: "center",
      gap: 10,
      border: `1.5px solid ${focused ? C.forestGreen : "#e0ddd8"}`,
      borderRadius: 12,
      padding: "12px 16px",
      background: focused ? `${C.forestGreen}06` : "#fafaf9",
      transition: "all 0.2s ease",
      boxShadow: focused ? `0 0 0 4px ${C.forestGreen}14` : "none",
    };
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${C.earthBrown} 0%, #1e0e08 35%, #0a160520 60%, #0d1a07 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Ambient decorative elements ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${C.forestGreen}0d 0%, transparent 70%)`,
      }} />
      <FloatingLeaf style={{ top: "8%",  left: "6%",  animationDelay: "0s",   animationDuration: "9s"  }} />
      <FloatingLeaf style={{ top: "15%", right: "8%", animationDelay: "2s",   animationDuration: "11s", transform: "rotate(45deg)" }} />
      <FloatingLeaf style={{ bottom: "20%", left: "4%", animationDelay: "1.5s", animationDuration: "10s", fontSize: "2.5rem" }} />
      <FloatingLeaf style={{ bottom: "10%", right: "5%", animationDelay: "3s", animationDuration: "8s", fontSize: "5rem", transform: "rotate(-30deg)" }} />

      {/* ── Back to article link ── */}
      <Link to="/article" style={{
        position: "absolute",
        top: 28, left: 28,
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "rgba(255,255,255,0.7)",
        textDecoration: "none",
        fontSize: "0.83rem",
        fontWeight: 500,
        padding: "8px 16px",
        borderRadius: 50,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(8px)",
        transition: "all 0.2s",
        zIndex: 10,
      }}
        onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "white"; }}
        onMouseOut={e  => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
      >
        <IconArrowLeft s={15} c="currentColor" /> Kembali ke Artikel
      </Link>

      {/* ── Login Card ── */}
      <div style={{
        background: "#ffffff",
        borderRadius: 24,
        width: "100%",
        maxWidth: 420,
        padding: "44px 40px 40px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
        position: "relative",
        zIndex: 1,
        animation: "slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
      }}>

        {/* Brand mark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: `linear-gradient(135deg, ${C.forestGreen}, ${C.leafGreen})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
            boxShadow: `0 8px 24px ${C.forestGreen}40`,
          }}>
            <IconLeaf s={28} c="white" />
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: C.earthBrown, margin: 0, letterSpacing: "-0.02em" }}>
            Portal Admin
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#9a8f85", marginTop: 5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
            Kampus Alam Tegal Sari
          </p>
        </div>

        {/* ── Divider ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: "#f0ece7" }} />
          <span style={{ fontSize: "0.72rem", color: "#b5aca4", fontWeight: 600, letterSpacing: "0.08em" }}>MASUK KE AKUN ANDA</span>
          <div style={{ flex: 1, height: 1, background: "#f0ece7" }} />
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Email field */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: C.earthBrown, display: "block", marginBottom: 7, letterSpacing: "0.02em" }}>
              Alamat Email
            </label>
            <div style={inputWrapStyle("email")}>
              <IconMail s={17} c={focusField === "email" ? C.forestGreen : "#b0a89e"} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusField("email")}
                onBlur={() => setFocusField(null)}
                placeholder="admin@kampusalam.id"
                autoComplete="email"
                disabled={loading || success}
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: "0.9rem", color: C.earthBrown, fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: C.earthBrown, display: "block", marginBottom: 7, letterSpacing: "0.02em" }}>
              Password
            </label>
            <div style={inputWrapStyle("password")}>
              <IconLock s={17} c={focusField === "password" ? C.forestGreen : "#b0a89e"} />
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusField("password")}
                onBlur={() => setFocusField(null)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading || success}
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: "0.9rem", color: C.earthBrown, fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0, color: "#b0a89e" }}
                tabIndex={-1}
              >
                {showPwd ? <IconEyeOff s={17} /> : <IconEye s={17} />}
              </button>
            </div>
          </div>

          {/* ── Feedback: Error ── */}
          {error && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              background: "#fff1f1", border: "1px solid #f5c6c6",
              borderRadius: 10, padding: "10px 14px",
              animation: "fadeIn 0.3s ease both",
            }}>
              <span style={{ fontSize: "1rem", lineHeight: 1.4, flexShrink: 0 }}>⚠️</span>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#c0392b", lineHeight: 1.6 }}>{error}</p>
            </div>
          )}

          {/* ── Feedback: Success ── */}
          {success && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#f0fce8", border: "1px solid #a8d880",
              borderRadius: 10, padding: "10px 14px",
              animation: "fadeIn 0.3s ease both",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: C.forestGreen,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <IconCheck s={13} c="white" />
              </div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: C.forestGreen, fontWeight: 600, lineHeight: 1.5 }}>
                Login berhasil! Mengalihkan ke halaman admin...
              </p>
            </div>
          )}

          {/* ── Submit button ── */}
          <button
            type="submit"
            disabled={loading || success}
            style={{
              marginTop: 4,
              padding: "13px 24px",
              borderRadius: 50,
              border: "none",
              background: loading || success
                ? "#c8d8b8"
                : `linear-gradient(135deg, ${C.forestGreen}, ${C.leafGreen})`,
              color: "white",
              fontSize: "0.92rem",
              fontWeight: 700,
              cursor: loading || success ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              letterSpacing: "0.02em",
              transition: "all 0.25s ease",
              boxShadow: loading || success ? "none" : `0 6px 20px ${C.forestGreen}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseOver={e => {
              if (!loading && !success) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 10px 28px ${C.forestGreen}50`;
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = loading || success ? "none" : `0 6px 20px ${C.forestGreen}40`;
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "white",
                  display: "inline-block",
                  animation: "spin 0.8s linear infinite",
                }} />
                Memproses...
              </>
            ) : success ? (
              <>
                <IconCheck s={16} c="white" /> Berhasil!
              </>
            ) : (
              "Masuk ke Admin"
            )}
          </button>
        </form>

        {/* Footer note */}
        <p style={{
          textAlign: "center",
          fontSize: "0.73rem",
          color: "#b0a89e",
          marginTop: 24,
          marginBottom: 0,
          lineHeight: 1.6,
        }}>
          Halaman ini khusus untuk admin Kampus Alam.<br />
          Jika Anda bukan admin,{" "}
          <Link to="/article" style={{ color: C.forestGreen, fontWeight: 600, textDecoration: "none" }}>
            kembali ke artikel
          </Link>.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes slideUp   { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn    { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatLeaf { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(8deg)} }
      `}</style>
    </div>
  );
}