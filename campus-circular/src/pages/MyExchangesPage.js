import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const MyExchangesPage = () => {
  const { allExchanges, allResources, currentUser, revokeExchange, cancelExchange, deleteExchange } = useApp();
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
    if (resource && byName[resource.name]) return byName[resource.name];
    const catMap = {
      Cameras: { icon: "fa-solid fa-camera", bg: "linear-gradient(135deg, #ec4899, #8b5cf6)" },
      Electronics: { icon: "fa-solid fa-microchip", bg: "linear-gradient(135deg, #6366f1, #06b6d4)" },
      Textbooks: { icon: "fa-solid fa-book", bg: "linear-gradient(135deg, #f59e0b, #d97706)" },
      Sports: { icon: "fa-solid fa-medal", bg: "linear-gradient(135deg, #10b981, #06b6d4)" },
      Musical: { icon: "fa-solid fa-music", bg: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
      Event: { icon: "fa-solid fa-star", bg: "linear-gradient(135deg, #06b6d4, #8b5cf6)" },
      Other: { icon: "fa-solid fa-box", bg: "linear-gradient(135deg, #64748b, #475569)" },
    };
    return catMap[resource?.category] || { icon: "fa-solid fa-box", bg: "linear-gradient(135deg, #64748b, #475569)" };
  };
  const [activeTab, setActiveTab] = useState("all");
  const [section, setSection] = useState("all"); // all | borrowing | lending

  const borrowing = allExchanges.filter(e => e.borrowerId === currentUser.id);
  const lending = allExchanges.filter(e => e.ownerId === currentUser.id);
  const myExchanges = section === "borrowing" ? borrowing : section === "lending" ? lending : [...borrowing, ...lending];
  const filteredExchanges = activeTab === "all" ? myExchanges : myExchanges.filter(e => e.status.toLowerCase().includes(activeTab.toLowerCase()));

  const tabs = [
    { key: "all", label: "All", icon: "fa-solid fa-layer-group" },
    { key: "requested", label: "Requested", icon: "fa-solid fa-paper-plane" },
    { key: "accepted", label: "Accepted", icon: "fa-solid fa-check" },
    { key: "borrowed", label: "Borrowed", icon: "fa-solid fa-arrow-right-arrow-left" },
    { key: "returned", label: "Returned", icon: "fa-solid fa-rotate-left" },
  ];

  const renderCard = (exchange, i) => {
    const resource = allResources.find(r => r.id === exchange.resourceId);
    const v = getCardVisual(resource);
    const isBorrower = exchange.borrowerId === currentUser.id;
    const isOwner = exchange.ownerId === currentUser.id;
    const lateFee = exchange.status === "Returned" && exchange.returnDate > exchange.endDate ? Math.ceil((new Date(exchange.returnDate) - new Date(exchange.endDate)) / (1000 * 60 * 60 * 24)) * 50 : 0;
    const canDelete = isOwner; // borrower cannot delete — enforced in AppContext too
    return (
      <motion.div key={exchange.id} className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "start" }}>
          {resource?.images?.[0] && resource.images[0].trim() !== "" ? <img src={resource.images[0]} alt={resource.name} style={{ width: "96px", height: "96px", borderRadius: "var(--radius-sm)", objectFit: "cover", flexShrink: 0, border: '1px solid var(--border)' }} /> : <div style={{ width: "96px", height: "96px", borderRadius: "var(--radius-sm)", background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: '1px solid var(--border)' }}><i className={v.icon} style={{ fontSize: 28, color: "white" }}></i></div>}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "6px" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>{resource?.name}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>
                  <i className={`fa-solid ${isBorrower ? 'fa-arrow-down' : 'fa-arrow-up'}`} style={{ marginRight: '4px' }}></i>{isBorrower ? "Borrowing" : "Lending"} • #{exchange.id} • <span style={{ color: isBorrower ? "#2563EB" : "#059669" }}>{isBorrower ? "You borrowed" : "You lent"}</span>
                </div>
              </div>
              <span className={`badge ${exchange.status === "Returned" || exchange.status === "Rated" ? "badge-success" : exchange.status === "Borrowed" ? "badge-warning" : exchange.status === "Requested" ? "badge-neutral" : "badge-primary"}`}>{exchange.status}</span>
            </div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "10px", fontSize: "12px", color: "var(--text-secondary)", fontFamily: 'JetBrains Mono, monospace' }}>
              <span><i className="fa-regular fa-calendar"></i> {exchange.startDate} → {exchange.endDate}</span>
              {exchange.returnDate && <span><i className="fa-solid fa-rotate-left"></i> {exchange.returnDate}</span>}
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <div style={{ padding: "6px 10px", background: "var(--bg-surface)", borderRadius: "999px", border: '1px solid var(--border)', fontSize: '11px' }}><span style={{ color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '9px' }}>Charge</span> <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.borrowingCharge}</span></div>
              <div style={{ padding: "6px 10px", background: "var(--bg-surface)", borderRadius: "999px", border: '1px solid var(--border)', fontSize: '11px' }}><span style={{ color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '9px' }}>Fee</span> <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.platformFee}</span></div>
              <div style={{ padding: "6px 10px", background: "var(--bg-surface)", borderRadius: "999px", border: '1px solid var(--border)', fontSize: '11px' }}><span style={{ color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '9px' }}>Deposit</span> <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.securityDeposit}</span></div>
              {lateFee > 0 && <div style={{ padding: "6px 10px", background: "rgba(201,122,107,0.12)", borderRadius: "999px", border: '1px solid rgba(201,122,107,0.2)', fontSize: '11px', color: 'var(--danger)' }}><i className="fa-solid fa-triangle-exclamation"></i> ₹{lateFee}</div>}
              <div style={{ padding: "6px 10px", background: "var(--primary-soft)", borderRadius: "999px", border: '1px solid rgba(22,163,74,0.18)', fontSize: '11px' }}><span style={{ color: 'var(--primary)', fontWeight: 600 }}>Total ₹{exchange.totalAmount + lateFee}</span></div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "end" }}>
            <Link to={`/exchange/${exchange.id}`} className="btn btn-secondary btn-sm" style={{ borderRadius: '999px' }}>
              <i className="fa-solid fa-eye"></i> Live
            </Link>
            {isBorrower && exchange.status === "Requested" && (
              <button onClick={() => { if(window.confirm("Revoke this request?")) revokeExchange(exchange.id); }} className="btn btn-ghost btn-sm" style={{ borderRadius: 999, color: "var(--danger)", fontSize: 11, border: "1px solid rgba(201,122,107,0.18)" }}><i className="fa-solid fa-ban"></i> Revoke</button>
            )}
            {!isBorrower && exchange.status === "Requested" && (
              <button onClick={() => { if(window.confirm("Decline this request?")) cancelExchange(exchange.id); }} className="btn btn-ghost btn-sm" style={{ borderRadius: 999, color: "var(--danger)", fontSize: 11, border: "1px solid rgba(201,122,107,0.18)" }}><i className="fa-solid fa-xmark"></i> Decline</button>
            )}
            {canDelete && (exchange.status === "Rated" || exchange.status === "Returned" || exchange.status === "Settlement") && (
              <button onClick={() => { if(window.confirm("Delete this exchange? Only owner can delete.")) deleteExchange(exchange.id); }} className="btn btn-ghost btn-sm" style={{ borderRadius: 999, fontSize: 11 }}><i className="fa-regular fa-trash-can"></i> Delete</button>
            )}
            {isBorrower && !canDelete && (exchange.status === "Rated" || exchange.status === "Returned") && (
              <span style={{ fontSize: 10, color: "var(--text-faint)", textAlign: "center" }}><i className="fa-solid fa-lock"></i> Owner controls delete</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My <em>exchanges</em></h1>
        <p className="page-subtitle">Two sections — <b>Borrowing</b> (you borrowed) and <b>Lending</b> (you lent). Borrower can revoke, only owner can delete.</p>
      </div>

      {/* Two sections toggle */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, background: "var(--bg-surface)", padding: 4, borderRadius: 999, border: "1px solid var(--border)" }}>
          {[
            { k: "all", l: `All (${borrowing.length + lending.length})`, icon: "fa-solid fa-layer-group" },
            { k: "borrowing", l: `Borrowing (${borrowing.length})`, icon: "fa-solid fa-arrow-down" },
            { k: "lending", l: `Lending (${lending.length})`, icon: "fa-solid fa-arrow-up" },
          ].map(s => (
            <button key={s.k} onClick={() => setSection(s.k)} className={`btn btn-sm ${section===s.k?"btn-primary":"btn-ghost"}`} style={{ borderRadius: 999 }}><i className={s.icon}></i> {s.l}</button>
          ))}
        </div>
        <div className="tabs" style={{ marginBottom: 0 }}>
          {tabs.map((tab) => (
            <button key={tab.key} className={`tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
              <i className={tab.icon} style={{ marginRight: '6px', fontSize: '12px' }}></i>{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* If all, show two separate sections */}
      {section === "all" ? (
        <>
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontFamily: "DM Serif Display, serif", fontSize: 16, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}><i className="fa-solid fa-arrow-down" style={{ color: "#2563EB" }}></i> Borrowing <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-muted)" }}>— you borrowed ({borrowing.length}) • you can revoke Requested, cannot delete</span></h3>
            {borrowing.filter(e => activeTab==="all" || e.status.toLowerCase().includes(activeTab.toLowerCase())).length===0 ? <div style={{ padding: 16, background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 13 }}>No borrowing exchanges in this filter.</div> : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{borrowing.filter(e => activeTab==="all" || e.status.toLowerCase().includes(activeTab.toLowerCase())).map((ex,i)=>renderCard(ex,i))}</div>}
          </div>
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontFamily: "DM Serif Display, serif", fontSize: 16, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}><i className="fa-solid fa-arrow-up" style={{ color: "#059669" }}></i> Lending <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "var(--text-muted)" }}>— you lent ({lending.length}) • you control delete & timeline</span></h3>
            {lending.filter(e => activeTab==="all" || e.status.toLowerCase().includes(activeTab.toLowerCase())).length===0 ? <div style={{ padding: 16, background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 13 }}>No lending exchanges in this filter.</div> : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{lending.filter(e => activeTab==="all" || e.status.toLowerCase().includes(activeTab.toLowerCase())).map((ex,i)=>renderCard(ex,i))}</div>}
          </div>
        </>
      ) : (
        filteredExchanges.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><i className="fa-solid fa-arrow-right-arrow-left"></i></div>
            <h3 className="empty-state-title">No exchanges in {section} • {activeTab}</h3>
            <p className="empty-state-text">Start by exploring available resources</p>
            <Link to="/discover" className="btn btn-primary" style={{ marginTop: "16px" }}>
              <i className="fa-solid fa-compass"></i> Explore resources
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredExchanges.map((ex,i)=>renderCard(ex,i))}
          </div>
        )
      )}
    </div>
  );
};

export default MyExchangesPage;
