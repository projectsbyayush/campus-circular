import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CAMPUS_CENTER = { lat: 28.5445, lng: 77.1925 };

const CAMPUS_PRESETS = [
  { label: "Hostel Block A", lat: 28.5458, lng: 77.1922 },
  { label: "Girls Hostel", lat: 28.5432, lng: 77.1935 },
  { label: "CS Department, Lab 3", lat: 28.5468, lng: 77.1912 },
  { label: "Media Center", lat: 28.5472, lng: 77.1942 },
  { label: "Central Library", lat: 28.5445, lng: 77.1928 },
  { label: "Sports Complex", lat: 28.5422, lng: 77.19 },
  { label: "Music Room, Block C", lat: 28.5438, lng: 77.1952 },
  { label: "Hostel Block B", lat: 28.5442, lng: 77.19 },
];

const LocationPicker = ({ value, onChange }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState(value?.coordinates || CAMPUS_CENTER);
  const [label, setLabel] = useState(value?.location || "");

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([coords.lat, coords.lng], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap", maxZoom: 19 }).addTo(mapInstance.current);
    L.control.zoom({ position: "bottomright" }).addTo(mapInstance.current);
    markerRef.current = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(mapInstance.current);
    markerRef.current.on("dragend", () => {
      const p = markerRef.current.getLatLng();
      setCoords({ lat: p.lat, lng: p.lng });
      onChange && onChange({ location: label || `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`, coordinates: { lat: p.lat, lng: p.lng } });
    });
    mapInstance.current.on("click", (e) => {
      const { lat, lng } = e.latlng;
      markerRef.current.setLatLng([lat, lng]);
      setCoords({ lat, lng });
      onChange && onChange({ location: label || `${lat.toFixed(4)}, ${lng.toFixed(4)}`, coordinates: { lat, lng } });
    });
    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
    };
  }, []);

  useEffect(() => {
    if (markerRef.current) markerRef.current.setLatLng([coords.lat, coords.lng]);
    if (mapInstance.current) mapInstance.current.setView([coords.lat, coords.lng], 16);
  }, [coords.lat, coords.lng]);

  const handlePreset = (preset) => {
    setCoords({ lat: preset.lat, lng: preset.lng });
    setLabel(preset.label);
    onChange && onChange({ location: preset.label, coordinates: { lat: preset.lat, lng: preset.lng } });
  };

  const handleLabelChange = (e) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    onChange && onChange({ location: newLabel, coordinates: coords });
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {CAMPUS_PRESETS.slice(0, 6).map(p => (
          <button key={p.label} type="button" onClick={() => handlePreset(p)} className="btn btn-secondary btn-sm" style={{ borderRadius: "999px", fontSize: 11 }}>
            <i className="fa-solid fa-location-dot" style={{ color: "var(--primary)" }}></i> {p.label.split(",")[0]}
          </button>
        ))}
      </div>
      <div style={{ borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)", position: "relative" }}>
        <div ref={mapRef} style={{ height: "260px", width: "100%" }} />
        <div style={{ position: "absolute", top: 8, left: 8, right: 8, display: "flex", gap: 8, zIndex: 400 }}>
          <input className="form-input" placeholder="Location label e.g., Hostel Block A, Room 312" value={label} onChange={handleLabelChange} style={{ flex: 1, background: "var(--bg-card)", backdropFilter: "blur(8px)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 8, left: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "999px", padding: "5px 10px", fontSize: 11, display: "flex", gap: 6, alignItems: "center", zIndex: 400 }}>
          <i className="fa-solid fa-crosshairs" style={{ color: "var(--primary)" }}></i>
          <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
          <span style={{ color: "var(--text-muted)" }}>• click or drag pin to pinpoint</span>
        </div>
      </div>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}><i className="fa-solid fa-circle-info"></i> Pinpoint shown on resource card & detail map. Distance auto-calculated from campus center.</p>
    </div>
  );
};

export default LocationPicker;
