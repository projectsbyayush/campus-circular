import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const MyExchangesPage = () => {
  const { allExchanges, allResources, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("all");

  const myExchanges = allExchanges.filter((e) => e.borrowerId === currentUser.id || e.ownerId === currentUser.id);
  const filteredExchanges = activeTab === "all" ? myExchanges : myExchanges.filter((e) => e.status.toLowerCase().includes(activeTab.toLowerCase()));

  const tabs = [
    { key: "all", label: "All", icon: "fa-solid fa-layer-group" },
    { key: "requested", label: "Requested", icon: "fa-solid fa-paper-plane" },
    { key: "accepted", label: "Accepted", icon: "fa-solid fa-check" },
    { key: "borrowed", label: "Borrowed", icon: "fa-solid fa-arrow-right-arrow-left" },
    { key: "returned", label: "Returned", icon: "fa-solid fa-rotate-left" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My <em>exchanges</em></h1>
        <p className="page-subtitle">Track every borrowing and lending — from request to settlement.</p>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button key={tab.key} className={`tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            <i className={tab.icon} style={{ marginRight: '6px', fontSize: '12px' }}></i>{tab.label}
          </button>
        ))}
      </div>

      {filteredExchanges.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="fa-solid fa-arrow-right-arrow-left"></i></div>
          <h3 className="empty-state-title">No exchanges found</h3>
          <p className="empty-state-text">Start by exploring available resources</p>
          <Link to="/discover" className="btn btn-primary" style={{ marginTop: "16px" }}>
            <i className="fa-solid fa-compass"></i> Explore resources
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredExchanges.map((exchange, i) => {
            const resource = allResources.find((r) => r.id === exchange.resourceId);
            const isBorrower = exchange.borrowerId === currentUser.id;
            const lateFee = exchange.status === "Returned" && exchange.returnDate > exchange.endDate ? Math.ceil((new Date(exchange.returnDate) - new Date(exchange.endDate)) / (1000 * 60 * 60 * 24)) * 50 : 0;
            return (
              <motion.div key={exchange.id} className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "start" }}>
                  <img src={resource?.images[0]} alt={resource?.name} style={{ width: "96px", height: "96px", borderRadius: "var(--radius-sm)", objectFit: "cover", border: '1px solid var(--border)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "6px" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>{resource?.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>
                          <i className={`fa-solid ${isBorrower ? 'fa-arrow-down' : 'fa-arrow-up'}`} style={{ marginRight: '4px' }}></i>{isBorrower ? "Borrowing" : "Lending"} • #{exchange.id}
                        </div>
                      </div>
                      <span className={`badge ${exchange.status === "Returned" ? "badge-success" : exchange.status === "Borrowed" ? "badge-warning" : exchange.status === "Requested" ? "badge-neutral" : "badge-primary"}`}>{exchange.status}</span>
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
                      <div style={{ padding: "6px 10px", background: "var(--primary-soft)", borderRadius: "999px", border: '1px solid rgba(217,119,87,0.18)', fontSize: '11px' }}><span style={{ color: 'var(--primary)', fontWeight: 600 }}>Total ₹{exchange.totalAmount + lateFee}</span></div>
                    </div>
                  </div>
                  <Link to={`/exchange/${exchange.id}`} className="btn btn-secondary btn-sm" style={{ borderRadius: '999px' }}>
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyExchangesPage;
