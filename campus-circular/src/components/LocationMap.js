import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon for webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationMap = ({ lat, lng, locationLabel, height = "220px", zoom = 16, onPinClick }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    if (typeof lat !== "number" || typeof lng !== "number") return;

    mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    L.control.zoom({ position: "bottomright" }).addTo(mapInstance.current);

    const marker = L.marker([lat, lng]).addTo(mapInstance.current);
    if (locationLabel) marker.bindPopup(`<b>${locationLabel}</b><br/>${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();
    if (onPinClick) marker.on("click", onPinClick);

    // Add circle for campus radius visual
    L.circle([lat, lng], { radius: 80, color: "#16A34A", fillColor: "#16A34A", fillOpacity: 0.08, weight: 1 }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [lat, lng, zoom, locationLabel, onPinClick]);

  // Update when coords change
  useEffect(() => {
    if (mapInstance.current && typeof lat === "number" && typeof lng === "number") {
      mapInstance.current.setView([lat, lng], zoom);
    }
  }, [lat, lng, zoom]);

  if (typeof lat !== "number" || typeof lng !== "number") {
    return <div style={{ height, background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><i className="fa-solid fa-location-dot" style={{ marginRight: 8 }}></i>No coordinates</div>;
  }

  return (
    <div style={{ borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)", position: "relative" }}>
      <div ref={mapRef} style={{ height, width: "100%" }} />
      <div style={{ position: "absolute", bottom: 8, left: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "999px", padding: "5px 10px", fontSize: "11px", display: "flex", gap: 6, alignItems: "center", boxShadow: "var(--shadow-soft)", zIndex: 400 }}>
        <i className="fa-solid fa-location-dot" style={{ color: "var(--primary)" }}></i>
        <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{lat.toFixed(4)}, {lng.toFixed(4)}</span>
        <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontWeight: 600 }}>Open <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 9 }}></i></a>
      </div>
    </div>
  );
};

export default LocationMap;
