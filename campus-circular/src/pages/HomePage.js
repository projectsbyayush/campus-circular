import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const HomePage = () => {
  const { allResources, allUsers, stats } = useApp();
  const getOwnerAvatar = (ownerId) => allUsers.find(u => u.id === ownerId)?.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=user${ownerId}`;
  const [landingCategory, setLandingCategory] = useState("All");
  const featured = allResources.filter(r => r.isApproved && (landingCategory === "All" || r.category === landingCategory) && r.availability === "Available").slice(0, 6);

  const heroStats = [
    { icon: "fa-solid fa-users", value: stats.activeMembers, label: "Active Members", bg: "rgba(217,119,87,0.1)", color: "#D97757" },
    { icon: "fa-solid fa-box-open", value: stats.resourcesShared, label: "Resources Shared", bg: "rgba(107,142,127,0.1)", color: "#6B8E7F" },
    { icon: "fa-solid fa-arrow-right-arrow-left", value: stats.successfulExchanges, label: "Exchanges", bg: "rgba(143,163,176,0.12)", color: "#8FA3B0" },
    { icon: "fa-solid fa-piggy-bank", value: `₹${(stats.moneySaved / 1000).toFixed(0)}K`, label: "Money Saved", bg: "rgba(217,166,121,0.12)", color: "#D9A679" },
    { icon: "fa-solid fa-recycle", value: stats.resourcesReused, label: "Reused", bg: "rgba(123,163,126,0.12)", color: "#7BA37E" },
    { icon: "fa-solid fa-leaf", value: `${stats.carbonSaved}kg`, label: "CO₂ Saved", bg: "rgba(123,163,126,0.1)", color: "#7BA37E" },
  ];

  const steps = [
    { n: "01", icon: "fa-solid fa-magnifying-glass", title: "Discover", desc: "Search or ask AI — 'camera for shooting' finds the full kit." },
    { n: "02", icon: "fa-solid fa-handshake", title: "Borrow securely", desc: "Clear agreement, transparent fees + refundable deposit." },
    { n: "03", icon: "fa-solid fa-rotate-left", title: "Return & settle", desc: "Condition check, auto settlement & trust score update." },
  ];

  const categories = ["All", "Cameras", "Electronics", "Textbooks", "Sports", "Musical", "Event"];

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}>
            <div className="hero-eyebrow">
              <i className="fa-solid fa-sparkles"></i>
              Why buy what someone nearby already has?
            </div>
            <h1 className="hero-title">
              From Ownership<br />
              to <em>Access</em>
            </h1>
            <p className="hero-subtitle">
              A trusted circular economy for your campus. Borrow calculators, cameras, laptops & more — or earn by sharing what you own.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/discover" className="btn btn-primary" style={{ padding: '15px 28px', fontSize: '15px', borderRadius: '999px', fontWeight: 600 }}>
                <i className="fa-solid fa-compass"></i> Explore Resources
              </Link>
              <Link to="/ai-search" className="btn btn-secondary" style={{ padding: '15px 26px', fontSize: '15px', borderRadius: '999px', fontWeight: 600 }}>
                <i className="fa-solid fa-wand-magic-sparkles"></i> Ask AI
              </Link>
              <Link to="/list" className="btn btn-ghost" style={{ padding: '15px 22px', fontSize: '14px', borderRadius: '999px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <i className="fa-solid fa-plus"></i> List an Item
              </Link>
            </div>
            {/* Hero proof */}
            <div style={{ marginTop: '26px', display: 'flex', gap: '14px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', marginRight: '10px' }}>
                  {allUsers.slice(0,4).map((u,i) => (
                    <img key={u.id} src={u.avatar} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--bg)', marginLeft: i===0?0:'-8px', background: 'var(--bg-surface)' }} />
                  ))}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: '2px', color: 'var(--warning)', fontSize: '12px' }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                    <span style={{ color: 'var(--text)', fontWeight: 700, marginLeft: '4px' }}>4.8/5</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trusted by 487 students • 892 exchanges</div>
                </div>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'var(--border)', display: 'block' }} className="hero-divider" />
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span><i className="fa-solid fa-shield-halved" style={{ color: 'var(--success)', marginRight: '4px' }}></i>Verified</span>
                <span><i className="fa-solid fa-lock" style={{ color: 'var(--primary)', marginRight: '4px' }}></i>Deposit safe</span>
                <span><i className="fa-solid fa-leaf" style={{ color: 'var(--success)', marginRight: '4px' }}></i>2.3t CO₂ saved</span>
              </div>
            </div>

            {/* Hero preview strip - proper stuff */}
            <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'left' }}>
              {allResources.filter(r=>r.isApproved).slice(0,3).map(r => (
                <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', gap: '10px', padding: '10px', alignItems: 'center', boxShadow: 'var(--shadow-soft)' }}>
                  <img src={r.images[0]} alt={r.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name.split(' ').slice(0,2).join(' ')}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.category} • ₹{r.dailyRate}/day</div>
                    <div style={{ fontSize: '10px', color: 'var(--warning)' }}><i className="fa-solid fa-star"></i> {r.rating} • <span style={{ color: 'var(--success)' }}><i className="fa-solid fa-circle-check"></i> {r.availability}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted bar */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', padding: '14px 28px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '18px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><i className="fa-solid fa-building-columns"></i> Trusted by 487 students • 6 departments</span>
          <span style={{ display: 'flex', gap: '14px' }}>
            <span><i className="fa-solid fa-star" style={{ color: 'var(--warning)' }}></i> 4.7 avg trust</span>
            <span><i className="fa-regular fa-clock"></i> 2.3h avg response</span>
            <span><i className="fa-solid fa-rotate-left" style={{ color: 'var(--success)' }}></i> 94% on-time returns</span>
          </span>
        </div>
      </div>

      <div className="page" style={{ paddingTop: '28px' }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "28px" }}>
          {heroStats.map((s, i) => (
            <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: '16px' }}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color, borderColor: 'transparent', width: '36px', height: '36px', fontSize: '14px' }}>
                <i className={s.icon}></i>
              </div>
              <div className="stat-value" style={{ fontSize: '22px' }}>{s.value}</div>
              <div className="stat-label" style={{ fontSize: '11px' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {steps.map((s, i) => (
            <motion.div key={i} className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} style={{ padding: '18px', position: 'relative' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-faint)', marginBottom: '8px' }}>{s.n}</div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-soft)', border: '1px solid rgba(217,119,87,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '10px' }}><i className={s.icon}></i></div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{s.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Featured with filter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: "14px", gap: "12px", flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: "24px", fontWeight: 400, letterSpacing: '-0.02em' }}>Featured <em style={{ fontStyle: 'italic', color: 'var(--primary)', fontWeight: 400 }}>resources</em></h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>Tap a category — cards update instantly. Every item shows trust, price & deposit.</p>
          </div>
          <Link to="/discover" className="btn btn-secondary btn-sm" style={{ borderRadius: '999px' }}>
            View all <i className="fa-solid fa-arrow-right" style={{ fontSize: "11px" }}></i>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setLandingCategory(cat)} className={`category-pill ${landingCategory === cat ? 'active' : ''}`} style={{ flexShrink: 0 }}>
              {cat === "All" ? <i className="fa-solid fa-stars"></i> : <i className="fa-solid fa-tag" style={{ fontSize: '11px' }}></i>} {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-3">
          {featured.map((resource, i) => (
            <Link to={`/resource/${resource.id}`} key={resource.id} style={{ textDecoration: "none" }}>
              <motion.div
                className="card resource-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="card-image-wrap" style={{ position: "relative" }}>
                  <img src={resource.images[0]} alt={resource.name} className="card-image" style={{ height: '180px' }} />
                  <div className={`availability-dot ${resource.availability === "Available" ? "available" : "borrowed"}`} />
                  <div style={{ position: "absolute", inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 45%)', pointerEvents: 'none' }} />
                  <div style={{ position: "absolute", bottom: "10px", left: "10px", right: '10px', display: "flex", gap: "6px", justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span className="badge badge-neutral" style={{ backdropFilter: 'blur(8px)', background: 'rgba(28,28,26,0.85)', color: 'white', borderColor: 'rgba(255,255,255,0.12)' }}>{resource.category}</span>
                      <span className="badge badge-primary">{resource.condition}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'white', background: 'rgba(0,0,0,0.45)', padding: '4px 8px', borderRadius: '999px', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      <i className="fa-solid fa-location-dot"></i> {resource.distance}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '999px', padding: '4px 8px', fontSize: '11px', fontWeight: 600, display: 'flex', gap: '4px', alignItems: 'center', color: 'var(--warning)' }}>
                    <i className="fa-solid fa-star" style={{ fontSize: '10px' }}></i> {resource.rating}
                  </div>
                </div>
                <div className="card-body" style={{ padding: '14px 14px 12px' }}>
                  <div className="card-title" style={{ fontSize: '14px', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{resource.name}</div>
                  <div className="card-text" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '10px', minHeight: '36px' }}>{resource.description}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="resource-price" style={{ fontSize: '15px' }}>₹{resource.dailyRate}<span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>/day</span></span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}><i className="fa-solid fa-eye" style={{ marginRight: '4px' }}></i>{resource.totalBorrows} borrows</span>
                  </div>
                  <div className="resource-owner" style={{ paddingTop: '10px' }}>
                    <img src={getOwnerAvatar(resource.owner)} alt="owner" style={{ background: 'var(--bg-surface)' }} />
                    <span style={{ flex: 1 }}><i className="fa-solid fa-shield-halved" style={{ fontSize: '10px', marginRight: '4px', color: 'var(--success)' }}></i>Deposit ₹{resource.securityDeposit}</span>
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>View <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }}></i></span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {featured.length === 0 && (
          <div className="empty-state" style={{ padding: '32px' }}>
            <div className="empty-icon"><i className="fa-solid fa-box-open"></i></div>
            <h3 className="empty-state-title">No resources in {landingCategory}</h3>
            <p className="empty-state-text">Try another category or view all.</p>
          </div>
        )}

        {/* AI CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: "28px", padding: "22px", background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', flexShrink: 0 }}>
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: "18px", fontWeight: 400 }}>Describe what you need</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "2px" }}>“i need camra for shotting” — typo-tolerant AI finds the kit & ranks by trust.</p>
            </div>
          </div>
          <Link to="/ai-search" className="btn btn-primary">
            Try AI Search <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </motion.div>

        {/* Why Campus Circular */}
        <div style={{ marginTop: '36px' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', fontWeight: 400, textAlign: 'center', marginBottom: '6px' }}>Why <em style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Circular</em> works</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '18px' }}>Built for campus — trust, transparency, and sustainability by design.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {[
              { icon: "fa-solid fa-shield-halved", title: "Verified trust", desc: "Trust scores, ratings, and verified students. See history before you borrow." },
              { icon: "fa-solid fa-scale-balanced", title: "Transparent pricing", desc: "Borrowing + platform fee + refundable deposit. No hidden costs, clear settlement." },
              { icon: "fa-solid fa-wand-magic-sparkles", title: "AI discovery", desc: "Describe needs in plain language. Handles typos like 'camra' and finds the full kit." },
              { icon: "fa-solid fa-leaf", title: "Sustainable impact", desc: "Reuse over re-buy. 2.3 tonnes CO₂ saved, ₹1.5L saved by students." },
            ].map((f, i) => (
              <motion.div key={i} className="card" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} style={{ padding: '18px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '12px' }}><i className={f.icon}></i></div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ marginTop: '36px' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', fontWeight: 400, textAlign: 'center', marginBottom: '6px' }}>Loved by <em style={{ fontStyle: 'italic', color: 'var(--primary)' }}>campus</em></h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '18px' }}>Real exchanges, real trust scores.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {[
              { name: "Priya Sharma", dept: "Electronics • 4.9 trust", text: "Got the full reel kit in 2 hours — camera, tripod, mic and light. AI understood 'camra for shotting' even with typo!", avatar: allUsers.find(u=>u.name==="Priya Sharma")?.avatar },
              { name: "Arjun Mehta", dept: "Computer Science • 4.8 trust", text: "Lent my guitar 8 times, earned trust and helped juniors. Settlement is automatic — deposit returned instantly.", avatar: allUsers.find(u=>u.name==="Arjun Mehta")?.avatar },
              { name: "Sneha Patel", dept: "Commerce • 4.7 trust", text: "Borrowed textbooks for ₹20/day vs ₹1200 to buy. Saved so much, and the condition tracker is super clear.", avatar: allUsers.find(u=>u.name==="Sneha Patel")?.avatar },
            ].map((t, i) => (
              <motion.div key={i} className="card" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} style={{ padding: '18px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <img src={t.avatar} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-surface)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.dept}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: 'var(--warning)', fontSize: '12px' }}><i className="fa-solid fa-star"></i> 5.0</div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: '36px', padding: '28px', background: 'linear-gradient(135deg, var(--primary) 0%, #B85C3A 100%)', borderRadius: 'var(--radius)', color: 'white', display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', fontWeight: 400, marginBottom: '6px' }}>Ready to share or borrow?</h3>
            <p style={{ opacity: 0.9, fontSize: '13px' }}>Join 487 students saving money and carbon — list in 60 seconds or discover nearby resources.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/list" className="btn" style={{ background: 'white', color: 'var(--primary)', borderRadius: '999px', fontWeight: 600 }}>
              <i className="fa-solid fa-plus"></i> List an item
            </Link>
            <Link to="/discover" className="btn" style={{ background: 'rgba(255,255,255,0.16)', color: 'white', border: '1px solid rgba(255,255,255,0.28)', borderRadius: '999px' }}>
              <i className="fa-solid fa-compass"></i> Discover
            </Link>
          </div>
        </motion.div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-faint)', padding: '12px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '13px', color: 'var(--text-muted)' }}>Campus Circular</span> • From ownership to access • Frontend-only hackathon demo • <i className="fa-solid fa-leaf" style={{ color: 'var(--success)' }}></i> Circular economy
        </div>
      </div>
    </div>
  );
};

export default HomePage;
