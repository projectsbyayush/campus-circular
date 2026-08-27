import React, { createContext, useContext, useState, useEffect } from "react";
import { users as seedUsers, resources as seedResources, exchanges as seedExchanges, disputes as seedDisputes, notifications as seedNotifications, campusStats, pendingApprovals as seedPending } from "../data/mockData";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

const ADMIN_CREDENTIALS = { username: "admin", password: "admin123", id: 3 };
const STUDENT_PASSWORD = "campus123";

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("cc-theme") || "dark"; } catch { return "dark"; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("cc-theme", theme); } catch {}
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  // Persistent states — load once
  const [allUsers, setAllUsers] = useState(() => load("cc_users", seedUsers));
  const [allResources, setAllResources] = useState(() => load("cc_resources", seedResources));
  const [allExchanges, setAllExchanges] = useState(() => load("cc_exchanges", seedExchanges));
  const [allDisputes, setAllDisputes] = useState(() => load("cc_disputes", seedDisputes));
  const [allNotifications, setAllNotifications] = useState(() => load("cc_notifications", seedNotifications));
  const [pendingList, setPendingList] = useState(() => load("cc_pending", seedPending));
  const [currentUser, setCurrentUser] = useState(() => {
    const id = load("cc_currentUserId", 1);
    const found = (load("cc_users", seedUsers).find(u => u.id === id)) || seedUsers.find(u => u.id === id) || seedUsers[0];
    return found;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return localStorage.getItem("cc_isAuth") !== "false"; } catch { return true; }
  });

  const [stats] = useState(campusStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState({ availability: "All", condition: "All", maxPrice: 500, maxDistance: 5 });
  const [cart, setCart] = useState([]);
  const [activeExchanges, setActiveExchanges] = useState([]);

  // Migration: ensure only Ayush & Tejas (v2) — clear stale 5-user data
  useEffect(() => {
    const ver = (() => { try { return localStorage.getItem("cc_data_version"); } catch { return null; } })();
    if (ver !== "ayush-tejas-v2") {
      const oldUsers = load("cc_users", null);
      if (oldUsers && (oldUsers.length !== seedUsers.length || oldUsers[0]?.name === "Arjun Mehta")) {
        save("cc_users", seedUsers);
        save("cc_resources", seedResources);
        save("cc_exchanges", seedExchanges);
        save("cc_disputes", seedDisputes);
        save("cc_notifications", seedNotifications);
        save("cc_pending", seedPending);
        setAllUsers(seedUsers);
        setAllResources(seedResources);
        setAllExchanges(seedExchanges);
        setAllDisputes(seedDisputes);
        setAllNotifications(seedNotifications);
        setPendingList(seedPending);
        setCurrentUser(seedUsers[0]);
      }
      try { localStorage.setItem("cc_data_version", "ayush-tejas-v2"); } catch {}
    }
  }, []);

  // Persist on change
  useEffect(() => save("cc_users", allUsers), [allUsers]);
  useEffect(() => save("cc_resources", allResources), [allResources]);
  useEffect(() => save("cc_exchanges", allExchanges), [allExchanges]);
  useEffect(() => save("cc_disputes", allDisputes), [allDisputes]);
  useEffect(() => save("cc_notifications", allNotifications), [allNotifications]);
  useEffect(() => save("cc_pending", pendingList), [pendingList]);
  useEffect(() => save("cc_currentUserId", currentUser.id), [currentUser.id]);
  useEffect(() => { try { localStorage.setItem("cc_isAuth", String(isAuthenticated)); } catch {} }, [isAuthenticated]);

  // Realtime sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "cc_resources" && e.newValue) try { setAllResources(JSON.parse(e.newValue)); } catch {}
      if (e.key === "cc_exchanges" && e.newValue) try { setAllExchanges(JSON.parse(e.newValue)); } catch {}
      if (e.key === "cc_notifications" && e.newValue) try { setAllNotifications(JSON.parse(e.newValue)); } catch {}
      if (e.key === "cc_pending" && e.newValue) try { setPendingList(JSON.parse(e.newValue)); } catch {}
      if (e.key === "cc_currentUserId" && e.newValue) {
        const id = JSON.parse(e.newValue);
        const u = allUsers.find(x => x.id === id);
        if (u) setCurrentUser(u);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [allUsers]);

  const loginAs = (userId) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) { setCurrentUser(user); setIsAuthenticated(true); }
  };

  const loginWithCredentials = (username, password) => {
    const u = username.trim().toLowerCase();
    const p = password.trim();
    if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
      const admin = allUsers.find(x => x.id === ADMIN_CREDENTIALS.id);
      setCurrentUser(admin); setIsAuthenticated(true); return { success: true, role: "admin" };
    }
    if ((u === "admin@circular.edu" || u === "admin@college.edu") && p === ADMIN_CREDENTIALS.password) {
      const admin = allUsers.find(x => x.id === ADMIN_CREDENTIALS.id);
      setCurrentUser(admin); setIsAuthenticated(true); return { success: true, role: "admin" };
    }
    const matched = allUsers.find(user =>
      !user.isAdmin && (
        user.email.toLowerCase() === u ||
        user.name.toLowerCase() === u ||
        user.name.toLowerCase().replace(/\s+/g, "") === u ||
        `student${user.id}` === u ||
        user.phone.replace(/\s/g, "") === u
      )
    );
    if (matched && (p === STUDENT_PASSWORD || p === "student123" || p === "123456")) {
      setCurrentUser(matched); setIsAuthenticated(true); return { success: true, role: "student" };
    }
    if (p === STUDENT_PASSWORD || p === "student123") {
      const fuzzy = allUsers.find(user => !user.isAdmin && (user.email.toLowerCase().includes(u) || user.name.toLowerCase().includes(u)));
      if (fuzzy) { setCurrentUser(fuzzy); setIsAuthenticated(true); return { success: true, role: "student" }; }
    }
    return { success: false, message: "Invalid ID or password. Try admin/admin123 or ayush@college.edu / campus123, tejas@college.edu / campus123" };
  };

  const logout = () => { setIsAuthenticated(false); setCurrentUser(allUsers.find(u=>u.id===1) || allUsers[0]); };

  const addResource = (resource) => {
    const newId = Math.max(0, ...allResources.map(r=>r.id)) + 1;
    const newResource = { ...resource, id: newId, owner: currentUser.id, createdAt: new Date().toISOString().split("T")[0], isApproved: false, isFlagged: false, totalBorrows: 0, rating: 0 };
    setAllResources(prev => [...prev, newResource]);
    setPendingList(prev => [...prev, { id: 100 + prev.length + 1, resource: resource.name, owner: currentUser.id, category: resource.category, status: "Pending", submittedDate: new Date().toISOString().split("T")[0] }]);
    // bump owner's shared count in realtime
    setAllUsers(prev => prev.map(u => u.id===currentUser.id ? { ...u, totalShared: (u.totalShared||0)+1 } : u));
  };

  const approveResource = (resourceId) => {
    setAllResources(prev => prev.map((r) => (r.id === resourceId ? { ...r, isApproved: true } : r)));
    setPendingList(prev => prev.filter((p) => p.id !== resourceId));
  };
  const rejectResource = (resourceId) => setPendingList(prev => prev.filter((p) => p.id !== resourceId));
  const flagResource = (resourceId) => setAllResources(prev => prev.map((r) => (r.id === resourceId ? { ...r, isFlagged: true } : r)));
  const suspendUser = (userId) => setAllUsers(prev => prev.map((u) => (u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u)));
  const deleteResource = (resourceId) => setAllResources(prev => prev.filter(r => r.id !== resourceId));
  const toggleAvailability = (resourceId) => setAllResources(prev => prev.map(r => r.id === resourceId ? { ...r, availability: r.availability === "Available" ? "Borrowed" : "Available" } : r));
  const updateResource = (resourceId, updates) => setAllResources(prev => prev.map(r => r.id === resourceId ? { ...r, ...updates } : r));

  const initiateExchange = (resourceId, duration, startDate) => {
    const resource = allResources.find((r) => r.id === resourceId);
    if (!resource) return null;
    if (resource.owner === currentUser.id) return null; // cannot borrow own
    const days = Math.ceil(duration / 24) || 1;
    const borrowingCharge = resource.dailyRate * days;
    const platformFee = Math.round(borrowingCharge * (resource.platformFeePercent / 100));
    const totalAmount = borrowingCharge + platformFee + resource.securityDeposit;
    const newId = Math.max(0, ...allExchanges.map(e=>e.id)) + 1;
    const newExchange = {
      id: newId, resourceId, borrowerId: currentUser.id, ownerId: resource.owner, status: "Requested",
      startDate: startDate || new Date().toISOString().split("T")[0], endDate: new Date(Date.now() + duration * 60 * 60 * 1000).toISOString().split("T")[0],
      returnDate: null, hourlyRate: resource.hourlyRate, dailyRate: resource.dailyRate, totalDays: days, borrowingCharge, platformFee, securityDeposit: resource.securityDeposit, totalAmount, lateFee: 0, damageDeduction: 0, conditionBefore: resource.conditionBefore, conditionAfter: null, agreement: false, dispute: null,
    };
    setAllExchanges(prev => [...prev, newExchange]);
    setActiveExchanges(prev => [...prev, newExchange.id]);
    // realtime notification to owner
    const owner = allUsers.find(u=>u.id===resource.owner);
    const borrower = currentUser;
    const notif = { id: Date.now(), userId: owner.id, type: "request", message: `${borrower.name} requested "${resource.name}"`, time: "just now", read: false };
    setAllNotifications(prev => [notif, ...prev]);
    // update borrower's profile stats instantly
    setAllUsers(prev => prev.map(u => {
      if (u.id === borrower.id) return { ...u, successfulExchanges: (u.successfulExchanges||0)+0 };
      return u;
    }));
    return newExchange;
  };

  const confirmAgreement = (exchangeId) => setAllExchanges(prev => prev.map((e) => e.id === exchangeId ? { ...e, agreement: true, status: "Accepted" } : e));
  const updateExchangeStatus = (exchangeId, status) => {
    setAllExchanges(prev => prev.map((e) => e.id === exchangeId ? { ...e, status, returnDate: status === "Returned" ? new Date().toISOString().split("T")[0] : e.returnDate } : e));
    // notify other party
    const ex = allExchanges.find(e=>e.id===exchangeId);
    if (ex) {
      const otherId = currentUser.id === ex.borrowerId ? ex.ownerId : ex.borrowerId;
      const notif = { id: Date.now()+1, userId: otherId, type: "update", message: `Exchange #${exchangeId} is now ${status}`, time: "just now", read: false };
      setAllNotifications(prev => [notif, ...prev]);
    }
  };
  const raiseDispute = (exchangeId, reason, evidence = []) => {
    const newId = Math.max(0, ...allDisputes.map(d=>d.id)) + 1;
    const newDispute = { id: newId, exchangeId, raisedBy: currentUser.id, reason, status: "Open", resolution: null, evidence, raisedDate: new Date().toISOString().split("T")[0], resolvedDate: null };
    setAllDisputes(prev => [...prev, newDispute]);
    setAllExchanges(prev => prev.map((e) => e.id === exchangeId ? { ...e, dispute: newDispute.id } : e));
  };
  const markNotificationRead = (notifId) => setAllNotifications(prev => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)));

  const resetDemo = () => {
    try {
      localStorage.removeItem("cc_resources");
      localStorage.removeItem("cc_exchanges");
      localStorage.removeItem("cc_disputes");
      localStorage.removeItem("cc_notifications");
      localStorage.removeItem("cc_pending");
      localStorage.removeItem("cc_currentUserId");
    } catch {}
    setAllResources(seedResources);
    setAllExchanges(seedExchanges);
    setAllDisputes(seedDisputes);
    setAllNotifications(seedNotifications);
    setPendingList(seedPending);
    setAllUsers(seedUsers);
    setCurrentUser(seedUsers[0]);
  };

  const value = {
    theme, toggleTheme, currentUser, isAuthenticated, allUsers, allResources, allExchanges, allDisputes, allNotifications, stats, pendingList,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, sortBy, setSortBy, filters, setFilters, cart, setCart, activeExchanges,
    loginAs, loginWithCredentials, logout, addResource, approveResource, rejectResource, flagResource, suspendUser, deleteResource, toggleAvailability, updateResource, initiateExchange, confirmAgreement, updateExchangeStatus, raiseDispute, markNotificationRead, resetDemo
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
