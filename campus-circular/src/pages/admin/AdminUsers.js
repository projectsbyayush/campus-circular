import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const AdminUsers = () => {
  const { allUsers, suspendUser } = useApp();
  const [search, setSearch] = useState("");
  const filteredUsers = allUsers.filter((u) => !u.isAdmin && (u.name.toLowerCase().includes(search.toLowerCase()) || u.department.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title"><i className="fa-solid fa-shield-halved"></i> Admin Panel</div>
        <Link to="/admin" className="admin-sidebar-link"><i className="fa-solid fa-chart-simple"></i> Dashboard</Link>
        <Link to="/admin/users" className="admin-sidebar-link active"><i className="fa-solid fa-users"></i> Users</Link>
        <Link to="/admin/resources" className="admin-sidebar-link"><i className="fa-solid fa-box"></i> Resources</Link>
        <Link to="/admin/exchanges" className="admin-sidebar-link"><i className="fa-solid fa-arrow-right-arrow-left"></i> Exchanges</Link>
        <Link to="/admin/disputes" className="admin-sidebar-link"><i className="fa-solid fa-triangle-exclamation"></i> Disputes</Link>
        <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }} />
        <Link to="/" className="admin-sidebar-link"><i className="fa-solid fa-house"></i> Back to home</Link>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">User management</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Trust, suspensions, and activity</p>
        </div>

        <div className="search-bar" style={{ marginBottom: "18px" }}>
          <div className="search-input-wrapper">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" className="search-input" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead><tr><th>User</th><th>Department</th><th>Trust</th><th>Exchanges</th><th>Late</th><th>Disputes</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img src={user.avatar} alt="" style={{ width: "32px", height: "32px", borderRadius: "50%", border: '1px solid var(--border)' }} />
                      <div><div style={{ fontWeight: 600, fontSize: "13px" }}>{user.name}</div><div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>{user.email}</div></div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px' }}>{user.department} • {user.year}</td>
                  <td><span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: user.trustScore >= 4.5 ? "var(--success)" : user.trustScore >= 3 ? "var(--warning)" : "var(--danger)" }}>{user.trustScore}</span></td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{user.successfulExchanges}</td>
                  <td><span style={{ color: user.lateReturns > 0 ? "var(--warning)" : "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>{user.lateReturns}</span></td>
                  <td><span style={{ color: user.disputes > 0 ? "var(--danger)" : "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>{user.disputes}</span></td>
                  <td><span className={`badge ${user.isSuspended ? "badge-danger" : "badge-success"}`}>{user.isSuspended ? "Suspended" : "Active"}</span></td>
                  <td><button className={`btn btn-sm ${user.isSuspended ? "btn-success" : "btn-danger"}`} style={{ borderRadius: '999px' }} onClick={() => suspendUser(user.id)}><i className={`fa-solid ${user.isSuspended ? 'fa-user-check' : 'fa-user-slash'}`}></i> {user.isSuspended ? "Reactivate" : "Suspend"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
