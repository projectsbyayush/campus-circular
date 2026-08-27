import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const ProfilePage = () => {
  const { currentUser, allExchanges, allResources } = useApp();
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
  const userResources = allResources.filter((r) => r.owner === currentUser.id);
  const userExchanges = allExchanges.filter((e) => e.borrowerId === currentUser.id || e.ownerId === currentUser.id);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Your <em>profile</em></h1>
        <p className="page-subtitle">Trust, history, and impact at a glance.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px" }}>
        <div>
          <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "24px", textAlign: "center" }}>
            <img src={currentUser.avatar} alt={currentUser.name} style={{ width: "88px", height: "88px", borderRadius: "50%", marginBottom: "14px", border: '2px solid var(--border)' }} />
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: "22px", fontWeight: 400, marginBottom: "4px" }}>{currentUser.name}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "2px" }}>{currentUser.department} • {currentUser.year}</p>
            <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "14px", lineHeight: 1.5 }}>{currentUser.bio}</p>
            {currentUser.verified && <span className="badge badge-success" style={{ marginBottom: "16px" }}><i className="fa-solid fa-badge-check"></i> Verified campus member</span>}

            <div className="trust-ring" style={{ margin: "0 auto 8px", background: "var(--gradient-1)" }}>
              <span>{currentUser.trustScore}</span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '18px' }}>Trust score</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div style={{ textAlign: "center", padding: "12px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: "18px", fontWeight: 700, color: "var(--success)" }}>{currentUser.successfulExchanges}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: '0.06em', textTransform: 'uppercase' }}>Exchanges</div>
              </div>
              <div style={{ textAlign: "center", padding: "12px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: "18px", fontWeight: 700, color: "var(--primary)" }}>{currentUser.ratings}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: '0.06em', textTransform: 'uppercase' }}>Rating</div>
              </div>
              <div style={{ textAlign: "center", padding: "12px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: "18px", fontWeight: 700, color: "var(--warning)" }}>{currentUser.lateReturns}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: '0.06em', textTransform: 'uppercase' }}>Late returns</div>
              </div>
              <div style={{ textAlign: "center", padding: "12px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: "18px", fontWeight: 700, color: "var(--danger)" }}>{currentUser.disputes}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: '0.06em', textTransform: 'uppercase' }}>Disputes</div>
              </div>
            </div>

            <div style={{ marginTop: "18px", textAlign: "left", background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', padding: '14px', border: '1px solid var(--border)' }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: '13px' }}>
                <span style={{ color: "var(--text-muted)" }}><i className="fa-solid fa-phone" style={{ width: '14px' }}></i> Phone</span><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>{currentUser.phone}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: '13px' }}>
                <span style={{ color: "var(--text-muted)" }}><i className="fa-regular fa-envelope" style={{ width: '14px' }}></i> Email</span><span style={{ fontSize: '12px' }}>{currentUser.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: '13px' }}>
                <span style={{ color: "var(--text-muted)" }}><i className="fa-regular fa-calendar" style={{ width: '14px' }}></i> Member since</span><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>{currentUser.joinDate}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: "18px", fontWeight: 400 }}>Your listings <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>({userResources.length})</span></h3>
              <Link to="/my-listings" className="btn btn-primary btn-sm" style={{ borderRadius: "999px" }}><i className="fa-solid fa-box"></i> Manage listings</Link>
            </div>
            {userResources.length === 0 ? (
              <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                <i className="fa-solid fa-box-open" style={{ fontSize: '18px', marginBottom: '8px', display: 'block' }}></i>
                No listings yet — list your first item to start earning trust.
              </div>
            ) : (
              <div className="grid grid-2">
                {userResources.map((r) => {
                  const v = getCardVisual(r);
                  const hasUploaded = r.images?.[0] && r.images[0].trim() !== "";
                  return (
                  <Link to={`/resource/${r.id}`} key={r.id} style={{ textDecoration: "none" }}>
                    <div className="card" style={{ display: "flex", overflow: "hidden" }}>
                      {hasUploaded ? <img src={r.images[0]} alt={r.name} style={{ width: "110px", height: "110px", objectFit: "cover", flexShrink: 0 }} /> : <div style={{ width: "110px", height: "110px", background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className={v.icon} style={{ fontSize: 28, color: "white" }}></i></div>}
                      <div style={{ padding: "12px", flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: "4px" }}>{r.name}</div>
                        <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                          <span className="badge badge-neutral" style={{ fontSize: "10px" }}>{r.category}</span>
                          <span className={`badge ${r.availability === "Available" ? "badge-success" : "badge-warning"}`} style={{ fontSize: "10px" }}>{r.availability}</span>
                          <span className={`badge ${r.isPublic===false ? "badge-danger" : "badge-success"}`} style={{ fontSize: "10px" }}><i className={`fa-solid ${r.isPublic===false ? "fa-eye-slash" : "fa-eye"}`}></i> {r.isPublic===false ? "Private" : "Public"}</span>
                          {!r.isApproved && <span className="badge badge-warning" style={{ fontSize: "10px" }}>Pending</span>}
                        </div>
                        <div style={{ fontWeight: 700, color: "var(--primary)", fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>₹{r.dailyRate}/day • <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>{r.location}</span></div>
                      </div>
                    </div>
                  </Link>
                )})}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: "18px", fontWeight: 400, marginBottom: "12px" }}>Recent exchanges</h3>
            {userExchanges.length === 0 ? (
              <div className="empty-state" style={{ padding: "32px" }}>
                <div className="empty-icon"><i className="fa-solid fa-arrow-right-arrow-left"></i></div>
                <h3 className="empty-state-title">No exchanges yet</h3>
                <p className="empty-state-text">Start by exploring available resources</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {userExchanges.slice(0, 5).map((e) => {
                  const resource = allResources.find((r) => r.id === e.resourceId);
                  return (
                    <div key={e.id} className="card" style={{ padding: "14px 16px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "13px" }}>{resource?.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>{e.startDate} → {e.endDate}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className={`badge ${e.status === "Returned" ? "badge-success" : e.status === "Borrowed" ? "badge-warning" : "badge-neutral"}`}>{e.status}</span>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)", marginTop: "4px", fontFamily: 'JetBrains Mono, monospace' }}>₹{e.totalAmount}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: "18px", fontWeight: 400, marginBottom: "12px" }}>Community impact</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <div className="stat-card" style={{ textAlign: 'center', padding: '18px' }}>
                <div className="stat-icon" style={{ margin: '0 auto 10px', background: 'rgba(217,119,87,0.1)', color: 'var(--primary)', border: 'none' }}><i className="fa-solid fa-piggy-bank"></i></div>
                <div className="stat-value" style={{ fontSize: '22px' }}>₹{(currentUser.moneySaved / 1000).toFixed(1)}K</div>
                <div className="stat-label">Money saved</div>
              </div>
              <div className="stat-card" style={{ textAlign: 'center', padding: '18px' }}>
                <div className="stat-icon" style={{ margin: '0 auto 10px', background: 'rgba(107,142,127,0.1)', color: 'var(--secondary)', border: 'none' }}><i className="fa-solid fa-box"></i></div>
                <div className="stat-value" style={{ fontSize: '22px' }}>{currentUser.totalShared}</div>
                <div className="stat-label">Items shared</div>
              </div>
              <div className="stat-card" style={{ textAlign: 'center', padding: '18px' }}>
                <div className="stat-icon" style={{ margin: '0 auto 10px', background: 'rgba(123,163,126,0.12)', color: 'var(--success)', border: 'none' }}><i className="fa-solid fa-leaf"></i></div>
                <div className="stat-value" style={{ fontSize: '22px' }}>{(currentUser.successfulExchanges * 2.6).toFixed(1)}kg</div>
                <div className="stat-label">CO₂ saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
