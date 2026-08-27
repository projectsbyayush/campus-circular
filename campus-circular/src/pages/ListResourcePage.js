import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { categories } from "../data/mockData";
import LocationPicker from "../components/LocationPicker";

const ListResourcePage = () => {
  const navigate = useNavigate();
  const { addResource } = useApp();
  const [form, setForm] = useState({ name: "", category: "", description: "", condition: "Good", location: "", coordinates: { lat: 28.5445, lng: 77.1925 }, hourlyRate: "", dailyRate: "", minCharge: "", securityDeposit: "", platformFeePercent: 5, accessories: "", images: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large. Max 2MB for demo storage.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setImagePreview(dataUrl);
      setForm(prev => ({ ...prev, images: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview("");
    setForm(prev => ({ ...prev, images: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.location || !form.coordinates) return;
    // simple distance from campus center 28.5445,77.1925
    const dLat = form.coordinates.lat - 28.5445;
    const dLng = form.coordinates.lng - 77.1925;
    const distKm = Math.sqrt(dLat*dLat + dLng*dLng) * 111;
    const distance = `${distKm.toFixed(1)} km`;
    const resource = {
      ...form,
      distance,
      hourlyRate: parseInt(form.hourlyRate) || 0,
      dailyRate: parseInt(form.dailyRate) || 0,
      minCharge: parseInt(form.minCharge) || 0,
      securityDeposit: parseInt(form.securityDeposit) || 0,
      platformFeePercent: parseInt(form.platformFeePercent) || 5,
      accessories: form.accessories.split(",").map((a) => a.trim()).filter(Boolean),
      images: form.images ? [form.images] : ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400"],
      availability: "Available",
      trustLevel: "New",
    };
    addResource(resource);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '22px', margin: '0 auto 16px' }}>
            <i className="fa-solid fa-check"></i>
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: "26px", fontWeight: 400, marginBottom: "8px" }}>Listed for <em style={{ fontStyle: 'italic', color: 'var(--primary)' }}>review</em></h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: '14px', lineHeight: 1.6 }}>Your resource is pending admin approval. You'll be notified once it's live — usually within a few hours.</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={() => navigate("/discover")}><i className="fa-solid fa-compass"></i> Browse resources</button>
            <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ name: "", category: "", description: "", condition: "Good", location: "", coordinates: { lat: 28.5445, lng: 77.1925 }, hourlyRate: "", dailyRate: "", minCharge: "", securityDeposit: "", platformFeePercent: 5, accessories: "", images: "" }); }}><i className="fa-solid fa-plus"></i> List another</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header" style={{ maxWidth: '700px', margin: '0 auto 28px' }}>
        <h1 className="page-title">List a <em>resource</em></h1>
        <p className="page-subtitle">Share what you own — earn trust, reduce waste, and help your campus.</p>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "18px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-regular fa-file-lines" style={{ marginRight: '6px' }}></i>Basic information</h3>

            <div className="form-group">
              <label className="form-label">Resource name *</label>
              <input type="text" name="name" className="form-input" placeholder="e.g., Canon EOS 1500D DSLR Camera" value={form.name} onChange={handleChange} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" className="form-select" value={form.category} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select name="condition" className="form-select" value={form.condition} onChange={handleChange}>
                  <option value="New">New</option><option value="Excellent">Excellent</option><option value="Good">Good</option><option value="Fair">Fair</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea name="description" className="form-textarea" placeholder="Features, ideal use cases, any quirks..." value={form.description} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label"><i className="fa-solid fa-map-location-dot"></i> Pinpoint location *</label>
              <LocationPicker value={form} onChange={({ location, coordinates }) => setForm({ ...form, location, coordinates })} />
              {!form.location && <p style={{ fontSize: 11, color: "var(--danger)", marginTop: 6 }}>Location is required — click on map or pick a preset.</p>}
            </div>

            <div className="form-group">
              <label className="form-label"><i className="fa-solid fa-image" style={{ marginRight: 6 }}></i>Item photo — upload or paste URL</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <label className="btn btn-secondary btn-sm" style={{ borderRadius: 999, cursor: "pointer", border: "1px solid var(--border)" }}>
                  <i className="fa-solid fa-upload"></i> Upload image
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                </label>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>or paste URL below • Max 2MB • Stored locally for demo</span>
                {imagePreview && <button type="button" className="btn btn-ghost btn-sm" onClick={clearImage} style={{ color: "var(--danger)", fontSize: 11 }}><i className="fa-solid fa-xmark"></i> Clear</button>}
              </div>
              {(imagePreview || form.images) && (
                <div style={{ marginBottom: 10, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", height: 160, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <img src={imagePreview || form.images} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={(e) => e.target.style.display = 'none'} />
                  <span style={{ position: "absolute", top: 8, left: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 999, padding: "4px 8px", fontSize: 11, display: "flex", gap: 6, alignItems: "center" }}><i className="fa-solid fa-eye" style={{ color: "var(--success)" }}></i> Preview</span>
                </div>
              )}
              <input type="url" name="images" className="form-input" placeholder="https://...  (or upload above — upload takes priority)" value={form.images.startsWith("data:") ? "" : form.images} onChange={(e) => { setImagePreview(""); setForm({ ...form, images: e.target.value }); }} />
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}><i className="fa-solid fa-circle-info"></i> Upload is stored as data URL in browser (frontend-only demo). If no photo, card shows a Font Awesome category icon.</p>
            </div>
          </div>

          <div className="card" style={{ padding: "24px", marginTop: "16px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "18px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-indian-rupee-sign" style={{ marginRight: '6px' }}></i>Pricing & deposit</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="form-group"><label className="form-label">Hourly rate (₹)</label><input type="number" name="hourlyRate" className="form-input" placeholder="0" value={form.hourlyRate} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Daily rate (₹) *</label><input type="number" name="dailyRate" className="form-input" placeholder="0" value={form.dailyRate} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">Minimum charge (₹)</label><input type="number" name="minCharge" className="form-input" placeholder="0" value={form.minCharge} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Security deposit (₹) *</label><input type="number" name="securityDeposit" className="form-input" placeholder="0" value={form.securityDeposit} onChange={handleChange} required /></div>
            </div>

            <div className="form-group">
              <label className="form-label">Platform fee (%)</label>
              <input type="number" name="platformFeePercent" className="form-input" value={form.platformFeePercent} onChange={handleChange} min="0" max="20" />
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>Default 5% — shown transparently as Borrowing + Platform fee + Deposit.</p>
            </div>

            <div className="form-group">
              <label className="form-label">Accessories (comma-separated)</label>
              <input type="text" name="accessories" className="form-input" placeholder="e.g., Charger, Bag, Extra Battery" value={form.accessories} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginTop: "18px", display: "flex", gap: "10px" }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i> Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px 18px', fontSize: '13px' }}><i className="fa-solid fa-box-open"></i> List resource</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListResourcePage;
