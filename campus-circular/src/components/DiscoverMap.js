import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DiscoverMap = ({ resources, onSelect }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const center = [28.5445, 77.1925];
    mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView(center, 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap", maxZoom: 19 }).addTo(mapInstance.current);
    L.control.zoom({ position: "bottomright" }).addTo(mapInstance.current);
    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    // clear existing markers (keep tile layer)
    mapInstance.current.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) mapInstance.current.removeLayer(layer);
    });
    // add markers
    const group = [];
    resources.forEach(r => {
      if (!r.coordinates) return;
      const color = r.availability === "Available" ? "#16A34A" : "#DC2626";
      const marker = L.circleMarker([r.coordinates.lat, r.coordinates.lng], {
        radius: 8, color: "white", weight: 2, fillColor: color, fillOpacity: 0.95
      }).addTo(mapInstance.current);
      marker.bindPopup(`<b>${r.name}</b><br/>${r.category} • ₹${r.dailyRate}/day<br/>${r.location}<br/><i style="color:${color}">${r.availability}</i>`);
      marker.on("click", () => onSelect && onSelect(r.id));
      group.push([r.coordinates.lat, r.coordinates.lng]);
    });
    // campus center marker
    L.marker([28.5445, 77.1925], {
      icon: L.divIcon({ html: '<div style="background:#2563EB;color:white;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><i class="fa-solid fa-crosshairs" style="font-size:10px"></i></div>', className: "", iconSize: [22,22] })
    }).addTo(mapInstance.current).bindPopup("<b>Campus Center</b>");
    if (group.length) {
      const bounds = L.latLngBounds(group);
      bounds.extend([28.5445, 77.1925]);
      mapInstance.current.fitBounds(bounds.pad(0.2));
    }
  }, [resources, onSelect]);

  if (!resources.length) {
    return <div style={{ height: 400, background: "var(--bg-surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>No resources to show on map</div>;
  }

  return (
    <div style={{ borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)", position: "relative" }}>
      <div ref={mapRef} style={{ height: 460, width: "100%" }} />
      <div style={{ position: "absolute", top: 10, left: 10, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 999, padding: "6px 12px", fontSize: 11, display: "flex", gap: 10, zIndex: 400 }}>
        <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#16A34A", border: "1px solid white" }}></span> Available</span>
        <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#DC2626", border: "1px solid white" }}></span> Borrowed</span>
        <span><i className="fa-solid fa-crosshairs" style={{ color: "#2563EB" }}></i> Campus center</span>
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 10, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 999, padding: "6px 10px", fontSize: 11, zIndex: 400 }}>
        <i className="fa-solid fa-map-location-dot" style={{ color: "var(--primary)" }}></i> Pinpoint • click pin to view • drag to explore
      </div>
    </div>
  );
};

export default DiscoverMap;
