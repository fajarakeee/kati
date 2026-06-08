import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

// ─── KONSTANTA ────────────────────────────────────────────────────────────────
const C = {
  forestGreen: "#4E7D22",
  leafGreen:   "#6F9D36",
  earthBrown:  "#3D2415",
  natureBlue:  "#2F6FC4",
};

const KATEGORI_OPTIONS = [
  "Umum","Konservasi","Air","Pendidikan",
  "Pertanian","Kepemimpinan Muda","Riset & Data",
];

const TAG_OPTIONS = [
  "BERITA TERKINI","LAPORAN KEGIATAN","OPINI & ANALISIS",
  "LAPORAN KHUSUS","KISAH INSPIRATIF","PROGRAM BARU",
];

const WARNA_OPTIONS = [
  { label: "Hijau Hutan",  value: "#4E7D22" },
  { label: "Hijau Daun",   value: "#6F9D36" },
  { label: "Biru Alam",    value: "#2F6FC4" },
  { label: "Emas",         value: "#d4820e" },
  { label: "Ungu",         value: "#6c3daa" },
  { label: "Merah",        value: "#c0392b" },
];

const GRADIENT_OPTIONS = [
  { label: "Hijau Hutan",  value: "linear-gradient(160deg,#1a3d08 0%,#2d6f18 50%,#4e7d22 100%)" },
  { label: "Biru Alam",    value: "linear-gradient(160deg,#0e2d5c 0%,#1a5499 50%,#2f6fc4 100%)" },
  { label: "Emas Tanah",   value: "linear-gradient(160deg,#3d1f08 0%,#8a4a10 50%,#d4820e 100%)" },
  { label: "Ungu Malam",   value: "linear-gradient(160deg,#2d1a3d 0%,#5a2d8a 50%,#7c3dba 100%)" },
  { label: "Merah Bara",   value: "linear-gradient(160deg,#2d0a0a 0%,#7a1a1a 50%,#c0392b 100%)" },
  { label: "Hijau Segar",  value: "linear-gradient(160deg,#1a3a08 0%,#3a6812 50%,#6f9d36 100%)" },
];

const EMOJI_OPTIONS = ["🌳","💧","🎓","📊","🌾","♻️","🌿","🦋","🌺","🏔️","🌊","☀️"];

const FORM_KOSONG = {
  judul: "", konten: "", kategori: "Umum", tag: "BERITA TERKINI",
  penulis: "", peran_penulis: "", waktu_baca: "5 menit",
  emoji: "🌿", warna_kategori: "#4E7D22",
  bg_gradient: "linear-gradient(160deg,#1a3d08 0%,#2d6f18 50%,#4e7d22 100%)",
  badge: "", is_featured: false,
};

// ─── ICON SVG ─────────────────────────────────────────────────────────────────
const Ico = {
  Plus:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Eye:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Leaf:   () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  Close:  () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Image:  () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Star:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

// ─── KOMPONEN KECIL ───────────────────────────────────────────────────────────
function Badge({ label, color }) {
  return (
    <span style={{
      background: `${color}18`, color, border: `1px solid ${color}44`,
      borderRadius: 50, padding: "2px 10px", fontSize: "0.72rem", fontWeight: 700,
    }}>{label}</span>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  const colors = { success: "#4E7D22", error: "#c0392b", info: "#2F6FC4" };
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: colors[type] ?? colors.info, color: "white",
      padding: "14px 24px", borderRadius: 12, fontWeight: 600, fontSize: "0.9rem",
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 10,
      animation: "slideUp 0.3s ease",
    }}>
      {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"} {msg}
      <style>{`@keyframes slideUp { from { transform:translateY(20px); opacity:0 } to { transform:translateY(0); opacity:1 } }`}</style>
    </div>
  );
}

