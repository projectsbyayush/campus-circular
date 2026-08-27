import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const AdminExchanges = () => {
  const { allExchanges, allResources, allUsers } = useApp();
  const [filter, setFilter] = useState("all");
  const filteredExchanges = filter === "all" ? allExchanges : allExchanges.filter((e) => e.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title"><i className="fa-solid fa-shield-halved"></i> Admin Panel</div>
        <Link to="/admin" className="admin-sidebar-link"><i className="fa-solid fa-chart-simple"></i> Dashboard</Link>
        <Link to="/admin/users" className="admin-sidebar-link"><i className="fa-solid fa-users"></i> Users</Link>
        <Link to="/admin/resources" className="admin-sidebar-link"><i className="fa-solid fa-box"></i> Resources</Link>
        <Link to="/admin/exchanges" className="admin-sidebar-link active"><i className="fa-solid fa-arrow-right-arrow-left"></i> Exchanges</Link>
        <Link to="/admin/disputes" className="admin-sidebar-link"><i className="fa-solid fa-triangle-exclamation"></i> Disputes</Link>
        <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }} />
        <Link to="/" className="admin-sidebar-link"><i className="fa-solid fa-house"></i> Back to home</Link>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Exchange monitoring</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Track all borrowing and lending activity</p>
        </div>

        <div className="tabs">
          {[
            { key: "all", label: `All (${allExchanges.length})` },
            { key: "requested", label: `Requested (${allExchanges.filter((e) => e.status === "Requested").length})` },
            { key: "borrowed", label: `Borrowed (${allExchanges.filter((e) => e.status === "Borrowed").length})` },
            { key: "returned", label: `Returned (${allExchanges.filter((e) => e.status === "Returned").length})` },
          ].map((tab) => (
            <button key={tab.key} className={`tab ${filter === tab.key ? "active" : ""}`} onClick={() => setFilter(tab.key)}>{tab.label}</button>
          ))}
        </div>

        <div className="table-container">
          <table className="table">
            <thead><tr><th>ID</th><th>Resource</th><th>Borrower</th><th>Owner</th><th>Period</th><th>Charge</th><th>Fee</th><th>Deposit</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {filteredExchanges.map((exchange) => {
                const resource = allResources.find((r) => r.id === exchange.resourceId);
                const borrower = allUsers.find((u) => u.id === exchange.borrowerId);
                const owner = allUsers.find((u) => u.id === exchange.ownerId);
                return (
                  <tr key={exchange.id}>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>#{exchange.id}</td>
                    <td style={{ maxWidth: "140px", fontSize: '13px' }}>{resource?.name?.substring(0, 20)}...</td>
                    <td style={{ fontSize: '13px' }}>{borrower?.name}</td>
                    <td style={{ fontSize: '13px' }}>{owner?.name}</td>
                    <td style={{ fontSize: "11px", fontFamily: 'JetBrains Mono, monospace' }}>{exchange.startDate} → {exchange.endDate}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.borrowingCharge}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.platformFee}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.securityDeposit}</td>
                    <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>₹{exchange.totalAmount}</td>
                    <td><span className={`badge ${exchange.status === "Returned" ? "badge-success" : exchange.status === "Borrowed" ? "badge-warning" : exchange.status === "Requested" ? "badge-neutral" : "badge-primary"}`}>{exchange.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginTop: "16px" }}>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-icon" style={{ margin: '0 auto 10px', background: 'rgba(217,119,87,0.1)', color: 'var(--primary)', border: 'none' }}><i className="fa-solid fa-indian-rupee-sign"></i></div>
            <div className="stat-value" style={{ fontSize: '22px' }}>₹{allExchanges.reduce((s, e) => s + e.borrowingCharge, 0)}</div>
            <div className="stat-label">Borrowing charges</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-icon" style={{ margin: '0 auto 10px', background: 'rgba(107,142,127,0.12)', color: 'var(--secondary)', border: 'none' }}><i className="fa-solid fa-building-columns"></i></div>
            <div className="stat-value" style={{ fontSize: '22px' }}>₹{allExchanges.reduce((s, e) => s + e.platformFee, 0)}</div>
            <div className="stat-label">Platform fees</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-icon" style={{ margin: '0 auto 10px', background: 'rgba(143,163,176,0.12)', color: 'var(--accent)', border: 'none' }}><i className="fa-solid fa-lock"></i></div>
            <div className="stat-value" style={{ fontSize: '22px' }}>₹{allExchanges.reduce((s, e) => s + e.securityDeposit, 0)}</div>
            <div className="stat-label">Deposits held</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminExchanges;
