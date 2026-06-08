
import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ── Warna tema (samakan dengan App.jsx) ──────────────────────
const C = {
  green:      "#4E7D22",
  lightGreen: "#6F9D36",
  brown:      "#3D2415",
  blue:       "#2F6FC4",
  red:        "#c0392b",
  orange:     "#d4820e",
  purple:     "#9c3dba",
  gray:       "#f7f5f1",
  border:     "#e8e6e2",
  muted:      "#7a6a5a",
};

// ── Helper: format tanggal ke string lokal ───────────────────
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

// ── Komponen: Badge status ───────────────────────────────────
const Badge = ({ active }) => (
  <span style={{
    padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700,
    background: active ? "#e8f5d4" : "#fde8e8",
    color: active ? C.green : C.red,
  }}>
    {active ? "Aktif" : "Nonaktif"}
  </span>
);

// ── Komponen: Tombol aksi ─────────────────────────────────────
const Btn = ({ onClick, color = C.green, children, disabled, small }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? "#ccc" : color,
      color: "white", border: "none", borderRadius: 8,
      padding: small ? "6px 14px" : "10px 20px",
      fontSize: small ? "0.78rem" : "0.88rem",
      fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", gap: 6,
      transition: "opacity 0.2s",
    }}
    onMouseOver={e => !disabled && (e.currentTarget.style.opacity = "0.85")}
    onMouseOut={e => (e.currentTarget.style.opacity = "1")}
  >
    {children}
  </button>
);

// ── Komponen: Input field ─────────────────────────────────────
const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontWeight: 600, fontSize: "0.82rem", color: C.muted, marginBottom: 6 }}>
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ value, onChange, type = "text", placeholder, style = {} }) => (
  <input
    type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{
      width: "100%", padding: "10px 14px", borderRadius: 8,
      border: `1.5px solid ${C.border}`, fontSize: "0.9rem", outline: "none",
      background: "#fafaf8", color: C.brown, boxSizing: "border-box", ...style,
    }}
    onFocus={e => (e.target.style.borderColor = C.green)}
    onBlur={e => (e.target.style.borderColor = C.border)}
  />
);

const Textarea = ({ value, onChange, rows = 3, placeholder }) => (
  <textarea
    value={value} onChange={onChange} rows={rows} placeholder={placeholder}
    style={{
      width: "100%", padding: "10px 14px", borderRadius: 8,
      border: `1.5px solid ${C.border}`, fontSize: "0.9rem", outline: "none",
      background: "#fafaf8", color: C.brown, resize: "vertical", boxSizing: "border-box",
    }}
    onFocus={e => (e.target.style.borderColor = C.green)}
    onBlur={e => (e.target.style.borderColor = C.border)}
  />
);

const Select = ({ value, onChange, children }) => (
  <select
    value={value} onChange={onChange}
    style={{
      width: "100%", padding: "10px 14px", borderRadius: 8,
      border: `1.5px solid ${C.border}`, fontSize: "0.9rem", outline: "none",
      background: "#fafaf8", color: C.brown, boxSizing: "border-box",
    }}
  >
    {children}
  </select>
);

// ── Komponen: Modal wrapper ───────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 9999,
    background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20,
  }}>
    <div style={{
      background: "white", borderRadius: 20, padding: 32,
      width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto",
      boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ fontWeight: 800, fontSize: "1.2rem", color: C.brown }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: C.muted }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

// ── Komponen: Notifikasi toast ────────────────────────────────
const Toast = ({ msg, type }) => (
  msg ? (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 99999,
      background: type === "error" ? C.red : C.green,
      color: "white", padding: "14px 24px", borderRadius: 12,
      fontWeight: 600, fontSize: "0.9rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      animation: "slideIn 0.3s ease",
    }}>
      {type === "error" ? "❌" : "✅"} {msg}
    </div>
  ) : null
);


