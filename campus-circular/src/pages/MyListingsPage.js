import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import LocationMap from "../components/LocationMap";
import LocationPicker from "../components/LocationPicker";

const MyListingsPage = () => {
  const { currentUser, allResources, allExchanges, deleteResource, toggleAvailability, togglePublic, updateResource } = useApp();
  const getCardVisual = (resource) => {
    const byName = {
      "Canon EOS 1500D DSLR Camera": { icon: "fa-solid fa-camera", bg: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)" },
      "Tripod Stand - Professional": { icon: "fa-solid fa-video", bg: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" },
      "Wireless Bluetooth Microphone": { icon: "fa-solid fa-microphone", bg: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)" },
      "LED Ring Light 12 inch": { icon: "fa-solid fa-lightbulb", bg: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)" },
      "Engineering Mathematics Vol 1": { icon: "fa-solid fa-book-open", bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
      "Cricket Bat - SG": { icon: "fa-solid fa-baseball-bat-ball", bg: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)" },
      "Yamaha Acoustic Guitar": { icon: "fa-solid fa-guitar", bg: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" },
      "Dell Laptop - i5 10th Gen": { icon: "fa-solid fa-laptop", bg: "linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)" },
      "Football - Official Size 5": { icon: "fa-solid fa-futbol", bg: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)" },
      "Scientific Calculator - Casio fx-991EX": { icon: "fa-solid fa-calculator", bg: "linear-gradient(135deg, #6366f1 0%, #1e40af 100%)" },
      "Bluetooth Speaker - JBL": { icon: "fa-solid fa-volume-high", bg: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)" },
      "Desk Lamp - LED Study Lamp": { icon: "fa-regular fa-lightbulb", bg: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)" },
    };
    if (byName[resource.name]) return byName[resource.name];
    const catMap = {
      Cameras: { icon: "fa-solid fa-camera", bg: "linear-gradient(135deg, #ec4899, #8b5cf6)" },
      Electronics: { icon: "fa-solid fa-microchip", bg: "linear-gradient(135deg, #6366f1, #06b6d4)" },
      Textbooks: { icon: "fa-solid fa-book", bg: "linear-gradient(135deg, #f59e0b, #d97706)" },
      Sports: { icon: "fa-solid fa-medal", bg: "linear-gradient(135deg, #10b981, #06b6d4)" },
      Musical: { icon: "fa-solid fa-music", bg: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
      Event: { icon: "fa-solid fa-star", bg: "linear-gradient(135deg, #06b6d4, #8b5cf6)" },
      Other: { icon: "fa-solid fa-box", bg: "linear-gradient(135deg, #64748b, #475569)" },
    };
    return catMap[resource.category] || { icon: "fa-solid fa-box", bg: "linear-gradient(135deg, #64748b, #475569)" };
  };
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const myResources = allResources.filter(r => r.owner === currentUser.id);
  const filtered = filter === "all" ? myResources : myResources.filter(r => {
    if (filter === "available") return r.availability === "Available" && r.isApproved && r.isPublic !== false;
    if (filter === "borrowed") return r.availability === "Borrowed";
    if (filter === "pending") return !r.isApproved;
    if (filter === "private") return r.isPublic === false;
    if (filter === "flagged") return r.isFlagged;
    return true;
  });

  const stats = {
    total: myResources.length,
    available: myResources.filter(r => r.availability === "Available" && r.isApproved && r.isPublic !== false).length,
    borrowed: myResources.filter(r => r.availability === "Borrowed").length,
    pending: myResources.filter(r => !r.isApproved).length,
    privates: myResources.filter(r => r.isPublic === false).length,
  };

  const openEdit = (resource) => {
    setEditing(resource);
    setEditForm({ name: resource.name, dailyRate: resource.dailyRate, securityDeposit: resource.securityDeposit, location: resource.location, coordinates: resource.coordinates, condition: resource.condition });
  };

  const handleUpdate = () => {
    updateResource(editing.id, editForm);
    setEditing(null);
  };

  const getExchangeForResource = (resourceId) => allExchanges.find(e => e.resourceId === resourceId && e.status === "Borrowed");

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My <em>listings</em></h1>
        <p className="page-subtitle">All items you’ve listed for the campus — pinpointed, managed, and tracked. {myResources.length} total.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Total", value: stats.total, icon: "fa-solid fa-box", color: "var(--primary)" },
          { label: "Available", value: stats.available, icon: "fa-solid fa-circle-check", color: "var(--success)" },
          { label: "Borrowed", value: stats.borrowed, icon: "fa-solid fa-arrow-right-arrow-left", color: "var(--warning)" },
          { label: "Private", value: stats.privates, icon: "fa-solid fa-eye-slash", color: "var(--text-muted)" },
          { label: "Pending", value: stats.pending, icon: "fa-regular fa-clock", color: "var(--text-muted)" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}><i className={s.icon}></i></div>
            <div><div style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, lineHeight: 1 }}>{s.value}</div><div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="tabs" style={{ marginBottom: 14 }}>
        {[
          { k: "all", l: `All (${stats.total})` },
          { k: "available", l: `Available (${stats.available})` },
          { k: "private", l: `Private (${stats.privates})` },
          { k: "borrowed", l: `Borrowed (${stats.borrowed})` },
          { k: "pending", l: `Pending (${stats.pending})` },
        ].map(t => (
          <button key={t.k} className={`tab ${filter === t.k ? "active" : ""}`} onClick={() => setFilter(t.k)}>{t.l}</button>
        ))}
        <Link to="/list" className="btn btn-primary btn-sm" style={{ marginLeft: "auto", borderRadius: "999px" }}><i className="fa-solid fa-plus"></i> List new</Link>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="fa-solid fa-box-open"></i></div>
          <h3 className="empty-state-title">No listings in {filter}</h3>
          <p className="empty-state-text">List your first item — it takes 60 seconds and appears after admin approval.</p>
          <Link to="/list" className="btn btn-primary" style={{ marginTop: 12 }}><i className="fa-solid fa-plus"></i> List an item</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((r, i) => {
            const exchange = getExchangeForResource(r.id);
            return (
              <motion.div key={r.id} className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} style={{ overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 320px", gap: 0 }}>
                  {(() => { const hasUploaded = r.images?.[0]?.startsWith("data:"); const v = getCardVisual(r); return hasUploaded ? <img src={r.images[0]} alt={r.name} style={{ width: "180px", minHeight: 180, objectFit: "cover" }} /> : <div style={{ background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}><i className={v.icon} style={{ fontSize: 48, color: 'white' }}></i></div>; })()}
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span className="badge badge-neutral">{r.category}</span>
                      <span className="badge badge-primary">{r.condition}</span>
                      <span className={`badge ${r.isApproved ? "badge-success" : "badge-warning"}`}>{r.isApproved ? "Approved" : "Pending approval"}</span>
                      <span className={`badge ${r.availability === "Available" ? "badge-success" : "badge-warning"}`}>{r.availability}</span>
                      <span className={`badge ${r.isPublic===false ? "badge-danger" : "badge-success"}`}><i className={`fa-solid ${r.isPublic===false ? "fa-eye-slash" : "fa-eye"}`}></i> {r.isPublic===false ? "Private" : "Public"}</span>
                      {r.isFlagged && <span className="badge badge-danger"><i className="fa-solid fa-flag"></i> Flagged</span>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.description}</div>
                    <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--primary)" }}>₹{r.dailyRate}/day</span>
                      <span style={{ color: "var(--text-muted)" }}><i className="fa-solid fa-eye"></i> {r.totalBorrows} borrows</span>
                      <span style={{ color: "var(--text-muted)" }}><i className="fa-solid fa-star" style={{ color: "var(--warning)" }}></i> {r.rating || "New"}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", gap: 6, alignItems: "center" }}>
                      <i className="fa-solid fa-location-dot" style={{ color: "var(--primary)" }}></i> {r.location}
                      <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-muted)" }}>• {r.distance} • {r.coordinates?.lat.toFixed(4)}, {r.coordinates?.lng.toFixed(4)}</span>
                    </div>
                    {exchange && (
                      <div style={{ background: "rgba(217,166,121,0.10)", border: "1px solid rgba(217,166,121,0.18)", borderRadius: 10, padding: "8px 10px", fontSize: 12 }}>
                        <i className="fa-solid fa-arrow-right-arrow-left" style={{ color: "var(--warning)", marginRight: 6 }}></i>Currently borrowed • Exchange #{exchange.id} • Due {exchange.endDate}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                      <button onClick={() => toggleAvailability(r.id)} className={`btn btn-sm ${r.availability === "Available" ? "btn-secondary" : "btn-success"}`} style={{ borderRadius: 999 }}>
                        <i className={`fa-solid ${r.availability === "Available" ? "fa-pause" : "fa-play"}`}></i> {r.availability === "Available" ? "Mark borrowed" : "Mark available"}
                      </button>
                      <button onClick={() => togglePublic(r.id)} className={`btn btn-sm ${r.isPublic===false ? "btn-primary" : "btn-secondary"}`} style={{ borderRadius: 999 }} title={r.isPublic===false ? "Make public — visible in Discover" : "Make private — hidden from Discover"}>
                        <i className={`fa-solid ${r.isPublic===false ? "fa-eye" : "fa-eye-slash"}`}></i> {r.isPublic===false ? "Make public" : "Make private"}
                      </button>
                      <button onClick={() => openEdit(r)} className="btn btn-secondary btn-sm" style={{ borderRadius: 999 }}><i className="fa-solid fa-pen"></i> Edit pinpoint</button>
                      <Link to={`/resource/${r.id}`} className="btn btn-ghost btn-sm" style={{ borderRadius: 999, border: "1px solid var(--border)" }}><i className="fa-solid fa-eye"></i> View</Link>
                      <button onClick={() => { if (window.confirm(`Delete "${r.name}"? This will revoke it for everyone.`)) deleteResource(r.id); }} className="btn btn-ghost btn-sm" style={{ borderRadius: 999, color: "var(--danger)" }}><i className="fa-regular fa-trash-can"></i> Delete</button>
                    </div>
                  </div>
                  <div style={{ padding: 12, background: "var(--bg-surface)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", display: "flex", gap: 6, alignItems: "center" }}>
                      <i className="fa-solid fa-map-location-dot" style={{ color: "var(--primary)" }}></i> Pinpoint
                    </div>
                    <LocationMap lat={r.coordinates?.lat} lng={r.coordinates?.lng} locationLabel={r.location} height="150px" zoom={16} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <span className="badge badge-neutral" style={{ fontFamily: "JetBrains Mono, monospace" }}><i className="fa-solid fa-location-crosshairs"></i> {r.distance} from you</span>
                      <span className="badge badge-primary"><i className="fa-solid fa-shield-halved"></i> Deposit ₹{r.securityDeposit}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)}>
            <motion.div className="modal" initial={{ scale: 0.97, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 8 }} onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
              <div className="modal-header"><h3 className="modal-title">Edit listing & pinpoint</h3><button className="modal-close" onClick={() => setEditing(null)}><i className="fa-solid fa-xmark"></i></button></div>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Item name</label>
                  <input className="form-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Daily rate (₹)</label><input type="number" className="form-input" value={editForm.dailyRate} onChange={e => setEditForm({ ...editForm, dailyRate: parseInt(e.target.value)||0 })} /></div>
                  <div className="form-group" style={{ marginBottom: 0 }}><label className="form-label">Deposit (₹)</label><input type="number" className="form-input" value={editForm.securityDeposit} onChange={e => setEditForm({ ...editForm, securityDeposit: parseInt(e.target.value)||0 })} /></div>
                </div>
                <div>
                  <label className="form-label"><i className="fa-solid fa-location-dot"></i> Location pinpoint</label>
                  <LocationPicker value={editForm} onChange={({ location, coordinates }) => setEditForm({ ...editForm, location, coordinates })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdate}><i className="fa-solid fa-check"></i> Save changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyListingsPage;
