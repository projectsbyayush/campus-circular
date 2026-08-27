import React, { createContext, useContext, useState, useEffect } from "react";
import { users, resources, exchanges, disputes, notifications, campusStats, pendingApprovals } from "../data/mockData";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

// Hardcoded credentials for hackathon demo
const ADMIN_CREDENTIALS = { username: "admin", password: "admin123", id: 5 };
const STUDENT_PASSWORD = "campus123"; // all demo students share this for ease

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("cc-theme") || "dark"; } catch { return "dark"; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("cc-theme", theme); } catch {}
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const [currentUser, setCurrentUser] = useState(users[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // start authenticated for demo
  const [allUsers, setAllUsers] = useState(users);
  const [allResources, setAllResources] = useState(resources);
  const [allExchanges, setAllExchanges] = useState(exchanges);
  const [allDisputes, setAllDisputes] = useState(disputes);
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [stats] = useState(campusStats);
  const [pendingList, setPendingList] = useState(pendingApprovals);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState({ availability: "All", condition: "All", maxPrice: 500, maxDistance: 5 });
  const [cart, setCart] = useState([]);
  const [activeExchanges, setActiveExchanges] = useState([]);

  const loginAs = (userId) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) { setCurrentUser(user); setIsAuthenticated(true); }
  };

  const loginWithCredentials = (username, password) => {
    const u = username.trim().toLowerCase();
    const p = password.trim();
    // Admin check
    if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
      const admin = allUsers.find(x => x.id === ADMIN_CREDENTIALS.id);
      setCurrentUser(admin);
      setIsAuthenticated(true);
      return { success: true, role: "admin" };
    }
    // also allow admin@circular.edu
    if ((u === "admin@circular.edu" || u === "admin@college.edu") && p === ADMIN_CREDENTIALS.password) {
      const admin = allUsers.find(x => x.id === ADMIN_CREDENTIALS.id);
      setCurrentUser(admin);
      setIsAuthenticated(true);
      return { success: true, role: "admin" };
    }
    // Student check — allow email, name, or id
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
      setCurrentUser(matched);
      setIsAuthenticated(true);
      return { success: true, role: "student" };
    }
    // also allow any demo student with generic password
    if (p === STUDENT_PASSWORD || p === "student123") {
      // fallback: if password is generic but username not found, pick first matching substring
      const fuzzy = allUsers.find(user => !user.isAdmin && (user.email.toLowerCase().includes(u) || user.name.toLowerCase().includes(u)));
      if (fuzzy) {
        setCurrentUser(fuzzy);
        setIsAuthenticated(true);
        return { success: true, role: "student" };
      }
    }
    return { success: false, message: "Invalid ID or password. Try admin/admin123 or any student email with campus123" };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(users[0]);
  };

  const addResource = (resource) => {
    const newResource = { ...resource, id: allResources.length + 1, owner: currentUser.id, createdAt: new Date().toISOString().split("T")[0], isApproved: false, isFlagged: false, totalBorrows: 0, rating: 0 };
    setAllResources([...allResources, newResource]);
    setPendingList([...pendingList, { id: 100 + pendingList.length + 1, resource: resource.name, owner: currentUser.id, category: resource.category, status: "Pending", submittedDate: new Date().toISOString().split("T")[0] }]);
  };

  const approveResource = (resourceId) => {
    setAllResources(allResources.map((r) => (r.id === resourceId ? { ...r, isApproved: true } : r)));
    setPendingList(pendingList.filter((p) => p.id !== resourceId));
  };
  const rejectResource = (resourceId) => setPendingList(pendingList.filter((p) => p.id !== resourceId));
  const flagResource = (resourceId) => setAllResources(allResources.map((r) => (r.id === resourceId ? { ...r, isFlagged: true } : r)));
  const suspendUser = (userId) => setAllUsers(allUsers.map((u) => (u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u)));

  const deleteResource = (resourceId) => {
    setAllResources(allResources.filter(r => r.id !== resourceId));
  };
  const toggleAvailability = (resourceId) => {
    setAllResources(allResources.map(r => r.id === resourceId ? { ...r, availability: r.availability === "Available" ? "Borrowed" : "Available" } : r));
  };
  const updateResource = (resourceId, updates) => {
    setAllResources(allResources.map(r => r.id === resourceId ? { ...r, ...updates } : r));
  };

  const initiateExchange = (resourceId, duration, startDate) => {
    const resource = allResources.find((r) => r.id === resourceId);
    if (!resource) return null;
    const days = Math.ceil(duration / 24) || 1;
    const borrowingCharge = resource.dailyRate * days;
    const platformFee = Math.round(borrowingCharge * (resource.platformFeePercent / 100));
    const totalAmount = borrowingCharge + platformFee + resource.securityDeposit;
    const newExchange = {
      id: allExchanges.length + 1, resourceId, borrowerId: currentUser.id, ownerId: resource.owner, status: "Requested",
      startDate: startDate || new Date().toISOString().split("T")[0], endDate: new Date(Date.now() + duration * 60 * 60 * 1000).toISOString().split("T")[0],
      returnDate: null, hourlyRate: resource.hourlyRate, dailyRate: resource.dailyRate, totalDays: days, borrowingCharge, platformFee, securityDeposit: resource.securityDeposit, totalAmount, lateFee: 0, damageDeduction: 0, conditionBefore: resource.conditionBefore, conditionAfter: null, agreement: false, dispute: null,
    };
    setAllExchanges([...allExchanges, newExchange]);
    setActiveExchanges([...activeExchanges, newExchange.id]);
    return newExchange;
  };

  const confirmAgreement = (exchangeId) => setAllExchanges(allExchanges.map((e) => e.id === exchangeId ? { ...e, agreement: true, status: "Accepted" } : e));
  const updateExchangeStatus = (exchangeId, status) => setAllExchanges(allExchanges.map((e) => e.id === exchangeId ? { ...e, status, returnDate: status === "Returned" ? new Date().toISOString().split("T")[0] : e.returnDate } : e));
  const raiseDispute = (exchangeId, reason, evidence = []) => {
    const newDispute = { id: allDisputes.length + 1, exchangeId, raisedBy: currentUser.id, reason, status: "Open", resolution: null, evidence, raisedDate: new Date().toISOString().split("T")[0], resolvedDate: null };
    setAllDisputes([...allDisputes, newDispute]);
    setAllExchanges(allExchanges.map((e) => e.id === exchangeId ? { ...e, dispute: newDispute.id } : e));
  };
  const markNotificationRead = (notifId) => setAllNotifications(allNotifications.map((n) => (n.id === notifId ? { ...n, read: true } : n)));

  const value = {
    theme, toggleTheme, currentUser, isAuthenticated, allUsers, allResources, allExchanges, allDisputes, allNotifications, stats, pendingList,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, sortBy, setSortBy, filters, setFilters, cart, setCart, activeExchanges,
    loginAs, loginWithCredentials, logout, addResource, approveResource, rejectResource, flagResource, suspendUser, deleteResource, toggleAvailability, updateResource, initiateExchange, confirmAgreement, updateExchangeStatus, raiseDispute, markNotificationRead,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
