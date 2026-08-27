import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";

const AdminDashboard = () => {
  const { stats, allUsers, allResources, allExchanges, allDisputes, pendingList } = useApp();
  const recentExchanges = allExchanges.slice(-5).reverse();
  const openDisputes = allDisputes.filter((d) => d.status === "Open");

  const statCards = [
    { icon: "fa-solid fa-users", value: allUsers.length - 1, label: "Total users", bg: "rgba(217,119,87,0.1)", color: "#D97757" },
    { icon: "fa-solid fa-box-open", value: allResources.length, label: "Total resources", bg: "rgba(143,163,176,0.12)", color: "#8FA3B0" },
    { icon: "fa-solid fa-arrow-right-arrow-left", value: allExchanges.length, label: "Total exchanges", bg: "rgba(107,142,127,0.12)", color: "#6B8E7F" },
    { icon: "fa-solid fa-piggy-bank", value: `₹${(stats.moneySaved / 1000).toFixed(0)}K`, label: "Money saved", bg: "rgba(217,166,121,0.12)", color: "#D9A679" },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title"><i className="fa-solid fa-shield-halved"></i> Admin Panel</div>
        <Link to="/admin" className="admin-sidebar-link active"><i className="fa-solid fa-chart-simple"></i> Dashboard</Link>
        <Link to="/admin/users" className="admin-sidebar-link"><i className="fa-solid fa-users"></i> Users</Link>
        <Link to="/admin/resources" className="admin-sidebar-link"><i className="fa-solid fa-box"></i> Resources</Link>
        <Link to="/admin/exchanges" className="admin-sidebar-link"><i className="fa-solid fa-arrow-right-arrow-left"></i> Exchanges</Link>
        <Link to="/admin/disputes" className="admin-sidebar-link"><i className="fa-solid fa-triangle-exclamation"></i> Disputes</Link>
        <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }} />
        <Link to="/" className="admin-sidebar-link"><i className="fa-solid fa-house"></i> Back to home</Link>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Overview of platform activity & fees</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
          {statCards.map((s, i) => (
            <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color, borderColor: 'transparent' }}><i className={s.icon}></i></div>
              <div className="stat-value" style={{ fontSize: '24px' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div className="card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-regular fa-clock" style={{ marginRight: '6px' }}></i>Pending approvals</h3>
              <span className="badge badge-warning">{pendingList.length}</span>
            </div>
            {pendingList.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: "13px" }}><i className="fa-solid fa-check"></i> No pending approvals</p> : pendingList.map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", alignItems: 'center' }}>
                <div><div style={{ fontWeight: 600, fontSize: "13px" }}>{p.resource}</div><div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>{p.category} • {p.submittedDate}</div></div>
                <Link to="/admin/resources" className="btn btn-sm btn-primary" style={{ borderRadius: '999px' }}><i className="fa-solid fa-eye"></i></Link>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i>Open disputes</h3>
              <span className="badge badge-danger">{openDisputes.length}</span>
            </div>
            {openDisputes.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: "13px" }}><i className="fa-solid fa-check"></i> No open disputes</p> : openDisputes.map((d) => (
              <div key={d.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>{d.reason}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>Raised: {d.raisedDate}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: "18px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '6px' }}></i>Recent exchanges</h3>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>ID</th><th>Resource</th><th>Borrower</th><th>Owner</th><th>Status</th><th>Amount</th></tr></thead>
              <tbody>
                {recentExchanges.map((e) => {
                  const resource = allResources.find((r) => r.id === e.resourceId);
                  const borrower = allUsers.find((u) => u.id === e.borrowerId);
                  const owner = allUsers.find((u) => u.id === e.ownerId);
                  return (
                    <tr key={e.id}>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>#{e.id}</td>
                      <td>{resource?.name?.substring(0, 24)}...</td>
                      <td>{borrower?.name}</td>
                      <td>{owner?.name}</td>
                      <td><span className={`badge ${e.status === "Returned" ? "badge-success" : e.status === "Borrowed" ? "badge-warning" : "badge-neutral"}`}>{e.status}</span></td>
                      <td style={{ fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>₹{e.totalAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="card" style={{ padding: "18px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-indian-rupee-sign" style={{ marginRight: '6px' }}></i>Fee collection</h3>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: "32px", marginBottom: "4px" }}>₹{allExchanges.reduce((sum, e) => sum + e.platformFee, 0)}</div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: '14px' }}>Total platform fees collected</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Borrowing charges</span><span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>₹{allExchanges.reduce((sum, e) => sum + e.borrowingCharge, 0)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Deposits held</span><span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>₹{allExchanges.reduce((sum, e) => sum + e.securityDeposit, 0)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Late fees</span><span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>₹{allExchanges.reduce((sum, e) => sum + e.lateFee, 0)}</span></div>
            </div>
          </div>

          <div className="card" style={{ padding: "18px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Platform health</h3>
            {[
              { label: "On-time returns", value: `${stats.onTimeReturns}%`, icon: "fa-regular fa-clock" },
              { label: "Avg trust score", value: "4.7", icon: "fa-solid fa-star" },
              { label: "Active listings", value: allResources.filter((r) => r.availability === "Available").length, icon: "fa-solid fa-box" },
              { label: "Flagged resources", value: allResources.filter((r) => r.isFlagged).length, icon: "fa-solid fa-flag" },
              { label: "Suspended users", value: allUsers.filter((u) => u.isSuspended).length, icon: "fa-solid fa-user-slash" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "13px", display: "flex", gap: "8px", alignItems: "center", color: 'var(--text-secondary)' }}><i className={s.icon} style={{ width: '14px', color: 'var(--text-muted)' }}></i> {s.label}</span>
                <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
