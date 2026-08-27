import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

const ExchangePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allExchanges, allResources, allUsers, currentUser, confirmAgreement, updateExchangeStatus, raiseDispute } = useApp();
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  const exchange = allExchanges.find((e) => e.id === parseInt(id));
  if (!exchange) return <div className="page"><div className="empty-state"><div className="empty-icon"><i className="fa-solid fa-triangle-exclamation"></i></div><h3>Exchange not found</h3></div></div>;

  const resource = allResources.find((r) => r.id === exchange.resourceId);
  const borrower = allUsers.find((u) => u.id === exchange.borrowerId);
  const owner = allUsers.find((u) => u.id === exchange.ownerId);

  const lifecycleSteps = [
    { key: "Available", icon: "fa-solid fa-box" },
    { key: "Requested", icon: "fa-solid fa-paper-plane" },
    { key: "Accepted", icon: "fa-solid fa-check" },
    { key: "Handover", icon: "fa-solid fa-handshake" },
    { key: "Borrowed", icon: "fa-solid fa-arrow-right-arrow-left" },
    { key: "Return Due", icon: "fa-regular fa-clock" },
    { key: "Returned", icon: "fa-solid fa-rotate-left" },
    { key: "Inspection", icon: "fa-solid fa-magnifying-glass" },
    { key: "Settlement", icon: "fa-solid fa-indian-rupee-sign" },
    { key: "Rated", icon: "fa-solid fa-star" },
  ];

  const statusOrder = ["Requested", "Accepted", "Handover", "Borrowed", "Return Due", "Returned", "Inspection", "Settlement", "Rated"];
  const currentStepIndex = statusOrder.indexOf(exchange.status);

  const handleRaiseDispute = () => {
    if (disputeReason.trim()) {
      raiseDispute(exchange.id, disputeReason);
      setShowDisputeModal(false);
      setDisputeReason("");
    }
  };

  const lateFee = exchange.status === "Returned" && exchange.returnDate > exchange.endDate ? Math.ceil((new Date(exchange.returnDate) - new Date(exchange.endDate)) / (1000 * 60 * 60 * 24)) * 50 : 0;

  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: "18px" }}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <div className="page-header">
        <h1 className="page-title">Exchange <em>#{exchange.id}</em></h1>
        <p className="page-subtitle">{resource?.name} — {exchange.status}</p>
      </div>

      <div className="card" style={{ padding: "18px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-route" style={{ marginRight: '6px' }}></i>Lifecycle</h3>
        <div className="lifecycle">
          {lifecycleSteps.map((step, i) => (
            <React.Fragment key={step.key}>
              <div className="lifecycle-step">
                <div className={`lifecycle-dot ${i < currentStepIndex ? "completed" : i === currentStepIndex ? "active" : ""}`}>
                  <i className={step.icon} style={{ fontSize: '13px' }}></i>
                </div>
                <span className="lifecycle-label">{step.key}</span>
              </div>
              {i < lifecycleSteps.length - 1 && <div className={`lifecycle-line ${i < currentStepIndex ? "completed" : ""}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: "20px" }}>
        <div>
          <div className="card" style={{ padding: "18px", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Resource</h3>
            <div style={{ display: "flex", gap: "14px" }}>
              <img src={resource?.images[0]} alt={resource?.name} style={{ width: "110px", height: "110px", borderRadius: "var(--radius-sm)", objectFit: "cover", border: '1px solid var(--border)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>{resource?.name}</div>
                <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                  <span className="badge badge-neutral">{resource?.category}</span>
                  <span className="badge badge-primary">{resource?.condition}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}><i className="fa-solid fa-location-dot"></i> {resource?.location}</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "18px", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Participants</h3>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1, padding: "12px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: '1px solid var(--border)' }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: '0.06em', textTransform: 'uppercase' }}>Borrower</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img src={borrower?.avatar} alt="" style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
                  <div><div style={{ fontWeight: 600, fontSize: "13px" }}>{borrower?.name}</div><div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>Trust {borrower?.trustScore}</div></div>
                </div>
              </div>
              <div style={{ flex: 1, padding: "12px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: '1px solid var(--border)' }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "6px", letterSpacing: '0.06em', textTransform: 'uppercase' }}>Owner</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img src={owner?.avatar} alt="" style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
                  <div><div style={{ fontWeight: 600, fontSize: "13px" }}>{owner?.name}</div><div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>Trust {owner?.trustScore}</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "18px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-camera"></i> Condition tracking</h3>
            <div className="condition-comparison">
              <div className="condition-column">
                <h4><i className="fa-regular fa-image" style={{ marginRight: '6px' }}></i>Before lending</h4>
                {exchange.conditionBefore && Object.entries(exchange.conditionBefore).map(([key, val]) => (
                  <div key={key} className="condition-item" style={{ marginBottom: "8px" }}><span className="condition-label">{key}</span><span className="condition-value">{val}</span></div>
                ))}
              </div>
              <div className="condition-column">
                <h4><i className="fa-solid fa-rotate-left" style={{ marginRight: '6px' }}></i>After return</h4>
                {exchange.conditionAfter ? Object.entries(exchange.conditionAfter).map(([key, val]) => (
                  <div key={key} className="condition-item" style={{ marginBottom: "8px" }}><span className="condition-label">{key}</span><span className="condition-value">{val}</span></div>
                )) : <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "16px", textAlign: "center", background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)' }}><i className="fa-regular fa-clock"></i> Not yet returned</div>}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: "18px", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Agreement</h3>
            <div className="agreement-box" style={{ border: "none", padding: "0", background: 'transparent' }}>
              <div className="agreement-row"><span className="agreement-label">Start</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{exchange.startDate}</span></div>
              <div className="agreement-row"><span className="agreement-label">Return due</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{exchange.endDate}</span></div>
              {exchange.returnDate && <div className="agreement-row"><span className="agreement-label">Actual return</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{exchange.returnDate}</span></div>}
              <div className="agreement-row"><span className="agreement-label">Status</span><span className={`badge ${exchange.status === "Returned" ? "badge-success" : "badge-warning"}`}>{exchange.status}</span></div>
              <div className="agreement-row"><span className="agreement-label">Agreement</span><span className="agreement-value">{exchange.agreement ? <span style={{ color: 'var(--success)' }}><i className="fa-solid fa-check"></i> Signed</span> : <span style={{ color: 'var(--text-muted)' }}><i className="fa-solid fa-xmark"></i> Pending</span>}</span></div>
            </div>
          </div>

          <div className="card" style={{ padding: "18px", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Settlement</h3>
            <div className="agreement-box" style={{ border: "none", padding: "0", background: 'transparent' }}>
              <div className="agreement-row"><span className="agreement-label">Borrowing</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.borrowingCharge}</span></div>
              <div className="agreement-row"><span className="agreement-label">Platform fee</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.platformFee}</span></div>
              <div className="agreement-row"><span className="agreement-label">Security deposit</span><span className="agreement-value" style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.securityDeposit}</span></div>
              {lateFee > 0 && <div className="agreement-row"><span className="agreement-label" style={{ color: "var(--danger)" }}><i className="fa-solid fa-triangle-exclamation"></i> Late fee</span><span className="agreement-value" style={{ color: "var(--danger)", fontFamily: 'JetBrains Mono, monospace' }}>₹{lateFee}</span></div>}
              {exchange.damageDeduction > 0 && <div className="agreement-row"><span className="agreement-label" style={{ color: "var(--danger)" }}>Damage</span><span className="agreement-value" style={{ color: "var(--danger)", fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.damageDeduction}</span></div>}
              <div className="agreement-row" style={{ borderTop: "1px solid var(--border)", marginTop: "6px", paddingTop: "10px" }}>
                <span className="agreement-label" style={{ fontWeight: 600, color: "var(--text)" }}>Total</span>
                <span className="agreement-value agreement-total">₹{exchange.totalAmount + lateFee + exchange.damageDeduction}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "18px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {exchange.status === "Requested" && !exchange.agreement && currentUser.id === exchange.ownerId && (
                <button className="btn btn-success btn-block" onClick={() => confirmAgreement(exchange.id)}><i className="fa-solid fa-check"></i> Accept & confirm</button>
              )}
              {exchange.status === "Accepted" && currentUser.id === exchange.borrowerId && (
                <button className="btn btn-primary btn-block" onClick={() => updateExchangeStatus(exchange.id, "Handover")}><i className="fa-solid fa-handshake"></i> Mark handed over</button>
              )}
              {exchange.status === "Handover" && currentUser.id === exchange.borrowerId && (
                <button className="btn btn-primary btn-block" onClick={() => updateExchangeStatus(exchange.id, "Borrowed")}><i className="fa-solid fa-arrow-right-arrow-left"></i> Mark as borrowed</button>
              )}
              {exchange.status === "Borrowed" && currentUser.id === exchange.borrowerId && (
                <button className="btn btn-primary btn-block" onClick={() => updateExchangeStatus(exchange.id, "Return Due")}><i className="fa-regular fa-clock"></i> Mark return due</button>
              )}
              {exchange.status === "Return Due" && currentUser.id === exchange.borrowerId && (
                <button className="btn btn-success btn-block" onClick={() => updateExchangeStatus(exchange.id, "Returned")}><i className="fa-solid fa-rotate-left"></i> Mark as returned</button>
              )}
              {exchange.status === "Returned" && currentUser.id === exchange.ownerId && (
                <button className="btn btn-primary btn-block" onClick={() => updateExchangeStatus(exchange.id, "Inspection")}><i className="fa-solid fa-magnifying-glass"></i> Start inspection</button>
              )}
              {exchange.status === "Inspection" && currentUser.id === exchange.ownerId && (
                <button className="btn btn-success btn-block" onClick={() => updateExchangeStatus(exchange.id, "Settlement")}><i className="fa-solid fa-indian-rupee-sign"></i> Complete settlement</button>
              )}
              {exchange.status === "Settlement" && (
                <button className="btn btn-primary btn-block" onClick={() => updateExchangeStatus(exchange.id, "Rated")}><i className="fa-solid fa-star"></i> Rate & complete</button>
              )}
              <button className="btn btn-ghost btn-block" onClick={() => setShowDisputeModal(true)} style={{ color: 'var(--danger)', borderColor: 'rgba(201,122,107,0.2)' }}>
                <i className="fa-solid fa-triangle-exclamation"></i> Raise dispute
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDisputeModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDisputeModal(false)}>
            <motion.div className="modal" initial={{ scale: 0.97, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 8 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header"><h3 className="modal-title">Raise a dispute</h3><button className="modal-close" onClick={() => setShowDisputeModal(false)}><i className="fa-solid fa-xmark"></i></button></div>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Reason</label><textarea className="form-textarea" placeholder="Describe the issue..." value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} /></div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowDisputeModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleRaiseDispute}><i className="fa-solid fa-paper-plane"></i> Submit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExchangePage;
