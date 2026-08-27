import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

const ExchangePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allExchanges, allResources, allUsers, currentUser, confirmAgreement, updateExchangeStatus, revokeExchange, cancelExchange, deleteExchange, raiseDispute } = useApp();
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

  const isOwner = currentUser.id === exchange.ownerId;
  const isBorrower = currentUser.id === exchange.borrowerId;
  const canProgress = (targetStatus) => {
    const order = statusOrder;
    const curIdx = order.indexOf(exchange.status);
    const tgtIdx = order.indexOf(targetStatus);
    if (tgtIdx !== curIdx + 1) return false;
    // permission matrix
    if (targetStatus === "Accepted") return isOwner && exchange.status === "Requested";
    if (targetStatus === "Handover") return isBorrower && exchange.status === "Accepted";
    if (targetStatus === "Borrowed") return isBorrower && exchange.status === "Handover";
    if (targetStatus === "Return Due") return isBorrower && exchange.status === "Borrowed";
    if (targetStatus === "Returned") return isBorrower && exchange.status === "Return Due";
    if (targetStatus === "Inspection") return isOwner && exchange.status === "Returned";
    if (targetStatus === "Settlement") return isOwner && exchange.status === "Inspection";
    if (targetStatus === "Rated") return true;
    return false;
  };
  const handleTimelineClick = (statusKey) => {
    const lifecycleToStatus = { "Requested":"Requested","Accepted":"Accepted","Handover":"Handover","Borrowed":"Borrowed","Return Due":"Return Due","Returned":"Returned","Inspection":"Inspection","Settlement":"Settlement","Rated":"Rated" };
    const target = lifecycleToStatus[statusKey];
    if (!target || target===exchange.status) return;
    if (canProgress(target)) {
      if (target==="Accepted") confirmAgreement(exchange.id);
      else updateExchangeStatus(exchange.id, target);
    }
  };

  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: "18px" }}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <div className="page-header">
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Exchange <em>#{exchange.id}</em></h1>
          <span className={`badge ${exchange.status==="Requested"?"badge-warning":exchange.status==="Borrowed"?"badge-warning":exchange.status==="Returned"||exchange.status==="Rated"?"badge-success":"badge-neutral"}`} style={{ fontSize: 12 }}>{exchange.status}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{isOwner ? "You are owner" : isBorrower ? "You are borrower" : ""} • Live</span>
        </div>
        <p className="page-subtitle">{resource?.name} — {exchange.startDate} → {exchange.endDate} {exchange.returnDate ? `• returned ${exchange.returnDate}` : ""}</p>
      </div>

      <div className="card" style={{ padding: "18px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', display: "flex", gap: 6, alignItems: "center" }}><i className="fa-solid fa-route" style={{ color: "var(--primary)" }}></i>Live lifecycle — {isOwner ? "owner controls" : "borrower controls"} • click next dot to progress</h3>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}><i className="fa-solid fa-circle" style={{ color: "var(--success)", fontSize: 8 }}></i> realtime • {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="lifecycle">
          {lifecycleSteps.map((step, i) => {
            const statusForStep = step.key==="Available" ? null : step.key;
            const idx = statusForStep ? statusOrder.indexOf(statusForStep) : -1;
            const isCompleted = idx !== -1 && idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            const isNext = idx === currentStepIndex+1;
            const clickable = statusForStep && isNext && canProgress(statusForStep);
            return (
              <React.Fragment key={step.key}>
                <div className="lifecycle-step" style={{ opacity: step.key==="Available" && currentStepIndex===-1 ? 0.5 : 1 }}>
                  <div
                    className={`lifecycle-dot ${isCompleted ? "completed" : isActive ? "active" : ""}`}
                    onClick={() => statusForStep && handleTimelineClick(statusForStep)}
                    title={clickable ? `Click to move to ${statusForStep} (you have permission)` : isActive ? "Current stage" : isCompleted ? "Completed" : "Upcoming"}
                    style={{ cursor: clickable ? "pointer" : "default", position: "relative", border: clickable ? "2px dashed var(--primary)" : undefined }}
                  >
                    <i className={step.icon} style={{ fontSize: '13px' }}></i>
                    {clickable && <span style={{ position: "absolute", top: -6, right: -6, width: 14, height: 14, background: "var(--primary)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, border: "1px solid var(--bg-card)" }}><i className="fa-solid fa-arrow-right"></i></span>}
                  </div>
                  <span className="lifecycle-label" style={{ color: isActive ? "var(--primary)" : isCompleted ? "var(--success)" : "var(--text-muted)", fontWeight: isActive?700:500 }}>{step.key}</span>
                  {isActive && <span style={{ fontSize: 9, color: "var(--primary)", fontWeight: 700, letterSpacing: "0.06em" }}>LIVE</span>}
                </div>
                {i < lifecycleSteps.length - 1 && <div className={`lifecycle-line ${isCompleted ? "completed" : ""}`} />}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginTop: 10, padding: 10, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, color: "var(--text-secondary)", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span><i className="fa-solid fa-user" style={{ color: isOwner ? "var(--primary)" : "var(--text-muted)" }}></i> Owner: <b>{owner?.name}</b> {isOwner && "(you)"}</span>
          <span>•</span>
          <span><i className="fa-solid fa-user" style={{ color: isBorrower ? "var(--primary)" : "var(--text-muted)" }}></i> Borrower: <b>{borrower?.name}</b> {isBorrower && "(you)"}</span>
          <span>•</span>
          <span><i className="fa-solid fa-box"></i> {resource?.name}</span>
          <span>•</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace" }}><i className="fa-regular fa-calendar"></i> {exchange.startDate} → {exchange.endDate}</span>
        </div>
      </div>

      {/* Timeline details • Due as per owner • Time left • Completed */}
      <div className="card" style={{ padding: "16px", marginBottom: "16px" }}>
        {(() => {
          const end = new Date(exchange.endDate);
          const now = new Date();
          const diff = end - now;
          const isCompleted = exchange.status === "Rated";
          let timeLeft = null;
          if (isCompleted) timeLeft = { text: "Completed", sub: `Completed on ${exchange.timeline?.find(t=>t.status==="Rated")?.at || exchange.returnDate || end.toLocaleDateString()}`, color: "var(--success)", bg: "rgba(22,163,74,0.10)", border: "rgba(22,163,74,0.18)", icon: "fa-circle-check" };
          else if (diff <= 0) {
            const overdue = Math.ceil(Math.abs(diff)/(1000*60*60*24));
            timeLeft = { text: `Overdue by ${overdue} day${overdue>1?"s":""}`, sub: `Due was ${exchange.endDate} • owner set ${exchange.totalDays} day${exchange.totalDays>1?"s":""}`, color: "var(--danger)", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.18)", icon: "fa-triangle-exclamation" };
          } else {
            const days = Math.floor(diff/(1000*60*60*24));
            const hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
            timeLeft = { text: days>0 ? `Due in ${days}d ${hours}h` : `Due in ${hours}h`, sub: `Due ${exchange.endDate} • ${exchange.totalDays} day${exchange.totalDays>1?"s":""} as per owner accepted • ${exchange.startDate} → ${exchange.endDate}`, color: "var(--warning)", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)", icon: "fa-clock" };
          }
          return (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                <h3 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', display: "flex", gap: 6, alignItems: "center" }}><i className="fa-solid fa-clock" style={{ color: timeLeft.color }}></i> Timeline • Due as per owner</h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ background: timeLeft.bg, border: `1px solid ${timeLeft.border}`, color: timeLeft.color, padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, display: "flex", gap: 6, alignItems: "center" }}><i className={`fa-solid ${timeLeft.icon}`}></i> {timeLeft.text}</span>
                  {isCompleted && <span className="badge badge-success" style={{ fontSize: 11 }}><i className="fa-solid fa-check"></i> Completed</span>}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12, fontFamily: "JetBrains Mono, monospace" }}>{timeLeft.sub}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(exchange.timeline || []).map((t,i) => {
                  const user = allUsers.find(u=>u.id===t.by);
                  const isLast = i === exchange.timeline.length-1;
                  const isAccept = t.status === "Accepted";
                  return (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 10px", background: isLast ? "var(--primary-soft)" : "var(--bg-surface)", border: `1px solid ${isLast ? "rgba(22,163,74,0.18)" : "var(--border)"}`, borderRadius: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: isAccept ? "var(--success)" : isLast ? "var(--primary)" : "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: isAccept||isLast ? "white" : "var(--text-muted)", fontSize: 11 }}><i className={isAccept ? "fa-solid fa-check" : "fa-solid fa-circle"} style={{ fontSize: 8 }}></i></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, display: "flex", gap: 6, alignItems: "center" }}>
                          {t.status}
                          {isAccept && <span className="badge badge-success" style={{ fontSize: 10 }}><i className="fa-solid fa-check"></i> Accept</span>}
                          {t.status==="Rated" && <span className="badge badge-success" style={{ fontSize: 10 }}>Completed</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.at} • by {user?.name || "—"} {user?.id===currentUser.id && "(you)"} {t.status==="Accepted" ? "• owner accepted" : t.status==="Requested" ? "• borrower requested" : ""}</div>
                      </div>
                      {isLast && <span style={{ fontSize: 10, color: "var(--primary)", fontWeight: 700, letterSpacing: "0.06em" }}>LIVE</span>}
                    </div>
                  );
                })}
                {!exchange.timeline && <div style={{ fontSize: 12, color: "var(--text-muted)", padding: 10, background: "var(--bg-surface)", borderRadius: 8, border: "1px dashed var(--border)" }}>No timeline yet — it will populate live as owner/borrower progress via clicks.</div>}
              </div>
              <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8, textAlign: "center" }}>Owner set due: {exchange.startDate} → <b style={{ color: "var(--text)" }}>{exchange.endDate}</b> ({exchange.totalDays} days) • Click next dot above to progress live — both see it instantly.</p>
            </>
          );
        })()}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: "20px" }}>
        <div>
          <div className="card" style={{ padding: "18px", marginBottom: "14px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Resource</h3>
            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "110px", height: "110px", borderRadius: "var(--radius-sm)", background: getCardVisual(resource).bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: '1px solid var(--border)' }}><i className={getCardVisual(resource).icon} style={{ fontSize: 32, color: "white" }}></i></div>
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
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', display: "flex", justifyContent: "space-between" }}>
              <span>Owner controls</span>
              <span style={{ fontSize: 10, color: isOwner ? "var(--primary)" : "var(--text-muted)", border: "1px solid var(--border)", padding: "2px 6px", borderRadius: 999 }}>{isOwner ? "You are owner — click timeline" : isBorrower ? "You are borrower" : ""}</span>
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {exchange.status === "Requested" && !exchange.agreement && isOwner && (
                <button className="btn btn-success btn-block" onClick={() => confirmAgreement(exchange.id)}><i className="fa-solid fa-check"></i> Accept & confirm (owner)</button>
              )}
              {exchange.status === "Requested" && isOwner && (
                <button className="btn btn-ghost btn-block" onClick={() => { if(window.confirm("Decline this request?")) cancelExchange(exchange.id); }} style={{ color: "var(--danger)", border: "1px solid rgba(201,122,107,0.2)" }}><i className="fa-solid fa-xmark"></i> Decline request (owner)</button>
              )}
              {exchange.status === "Requested" && isBorrower && (
                <button className="btn btn-ghost btn-block" onClick={() => { if(window.confirm("Revoke your request?")) { revokeExchange(exchange.id); navigate("/exchanges"); } }} style={{ color: "var(--danger)", border: "1px solid rgba(201,122,107,0.2)" }}><i className="fa-solid fa-rotate-left"></i> Revoke request (borrower)</button>
              )}
              {exchange.status === "Accepted" && isBorrower && (
                <button className="btn btn-primary btn-block" onClick={() => updateExchangeStatus(exchange.id, "Handover")}><i className="fa-solid fa-handshake"></i> Mark handed over</button>
              )}
              {exchange.status === "Accepted" && isBorrower && (
                <button className="btn btn-ghost btn-sm btn-block" onClick={() => { if(window.confirm("Revoke after accept?")) revokeExchange(exchange.id); }} style={{ color: "var(--danger)" }}><i className="fa-solid fa-ban"></i> Revoke (borrower)</button>
              )}
              {exchange.status === "Handover" && isBorrower && (
                <button className="btn btn-primary btn-block" onClick={() => updateExchangeStatus(exchange.id, "Borrowed")}><i className="fa-solid fa-arrow-right-arrow-left"></i> Mark as borrowed</button>
              )}
              {exchange.status === "Borrowed" && isBorrower && (
                <button className="btn btn-primary btn-block" onClick={() => updateExchangeStatus(exchange.id, "Return Due")}><i className="fa-regular fa-clock"></i> Mark return due</button>
              )}
              {exchange.status === "Return Due" && isBorrower && (
                <button className="btn btn-success btn-block" onClick={() => updateExchangeStatus(exchange.id, "Returned")}><i className="fa-solid fa-rotate-left"></i> Mark as returned</button>
              )}
              {exchange.status === "Returned" && isOwner && (
                <button className="btn btn-primary btn-block" onClick={() => updateExchangeStatus(exchange.id, "Inspection")}><i className="fa-solid fa-magnifying-glass"></i> Start inspection (owner)</button>
              )}
              {exchange.status === "Inspection" && isOwner && (
                <button className="btn btn-success btn-block" onClick={() => updateExchangeStatus(exchange.id, "Settlement")}><i className="fa-solid fa-indian-rupee-sign"></i> Complete settlement (owner)</button>
              )}
              {exchange.status === "Settlement" && (
                <button className="btn btn-primary btn-block" onClick={() => updateExchangeStatus(exchange.id, "Rated")}><i className="fa-solid fa-star"></i> Rate & complete</button>
              )}
              <button className="btn btn-ghost btn-block" onClick={() => setShowDisputeModal(true)} style={{ color: 'var(--danger)', borderColor: 'rgba(201,122,107,0.2)' }}>
                <i className="fa-solid fa-triangle-exclamation"></i> Raise dispute
              </button>
              {(exchange.status === "Rated" || exchange.status === "Returned" || exchange.status === "Settlement") && isOwner && (
                <button className="btn btn-ghost btn-block" onClick={() => { if(window.confirm("Delete this exchange record? Only owner can delete.")) { deleteExchange(exchange.id); navigate("/exchanges"); } }} style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                  <i className="fa-regular fa-trash-can"></i> Delete record (owner only)
                </button>
              )}
              {(exchange.status === "Rated" || exchange.status === "Returned" || exchange.status === "Settlement") && isBorrower && !isOwner && (
                <div style={{ padding: "8px 10px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 11, color: "var(--text-faint)", textAlign: "center" }}>
                  <i className="fa-solid fa-lock"></i> Only owner can delete • Borrower can revoke when Requested
                </div>
              )}
            </div>
            <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8, textAlign: "center" }}>Tip: Owner can click the next dot in timeline to progress live.</p>
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
