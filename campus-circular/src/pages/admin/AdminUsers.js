import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../context/AppContext";

const AdminUsers = () => {
  const { allUsers, suspendUser, createUser } = useApp();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", department: "Computer Science", year: "1st Year", email: "", phone: "", bio: "" });
  const filteredUsers = allUsers.filter((u) => !u.isAdmin && (u.name.toLowerCase().includes(search.toLowerCase()) || u.department.toLowerCase().includes(search.toLowerCase())));

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newUser.name.trim()) return;
    createUser(newUser);
    setNewUser({ name: "", department: "Computer Science", year: "1st Year", email: "", phone: "", bio: "" });
    setShowCreate(false);
  };

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
        <div className="admin-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="admin-title">User management</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Trust, suspensions, and activity — create new campus members</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)} style={{ borderRadius: 999 }}><i className="fa-solid fa-user-plus"></i> Create user</button>
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

        <AnimatePresence>
          {showCreate && (
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreate(false)}>
              <motion.div className="modal" initial={{ scale: 0.97, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 8 }} onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
                <div className="modal-header">
                  <h3 className="modal-title"><i className="fa-solid fa-user-plus" style={{ color: "var(--primary)", marginRight: 6 }}></i>Create campus user</h3>
                  <button className="modal-close" onClick={() => setShowCreate(false)}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form onSubmit={handleCreate}>
                  <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Full name *</label>
                      <input className="form-input" placeholder="e.g., Aarav Singh" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Department</label>
                        <select className="form-select" value={newUser.department} onChange={e => setNewUser({ ...newUser, department: e.target.value })}>
                          <option>Computer Science</option><option>Electronics</option><option>Mechanical</option><option>Commerce</option><option>Architecture</option><option>General</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Year</label>
                        <select className="form-select" value={newUser.year} onChange={e => setNewUser({ ...newUser, year: e.target.value })}>
                          <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Staff</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-input" placeholder="name@college.edu" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Login ID will be email • password is <b>campus123</b> for demo</p>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Phone</label>
                      <input className="form-input" placeholder="+91 98765 43210" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Bio / note</label>
                      <input className="form-input" placeholder="Short bio" value={newUser.bio} onChange={e => setNewUser({ ...newUser, bio: e.target.value })} />
                    </div>
                    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 10, fontSize: 11, color: "var(--text-muted)" }}>
                      <i className="fa-solid fa-circle-info" style={{ color: "var(--primary)" }}></i> New user gets Dicebear PFP `seed=name`, trust 4.5, verified, `campus123` login. Appears instantly in Discover & can be switched via Login page.
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary"><i className="fa-solid fa-check"></i> Create user</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminUsers;