// ============================================================
// MAIN COMPONENT: AdminPage
// ============================================================
export default function AdminPage() {
  // ── Tab aktif: galeri | programs | events | blogs ──────────
  const [tab, setTab] = useState("galeri");

  // ── Toast notifikasi ───────────────────────────────────────
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.gray, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.brown}, #1a0d06)`, padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>🌿</div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: "1.15rem" }}>KATI Admin Dashboard</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>Kampus Alam Tegalsari Indonesia</div>
          </div>
        </div>
        <a href="/" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", textDecoration: "none" }}>← Kembali ke Website</a>
      </div>

      {/* Tab Navigation */}
      <div style={{ background: "white", borderBottom: `1px solid ${C.border}`, padding: "0 32px", display: "flex", gap: 4 }}>
        {[
          { key: "galeri",   label: "🖼️  Galeri"   },
          { key: "programs", label: "🌿  Program"   },
          { key: "events",   label: "📅  Events"    },
          { key: "blogs",    label: "✍️  Artikel"   },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "16px 24px", border: "none", background: "none",
            fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
            color: tab === t.key ? C.green : C.muted,
            borderBottom: tab === t.key ? `3px solid ${C.green}` : "3px solid transparent",
            transition: "all 0.2s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
        {tab === "galeri"   && <TabGaleri   showToast={showToast} />}
        {tab === "programs" && <TabPrograms showToast={showToast} />}
        {tab === "events"   && <TabEvents   showToast={showToast} />}
        {tab === "blogs"    && <TabBlogs    showToast={showToast} />}
      </div>

      <Toast msg={toast.msg} type={toast.type} />

      <style>{`
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}


// ============================================================
// TAB: GALERI — CRUD + Upload foto ke Supabase Storage
// ============================================================
function TabGaleri({ showToast }) {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);       // tambah/edit
  const [delModal, setDelModal] = useState(null);        // konfirmasi hapus (id)
  const [editing, setEditing]   = useState(null);        // data item yang diedit
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  // Form state
  const emptyForm = { cat: "forest", label: "", span: "1", h: 240, image_url: "" };
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null); // preview gambar lokal

  // ── Fetch semua data galeri ──────────────────────────────
  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("galeri")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) showToast("Gagal memuat galeri: " + error.message, "error");
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  // ── Buka modal tambah ────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview(null);
    setModal(true);
  };

  // ── Buka modal edit ──────────────────────────────────────
  const openEdit = (item) => {
    setEditing(item);
    setForm({ cat: item.cat, label: item.label, span: item.span, h: item.h, image_url: item.image_url || "" });
    setPreview(item.image_url || null);
    setModal(true);
  };

  // ── Handle pilih file, tampilkan preview lokal ───────────
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validasi: hanya gambar, maks 5MB
    if (!file.type.startsWith("image/")) { showToast("File harus berupa gambar", "error"); return; }
    if (file.size > 5 * 1024 * 1024)    { showToast("Ukuran file maks 5MB", "error"); return; }
    setPreview(URL.createObjectURL(file));
    setForm(f => ({ ...f, _file: file })); // simpan file object sementara
  };

  // ── Upload file ke Supabase Storage ─────────────────────
  const uploadImage = async (file) => {
    const ext      = file.name.split(".").pop();
    const fileName = `galeri/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("kati-media")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (upErr) throw new Error("Upload gagal: " + upErr.message);

    // Ambil public URL
    const { data } = supabase.storage.from("kati-media").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // ── Hapus file lama dari Storage (saat edit/ganti gambar) ─
  const deleteOldImage = async (url) => {
    if (!url || !url.includes("kati-media")) return;
    // Ekstrak path dari URL
    const path = url.split("/kati-media/")[1];
    if (path) await supabase.storage.from("kati-media").remove([path]);
  };

  // ── Simpan (tambah / update) ──────────────────────────────
  const handleSave = async () => {
    if (!form.label.trim()) { showToast("Label harus diisi", "error"); return; }
    setUploading(true);
    try {
      let imageUrl = form.image_url;

      // Jika ada file baru dipilih, upload dulu
      if (form._file) {
        // Hapus gambar lama jika sedang edit
        if (editing?.image_url) await deleteOldImage(editing.image_url);
        imageUrl = await uploadImage(form._file);
      }

      const payload = {
        cat:       form.cat,
        label:     form.label,
        span:      form.span,
        h:         Number(form.h),
        image_url: imageUrl,
      };

      if (editing) {
        // UPDATE
        const { error } = await supabase.from("galeri").update(payload).eq("id", editing.id);
        if (error) throw error;
        showToast("Item berhasil diperbarui ✨");
      } else {
        // INSERT
        const { error } = await supabase.from("galeri").insert([payload]);
        if (error) throw error;
        showToast("Item berhasil ditambahkan 🌿");
      }

      setModal(false);
      fetchItems();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  // ── Hapus item ────────────────────────────────────────────
  const handleDelete = async (item) => {
    try {
      // Hapus gambar dari storage juga
      if (item.image_url) await deleteOldImage(item.image_url);
      const { error } = await supabase.from("galeri").delete().eq("id", item.id);
      if (error) throw error;
      showToast("Item dihapus");
      setDelModal(null);
      fetchItems();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div>
      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: C.brown }}>Manajemen Galeri</h2>
          <p style={{ color: C.muted, fontSize: "0.85rem", marginTop: 4 }}>{items.length} foto tersimpan</p>
        </div>
        <Btn onClick={openAdd}>+ Tambah Foto</Btn>
      </div>

      {/* Grid foto */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 64, color: C.muted }}>⏳ Memuat data...</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64, color: C.muted, background: "white", borderRadius: 16 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🖼️</div>
          <p>Belum ada foto. Klik "Tambah Foto" untuk mulai.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              {/* Preview gambar */}
              <div style={{
                height: 160, background: "linear-gradient(135deg, #1a3d08, #4e7d22)",
                position: "relative", overflow: "hidden",
              }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "3rem" }}>🌿</div>
                )}
                {/* Badge kategori */}
                <span style={{
                  position: "absolute", top: 10, left: 10,
                  background: "rgba(0,0,0,0.6)", color: "white",
                  padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600,
                }}>
                  {item.cat}
                </span>
              </div>
              {/* Info */}
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: "0.95rem" }}>{item.label}</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ background: C.gray, padding: "2px 10px", borderRadius: 50, fontSize: "0.72rem", color: C.muted }}>Span: {item.span}</span>
                  <span style={{ background: C.gray, padding: "2px 10px", borderRadius: 50, fontSize: "0.72rem", color: C.muted }}>H: {item.h}px</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small onClick={() => openEdit(item)} color={C.blue}>✏️ Edit</Btn>
                  <Btn small onClick={() => setDelModal(item)} color={C.red}>🗑️ Hapus</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah / Edit */}
      {modal && (
        <Modal title={editing ? "Edit Item Galeri" : "Tambah Foto Baru"} onClose={() => setModal(false)}>
          <Field label="Kategori">
            <Select value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
              <option value="forest">🌳 Forest (Hutan)</option>
              <option value="water">💧 Water (Air)</option>
              <option value="community">🤝 Community (Komunitas)</option>
              <option value="education">📚 Education (Edukasi)</option>
            </Select>
          </Field>

          <Field label="Label / Judul Foto">
            <Input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Contoh: Penanaman Mangrove 2026" />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Span Grid (lebar kolom)">
              <Select value={form.span} onChange={e => setForm(f => ({ ...f, span: e.target.value }))}>
                <option value="1">1 kolom (normal)</option>
                <option value="2">2 kolom (lebar)</option>
              </Select>
            </Field>
            <Field label="Tinggi Kartu (px)">
              <Input type="number" value={form.h} onChange={e => setForm(f => ({ ...f, h: e.target.value }))} placeholder="240" />
            </Field>
          </div>

          {/* Upload Foto */}
          <Field label="Foto">
            <div
              onClick={() => fileRef.current.click()}
              style={{
                border: `2px dashed ${C.border}`, borderRadius: 12, padding: 20,
                textAlign: "center", cursor: "pointer", background: C.gray,
                transition: "border-color 0.2s",
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = C.green)}
              onMouseOut={e => (e.currentTarget.style.borderColor = C.border)}
            >
              {preview ? (
                <img src={preview} alt="preview" style={{ maxHeight: 160, maxWidth: "100%", borderRadius: 8, objectFit: "cover" }} />
              ) : (
                <div>
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>📸</div>
                  <p style={{ color: C.muted, fontSize: "0.85rem" }}>Klik untuk pilih gambar<br/><span style={{ fontSize: "0.75rem" }}>JPG, PNG, WebP · Maks 5MB</span></p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            {preview && (
              <button onClick={() => { setPreview(null); setForm(f => ({ ...f, _file: null, image_url: "" })); fileRef.current.value = ""; }}
                style={{ marginTop: 8, background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.82rem" }}>
                ✕ Hapus gambar
              </button>
            )}
          </Field>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn onClick={() => setModal(false)} color={C.muted}>Batal</Btn>
            <Btn onClick={handleSave} disabled={uploading}>
              {uploading ? "⏳ Menyimpan..." : (editing ? "💾 Simpan Perubahan" : "➕ Tambahkan")}
            </Btn>
          </div>
        </Modal>
      )}

      {/* Modal Konfirmasi Hapus */}
      {delModal && (
        <Modal title="Konfirmasi Hapus" onClose={() => setDelModal(null)}>
          <p style={{ color: C.muted, marginBottom: 24, lineHeight: 1.7 }}>
            Yakin ingin menghapus foto <strong>"{delModal.label}"</strong>?<br/>
            Foto juga akan dihapus dari storage. Tindakan ini tidak bisa dibatalkan.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn onClick={() => setDelModal(null)} color={C.muted}>Batal</Btn>
            <Btn onClick={() => handleDelete(delModal)} color={C.red}>🗑️ Ya, Hapus</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}


// ============================================================
// TAB: PROGRAMS — CRUD
// ============================================================
function TabPrograms({ showToast }) {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [delModal, setDelModal] = useState(null);
  const [editing, setEditing]   = useState(null);

  const emptyForm = { title: "", title_en: "", desc_id: "", desc_en: "", color: "#4E7D22", icon_emoji: "🌿", is_active: true, urutan: 0 };
  const [form, setForm] = useState(emptyForm);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("programs").select("*").order("urutan");
    if (error) showToast("Gagal memuat programs: " + error.message, "error");
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, title_en: item.title_en || "", desc_id: item.desc_id || "", desc_en: item.desc_en || "", color: item.color, icon_emoji: item.icon_emoji || "🌿", is_active: item.is_active, urutan: item.urutan || 0 });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { showToast("Judul harus diisi", "error"); return; }
    const payload = { ...form, urutan: Number(form.urutan) };
    try {
      if (editing) {
        const { error } = await supabase.from("programs").update(payload).eq("id", editing.id);
        if (error) throw error;
        showToast("Program diperbarui ✨");
      } else {
        const { error } = await supabase.from("programs").insert([payload]);
        if (error) throw error;
        showToast("Program ditambahkan 🌿");
      }
      setModal(false);
      fetchItems();
    } catch (err) { showToast(err.message, "error"); }
  };

  const handleDelete = async (item) => {
    const { error } = await supabase.from("programs").delete().eq("id", item.id);
    if (error) showToast(error.message, "error");
    else { showToast("Program dihapus"); setDelModal(null); fetchItems(); }
  };

  const toggleActive = async (item) => {
    await supabase.from("programs").update({ is_active: !item.is_active }).eq("id", item.id);
    fetchItems();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: C.brown }}>Manajemen Program</h2>
          <p style={{ color: C.muted, fontSize: "0.85rem", marginTop: 4 }}>{items.length} program tersimpan</p>
        </div>
        <Btn onClick={openAdd}>+ Tambah Program</Btn>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 64, color: C.muted }}>⏳ Memuat data...</div>
      ) : (
        <div style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.gray }}>
                {["No", "Ikon", "Judul (ID)", "Judul (EN)", "Warna", "Status", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: C.muted, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "14px 16px", color: C.muted, fontSize: "0.85rem" }}>{i + 1}</td>
                  <td style={{ padding: "14px 16px", fontSize: "1.5rem" }}>{item.icon_emoji}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>{item.title}</td>
                  <td style={{ padding: "14px 16px", color: C.muted, fontSize: "0.85rem" }}>{item.title_en}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 14, height: 14, borderRadius: "50%", background: item.color, display: "inline-block" }}/>
                      <span style={{ fontSize: "0.78rem", color: C.muted }}>{item.color}</span>
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div onClick={() => toggleActive(item)} style={{ cursor: "pointer" }}>
                      <Badge active={item.is_active} />
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn small onClick={() => openEdit(item)} color={C.blue}>✏️</Btn>
                      <Btn small onClick={() => setDelModal(item)} color={C.red}>🗑️</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div style={{ textAlign: "center", padding: 48, color: C.muted }}>Belum ada program.</div>}
        </div>
      )}

      {/* Modal Form */}
      {modal && (
        <Modal title={editing ? "Edit Program" : "Tambah Program Baru"} onClose={() => setModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Judul (Bahasa Indonesia) *">
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Konservasi Hutan" />
            </Field>
            <Field label="Judul (English)">
              <Input value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} placeholder="Forest Conservation" />
            </Field>
          </div>
          <Field label="Deskripsi (Indonesia)">
            <Textarea value={form.desc_id} onChange={e => setForm(f => ({ ...f, desc_id: e.target.value }))} placeholder="Deskripsi program dalam Bahasa Indonesia..." />
          </Field>
          <Field label="Deskripsi (English)">
            <Textarea value={form.desc_en} onChange={e => setForm(f => ({ ...f, desc_en: e.target.value }))} placeholder="Program description in English..." />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Field label="Ikon Emoji">
              <Input value={form.icon_emoji} onChange={e => setForm(f => ({ ...f, icon_emoji: e.target.value }))} placeholder="🌿" />
            </Field>
            <Field label="Warna Aksen (hex)">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{ width: 44, height: 40, padding: 2, borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer" }} />
                <Input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="#4E7D22" />
              </div>
            </Field>
            <Field label="Urutan Tampil">
              <Input type="number" value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: e.target.value }))} placeholder="1" />
            </Field>
          </div>
          <Field label="Status">
            <Select value={form.is_active ? "true" : "false"} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "true" }))}>
              <option value="true">✅ Aktif (tampil di website)</option>
              <option value="false">❌ Nonaktif (disembunyikan)</option>
            </Select>
          </Field>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn onClick={() => setModal(false)} color={C.muted}>Batal</Btn>
            <Btn onClick={handleSave}>{editing ? "💾 Simpan" : "➕ Tambahkan"}</Btn>
          </div>
        </Modal>
      )}

      {delModal && (
        <Modal title="Konfirmasi Hapus" onClose={() => setDelModal(null)}>
          <p style={{ color: C.muted, marginBottom: 24 }}>Yakin hapus program <strong>"{delModal.title}"</strong>? Tidak bisa dibatalkan.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn onClick={() => setDelModal(null)} color={C.muted}>Batal</Btn>
            <Btn onClick={() => handleDelete(delModal)} color={C.red}>🗑️ Hapus</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}


// ============================================================
// TAB: EVENTS — CRUD
// ============================================================
function TabEvents({ showToast }) {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [delModal, setDelModal] = useState(null);
  const [editing, setEditing]   = useState(null);

  const emptyForm = { title: "", title_en: "", event_date: "", location: "", type_id: "", type_en: "", color: "#4E7D22", is_active: true };
  const [form, setForm] = useState(emptyForm);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("events").select("*").order("event_date");
    if (error) showToast("Gagal memuat events: " + error.message, "error");
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, title_en: item.title_en || "", event_date: item.event_date || "", location: item.location || "", type_id: item.type_id || "", type_en: item.type_en || "", color: item.color, is_active: item.is_active });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.event_date) { showToast("Judul dan tanggal harus diisi", "error"); return; }
    try {
      if (editing) {
        const { error } = await supabase.from("events").update(form).eq("id", editing.id);
        if (error) throw error;
        showToast("Event diperbarui ✨");
      } else {
        const { error } = await supabase.from("events").insert([form]);
        if (error) throw error;
        showToast("Event ditambahkan 📅");
      }
      setModal(false); fetchItems();
    } catch (err) { showToast(err.message, "error"); }
  };

  const handleDelete = async (item) => {
    const { error } = await supabase.from("events").delete().eq("id", item.id);
    if (error) showToast(error.message, "error");
    else { showToast("Event dihapus"); setDelModal(null); fetchItems(); }
  };

  // Cek apakah event sudah lewat
  const isPast = (dateStr) => new Date(dateStr) < new Date();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: C.brown }}>Manajemen Events</h2>
          <p style={{ color: C.muted, fontSize: "0.85rem", marginTop: 4 }}>{items.length} event tersimpan</p>
        </div>
        <Btn onClick={openAdd}>+ Tambah Event</Btn>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 64, color: C.muted }}>⏳ Memuat data...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: "white", borderRadius: 14, padding: "18px 22px",
              border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 20,
              opacity: isPast(item.event_date) ? 0.6 : 1,
            }}>
              {/* Tanggal */}
              <div style={{ minWidth: 64, height: 64, borderRadius: 12, background: `${item.color}18`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: item.color, textTransform: "uppercase" }}>
                  {new Date(item.event_date).toLocaleString("id-ID", { month: "short" })}
                </div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: item.color, lineHeight: 1 }}>
                  {new Date(item.event_date).getDate()}
                </div>
              </div>
              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ background: item.color, color: "white", padding: "2px 10px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 700 }}>{item.type_id}</span>
                  {isPast(item.event_date) && <span style={{ background: "#f0eee9", color: C.muted, padding: "2px 10px", borderRadius: 50, fontSize: "0.7rem" }}>Sudah Lewat</span>}
                  <Badge active={item.is_active} />
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{item.title}</div>
                <div style={{ color: C.muted, fontSize: "0.8rem", marginTop: 2 }}>📍 {item.location}</div>
              </div>
              {/* Aksi */}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn small onClick={() => openEdit(item)} color={C.blue}>✏️ Edit</Btn>
                <Btn small onClick={() => setDelModal(item)} color={C.red}>🗑️</Btn>
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ textAlign: "center", padding: 48, color: C.muted, background: "white", borderRadius: 16 }}>Belum ada event.</div>}
        </div>
      )}

      {/* Modal Form */}
      {modal && (
        <Modal title={editing ? "Edit Event" : "Tambah Event Baru"} onClose={() => setModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Judul (Indonesia) *">
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Penanaman Mangrove" />
            </Field>
            <Field label="Judul (English)">
              <Input value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} placeholder="Mangrove Planting Day" />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Tanggal Event *">
              <Input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} />
            </Field>
            <Field label="Lokasi">
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Pantai Tegal" />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Field label="Tipe (Indonesia)">
              <Input value={form.type_id} onChange={e => setForm(f => ({ ...f, type_id: e.target.value }))} placeholder="Konservasi" />
            </Field>
            <Field label="Tipe (English)">
              <Input value={form.type_en} onChange={e => setForm(f => ({ ...f, type_en: e.target.value }))} placeholder="Conservation" />
            </Field>
            <Field label="Warna Label">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{ width: 44, height: 40, padding: 2, borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer" }} />
                <Input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
              </div>
            </Field>
          </div>
          <Field label="Status">
            <Select value={form.is_active ? "true" : "false"} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "true" }))}>
              <option value="true">✅ Aktif</option>
              <option value="false">❌ Nonaktif</option>
            </Select>
          </Field>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn onClick={() => setModal(false)} color={C.muted}>Batal</Btn>
            <Btn onClick={handleSave}>{editing ? "💾 Simpan" : "➕ Tambahkan"}</Btn>
          </div>
        </Modal>
      )}

      {delModal && (
        <Modal title="Konfirmasi Hapus" onClose={() => setDelModal(null)}>
          <p style={{ color: C.muted, marginBottom: 24 }}>Yakin hapus event <strong>"{delModal.title}"</strong>?</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn onClick={() => setDelModal(null)} color={C.muted}>Batal</Btn>
            <Btn onClick={() => handleDelete(delModal)} color={C.red}>🗑️ Hapus</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}


// ============================================================
// TAB: BLOGS — CRUD + Upload cover image
// ============================================================
function TabBlogs({ showToast }) {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [delModal, setDelModal] = useState(null);
  const [editing, setEditing]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const emptyForm = { tag_id: "", tag_en: "", title_id: "", title_en: "", slug: "", content: "", color: "#4E7D22", read_time: 5, is_active: true, image_url: "" };
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("blogs").select("*").order("published_at", { ascending: false });
    if (error) showToast("Gagal memuat artikel: " + error.message, "error");
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setPreview(null); setModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ tag_id: item.tag_id || "", tag_en: item.tag_en || "", title_id: item.title_id, title_en: item.title_en || "", slug: item.slug || "", content: item.content || "", color: item.color, read_time: item.read_time || 5, is_active: item.is_active, image_url: item.image_url || "" });
    setPreview(item.image_url || null);
    setModal(true);
  };

  // Auto-generate slug dari judul Indonesia
  const genSlug = (title) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("File harus berupa gambar", "error"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("Ukuran file maks 5MB", "error"); return; }
    setPreview(URL.createObjectURL(file));
    setForm(f => ({ ...f, _file: file }));
  };

  const uploadImage = async (file) => {
    const ext = file.name.split(".").pop();
    const fileName = `blogs/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("kati-media").upload(fileName, file, { cacheControl: "3600" });
    if (error) throw new Error("Upload gagal: " + error.message);
    const { data } = supabase.storage.from("kati-media").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.title_id.trim()) { showToast("Judul harus diisi", "error"); return; }
    setUploading(true);
    try {
      let imageUrl = form.image_url;
      if (form._file) {
        if (editing?.image_url) {
          const path = editing.image_url.split("/kati-media/")[1];
          if (path) await supabase.storage.from("kati-media").remove([path]);
        }
        imageUrl = await uploadImage(form._file);
      }

      const payload = {
        tag_id: form.tag_id, tag_en: form.tag_en,
        title_id: form.title_id, title_en: form.title_en,
        slug: form.slug || genSlug(form.title_id),
        content: form.content, color: form.color,
        read_time: Number(form.read_time), is_active: form.is_active,
        image_url: imageUrl,
      };

      if (editing) {
        const { error } = await supabase.from("blogs").update(payload).eq("id", editing.id);
        if (error) throw error;
        showToast("Artikel diperbarui ✨");
      } else {
        const { error } = await supabase.from("blogs").insert([payload]);
        if (error) throw error;
        showToast("Artikel ditambahkan ✍️");
      }
      setModal(false); fetchItems();
    } catch (err) { showToast(err.message, "error"); }
    finally { setUploading(false); }
  };

  const handleDelete = async (item) => {
    if (item.image_url) {
      const path = item.image_url.split("/kati-media/")[1];
      if (path) await supabase.storage.from("kati-media").remove([path]);
    }
    const { error } = await supabase.from("blogs").delete().eq("id", item.id);
    if (error) showToast(error.message, "error");
    else { showToast("Artikel dihapus"); setDelModal(null); fetchItems(); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: C.brown }}>Manajemen Artikel / Blog</h2>
          <p style={{ color: C.muted, fontSize: "0.85rem", marginTop: 4 }}>{items.length} artikel tersimpan</p>
        </div>
        <Btn onClick={openAdd}>+ Tulis Artikel</Btn>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 64, color: C.muted }}>⏳ Memuat data...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}` }}>
              {/* Cover */}
              <div style={{ height: 140, background: `linear-gradient(135deg, ${item.color}22, ${item.color}55)`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.title_id} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: "3rem" }}>📰</span>
                }
                <span style={{ position: "absolute", top: 10, left: 10, background: item.color, color: "white", padding: "3px 10px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 700 }}>{item.tag_id}</span>
              </div>
              {/* Content */}
              <div style={{ padding: "16px 18px" }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.4, marginBottom: 10 }}>{item.title_id}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ color: C.muted, fontSize: "0.78rem" }}>{fmtDate(item.published_at)}</span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ color: C.muted, fontSize: "0.78rem" }}>⏱ {item.read_time} min</span>
                    <Badge active={item.is_active} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small onClick={() => openEdit(item)} color={C.blue}>✏️ Edit</Btn>
                  <Btn small onClick={() => setDelModal(item)} color={C.red}>🗑️</Btn>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 64, color: C.muted, background: "white", borderRadius: 16 }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>✍️</div>
              <p>Belum ada artikel. Klik "Tulis Artikel" untuk mulai.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {modal && (
        <Modal title={editing ? "Edit Artikel" : "Tulis Artikel Baru"} onClose={() => setModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Tag (Indonesia)">
              <Input value={form.tag_id} onChange={e => setForm(f => ({ ...f, tag_id: e.target.value }))} placeholder="Konservasi" />
            </Field>
            <Field label="Tag (English)">
              <Input value={form.tag_en} onChange={e => setForm(f => ({ ...f, tag_en: e.target.value }))} placeholder="Conservation" />
            </Field>
          </div>
          <Field label="Judul (Indonesia) *">
            <Input value={form.title_id}
              onChange={e => setForm(f => ({ ...f, title_id: e.target.value, slug: genSlug(e.target.value) }))}
              placeholder="Judul artikel dalam Bahasa Indonesia" />
          </Field>
          <Field label="Judul (English)">
            <Input value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} placeholder="Article title in English" />
          </Field>
          <Field label={`Slug (URL) — auto: /${form.slug}`}>
            <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="judul-artikel-url-friendly" />
          </Field>
          <Field label="Isi Artikel">
            <Textarea rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Tulis isi artikel di sini (bisa gunakan Markdown)..." />
          </Field>

          {/* Upload Cover */}
          <Field label="Gambar Cover">
            <div onClick={() => fileRef.current.click()}
              style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: 16, textAlign: "center", cursor: "pointer", background: C.gray }}
              onMouseOver={e => (e.currentTarget.style.borderColor = C.green)}
              onMouseOut={e => (e.currentTarget.style.borderColor = C.border)}
            >
              {preview
                ? <img src={preview} alt="cover" style={{ maxHeight: 120, maxWidth: "100%", borderRadius: 8, objectFit: "cover" }} />
                : <div><div style={{ fontSize: "1.8rem" }}>🖼️</div><p style={{ color: C.muted, fontSize: "0.82rem", margin: "4px 0 0" }}>Klik pilih gambar cover</p></div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Field label="Warna Tag">
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{ width: 40, height: 38, padding: 2, borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer" }} />
                <Input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
              </div>
            </Field>
            <Field label="Estimasi Baca (menit)">
              <Input type="number" value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))} placeholder="5" />
            </Field>
            <Field label="Status">
              <Select value={form.is_active ? "true" : "false"} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === "true" }))}>
                <option value="true">✅ Aktif</option>
                <option value="false">❌ Draft</option>
              </Select>
            </Field>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn onClick={() => setModal(false)} color={C.muted}>Batal</Btn>
            <Btn onClick={handleSave} disabled={uploading}>{uploading ? "⏳ Menyimpan..." : (editing ? "💾 Simpan" : "✍️ Publikasikan")}</Btn>
          </div>
        </Modal>
      )}

      {delModal && (
        <Modal title="Konfirmasi Hapus" onClose={() => setDelModal(null)}>
          <p style={{ color: C.muted, marginBottom: 24 }}>Yakin hapus artikel <strong>"{delModal.title_id}"</strong>? Cover juga akan dihapus dari storage.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn onClick={() => setDelModal(null)} color={C.muted}>Batal</Btn>
            <Btn onClick={() => handleDelete(delModal)} color={C.red}>🗑️ Hapus</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}