// ─── MODAL KONFIRMASI HAPUS ───────────────────────────────────────────────────
function DeleteModal({ artikel, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 5000,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "36px 32px",
        maxWidth: 420, width: "100%", textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
      }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🗑️</div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: C.earthBrown, marginBottom: 8 }}>
          Hapus Artikel?
        </h3>
        <p style={{ color: "#7a6a5a", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 28 }}>
          Artikel <strong>"{artikel?.judul}"</strong> akan dihapus permanen dan tidak bisa dikembalikan.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onCancel} style={{
            padding: "11px 28px", borderRadius: 50, border: "1.5px solid #e8e6e2",
            background: "white", color: C.earthBrown, fontWeight: 600, cursor: "pointer", fontSize: "0.9rem",
          }}>Batal</button>
          <button onClick={onConfirm} style={{
            padding: "11px 28px", borderRadius: 50, border: "none",
            background: "#c0392b", color: "white", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem",
          }}>Ya, Hapus</button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL PREVIEW ─────────────────────────────────────────────────────────────
function PreviewModal({ form, imagePreview, onClose }) {
  const paragraphs = (form.konten ?? "").split(/\n\n+/).filter(Boolean);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 5000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      overflowY: "auto", padding: "40px 16px",
    }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 780, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
        {/* Preview Header */}
        <div style={{ background: "#1a2a0e", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#8aad60", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em" }}>
            👁️ PREVIEW ARTIKEL
          </span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico.Close />
          </button>
        </div>
        {/* Hero */}
        <div style={{ height: 280, background: form.bg_gradient, position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          {imagePreview && <img src={imagePreview} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}/>}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem", opacity: 0.2 }}>{form.emoji}</div>
          <div style={{ position: "relative", zIndex: 2, padding: "0 32px 28px" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ background: form.warna_kategori, color: "white", padding: "3px 12px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 700 }}>{form.kategori}</span>
              <span style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", padding: "3px 12px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 600 }}>{form.tag}</span>
              {form.badge && <span style={{ background: "rgba(255,255,255,0.9)", color: form.warna_kategori, padding: "3px 12px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 800 }}>{form.badge}</span>}
            </div>
            <h2 style={{ fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: 800, color: "white", lineHeight: 1.2 }}>{form.judul || "Judul Artikel"}</h2>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding: "32px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #e8e6e2" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${form.warna_kategori}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>{form.emoji}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: C.earthBrown }}>{form.penulis || "Nama Penulis"}</div>
              <div style={{ fontSize: "0.75rem", color: "#7a6a5a" }}>{form.peran_penulis || "Peran Penulis"} · {form.waktu_baca}</div>
            </div>
          </div>
          {paragraphs.length > 0
            ? paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: "0.95rem", lineHeight: 1.9, color: C.earthBrown, marginBottom: 20, textAlign: "justify" }}>{p}</p>
              ))
            : <p style={{ color: "#aaa", fontStyle: "italic" }}>Isi konten akan tampil di sini...</p>
          }
        </div>
      </div>
    </div>
  );
}

