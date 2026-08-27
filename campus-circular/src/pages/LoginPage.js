import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { users } from "../data/mockData";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginAs, loginWithCredentials } = useApp();
  const [mode, setMode] = useState("student"); // student | admin
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (userId) => {
    loginAs(userId);
    navigate("/");
  };

  const handleCredentialLogin = (e) => {
    e.preventDefault();
    setError("");
    const res = loginWithCredentials(form.username, form.password);
    if (res.success) {
      navigate(res.role === "admin" ? "/admin" : "/");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: "24px 16px" }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: "960px", width: "100%", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "28px", alignItems: "start" }}>

        {/* Left - Brand & Info */}
        <div style={{ padding: "8px 4px" }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', marginBottom: '14px' }}>
            <i className="fa-solid fa-arrows-rotate"></i>
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: "34px", fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.03em' }}>Welcome to <br /><em style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Campus Circular</em></h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "10px", fontSize: '14px', lineHeight: 1.6 }}>
            From ownership to access. Share, borrow, and discover resources within your campus — trusted, secure, and sustainable.
          </p>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: "fa-solid fa-shield-halved", title: "Verified & trusted", desc: "Trust scores, reviews & deposits" },
              { icon: "fa-solid fa-bolt", title: "AI-assisted discovery", desc: "Describe needs in plain language" },
              { icon: "fa-solid fa-recycle", title: "Circular economy", desc: "Save money • Reduce waste • Reuse" },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}><i className={f.icon}></i></div>
                <div><div style={{ fontWeight: 600, fontSize: '13px' }}>{f.title}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{f.desc}</div></div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--primary-soft)', border: '1px solid rgba(217,119,87,0.18)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}><i className="fa-solid fa-circle-info"></i> Demo credentials</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
              Student: <b>arjun@college.edu</b> / <b>campus123</b> • Admin: <b>admin</b> / <b>admin123</b>
            </div>
          </div>
        </div>

        {/* Right - Login Card */}
        <div className="card" style={{ padding: "22px", position: 'sticky', top: '88px' }}>
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '999px', border: '1px solid var(--border)', marginBottom: '18px' }}>
            <button onClick={() => { setMode("student"); setError(""); }} className={`btn btn-sm ${mode === "student" ? "btn-primary" : "btn-ghost"}`} style={{ flex: 1, borderRadius: '999px', justifyContent: 'center' }}>
              <i className="fa-solid fa-graduation-cap"></i> Student
            </button>
            <button onClick={() => { setMode("admin"); setError(""); }} className={`btn btn-sm ${mode === "admin" ? "btn-primary" : "btn-ghost"}`} style={{ flex: 1, borderRadius: '999px', justifyContent: 'center' }}>
              <i className="fa-solid fa-shield-halved"></i> Admin
            </button>
          </div>

          <form onSubmit={handleCredentialLogin}>
            <div className="form-group">
              <label className="form-label"><i className="fa-regular fa-user" style={{ marginRight: '6px' }}></i>{mode === "admin" ? "Admin ID" : "Student ID / Email"}</label>
              <input
                className="form-input"
                placeholder={mode === "admin" ? "admin" : "arjun@college.edu or Arjun Mehta"}
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label"><i className="fa-solid fa-lock" style={{ marginRight: '6px' }}></i>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder={mode === "admin" ? "admin123" : "campus123"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingRight: '40px' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <i className={`fa-regular ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '10px 12px', background: 'rgba(201,122,107,0.12)', border: '1px solid rgba(201,122,107,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '12px', marginBottom: '12px' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i>{error}
              </motion.div>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              <i className="fa-solid fa-right-to-bracket"></i> Sign in as {mode === "admin" ? "Admin" : "Student"}
            </button>
            <p style={{ fontSize: '11px', color: 'var(--text-faint)', textAlign: 'center', marginTop: '8px' }}>
              Frontend-only demo • No real auth • Data in memory
            </p>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>or quick demo</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
            {users.filter(u => mode === "admin" ? u.isAdmin : !u.isAdmin).map((user) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user.id)}
                style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", textAlign: 'left', width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)' }}
              >
                <img src={user.avatar} alt={user.name} style={{ width: "32px", height: "32px", borderRadius: "50%", border: '1px solid var(--border)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "13px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{user.department} • {user.year}</div>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: '12px' }}><i className="fa-solid fa-arrow-right"></i></span>
              </button>
            ))}
            {mode === "student" && users.filter(u => !u.isAdmin).length === 0 && null}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
