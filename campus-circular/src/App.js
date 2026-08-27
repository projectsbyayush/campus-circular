import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider, useApp } from "./context/AppContext";
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ExchangePage from "./pages/ExchangePage";
import MyExchangesPage from "./pages/MyExchangesPage";
import ListResourcePage from "./pages/ListResourcePage";
import AiSearchPage from "./pages/AiSearchPage";
import CampusImpactPage from "./pages/CampusImpactPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminResources from "./pages/admin/AdminResources";
import AdminExchanges from "./pages/admin/AdminExchanges";
import AdminDisputes from "./pages/admin/AdminDisputes";
import LoginPage from "./pages/LoginPage";
import "./App.css";

const RequireAdmin = ({ children }) => {
  const { currentUser } = useApp();
  if (!currentUser?.isAdmin) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(201,122,107,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--danger)', fontSize: '22px', border: '1px solid rgba(201,122,107,0.18)' }}>
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', fontWeight: 400, marginBottom: '8px' }}>Admin access required</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Please sign in with admin credentials to view this page.</p>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-surface)', display: 'inline-block', padding: '6px 10px', borderRadius: '999px', border: '1px solid var(--border)' }}>
          ID: <b style={{ color: 'var(--text)' }}>admin</b> • Pass: <b style={{ color: 'var(--text)' }}>admin123</b>
        </p>
        <div style={{ marginTop: '18px' }}>
          <Link to="/login" className="btn btn-primary"><i className="fa-solid fa-right-to-bracket"></i> Go to login</Link>
        </div>
      </div>
    );
  }
  return children;
};

const Navbar = () => {
  const { currentUser, allNotifications, logout, theme, toggleTheme } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = allNotifications.filter((n) => !n.read && n.userId === currentUser.id).length;

  const navItems = [
    { path: "/", label: "Home", icon: "fa-solid fa-house" },
    { path: "/discover", label: "Discover", icon: "fa-solid fa-compass" },
    { path: "/ai-search", label: "AI Search", icon: "fa-solid fa-wand-magic-sparkles" },
    { path: "/list", label: "List Item", icon: "fa-solid fa-plus" },
    { path: "/exchanges", label: "Exchanges", icon: "fa-solid fa-arrow-right-arrow-left" },
    { path: "/impact", label: "Impact", icon: "fa-solid fa-chart-simple" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-mark">
            <i className="fa-solid fa-arrows-rotate"></i>
          </div>
          <span className="brand-text">Campus <span>Circular</span></span>
        </Link>

        <div className="nav-links">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`nav-link ${location.pathname === item.path ? "active" : ""}`}>
              <i className={item.icon}></i>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <button className="notification-btn" onClick={toggleTheme} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} aria-label="Toggle theme">
            <i className={theme === "dark" ? "fa-regular fa-sun" : "fa-regular fa-moon"}></i>
          </button>
          <div className="notification-wrapper">
            <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <i className="fa-regular fa-bell"></i>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="notification-dropdown">
                  <h4><i className="fa-regular fa-bell" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Notifications</h4>
                  {allNotifications.filter((n) => n.userId === currentUser.id).map((n) => (
                    <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}>
                      <p>{n.message}</p>
                      <span className="notif-time">{n.time}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ position: 'relative' }}>
            <button className="profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <img src={currentUser.avatar} alt={currentUser.name} className="profile-avatar" />
              <span className="profile-name">{currentUser.name.split(" ")[0]}</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: 'var(--text-muted)' }}></i>
            </button>
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '220px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 20 }}>
                  <div style={{ padding: '14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img src={currentUser.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentUser.isAdmin ? 'Administrator' : `${currentUser.department} • ${currentUser.year}`}</div>
                    </div>
                  </div>
                  <div style={{ padding: '8px' }}>
                    <button onClick={() => { setShowProfileMenu(false); navigate("/profile"); }} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', background: 'none', border: 'none', color: 'var(--text)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <i className="fa-regular fa-user" style={{ width: '14px' }}></i> Profile
                    </button>
                    <button onClick={() => { setShowProfileMenu(false); navigate("/exchanges"); }} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', background: 'none', border: 'none', color: 'var(--text)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <i className="fa-solid fa-arrow-right-arrow-left" style={{ width: '14px' }}></i> My exchanges
                    </button>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '6px 0' }} />
                    <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', background: 'none', border: 'none', color: 'var(--danger)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <i className="fa-solid fa-right-from-bracket" style={{ width: '14px' }}></i> Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {currentUser.isAdmin ? (
            <Link to="/admin" className="admin-link">
              <i className="fa-solid fa-shield-halved"></i> Admin
            </Link>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm" style={{ borderRadius: '999px' }}>
              <i className="fa-solid fa-right-to-bracket"></i> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const MobileNav = () => {
  const location = useLocation();
  const items = [
    { path: "/", icon: "fa-solid fa-house" },
    { path: "/discover", icon: "fa-solid fa-compass" },
    { path: "/ai-search", icon: "fa-solid fa-wand-magic-sparkles" },
    { path: "/list", icon: "fa-solid fa-plus" },
    { path: "/exchanges", icon: "fa-solid fa-arrow-right-arrow-left" },
  ];
  return (
    <div className="mobile-nav">
      {items.map((item) => (
        <Link key={item.path} to={item.path} className={`mobile-nav-item ${location.pathname === item.path ? "active" : ""}`}>
          <i className={item.icon}></i>
        </Link>
      ))}
    </div>
  );
};

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/resource/:id" element={<ResourceDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/exchange/:id" element={<ExchangePage />} />
            <Route path="/exchanges" element={<MyExchangesPage />} />
            <Route path="/list" element={<ListResourcePage />} />
            <Route path="/ai-search" element={<AiSearchPage />} />
            <Route path="/impact" element={<CampusImpactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
            <Route path="/admin/resources" element={<RequireAdmin><AdminResources /></RequireAdmin>} />
            <Route path="/admin/exchanges" element={<RequireAdmin><AdminExchanges /></RequireAdmin>} />
            <Route path="/admin/disputes" element={<RequireAdmin><AdminDisputes /></RequireAdmin>} />
          </Routes>
        </AnimatePresence>
      </main>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
