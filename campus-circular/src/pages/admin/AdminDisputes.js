import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const AdminDisputes = () => {
  const { allDisputes, allExchanges, allResources, allUsers } = useApp();
  const [filter, setFilter] = useState("all");
  const filteredDisputes = filter === "all" ? allDisputes : allDisputes.filter((d) => d.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title"><i className="fa-solid fa-shield-halved"></i> Admin Panel</div>
        <Link to="/admin" className="admin-sidebar-link"><i className="fa-solid fa-chart-simple"></i> Dashboard</Link>
        <Link to="/admin/users" className="admin-sidebar-link"><i className="fa-solid fa-users"></i> Users</Link>
        <Link to="/admin/resources" className="admin-sidebar-link"><i className="fa-solid fa-box"></i> Resources</Link>
        <Link to="/admin/exchanges" className="admin-sidebar-link"><i className="fa-solid fa-arrow-right-arrow-left"></i> Exchanges</Link>
        <Link to="/admin/disputes" className="admin-sidebar-link active"><i className="fa-solid fa-triangle-exclamation"></i> Disputes</Link>
        <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }} />
        <Link to="/" className="admin-sidebar-link"><i className="fa-solid fa-house"></i> Back to home</Link>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Dispute management</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Handle reported issues with evidence & resolution</p>
        </div>

        <div className="tabs">
          {[
            { key: "all", label: `All (${allDisputes.length})` },
            { key: "open", label: `Open (${allDisputes.filter((d) => d.status === "Open").length})` },
            { key: "resolved", label: `Resolved (${allDisputes.filter((d) => d.status === "Resolved").length})` },
          ].map((tab) => (
            <button key={tab.key} className={`tab ${filter === tab.key ? "active" : ""}`} onClick={() => setFilter(tab.key)}>{tab.label}</button>
          ))}
        </div>

        {filteredDisputes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><i className="fa-solid fa-circle-check"></i></div>
            <h3 className="empty-state-title">No disputes found</h3>
            <p className="empty-state-text">{filter === "open" ? "All disputes have been resolved" : "No disputes on record"}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredDisputes.map((dispute) => {
              const exchange = allExchanges.find((e) => e.id === dispute.exchangeId);
              const resource = exchange ? allResources.find((r) => r.id === exchange.resourceId) : null;
              const reporter = allUsers.find((u) => u.id === dispute.raisedBy);
              return (
                <div key={dispute.id} className="dispute-card">
                  <div className="dispute-header">
                    <div>
                      <div className="dispute-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--danger)', fontSize: '13px' }}></i> Dispute #{dispute.id}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", fontFamily: 'JetBrains Mono, monospace' }}>Exchange #{dispute.exchangeId} • {resource?.name}</div>
                    </div>
                    <span className={`badge ${dispute.status === "Open" ? "badge-danger" : "badge-success"}`}>{dispute.status}</span>
                  </div>
                  <div className="dispute-reason">{dispute.reason}</div>
                  <div className="dispute-meta">
                    <span><i className="fa-solid fa-user"></i> {reporter?.name}</span>
                    <span><i className="fa-regular fa-calendar"></i> {dispute.raisedDate}</span>
                    {dispute.resolvedDate && <span><i className="fa-solid fa-check"></i> {dispute.resolvedDate}</span>}
                  </div>
                  {dispute.resolution && (
                    <div style={{ marginTop: "12px", padding: "12px", background: "rgba(123,163,126,0.08)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(123,163,126,0.18)" }}>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--success)", marginBottom: "4px", letterSpacing: '0.06em', textTransform: 'uppercase' }}><i className="fa-solid fa-circle-check"></i> Resolution</div>
                      <div style={{ fontSize: "13px", lineHeight: 1.6 }}>{dispute.resolution}</div>
                    </div>
                  )}
                  {dispute.status === "Open" && (
                    <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                      <button className="btn btn-sm btn-success" style={{ borderRadius: '999px' }}><i className="fa-solid fa-check"></i> Resolve</button>
                      <button className="btn btn-sm btn-secondary" style={{ borderRadius: '999px' }}><i className="fa-solid fa-eye"></i> View details</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDisputes;
