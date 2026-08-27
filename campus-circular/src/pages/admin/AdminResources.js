import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const AdminResources = () => {
  const { allResources, allUsers, approveResource, rejectResource, flagResource, deleteResource } = useApp();
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");

  const pendingResources = allResources.filter((r) => !r.isApproved);
  const approvedResources = allResources.filter((r) => r.isApproved);
  const flaggedResources = allResources.filter((r) => r.isFlagged);

  const getDisplayResources = () => {
    let list = [];
    if (activeTab === "pending") list = pendingResources;
    else if (activeTab === "approved") list = approvedResources;
    else if (activeTab === "flagged") list = flaggedResources;
    else list = allResources;
    if (search) list = list.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()));
    return list;
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title"><i className="fa-solid fa-shield-halved"></i> Admin Panel</div>
        <Link to="/admin" className="admin-sidebar-link"><i className="fa-solid fa-chart-simple"></i> Dashboard</Link>
        <Link to="/admin/users" className="admin-sidebar-link"><i className="fa-solid fa-users"></i> Users</Link>
        <Link to="/admin/resources" className="admin-sidebar-link active"><i className="fa-solid fa-box"></i> Resources</Link>
        <Link to="/admin/exchanges" className="admin-sidebar-link"><i className="fa-solid fa-arrow-right-arrow-left"></i> Exchanges</Link>
        <Link to="/admin/disputes" className="admin-sidebar-link"><i className="fa-solid fa-triangle-exclamation"></i> Disputes</Link>
        <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }} />
        <Link to="/" className="admin-sidebar-link"><i className="fa-solid fa-house"></i> Back to home</Link>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Resource management</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Approve, reject, or flag resources</p>
        </div>

        <div className="tabs">
          {[
            { key: "pending", label: `Pending (${pendingResources.length})` },
            { key: "approved", label: `Approved (${approvedResources.length})` },
            { key: "flagged", label: `Flagged (${flaggedResources.length})` },
            { key: "all", label: `All (${allResources.length})` },
          ].map((tab) => (
            <button key={tab.key} className={`tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
          ))}
        </div>

        <div className="search-bar" style={{ marginBottom: "18px" }}>
          <div className="search-input-wrapper">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" className="search-input" placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead><tr><th>Resource</th><th>Category</th><th>Owner</th><th>Condition</th><th>Price/day</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {getDisplayResources().map((resource) => {
                const owner = allUsers.find((u) => u.id === resource.owner);
                return (
                  <tr key={resource.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={resource.images[0]} alt="" style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", border: '1px solid var(--border)' }} />
                        <div><div style={{ fontWeight: 600, fontSize: "13px" }}>{resource.name}</div><div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{resource.location}</div></div>
                      </div>
                    </td>
                    <td><span className="badge badge-neutral">{resource.category}</span></td>
                    <td style={{ fontSize: '13px' }}>{owner?.name}</td>
                    <td><span className="badge badge-primary">{resource.condition}</span></td>
                    <td style={{ fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>₹{resource.dailyRate}</td>
                    <td><span className={`badge ${resource.isFlagged ? "badge-danger" : resource.isApproved ? "badge-success" : "badge-warning"}`}>{resource.isFlagged ? "Flagged" : resource.isApproved ? "Approved" : "Pending"}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {!resource.isApproved && (
                          <>
                            <button className="btn btn-sm btn-success" style={{ borderRadius: '999px' }} onClick={() => approveResource(resource.id)} title="Approve"><i className="fa-solid fa-check"></i></button>
                            <button className="btn btn-sm btn-danger" style={{ borderRadius: '999px' }} onClick={() => rejectResource(resource.id)} title="Reject"><i className="fa-solid fa-xmark"></i></button>
                          </>
                        )}
                        {resource.isApproved && !resource.isFlagged && (
                          <button className="btn btn-sm btn-danger" style={{ borderRadius: '999px' }} onClick={() => flagResource(resource.id)} title="Flag"><i className="fa-solid fa-flag"></i></button>
                        )}
                        <button className="btn btn-sm btn-ghost" style={{ borderRadius: '999px', color: "var(--danger)", border: "1px solid var(--border)" }} onClick={() => { if(window.confirm(`Admin delete "${resource.name}"? This will remove it for everyone.`)) deleteResource(resource.id); }} title="Admin delete — works for any status"><i className="fa-regular fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminResources;
