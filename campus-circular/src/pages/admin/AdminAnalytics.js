import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area
} from "recharts";

const COLORS = ["#16A34A", "#2563EB", "#F59E0B", "#EC4899", "#06B6D4", "#8B5CF6", "#64748B", "#EF4444"];

const AdminAnalytics = () => {
  const { allResources, allExchanges, allReviews, allUsers, stats } = useApp();

  // Live derived data
  const byCategory = (() => {
    const m = {};
    allResources.forEach(r => { m[r.category] = (m[r.category]||0)+1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  })();

  const monthly = stats.monthlyExchanges; // also live exchanges trend
  const liveMonthly = (() => {
    // also compute from allExchanges createdAt if needed, but use stats for demo
    return monthly;
  })();

  const byCondition = (() => {
    const m = {};
    allResources.forEach(r => { m[r.condition] = (m[r.condition]||0)+1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  })();

  const byListingType = (() => {
    const donate = allResources.filter(r=>r.listingType==="donate").length;
    const borrow = allResources.length - donate;
    return [{ name: "Borrow", value: borrow }, { name: "Donate", value: donate }];
  })();

  const byStatus = (() => {
    const m = {};
    allExchanges.forEach(e => { m[e.status] = (m[e.status]||0)+1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  })();

  const topRated = [...allResources].sort((a,b)=>b.rating-a.rating).slice(0,5).map(r=>({ name: r.name.split(" ").slice(0,2).join(" "), rating: r.rating, borrows: r.totalBorrows }));

  const recentReviews = allReviews.slice(0,5);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title"><i className="fa-solid fa-shield-halved"></i> Admin Panel</div>
        <Link to="/admin" className="admin-sidebar-link"><i className="fa-solid fa-chart-simple"></i> Dashboard</Link>
        <Link to="/admin/analytics" className="admin-sidebar-link active"><i className="fa-solid fa-chart-pie"></i> Analytics</Link>
        <Link to="/admin/users" className="admin-sidebar-link"><i className="fa-solid fa-users"></i> Users</Link>
        <Link to="/admin/resources" className="admin-sidebar-link"><i className="fa-solid fa-box"></i> Resources</Link>
        <Link to="/admin/exchanges" className="admin-sidebar-link"><i className="fa-solid fa-arrow-right-arrow-left"></i> Exchanges</Link>
        <Link to="/admin/disputes" className="admin-sidebar-link"><i className="fa-solid fa-triangle-exclamation"></i> Disputes</Link>
        <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }} />
        <Link to="/" className="admin-sidebar-link"><i className="fa-solid fa-house"></i> Back to home</Link>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Analytics</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Live graphs — updates as Ayush/Tejas list, borrow, and review (Recharts)</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
          {[
            { label: "Resources", value: allResources.length, icon: "fa-solid fa-box", color: "#16A34A" },
            { label: "Exchanges", value: allExchanges.length, icon: "fa-solid fa-arrow-right-arrow-left", color: "#2563EB" },
            { label: "Reviews", value: allReviews.length, icon: "fa-solid fa-star", color: "#F59E0B" },
            { label: "Users", value: allUsers.filter(u=>!u.isAdmin).length, icon: "fa-solid fa-users", color: "#8B5CF6" },
          ].map((s,i)=>(
            <motion.div key={i} className="card" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} style={{ padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--bg-surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}><i className={s.icon}></i></div>
              <div><div style={{ fontFamily: "DM Serif Display, serif", fontSize: 20 }}>{s.value}</div><div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div></div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14, marginBottom: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}><i className="fa-solid fa-chart-simple" style={{ color: "var(--primary)", marginRight: 6 }}></i>Monthly exchanges</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liveMonthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#16A34A" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}><i className="fa-solid fa-chart-pie" style={{ color: "var(--primary)", marginRight: 6 }}></i>Top categories (live)</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={78} innerRadius={36} paddingAngle={3}>
                    {byCategory.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}><i className="fa-solid fa-star" style={{ color: "#F59E0B", marginRight: 6 }}></i>Top rated (live)</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRated} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis type="number" domain={[0,5]} stroke="var(--text-muted)" fontSize={11} />
                  <YAxis dataKey="name" type="category" width={90} stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="rating" fill="#F59E0B" radius={[0,6,6,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}><i className="fa-solid fa-scale-balanced" style={{ color: "var(--primary)", marginRight: 6 }}></i>Borrow vs Donate</h3>
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byListingType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={78} label>
                    {byListingType.map((e,i)=><Cell key={i} fill={i===0?"#2563EB":"#16A34A"} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {byListingType.map(c=><span key={c.name} className="badge badge-neutral" style={{ fontSize: 11 }}>{c.name}: {c.value}</span>)}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}><i className="fa-solid fa-layer-group" style={{ color: "var(--primary)", marginRight: 6 }}></i>Exchange status</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} interval={0} angle={-18} dy={10} height={40} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}><i className="fa-solid fa-clipboard-check" style={{ color: "var(--primary)", marginRight: 6 }}></i>Condition</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={byCondition.map(c=>({ name: c.name, value: c.value }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="value" stroke="#16A34A" fill="rgba(22,163,74,0.18)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}><i className="fa-solid fa-star" style={{ color: "#F59E0B", marginRight: 6 }}></i>Recent reviews — live from users</h3>
            <span className="badge badge-neutral" style={{ fontSize: 11 }}>{allReviews.length} total</span>
          </div>
          {allReviews.length===0 ? (
            <div style={{ padding: 16, background: "var(--bg-surface)", border: "1px dashed var(--border)", borderRadius: 10, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
              No reviews yet — ask Ayush/Tejas to review a resource on its detail page. Reviews appear here instantly.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
              {recentReviews.map(r=>{
                const res = allResources.find(x=>x.id===r.resourceId);
                return (
                  <div key={r.id} style={{ display: "flex", gap: 10, padding: 10, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10 }}>
                    <img src={r.avatar} alt={r.userName} style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <b style={{ fontSize: 12 }}>{r.userName}</b>
                        <span style={{ fontSize: 11, color: "var(--warning)" }}><i className="fa-solid fa-star"></i> {r.rating}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.at}</span>
                        <span className="badge badge-neutral" style={{ fontSize: 10 }}>{res?.name?.slice(0,18) || `Resource #${r.resourceId}`}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{r.comment}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
