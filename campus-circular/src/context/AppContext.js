import React, { createContext, useContext, useState, useEffect } from "react";
import {
  users as seedUsers,
  resources as seedResources,
  exchanges as seedExchanges,
  disputes as seedDisputes,
  notifications as seedNotifications,
  campusStats,
  pendingApprovals as seedPending,
  getLocalItemImage,
} from "../data/mockData";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

const ADMIN_CREDENTIALS = { username: "admin", password: "admin123", id: 3 };
const STUDENT_PASSWORD = "campus123";

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("cc-theme") || "dark";
    } catch {
      return "dark";
    }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("cc-theme", theme);
    } catch {}
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Persistent states — load once
  const [allUsers, setAllUsers] = useState(() => load("cc_users", seedUsers));
  const [allResources, setAllResources] = useState(() => {
    const loaded = load("cc_resources", seedResources);
    // patch older stored resources that lack isPublic
    const patched = loaded.map((r) => {
      const localImage = getLocalItemImage(r.name);
      return {
        ...r,
        ...(r.isPublic === undefined ? { isPublic: true } : {}),
        ...(localImage ? { images: [localImage] } : {}),
      };
    });
    // version bump if needed
    if (loaded !== patched) save("cc_resources", patched);
    return patched;
  });
  const [allExchanges, setAllExchanges] = useState(() => {
    const loaded = load("cc_exchanges", seedExchanges);
    const patched = loaded.map((e) =>
      e.timeline
        ? e
        : {
            ...e,
            timeline: [
              {
                status: e.status,
                at: e.startDate || new Date().toLocaleDateString(),
                by: e.borrowerId,
              },
            ],
          },
    );
    if (patched.some((e, i) => !loaded[i]?.timeline))
      save("cc_exchanges", patched);
    return patched;
  });
  const [allDisputes, setAllDisputes] = useState(() =>
    load("cc_disputes", seedDisputes),
  );
  const [allNotifications, setAllNotifications] = useState(() =>
    load("cc_notifications", seedNotifications),
  );
  const [pendingList, setPendingList] = useState(() =>
    load("cc_pending", seedPending),
  );
  // Reviews: {id, resourceId, userId, userName, avatar, rating, comment, at, helpful}
  const [allReviews, setAllReviews] = useState(() => load("cc_reviews", []));
  const [currentUser, setCurrentUser] = useState(() => {
    const id = load("cc_currentUserId", 1);
    const found =
      load("cc_users", seedUsers).find((u) => u.id === id) ||
      seedUsers.find((u) => u.id === id) ||
      seedUsers[0];
    return found;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem("cc_isAuth") !== "false";
    } catch {
      return true;
    }
  });

  const [stats] = useState(campusStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState({
    availability: "All",
    condition: "All",
    maxPrice: 500,
    maxDistance: 5,
  });
  const [cart, setCart] = useState([]);
  const [activeExchanges, setActiveExchanges] = useState([]);

  // Migration: ensure only Ayush & Tejas (v2) — clear stale 5-user data
  useEffect(() => {
    const ver = (() => {
      try {
        return localStorage.getItem("cc_data_version");
      } catch {
        return null;
      }
    })();
    if (ver !== "ayush-tejas-v2") {
      const oldUsers = load("cc_users", null);
      if (
        oldUsers &&
        (oldUsers.length !== seedUsers.length ||
          oldUsers[0]?.name === "Arjun Mehta")
      ) {
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
      try {
        localStorage.setItem("cc_data_version", "ayush-tejas-v2");
      } catch {}
    }
  }, []);

  // Persist on change
  useEffect(() => save("cc_users", allUsers), [allUsers]);
  useEffect(() => save("cc_resources", allResources), [allResources]);
  useEffect(() => save("cc_exchanges", allExchanges), [allExchanges]);
  useEffect(() => save("cc_disputes", allDisputes), [allDisputes]);
  useEffect(
    () => save("cc_notifications", allNotifications),
    [allNotifications],
  );
  useEffect(() => save("cc_pending", pendingList), [pendingList]);
  useEffect(() => save("cc_reviews", allReviews), [allReviews]);
  useEffect(() => save("cc_currentUserId", currentUser.id), [currentUser.id]);
  useEffect(() => {
    try {
      localStorage.setItem("cc_isAuth", String(isAuthenticated));
    } catch {}
  }, [isAuthenticated]);

  // Realtime sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "cc_resources" && e.newValue)
        try {
          setAllResources(JSON.parse(e.newValue));
        } catch {}
      if (e.key === "cc_exchanges" && e.newValue)
        try {
          setAllExchanges(JSON.parse(e.newValue));
        } catch {}
      if (e.key === "cc_notifications" && e.newValue)
        try {
          setAllNotifications(JSON.parse(e.newValue));
        } catch {}
      if (e.key === "cc_pending" && e.newValue)
        try {
          setPendingList(JSON.parse(e.newValue));
        } catch {}
      if (e.key === "cc_reviews" && e.newValue)
        try {
          setAllReviews(JSON.parse(e.newValue));
        } catch {}
      if (e.key === "cc_currentUserId" && e.newValue) {
        const id = JSON.parse(e.newValue);
        const u = allUsers.find((x) => x.id === id);
        if (u) setCurrentUser(u);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [allUsers]);

  const loginAs = (userId) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  const loginWithCredentials = (username, password) => {
    const u = username.trim().toLowerCase();
    const p = password.trim();
    if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
      const admin = allUsers.find((x) => x.id === ADMIN_CREDENTIALS.id);
      setCurrentUser(admin);
      setIsAuthenticated(true);
      return { success: true, role: "admin" };
    }
    if (
      (u === "admin@circular.edu" || u === "admin@college.edu") &&
      p === ADMIN_CREDENTIALS.password
    ) {
      const admin = allUsers.find((x) => x.id === ADMIN_CREDENTIALS.id);
      setCurrentUser(admin);
      setIsAuthenticated(true);
      return { success: true, role: "admin" };
    }
    const matched = allUsers.find(
      (user) =>
        !user.isAdmin &&
        (user.email.toLowerCase() === u ||
          user.name.toLowerCase() === u ||
          user.name.toLowerCase().replace(/\s+/g, "") === u ||
          `student${user.id}` === u ||
          user.phone.replace(/\s/g, "") === u),
    );
    if (
      matched &&
      (p === STUDENT_PASSWORD || p === "student123" || p === "123456")
    ) {
      setCurrentUser(matched);
      setIsAuthenticated(true);
      return { success: true, role: "student" };
    }
    if (p === STUDENT_PASSWORD || p === "student123") {
      const fuzzy = allUsers.find(
        (user) =>
          !user.isAdmin &&
          (user.email.toLowerCase().includes(u) ||
            user.name.toLowerCase().includes(u)),
      );
      if (fuzzy) {
        setCurrentUser(fuzzy);
        setIsAuthenticated(true);
        return { success: true, role: "student" };
      }
    }
    return {
      success: false,
      message:
        "Invalid ID or password. Try admin/admin123 or ayush@college.edu / campus123, tejas@college.edu / campus123",
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(allUsers.find((u) => u.id === 1) || allUsers[0]);
  };

  const addResource = (resource) => {
    const newId = Math.max(0, ...allResources.map((r) => r.id)) + 1;
    // For Ayush ↔ Tejas demo, auto-approve so other user sees instantly; admin can still flag
    const newResource = {
      ...resource,
      id: newId,
      owner: currentUser.id,
      createdAt: new Date().toISOString().split("T")[0],
      isApproved: true,
      isFlagged: false,
      isPublic: resource.isPublic !== false,
      totalBorrows: 0,
      rating: 0,
    };
    setAllResources((prev) => [...prev, newResource]);
    // No pending needed when auto-approved, but keep for admin log
    // bump owner's shared count in realtime
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, totalShared: (u.totalShared || 0) + 1 }
          : u,
      ),
    );
  };

  const approveResource = (resourceId) => {
    setAllResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, isApproved: true } : r)),
    );
    setPendingList((prev) => prev.filter((p) => p.id !== resourceId));
  };
  const rejectResource = (resourceId) =>
    setPendingList((prev) => prev.filter((p) => p.id !== resourceId));
  const flagResource = (resourceId) =>
    setAllResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, isFlagged: true } : r)),
    );
  const suspendUser = (userId) =>
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u,
      ),
    );
  const createUser = (data) => {
    const newId = Math.max(0, ...allUsers.map((u) => u.id)) + 1;
    const newUser = {
      id: newId,
      name: data.name,
      department: data.department || "General",
      year: data.year || "1st Year",
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      verified: true,
      trustScore: 4.5,
      ratings: 4.5,
      successfulExchanges: 0,
      lateReturns: 0,
      disputes: 0,
      totalShared: 0,
      moneySaved: 0,
      bio: data.bio || "New campus member",
      phone: data.phone || "",
      email:
        data.email ||
        `${data.name.toLowerCase().replace(/\s+/g, "")}@college.edu`,
      joinDate: new Date().toISOString().split("T")[0],
      isSuspended: false,
      isAdmin: false,
    };
    setAllUsers((prev) => [...prev, newUser]);
    return newUser;
  };
  const deleteResource = (resourceId) => {
    setAllResources((prev) => prev.filter((r) => r.id !== resourceId));
    setAllExchanges((prev) => prev.filter((e) => e.resourceId !== resourceId));
    setPendingList((prev) => prev.filter((p) => p.id !== resourceId));
  };
  const toggleAvailability = (resourceId) =>
    setAllResources((prev) =>
      prev.map((r) =>
        r.id === resourceId
          ? {
              ...r,
              availability:
                r.availability === "Available" ? "Borrowed" : "Available",
            }
          : r,
      ),
    );
  const togglePublic = (resourceId) =>
    setAllResources((prev) =>
      prev.map((r) =>
        r.id === resourceId ? { ...r, isPublic: !r.isPublic } : r,
      ),
    );
  const updateResource = (resourceId, updates) =>
    setAllResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, ...updates } : r)),
    );
  const addConditionReport = (resourceId, report) => {
    const entry = {
      ...report,
      id: Date.now(),
      by: currentUser.id,
      at: nowStamp(),
      byName: currentUser.name,
    };
    setAllResources((prev) =>
      prev.map((r) =>
        r.id === resourceId
          ? { ...r, conditionReports: [...(r.conditionReports || []), entry] }
          : r,
      ),
    );
    // also add to exchange if active borrowing exists for that resource
    const active = allExchanges.find(
      (e) =>
        e.resourceId === resourceId &&
        [
          "Borrowed",
          "Return Due",
          "Requested",
          "Accepted",
          "Handover",
        ].includes(e.status),
    );
    if (active)
      setAllExchanges((prev) =>
        prev.map((e) =>
          e.id === active.id
            ? { ...e, conditionReports: [...(e.conditionReports || []), entry] }
            : e,
        ),
      );
  };
  const addExchangeConditionReport = (exchangeId, report) => {
    const entry = {
      ...report,
      id: Date.now(),
      by: currentUser.id,
      at: nowStamp(),
      byName: currentUser.name,
    };
    setAllExchanges((prev) =>
      prev.map((e) =>
        e.id === exchangeId
          ? {
              ...e,
              conditionReports: [...(e.conditionReports || []), entry],
              conditionAfter: report.checklist || e.conditionAfter,
            }
          : e,
      ),
    );
  };

  const revokeExchange = (exchangeId) => {
    const ex = allExchanges.find((e) => e.id === exchangeId);
    if (!ex || ex.borrowerId !== currentUser.id) return;
    if (!["Requested", "Accepted"].includes(ex.status)) return;
    setAllExchanges((prev) => prev.filter((e) => e.id !== exchangeId));
    const notif = {
      id: Date.now(),
      userId: ex.ownerId,
      type: "update",
      exchangeId,
      message: `${currentUser.name} revoked request #${exchangeId} for "${allResources.find((r) => r.id === ex.resourceId)?.name || "item"}"`,
      time: "just now",
      read: false,
    };
    setAllNotifications((prev) => [notif, ...prev]);
  };
  const cancelExchange = (exchangeId) => {
    const ex = allExchanges.find((e) => e.id === exchangeId);
    if (!ex || ex.ownerId !== currentUser.id) return;
    if (ex.status !== "Requested") return;
    setAllExchanges((prev) => prev.filter((e) => e.id !== exchangeId));
    const notif = {
      id: Date.now() + 2,
      userId: ex.borrowerId,
      type: "update",
      exchangeId,
      message: `Owner declined your request #${exchangeId}`,
      time: "just now",
      read: false,
    };
    setAllNotifications((prev) => [notif, ...prev]);
  };
  const deleteExchange = (exchangeId) => {
    const ex = allExchanges.find((e) => e.id === exchangeId);
    if (!ex) return;
    // Borrower must NOT delete active borrowing — only owner can delete, and only when completed/returned/rated or revoked
    const isBorrower = ex.borrowerId === currentUser.id;
    const isOwner = ex.ownerId === currentUser.id;
    if (isBorrower && !isOwner) {
      // borrower can only revoke when Requested/Accepted, not delete Borrowed/ReturnDue etc.
      if (
        !["Rated", "Returned", "Settlement", "Inspection"].includes(ex.status)
      )
        return;
      // even then, borrower delete is disallowed — owner controls lifecycle
      return;
    }
    setAllExchanges((prev) => prev.filter((e) => e.id !== exchangeId));
  };

  const nowStamp = () =>
    new Date().toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const initiateExchange = (resourceId, duration, startDate) => {
    const resource = allResources.find((r) => r.id === resourceId);
    if (!resource) return null;
    if (resource.owner === currentUser.id) return null;
    const isDonate = resource.listingType === "donate";
    const days = isDonate ? 0 : Math.ceil(duration / 24) || 1;
    const borrowingCharge = isDonate ? 0 : resource.dailyRate * days;
    const platformFee = isDonate
      ? 0
      : Math.round(borrowingCharge * (resource.platformFeePercent / 100));
    const totalAmount = isDonate
      ? 0
      : borrowingCharge + platformFee + resource.securityDeposit;
    const newId = Math.max(0, ...allExchanges.map((e) => e.id)) + 1;
    const start = startDate || new Date().toISOString().split("T")[0];
    const end = isDonate
      ? start
      : new Date(Date.now() + duration * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
    const newExchange = {
      id: newId,
      resourceId,
      borrowerId: currentUser.id,
      ownerId: resource.owner,
      status: "Requested",
      startDate: start,
      endDate: end,
      returnDate: null,
      hourlyRate: isDonate ? 0 : resource.hourlyRate,
      dailyRate: isDonate ? 0 : resource.dailyRate,
      totalDays: days,
      borrowingCharge,
      platformFee,
      securityDeposit: isDonate ? 0 : resource.securityDeposit,
      totalAmount,
      lateFee: 0,
      damageDeduction: 0,
      conditionBefore: resource.conditionBefore,
      conditionAfter: null,
      agreement: false,
      dispute: null,
      isDonate,
      timeline: [{ status: "Requested", at: nowStamp(), by: currentUser.id }],
    };
    setAllExchanges((prev) => [...prev, newExchange]);
    setActiveExchanges((prev) => [...prev, newExchange.id]);
    const owner = allUsers.find((u) => u.id === resource.owner);
    const borrower = currentUser;
    const notif = {
      id: Date.now(),
      userId: owner.id,
      type: "request",
      exchangeId: newId,
      resourceId,
      message: `${borrower.name} ${isDonate ? "wants your donation" : "requested"} "${resource.name}"${isDonate ? " — FREE" : ` — due ${end}`}`,
      time: "just now",
      read: false,
    };
    setAllNotifications((prev) => [notif, ...prev]);
    return newExchange;
  };

  const confirmAgreement = (exchangeId) =>
    setAllExchanges((prev) =>
      prev.map((e) => {
        if (e.id !== exchangeId) return e;
        const tl = [
          ...(e.timeline || []),
          { status: "Accepted", at: nowStamp(), by: currentUser.id },
        ];
        // For donate, auto-jump to Donated after accept
        if (e.isDonate) {
          const tl2 = [
            ...tl,
            { status: "Donated", at: nowStamp(), by: currentUser.id },
          ];
          return { ...e, agreement: true, status: "Donated", timeline: tl2 };
        }
        return { ...e, agreement: true, status: "Accepted", timeline: tl };
      }),
    );
  const updateExchangeStatus = (exchangeId, status) => {
    setAllExchanges((prev) =>
      prev.map((e) => {
        if (e.id !== exchangeId) return e;
        // Donate flow: Requested -> Accepted -> Donated -> Completed
        let finalStatus = status;
        if (e.isDonate && status === "Handover") finalStatus = "Donated";
        if (e.isDonate && status === "Borrowed") finalStatus = "Donated";
        const tl = [
          ...(e.timeline || []),
          { status: finalStatus, at: nowStamp(), by: currentUser.id },
        ];
        // Donated is terminal for donate (like Rated for borrow)
        return {
          ...e,
          status: finalStatus,
          returnDate:
            finalStatus === "Returned" || finalStatus === "Donated"
              ? new Date().toISOString().split("T")[0]
              : e.returnDate,
          timeline: tl,
        };
      }),
    );
    const ex = allExchanges.find((e) => e.id === exchangeId);
    if (ex) {
      const otherId =
        currentUser.id === ex.borrowerId ? ex.ownerId : ex.borrowerId;
      const notif = {
        id: Date.now() + 1,
        userId: otherId,
        type: "update",
        exchangeId,
        message: `Exchange #${exchangeId} is now ${status}${status === "Rated" || status === "Donated" ? " — Completed" : ""}${ex.isDonate ? " (donation)" : " • due " + ex.endDate}`,
        time: "just now",
        read: false,
      };
      setAllNotifications((prev) => [notif, ...prev]);
    }
  };
  const raiseDispute = (exchangeId, reason, evidence = []) => {
    const newId = Math.max(0, ...allDisputes.map((d) => d.id)) + 1;
    const newDispute = {
      id: newId,
      exchangeId,
      raisedBy: currentUser.id,
      reason,
      status: "Open",
      resolution: null,
      evidence,
      raisedDate: new Date().toISOString().split("T")[0],
      resolvedDate: null,
    };
    setAllDisputes((prev) => [...prev, newDispute]);
    setAllExchanges((prev) =>
      prev.map((e) =>
        e.id === exchangeId ? { ...e, dispute: newDispute.id } : e,
      ),
    );
  };
  const markNotificationRead = (notifId) =>
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)),
    );

  const addReview = (resourceId, { rating, comment }) => {
    const review = {
      id: Date.now(),
      resourceId,
      userId: currentUser.id,
      userName: currentUser.name,
      avatar: currentUser.avatar,
      rating: parseInt(rating) || 5,
      comment: comment.trim(),
      at: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      helpful: 0,
    };
    setAllReviews((prev) => [review, ...prev]);
    // update resource rating live
    setAllResources((prev) =>
      prev.map((r) => {
        if (r.id !== resourceId) return r;
        const reviewsFor = [
          ...allReviews.filter((x) => x.resourceId === resourceId),
          review,
        ];
        const avg =
          reviewsFor.reduce((s, x) => s + x.rating, 0) / reviewsFor.length;
        return {
          ...r,
          rating: Number(avg.toFixed(1)),
          totalBorrows: r.totalBorrows,
        };
      }),
    );
    // notify owner
    const res = allResources.find((r) => r.id === resourceId);
    if (res && res.owner !== currentUser.id) {
      const notif = {
        id: Date.now() + 5,
        userId: res.owner,
        type: "review",
        resourceId,
        message: `${currentUser.name} reviewed "${res.name}" — ${rating}★`,
        time: "just now",
        read: false,
      };
      setAllNotifications((prev) => [notif, ...prev]);
    }
    return review;
  };
  const deleteReview = (reviewId) =>
    setAllReviews((prev) => prev.filter((r) => r.id !== reviewId));
  const helpfulReview = (reviewId) =>
    setAllReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r,
      ),
    );

  const resetDemo = () => {
    try {
      localStorage.removeItem("cc_resources");
      localStorage.removeItem("cc_exchanges");
      localStorage.removeItem("cc_disputes");
      localStorage.removeItem("cc_notifications");
      localStorage.removeItem("cc_pending");
      localStorage.removeItem("cc_reviews");
      localStorage.removeItem("cc_currentUserId");
    } catch {}
    setAllResources(seedResources);
    setAllExchanges(seedExchanges);
    setAllDisputes(seedDisputes);
    setAllNotifications(seedNotifications);
    setPendingList(seedPending);
    setAllReviews([]);
    setAllUsers(seedUsers);
    setCurrentUser(seedUsers[0]);
  };

  const value = {
    theme,
    toggleTheme,
    currentUser,
    isAuthenticated,
    allUsers,
    allResources,
    allExchanges,
    allDisputes,
    allNotifications,
    allReviews,
    stats,
    pendingList,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    cart,
    setCart,
    activeExchanges,
    loginAs,
    loginWithCredentials,
    logout,
    addResource,
    approveResource,
    rejectResource,
    flagResource,
    suspendUser,
    createUser,
    deleteResource,
    toggleAvailability,
    togglePublic,
    updateResource,
    addConditionReport,
    addExchangeConditionReport,
    initiateExchange,
    confirmAgreement,
    updateExchangeStatus,
    revokeExchange,
    cancelExchange,
    deleteExchange,
    raiseDispute,
    markNotificationRead,
    addReview,
    deleteReview,
    helpfulReview,
    resetDemo,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
