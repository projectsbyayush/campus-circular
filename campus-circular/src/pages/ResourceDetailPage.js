import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allResources, allUsers, currentUser, initiateExchange } = useApp();
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [duration, setDuration] = useState(24);

  const resource = allResources.find((r) => r.id === parseInt(id));
  if (!resource) return <div className="page"><div className="empty-state"><div className="empty-icon"><i className="fa-solid fa-box-open"></i></div><h3>Resource not found</h3></div></div>;

  const owner = allUsers.find((u) => u.id === resource.owner);
  const days = Math.ceil(duration / 24) || 1;
  const borrowingCharge = resource.dailyRate * days;
  const platformFee = Math.round(borrowingCharge * (resource.platformFeePercent / 100));
  const totalAmount = borrowingCharge + platformFee + resource.securityDeposit;

  const handleBorrow = () => {
    const exchange = initiateExchange(resource.id, duration);
    if (exchange) {
      setShowBorrowModal(false);
      navigate(`/exchange/${exchange.id}`);
    }
  };

  const conditionItems = resource.conditionBefore ? Object.entries(resource.conditionBefore) : [];

  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: "18px" }}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 0.9fr", gap: "28px" }}>
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ position: "relative", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: "20px", border: '1px solid var(--border)' }}>
              <img src={resource.images[0]} alt={resource.name} style={{ width: "100%", height: "420px", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: "14px", left: "14px", display: "flex", gap: "8px" }}>
                <span className="badge badge-neutral" style={{ background: 'rgba(15,14,13,0.8)', backdropFilter: 'blur(8px)', color: 'white', borderColor: 'rgba(255,255,255,0.12)' }}>{resource.category}</span>
                <span className="badge badge-primary">{resource.condition}</span>
              </div>
              <div style={{ position: "absolute", top: "14px", right: "14px", padding: "6px 12px", borderRadius: "999px", background: resource.availability === "Available" ? "var(--success)" : "var(--danger)", color: "white", fontSize: "12px", fontWeight: "600", display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className={`fa-solid ${resource.availability === "Available" ? "fa-circle-check" : "fa-circle-xmark"}`} style={{ fontSize: '11px' }}></i> {resource.availability}
              </div>
            </div>

            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: "30px", fontWeight: 400, marginBottom: "10px", letterSpacing: '-0.02em' }}>{resource.name}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>{resource.description}</p>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "10px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-puzzle-piece" style={{ marginRight: '6px' }}></i>Included accessories</h3>
              {resource.accessories.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {resource.accessories.map((acc, i) => (
                    <span key={i} className="badge badge-neutral"><i className="fa-solid fa-check" style={{ fontSize: '10px' }}></i> {acc}</span>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No accessories included</p>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "10px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-clipboard-check" style={{ marginRight: '6px' }}></i>Condition before lending</h3>
              <div className="condition-grid">
                {conditionItems.map(([key, value]) => (
                  <div key={key} className="condition-item">
                    <span className="condition-label"><i className="fa-regular fa-circle-check" style={{ marginRight: '6px', color: 'var(--success)' }}></i>{key}</span>
                    <span className="condition-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "10px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '6px' }}></i>History</h3>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px", display: 'flex', justifyContent: 'space-between' }}>
                <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total borrows</div><div style={{ fontWeight: 600, marginTop: '2px' }}>{resource.totalBorrows}</div></div>
                <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Listed since</div><div style={{ fontWeight: 600, marginTop: '2px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>{resource.createdAt}</div></div>
                <div><div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rating</div><div style={{ fontWeight: 700, color: 'var(--warning)', marginTop: '2px' }}><i className="fa-solid fa-star"></i> {resource.rating}</div></div>
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} style={{ position: "sticky", top: "84px" }}>
            <div className="card" style={{ padding: "20px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: "26px", fontWeight: 700, color: "var(--primary)" }}>
                    ₹{resource.dailyRate}<span style={{ fontSize: "12px", fontWeight: 400, color: "var(--text-muted)" }}>/day</span>
                  </div>
                  {resource.hourlyRate > 0 && <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>₹{resource.hourlyRate}/hour</div>}
                </div>
                <div className="resource-rating" style={{ fontSize: "13px" }}><i className="fa-solid fa-star"></i> {resource.rating}</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px', marginBottom: "16px", display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}><i className="fa-solid fa-lock"></i> Deposit</span><span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>₹{resource.securityDeposit}</span>
                <span style={{ color: 'var(--text-muted)' }}><i className="fa-solid fa-percent"></i> Fee</span><span style={{ fontWeight: 600 }}>{resource.platformFeePercent}%</span>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label"><i className="fa-regular fa-clock"></i> Duration — {days} day(s)</label>
                <input type="range" min="1" max="168" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} style={{ width: "100%", accentColor: 'var(--primary)', marginBottom: "6px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>
                  <span>1h</span><span>7 days</span>
                </div>
              </div>

              <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", padding: "14px", marginBottom: "16px", border: '1px solid var(--border)' }}>
                <div className="agreement-row" style={{ padding: '8px 0' }}><span className="agreement-label">Borrowing</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{borrowingCharge}</span></div>
                <div className="agreement-row" style={{ padding: '8px 0' }}><span className="agreement-label">Platform fee</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{platformFee}</span></div>
                <div className="agreement-row" style={{ padding: '8px 0' }}><span className="agreement-label">Security deposit</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{resource.securityDeposit}</span></div>
                <div className="agreement-row" style={{ borderTop: "1px solid var(--border)", marginTop: "6px", paddingTop: "10px" }}>
                  <span className="agreement-label" style={{ fontWeight: 600, color: "var(--text)" }}>Total</span>
                  <span className="agreement-value agreement-total">₹{totalAmount}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>Deposit refundable on safe return</div>
              </div>

              {resource.availability === "Available" ? (
                <button className="btn btn-primary btn-block btn-lg" onClick={() => setShowBorrowModal(true)}>
                  <i className="fa-solid fa-handshake"></i> Request to borrow
                </button>
              ) : (
                <button className="btn btn-secondary btn-block btn-lg" disabled>
                  <i className="fa-solid fa-ban"></i> Currently unavailable
                </button>
              )}
              <p style={{ fontSize: '11px', color: 'var(--text-faint)', textAlign: 'center', marginTop: '10px' }}>
                <i className="fa-solid fa-shield-halved"></i> Protected by review & deposit
              </p>
            </div>

            <div className="card" style={{ padding: "18px" }}>
              <h4 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Owner</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <img src={owner?.avatar} alt={owner?.name} style={{ width: "44px", height: "44px", borderRadius: "50%", border: '1px solid var(--border)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>{owner?.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{owner?.department} • {owner?.year}</div>
                </div>
                {owner?.verified && <span className="badge badge-success" style={{ marginLeft: 'auto' }}><i className="fa-solid fa-badge-check"></i> Verified</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ textAlign: "center", padding: "10px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: "20px", color: "var(--success)" }}>{owner?.trustScore}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: '0.06em', textTransform: 'uppercase' }}>Trust score</div>
                </div>
                <div style={{ textAlign: "center", padding: "10px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: "20px", color: "var(--primary)" }}>{owner?.successfulExchanges}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: '0.06em', textTransform: 'uppercase' }}>Exchanges</div>
                </div>
              </div>
              <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--text-muted)", display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-location-dot"></i> {resource.location} • {resource.distance} away
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showBorrowModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBorrowModal(false)}>
            <motion.div className="modal" initial={{ scale: 0.97, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.97, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Confirm borrowing <em style={{ fontStyle: 'italic', color: 'var(--primary)', fontWeight: 400 }}>agreement</em></h3>
                <button className="modal-close" onClick={() => setShowBorrowModal(false)}><i className="fa-solid fa-xmark"></i></button>
              </div>
              <div className="modal-body">
                <div className="agreement-box">
                  <div className="agreement-row"><span className="agreement-label">Resource</span><span className="agreement-value">{resource.name}</span></div>
                  <div className="agreement-row"><span className="agreement-label">Owner</span><span className="agreement-value">{owner?.name}</span></div>
                  <div className="agreement-row"><span className="agreement-label">Borrower</span><span className="agreement-value">{currentUser.name}</span></div>
                  <div className="agreement-row"><span className="agreement-label">Duration</span><span className="agreement-value">{days} day(s) • {duration}h</span></div>
                  <div className="agreement-row"><span className="agreement-label">Return deadline</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{new Date(Date.now() + duration * 60 * 60 * 1000).toLocaleDateString()}</span></div>
                  <div className="agreement-row"><span className="agreement-label">Condition</span><span className="agreement-value">{resource.condition}</span></div>
                  <div className="agreement-row"><span className="agreement-label">Borrowing charge</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{borrowingCharge}</span></div>
                  <div className="agreement-row"><span className="agreement-label">Platform fee</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{platformFee}</span></div>
                  <div className="agreement-row"><span className="agreement-label">Security deposit</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{resource.securityDeposit}</span></div>
                  <div className="agreement-row" style={{ borderTop: "1px solid var(--border)", marginTop: "6px", paddingTop: "12px" }}>
                    <span className="agreement-label" style={{ fontWeight: 600, color: "var(--text)" }}>Total due now</span>
                    <span className="agreement-value agreement-total">₹{totalAmount}</span>
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "14px", lineHeight: "1.6" }}>
                  <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary)', marginRight: '4px' }}></i>
                  By confirming, you agree to return the item in the same condition by the deadline. Late returns incur fees. Damage is assessed against your deposit.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowBorrowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleBorrow}><i className="fa-solid fa-check"></i> Confirm agreement</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourceDetailPage;
