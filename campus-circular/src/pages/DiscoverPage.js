import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { categories } from "../data/mockData";
import DiscoverMap from "../components/DiscoverMap";

const catIcons = {
  Electronics: "fa-solid fa-microchip",
  Cameras: "fa-solid fa-camera",
  Textbooks: "fa-solid fa-book-open",
  Sports: "fa-solid fa-football",
  Musical: "fa-solid fa-guitar",
  Tools: "fa-solid fa-screwdriver-wrench",
  Event: "fa-solid fa-lightbulb",
  Other: "fa-solid fa-box",
};

const DiscoverPage = () => {
  const { allResources, allUsers, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, sortBy, setSortBy, filters, setFilters } = useApp();
  const navigate = useNavigate();
  const getOwnerAvatar = (ownerId) => allUsers.find(u => u.id === ownerId)?.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=user${ownerId}`;
  const [view, setView] = useState("grid");

  const filteredResources = useMemo(() => {
    let result = allResources.filter((r) => r.isApproved);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    if (selectedCategory !== "All") result = result.filter((r) => r.category === selectedCategory);
    if (filters.availability !== "All") result = result.filter((r) => r.availability === filters.availability);
    if (filters.condition !== "All") result = result.filter((r) => r.condition === filters.condition);
    result = result.filter((r) => r.dailyRate <= filters.maxPrice);
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.dailyRate - b.dailyRate); break;
      case "price-high": result.sort((a, b) => b.dailyRate - a.dailyRate); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "distance": result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)); break;
      case "newest": result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      default: result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [allResources, searchQuery, selectedCategory, sortBy, filters]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Discover <em>resources</em></h1>
        <p className="page-subtitle">Find exactly what you need from your campus community — filtered by distance, trust, and availability.</p>
      </div>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search resources, categories, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="category-pills">
        <button className={`category-pill ${selectedCategory === "All" ? "active" : ""}`} onClick={() => setSelectedCategory("All")}>
          <i className="fa-solid fa-stars"></i> All
        </button>
        {categories.map((cat) => (
          <button key={cat.id} className={`category-pill ${selectedCategory === cat.name ? "active" : ""}`} onClick={() => setSelectedCategory(cat.name)}>
            <i className={catIcons[cat.name] || "fa-solid fa-box"}></i> {cat.name}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="rating">Sort by Rating</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="distance">Nearest First</option>
          <option value="newest">Newest First</option>
        </select>
        <select className="filter-select" value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })}>
          <option value="All">All Availability</option>
          <option value="Available">Available</option>
          <option value="Borrowed">Borrowed</option>
        </select>
        <select className="filter-select" value={filters.condition} onChange={(e) => setFilters({ ...filters, condition: e.target.value })}>
          <option value="All">All Conditions</option>
          <option value="New">New</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontFamily: 'JetBrains Mono, monospace' }}>
          {filteredResources.length} resources found <span style={{ color: "var(--text-muted)" }}>• {filteredResources.filter(r=>r.coordinates).length} pinpointed</span>
        </span>
        <div style={{ display: "flex", gap: "6px", background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }}>
          <button className={`btn btn-sm ${view === "grid" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("grid")} style={{ borderRadius: '999px' }} title="Grid">
            <i className="fa-solid fa-table-cells-large"></i>
          </button>
          <button className={`btn btn-sm ${view === "list" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("list")} style={{ borderRadius: '999px' }} title="List">
            <i className="fa-solid fa-list"></i>
          </button>
          <button className={`btn btn-sm ${view === "map" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("map")} style={{ borderRadius: '999px' }} title="Pinpoint map">
            <i className="fa-solid fa-map-location-dot"></i>
          </button>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
          <h3 className="empty-state-title">No resources found</h3>
          <p className="empty-state-text">Try adjusting your filters or search terms</p>
        </div>
      ) : view === "map" ? (
        <DiscoverMap resources={filteredResources} onSelect={(id) => navigate(`/resource/${id}`)} />
      ) : view === "grid" ? (
        <div className="grid grid-3">
          {filteredResources.map((resource, i) => (
            <Link to={`/resource/${resource.id}`} key={resource.id} style={{ textDecoration: "none" }}>
              <motion.div className="card resource-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div className="card-image-wrap" style={{ position: "relative" }}>
                  <img src={resource.images[0]} alt={resource.name} className="card-image" />
                  <div className={`availability-dot ${resource.availability === "Available" ? "available" : "borrowed"}`} />
                  <div style={{ position: "absolute", bottom: "10px", left: "10px", display: "flex", gap: "6px" }}>
                    <span className="badge badge-neutral" style={{ background: 'rgba(28,28,26,0.85)', backdropFilter: 'blur(8px)' }}>{resource.category}</span>
                    <span className="badge badge-primary">{resource.condition}</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-title">{resource.name}</div>
                  <div className="card-text" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{resource.description}</div>
                  <div className="resource-meta">
                    <span className="resource-price">₹{resource.dailyRate}<span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>/day</span></span>
                    <span className="resource-rating"><i className="fa-solid fa-star"></i> {resource.rating}</span>
                  </div>
                  <div className="resource-location"><i className="fa-solid fa-location-dot"></i> {resource.distance} away</div>
                  <div className="resource-owner">
                    <img src={getOwnerAvatar(resource.owner)} alt="owner" style={{ background: 'var(--bg-surface)' }} />
                    <span>Deposit ₹{resource.securityDeposit}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredResources.map((resource, i) => (
            <Link to={`/resource/${resource.id}`} key={resource.id} style={{ textDecoration: "none" }}>
              <motion.div className="card" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} style={{ display: "flex", overflow: "hidden" }}>
                <img src={resource.images[0]} alt={resource.name} style={{ width: "180px", height: "140px", objectFit: "cover" }} />
                <div className="card-body" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                      <span className="badge badge-neutral">{resource.category}</span>
                      <span className="badge badge-primary">{resource.condition}</span>
                      <span className={`badge ${resource.availability === "Available" ? "badge-success" : "badge-danger"}`}>{resource.availability}</span>
                    </div>
                    <div className="card-title">{resource.name}</div>
                    <div className="card-text">{resource.description}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="resource-price">₹{resource.dailyRate}/day</span>
                    <span className="resource-rating"><i className="fa-solid fa-star"></i> {resource.rating}</span>
                    <span className="resource-location"><i className="fa-solid fa-location-dot"></i> {resource.distance}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
