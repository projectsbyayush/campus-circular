import React from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const CampusImpactPage = () => {
  const { stats } = useApp();

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Campus <em>impact</em></h1>
        <p className="page-subtitle">A living dashboard — how sharing is saving money, waste, and carbon.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "28px" }}>
        {[
          { icon: "fa-solid fa-users", value: stats.activeMembers, label: "Active members", color: "#D97757", bg: "rgba(217,119,87,0.1)" },
          { icon: "fa-solid fa-box-open", value: stats.resourcesShared, label: "Resources shared", color: "#8FA3B0", bg: "rgba(143,163,176,0.12)" },
          { icon: "fa-solid fa-arrow-right-arrow-left", value: stats.successfulExchanges, label: "Successful exchanges", color: "#6B8E7F", bg: "rgba(107,142,127,0.12)" },
          { icon: "fa-solid fa-piggy-bank", value: `₹${(stats.moneySaved / 1000).toFixed(0)}K`, label: "Money saved", color: "#D9A679", bg: "rgba(217,166,121,0.12)" },
          { icon: "fa-solid fa-recycle", value: stats.resourcesReused, label: "Resources reused", color: "#7BA37E", bg: "rgba(123,163,126,0.12)" },
          { icon: "fa-solid fa-leaf", value: `${stats.carbonSaved}kg`, label: "CO₂ saved", color: "#7BA37E", bg: "rgba(123,163,126,0.1)" },
          { icon: "fa-solid fa-bottle-water", value: `${stats.plasticSaved}kg`, label: "Plastic saved", color: "#8FA3B0", bg: "rgba(143,163,176,0.1)" },
          { icon: "fa-regular fa-clock", value: `${stats.onTimeReturns}%`, label: "On-time returns", color: "#D97757", bg: "rgba(217,119,87,0.08)" },
        ].map((s, i) => (
          <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color, borderColor: 'transparent' }}><i className={s.icon}></i></div>
            <div className="stat-value" style={{ fontSize: '24px' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "20px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "18px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-chart-simple" style={{ marginRight: '6px' }}></i>Monthly exchanges</h3>
          <div className="chart-bar">
            {stats.monthlyExchanges.map((m, i) => (
              <div key={i} className="chart-col">
                <div className="chart-value">{m.count}</div>
                <div className="chart-fill" style={{ height: `${(m.count / 130) * 100}%`, background: `linear-gradient(180deg, #D97757, #D9A679)` }} />
                <div className="chart-label">{m.month}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ padding: "20px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "18px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}><i className="fa-solid fa-chart-pie" style={{ marginRight: '6px' }}></i>Popular categories</h3>
          {stats.topCategories.map((cat, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: 500 }}>{cat.name}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: 'JetBrains Mono, monospace' }}>{cat.count} • {cat.percentage}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${cat.percentage}%`, background: `linear-gradient(90deg, #D97757, #D9A679)` }} /></div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={{ padding: "28px", textAlign: "center" }}>
        <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: "20px", fontWeight: 400, marginBottom: "20px" }}>Environmental <em style={{ fontStyle: 'italic', color: 'var(--primary)' }}>impact</em></h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(123,163,126,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: 'var(--success)', fontSize: '18px' }}><i className="fa-solid fa-earth-americas"></i></div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: "28px" }}>{stats.carbonSaved}kg</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", letterSpacing: '0.02em', textTransform: 'uppercase' }}>CO₂ prevented</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>≈ {Math.round(stats.carbonSaved / 21)} trees planted</div>
          </div>
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(217,119,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: 'var(--primary)', fontSize: '18px' }}><i className="fa-solid fa-recycle"></i></div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: "28px" }}>{stats.resourcesReused}</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", letterSpacing: '0.02em', textTransform: 'uppercase' }}>Resources reused</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Kept out of landfills</div>
          </div>
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(217,166,121,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: 'var(--warning)', fontSize: '18px' }}><i className="fa-solid fa-piggy-bank"></i></div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: "28px" }}>₹{(stats.moneySaved / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", letterSpacing: '0.02em', textTransform: 'uppercase' }}>Money saved</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Avg ₹{Math.round(stats.moneySaved / stats.successfulExchanges)}/exchange</div>
          </div>
        </div>
      </motion.div>

      <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} style={{ padding: "20px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Community champions</h3>
          {[
            { icon: "fa-solid fa-trophy", title: "Top sharer", desc: "Priya Sharma — 62 exchanges", color: "var(--warning)" },
            { icon: "fa-solid fa-star", title: "Highest rated", desc: "Arjun Mehta — 4.8 rating", color: "var(--primary)" },
            { icon: "fa-solid fa-medal", title: "Most reliable", desc: "Sneha Patel — 0 late returns", color: "var(--success)" },
            { icon: "fa-solid fa-leaf", title: "Eco champion", desc: "487 students saving the planet", color: "var(--success)" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", padding: "12px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", marginBottom: "8px", border: '1px solid var(--border)' }}>
              <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color, fontSize: '13px', flexShrink: 0 }}><i className={a.icon}></i></span>
              <div><div style={{ fontWeight: 600, fontSize: "13px" }}>{a.title}</div><div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{a.desc}</div></div>
            </div>
          ))}
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: "20px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Platform health</h3>
          {[
            { label: "Active listings", value: "342", icon: "fa-solid fa-box" },
            { label: "Pending approvals", value: "12", icon: "fa-regular fa-clock" },
            { label: "Open disputes", value: "3", icon: "fa-solid fa-triangle-exclamation" },
            { label: "Avg response", value: "2.3 hrs", icon: "fa-solid fa-bolt" },
            { label: "Satisfaction", value: "4.7/5", icon: "fa-regular fa-face-smile" },
            { label: "Return rate", value: "94%", icon: "fa-solid fa-rotate-left" },
          ].map((h, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: "13px", display: "flex", gap: "8px", alignItems: "center", color: 'var(--text-secondary)' }}><i className={h.icon} style={{ width: '14px', color: 'var(--text-muted)' }}></i> {h.label}</span>
              <span style={{ fontWeight: 600, fontSize: "13px", fontFamily: 'JetBrains Mono, monospace' }}>{h.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CampusImpactPage;