// ─── FORM ARTIKEL ──────────────────────────────────────────────────────────────
function ArticleForm({ initial, onSave, onCancel, saving }) {
  const [form,         setForm]         = useState(initial ?? FORM_KOSONG);
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(initial?.gambar_url ?? null);
  const [uploading,    setUploading]    = useState(false);
  const [showPreview,  setShowPreview]  = useState(false);
  const [dragOver,     setDragOver]     = useState(false);
  const fileInputRef = useRef();

  // 🔥 TAMBAHKAN BLOK INI: Mengisi ulang form & foto setiap kali data 'initial' berubah (saat tombol edit diklik)
  useEffect(() => {
    setForm(initial ?? FORM_KOSONG);
    setImagePreview(initial?.gambar_url ?? null);
    setImageFile(null); // Bersihkan sisa file sebelumnya jika ada
  }, [initial]);

  const isEdit = !!initial?.id;

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function handleImageChange(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Hanya file gambar yang diizinkan."); return; }
    if (file.size > 5 * 1024 * 1024)    { alert("Ukuran gambar maksimal 5MB."); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setShowPreview(true);
  }

  async function handleSubmit() {
    if (!form.judul.trim())  { alert("Judul wajib diisi!"); return; }
    if (!form.konten.trim()) { alert("Konten wajib diisi!"); return; }
    if (!form.penulis.trim()){ alert("Nama penulis wajib diisi!"); return; }

    let gambarUrl = initial?.gambar_url ?? null;

    // Upload gambar ke Supabase Storage jika ada file baru
    if (imageFile) {
      setUploading(true);
      const ext      = imageFile.name.split(".").pop();
      const fileName = `artikel-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("artikel-gambar")
        .upload(fileName, imageFile, { upsert: true });

      if (upErr) {
        alert("Gagal upload gambar: " + upErr.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("artikel-gambar")
        .getPublicUrl(fileName);

      gambarUrl = urlData.publicUrl;
      setUploading(false);
    }

    console.log("DATA FORM:", form);
    console.log("URL GAMBAR:", gambarUrl);
    
    onSave({ ...form, gambar_url: gambarUrl });
  }

  // ── Input helper ──
  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box",
    border: "1.5px solid #e8e6e2", fontSize: "0.88rem", outline: "none",
    fontFamily: "inherit", background: "#fff", color: C.earthBrown,
    transition: "border-color 0.2s",
  };
  const labelStyle = {
    display: "block", fontSize: "0.78rem", fontWeight: 700,
    color: "#7a6a5a", marginBottom: 7, letterSpacing: "0.04em", textTransform: "uppercase",
  };
  const sectionStyle = {
    background: "#fff", borderRadius: 16, padding: "24px",
    border: "1.5px solid #e8e6e2", marginBottom: 16,
  };

  return (
    <>
      {showPreview && (
        <PreviewModal form={form} imagePreview={imagePreview} onClose={() => setShowPreview(false)} />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>

        {/* ── KOLOM KIRI ── */}
        <div>
          {/* Judul & Meta */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: "0.82rem", fontWeight: 800, color: C.earthBrown, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              📝 Informasi Artikel
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Judul Artikel *</label>
              <input value={form.judul} onChange={e => set("judul", e.target.value)}
                placeholder="Tulis judul yang menarik..."
                style={{ ...inputStyle, fontSize: "1rem", fontWeight: 600 }}
                onFocus={e => e.target.style.borderColor = C.forestGreen}
                onBlur={e  => e.target.style.borderColor = "#e8e6e2"}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Penulis *</label>
                <input value={form.penulis} onChange={e => set("penulis", e.target.value)}
                  placeholder="Nama lengkap penulis"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.forestGreen}
                  onBlur={e  => e.target.style.borderColor = "#e8e6e2"}
                />
              </div>
              <div>
                <label style={labelStyle}>Peran / Jabatan</label>
                <input value={form.peran_penulis} onChange={e => set("peran_penulis", e.target.value)}
                  placeholder="cth: Koordinator Lapangan"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.forestGreen}
                  onBlur={e  => e.target.style.borderColor = "#e8e6e2"}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Kategori</label>
                <select value={form.kategori} onChange={e => set("kategori", e.target.value)} style={inputStyle}>
                  {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tag / Label</label>
                <select value={form.tag} onChange={e => set("tag", e.target.value)} style={inputStyle}>
                  {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Konten */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: "0.82rem", fontWeight: 800, color: C.earthBrown, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              ✍️ Isi Artikel *
            </h3>
            <p style={{ fontSize: "0.78rem", color: "#aaa", marginBottom: 12 }}>
              💡 Pisahkan antar paragraf dengan <strong>satu baris kosong</strong> (tekan Enter 2x)
            </p>
            <textarea
              value={form.konten}
              onChange={e => set("konten", e.target.value)}
              placeholder={"Tulis isi artikel di sini...\n\nParagraf kedua dimulai setelah baris kosong.\n\nParagraf ketiga, dan seterusnya."}
              rows={18}
              style={{
                ...inputStyle, resize: "vertical", lineHeight: 1.8,
                fontFamily: "inherit", minHeight: 320,
              }}
              onFocus={e => e.target.style.borderColor = C.forestGreen}
              onBlur={e  => e.target.style.borderColor = "#e8e6e2"}
            />
            <div style={{ textAlign: "right", fontSize: "0.75rem", color: "#aaa", marginTop: 6 }}>
              {form.konten.length} karakter · {form.konten.split(/\n\n+/).filter(Boolean).length} paragraf
            </div>
          </div>
        </div>

        {/* ── KOLOM KANAN ── */}
        <div>
          {/* Upload Gambar */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: "0.82rem", fontWeight: 800, color: C.earthBrown, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              🖼️ Gambar Artikel
            </h3>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleImageChange(e.dataTransfer.files[0]); }}
              style={{
                border: `2px dashed ${dragOver ? C.forestGreen : "#d0e8b0"}`,
                borderRadius: 12, padding: "20px 16px", textAlign: "center", cursor: "pointer",
                background: dragOver ? "#f0f9e8" : "#fafdf6", transition: "all 0.2s",
                marginBottom: 12,
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width: "100%", borderRadius: 8, maxHeight: 180, objectFit: "cover" }}/>
              ) : (
                <>
                  <div style={{ color: "#aaa", marginBottom: 8 }}><Ico.Image /></div>
                  <div style={{ fontSize: "0.82rem", color: "#7a6a5a", fontWeight: 600 }}>Klik atau drag & drop gambar</div>
                  <div style={{ fontSize: "0.72rem", color: "#aaa", marginTop: 4 }}>PNG, JPG, WEBP · Maks. 5MB</div>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => handleImageChange(e.target.files[0])}
            />
            {imagePreview && (
              <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1.5px solid #fecaca", background: "#fef2f2", color: "#c0392b", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                🗑️ Hapus Gambar
              </button>
            )}
          </div>

          {/* Tampilan */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: "0.82rem", fontWeight: 800, color: C.earthBrown, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              🎨 Tampilan Kartu
            </h3>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Emoji</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {EMOJI_OPTIONS.map(em => (
                  <button key={em} onClick={() => set("emoji", em)} style={{
                    width: 36, height: 36, borderRadius: 8, fontSize: "1.1rem",
                    border: form.emoji === em ? `2px solid ${C.forestGreen}` : "1.5px solid #e8e6e2",
                    background: form.emoji === em ? "#f0f9e8" : "#fff",
                    cursor: "pointer",
                  }}>{em}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Warna Kategori</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {WARNA_OPTIONS.map(w => (
                  <button key={w.value} title={w.label} onClick={() => set("warna_kategori", w.value)} style={{
                    width: 28, height: 28, borderRadius: "50%", background: w.value, border: "none", cursor: "pointer",
                    outline: form.warna_kategori === w.value ? `3px solid ${w.value}` : "none",
                    outlineOffset: 2, transform: form.warna_kategori === w.value ? "scale(1.2)" : "scale(1)",
                    transition: "transform 0.15s",
                  }}/>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Background Kartu</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {GRADIENT_OPTIONS.map(g => (
                  <button key={g.value} title={g.label} onClick={() => set("bg_gradient", g.value)} style={{
                    width: 36, height: 28, borderRadius: 6, background: g.value, border: "none", cursor: "pointer",
                    outline: form.bg_gradient === g.value ? "3px solid #4E7D22" : "2px solid transparent",
                    outlineOffset: 2,
                  }}/>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Badge (opsional)</label>
              <input value={form.badge ?? ""} onChange={e => set("badge", e.target.value)}
                placeholder="cth: UTAMA, EKSKLUSIF"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = C.forestGreen}
                onBlur={e  => e.target.style.borderColor = "#e8e6e2"}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Waktu Baca</label>
              <input value={form.waktu_baca} onChange={e => set("waktu_baca", e.target.value)}
                placeholder="cth: 5 menit"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = C.forestGreen}
                onBlur={e  => e.target.style.borderColor = "#e8e6e2"}
              />
            </div>

            {/* Toggle: Artikel Utama */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#f7f5f1", borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: C.earthBrown }}>⭐ Artikel Utama</div>
                <div style={{ fontSize: "0.72rem", color: "#7a6a5a" }}>Tampil sebagai artikel featured</div>
              </div>
              <button onClick={() => set("is_featured", !form.is_featured)} style={{
                width: 44, height: 24, borderRadius: 50, border: "none", cursor: "pointer",
                background: form.is_featured ? C.forestGreen : "#ccc",
                position: "relative", transition: "background 0.2s",
              }}>
                <span style={{
                  position: "absolute", top: 2, left: form.is_featured ? 22 : 2,
                  width: 20, height: 20, borderRadius: "50%", background: "white",
                  transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}/>
              </button>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => setShowPreview(true)} style={{
              padding: "12px", borderRadius: 50, border: `1.5px solid ${C.forestGreen}`,
              background: "white", color: C.forestGreen, fontWeight: 700, cursor: "pointer",
              fontSize: "0.88rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <Ico.Eye /> Preview Artikel
            </button>
            <button onClick={handleSubmit} disabled={saving || uploading} style={{
              padding: "13px", borderRadius: 50, border: "none",
              background: saving || uploading ? "#aaa" : `linear-gradient(135deg,${C.forestGreen},${C.leafGreen})`,
              color: "white", fontWeight: 700, cursor: saving || uploading ? "not-allowed" : "pointer",
              fontSize: "0.88rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {uploading ? "⬆️ Mengupload gambar..." : saving ? "💾 Menyimpan..." : isEdit ? "✏️ Simpan Perubahan" : "✅ Terbitkan Artikel"}
            </button>
            <button onClick={onCancel} style={{
              padding: "10px", borderRadius: 50, border: "1.5px solid #e8e6e2",
              background: "white", color: "#7a6a5a", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem",
            }}>
              Batal
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN ADMIN PAGE ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const navigate = useNavigate();

  const [view,          setView]          = useState("list"); // "list" | "add" | "edit"
  const [artikelList,   setArtikelList]   = useState([]);
  const [editTarget,    setEditTarget]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [saving,        setSaving]        = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [toast,         setToast]         = useState({ msg: "", type: "success" });
  const [search,        setSearch]        = useState("");
  const [userEmail,     setUserEmail]     = useState("");

  // Ambil info user yang sedang login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data?.user?.email ?? ""));
  }, []);

  // Ambil daftar artikel
  async function fetchArtikel() {
    setLoading(true);
    const { data, error } = await supabase
      .from("artikel")
      .select("*")
      .order("dibuat_pada", { ascending: false });
    if (!error) setArtikelList(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchArtikel(); }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
  }

  // ── LOGOUT ──
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }
// ── SIMPAN (Tambah / Edit) ──
  async function handleSave(formData) {
    setSaving(true);

    // Bersihkan field yang tidak ada di tabel
    const payload = {
      judul:         formData.judul,
      konten:        formData.konten,
      gambar_url:    formData.gambar_url, // 👈 Pastikan form membawa data ini
      kategori:      formData.kategori,
      tag:           formData.tag,
      penulis:       formData.penulis,
      peran_penulis: formData.peran_penulis,
      waktu_baca:    formData.waktu_baca,
      emoji:         formData.emoji,
      warna_kategori:formData.warna_kategori,
      bg_gradient:   formData.bg_gradient,
      badge:         formData.badge || null,
      is_featured:   formData.is_featured,
    };

    console.log("🔥 DEBUG 1 - Payload ke Supabase:", payload);
    console.log("🔥 DEBUG 2 - Target Edit ID:", editTarget?.id);

    let error;

    if (editTarget?.id) {
      const response = await supabase.from("artikel").update(payload).eq("id", editTarget.id).select();
      console.log("🔥 DEBUG 3 - Hasil Update DB:", response);
      error = response.error;
    } else {
      // INSERT
      const response = await supabase.from("artikel").insert([payload]).select();
      console.log("🔥 DEBUG 3 - Hasil Insert DB:", response);
      error = response.error;
    }

    setSaving(false);

    if (error) {
      showToast("Gagal menyimpan: " + error.message, "error");
    } else {
      showToast(editTarget?.id ? "Artikel berhasil diperbarui! ✨" : "Artikel berhasil diterbitkan! 🎉", "success");
      setView("list");
      setEditTarget(null);
      fetchArtikel();
    }
  }

  // ── HAPUS ──
  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from("artikel").delete().eq("id", deleteTarget.id);
    setDeleteTarget(null);
    if (error) {
      showToast("Gagal menghapus: " + error.message, "error");
    } else {
      showToast("Artikel berhasil dihapus.", "info");
      fetchArtikel();
    }
  }

  // Filter search
  const filtered = artikelList.filter(a =>
    !search || a.judul?.toLowerCase().includes(search.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Toast msg={toast.msg} type={toast.type} />

      {deleteTarget && (
        <DeleteModal
          artikel={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── TOPBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "white", borderBottom: "1.5px solid #e8e6e2",
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#4E7D22,#6F9D36)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "white",
          }}><Ico.Leaf /></div>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: C.earthBrown, lineHeight: 1 }}>Admin Panel</div>
            <div style={{ fontSize: "0.65rem", color: C.leafGreen, letterSpacing: "0.08em" }}>KAMPUS ALAM TEGAL SARI</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {view !== "list" && (
            <button onClick={() => { setView("list"); setEditTarget(null); }} style={{
              padding: "7px 18px", borderRadius: 50, border: "1.5px solid #e8e6e2",
              background: "white", color: "#7a6a5a", fontWeight: 600, cursor: "pointer", fontSize: "0.82rem",
            }}>← Kembali</button>
          )}
          <div style={{ fontSize: "0.78rem", color: "#7a6a5a" }}>
            👤 {userEmail}
          </div>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 16px", borderRadius: 50, border: "1.5px solid #fecaca",
            background: "#fef2f2", color: "#c0392b", fontWeight: 600, cursor: "pointer", fontSize: "0.82rem",
          }}>
            <Ico.Logout /> Keluar
          </button>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* ═══ VIEW: LIST ═══ */}
        {view === "list" && (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: C.earthBrown, marginBottom: 4 }}>
                  Manajemen Artikel
                </h1>
                <p style={{ color: "#7a6a5a", fontSize: "0.88rem" }}>
                  {loading ? "Memuat..." : `${artikelList.length} artikel tersimpan`}
                </p>
              </div>
              <button onClick={() => { setEditTarget(null); setView("add"); }} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 50, border: "none",
                background: `linear-gradient(135deg,${C.forestGreen},${C.leafGreen})`,
                color: "white", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem",
                boxShadow: "0 4px 16px rgba(78,125,34,0.35)",
              }}>
                <Ico.Plus /> Tambah Artikel Baru
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Artikel", value: artikelList.length, emoji: "📄", color: C.forestGreen },
                { label: "Artikel Utama", value: artikelList.filter(a => a.is_featured).length, emoji: "⭐", color: "#d4820e" },
                { label: "Total Kategori", value: new Set(artikelList.map(a => a.kategori)).size, emoji: "🏷️", color: C.natureBlue },
                { label: "Total Penayangan", value: artikelList.reduce((s, a) => s + (a.views ?? 0), 0).toLocaleString("id-ID"), emoji: "👁️", color: "#6c3daa" },
              ].map(s => (
                <div key={s.label} style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1.5px solid #e8e6e2" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>{s.emoji}</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "0.78rem", color: "#7a6a5a", fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "white", border: "1.5px solid #e8e6e2", borderRadius: 50,
              padding: "10px 18px", marginBottom: 20,
            }}>
              <span style={{ color: "#aaa" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari judul artikel..."
                style={{ border: "none", outline: "none", flex: 1, fontSize: "0.88rem", color: C.earthBrown, background: "transparent" }}
              />
            </div>

            {/* Tabel Artikel */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "64px", color: "#7a6a5a" }}>🌿 Memuat data...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px", background: "white", borderRadius: 16, border: "1.5px solid #e8e6e2" }}>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>📭</div>
                <div style={{ fontWeight: 700, color: C.earthBrown, marginBottom: 8 }}>
                  {search ? "Artikel tidak ditemukan" : "Belum ada artikel"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#7a6a5a" }}>
                  {search ? "Coba kata kunci lain" : "Klik 'Tambah Artikel Baru' untuk mulai menulis!"}
                </div>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e8e6e2", overflow: "hidden" }}>
                {/* Table header */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 120px 120px 120px 130px",
                  padding: "12px 20px", background: "#f7f5f1", borderBottom: "1.5px solid #e8e6e2",
                  fontSize: "0.72rem", fontWeight: 800, color: "#7a6a5a", letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  <span>Judul</span>
                  <span>Kategori</span>
                  <span>Penulis</span>
                  <span>Tanggal</span>
                  <span style={{ textAlign: "right" }}>Aksi</span>
                </div>

                {filtered.map((a, i) => (
                  <div key={a.id} style={{
                    display: "grid", gridTemplateColumns: "1fr 120px 120px 120px 130px",
                    padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #f0eee9" : "none",
                    alignItems: "center", transition: "background 0.15s",
                  }}
                    onMouseOver={e => e.currentTarget.style.background = "#fafdf6"}
                    onMouseOut={e  => e.currentTarget.style.background = "white"}
                  >
                    {/* Judul */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 16 }}>
                      <span style={{ fontSize: "1.2rem" }}>{a.emoji ?? "🌿"}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: C.earthBrown, lineHeight: 1.3 }}>
                          {a.judul}
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                          {a.is_featured && (
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.68rem", color: "#d4820e", fontWeight: 700 }}>
                              <Ico.Star /> Utama
                            </span>
                          )}
                          <span style={{ fontSize: "0.68rem", color: "#aaa" }}>{a.tag}</span>
                        </div>
                      </div>
                    </div>

                    {/* Kategori */}
                    <div><Badge label={a.kategori ?? "Umum"} color={a.warna_kategori ?? C.forestGreen} /></div>

                    {/* Penulis */}
                    <div style={{ fontSize: "0.82rem", color: "#7a6a5a" }}>{a.penulis ?? "-"}</div>

                    {/* Tanggal */}
                    <div style={{ fontSize: "0.78rem", color: "#aaa" }}>
                      {new Date(a.dibuat_pada).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" })}
                    </div>

                    {/* Aksi */}
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button
                        title="Edit"
                        onClick={() => { setEditTarget(a); setView("edit"); }}
                        style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e8e6e2", background: "white", color: C.natureBlue, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", fontWeight: 600 }}>
                        <Ico.Edit /> Edit
                      </button>
                      <button
                        title="Hapus"
                        onClick={() => setDeleteTarget(a)}
                        style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #fecaca", background: "#fef2f2", color: "#c0392b", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", fontWeight: 600 }}>
                        <Ico.Trash /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══ VIEW: TAMBAH / EDIT ═══ */}
        {(view === "add" || view === "edit") && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: C.earthBrown, marginBottom: 4 }}>
                {view === "edit" ? "✏️ Edit Artikel" : "✍️ Tulis Artikel Baru"}
              </h1>
              <p style={{ color: "#7a6a5a", fontSize: "0.88rem" }}>
                {view === "edit" ? `Mengedit: "${editTarget?.judul}"` : "Isi semua kolom yang wajib, lalu terbitkan."}
              </p>
            </div>
            <ArticleForm
              initial={view === "edit" ? editTarget : null}
              onSave={handleSave}
              onCancel={() => { setView("list"); setEditTarget(null); }}
              saving={saving}
            />
          </>
        )}
      </div>
    </div>
  );
}