// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket, connectSocket, disconnectSocket } from "../socketClient.js";
import AddUser from "./AddUser";
import UsersList from "./UsersList";
import Sidebar from "./Sidebar";
import "./admin.css";
import Header from "./Header";

export default function AdminDashboard() {
  // ----- users (كما في الكود الأول تماماً) -----
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("خطأ في جلب المستخدمين:", err);
    }
  };

  // ---------------------- إشعارات ----------------------
  // إشعارات مخزنة في DB (saved)
  const [savedNotifications, setSavedNotifications] = useState([]);
  // إشعارات لحظية من السوكيت قبل أن يكتبها الباك في DB
  const [liveNotifications, setLiveNotifications] = useState([]);
  // افتح/أغلق قائمة الإشعارات
  const [showNotifList, setShowNotifList] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  // عداد الاشعارات غير المقروءة (badge)
  const [unreadCount, setUnreadCount] = useState(0);

  // ---------------------- Helpers ----------------------
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  // ---------------------------------------------------------
  // جلب إشعارات الادمن من السيرفر (المسار نسبي كما طلبت)
  // نتوقع أن السيرفر يرجع مصفوفة notifications مع حقل is_unread أو read_at
  // ---------------------------------------------------------
  const fetchAdminNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const res = await axios.get("https://check-in-sy.com/api/hotel-admin/notifications", getAuthHeaders());

      // تنسيق النتائج بحيث نضمن الحقول اللازمة للعرض
      const formatted = (res.data || []).map((n) => ({
        id: n.id,
        title: n.title || "إشعار نظام",
        body: n.body || n.message || "",
        created_at: n.created_at,
        // إذا أرسل السيرفر حقل is_unread أو نستخدم وجود read_at
        is_unread: n.is_unread === 1 || n.is_unread === true || n.read_at == null,
        raw: n,
      }));

      setSavedNotifications(formatted);

      // نفضّ الإشعارات اللحظية لأن DB هو المصدر النهائي
      setLiveNotifications([]);

      // عدّ الاشعارات غير المقروءة اعتماداً على DB
      setUnreadCount(formatted.filter((f) => f.is_unread).length);
    } catch (err) {
      console.error("فشل جلب إشعارات الادمن:", err.response?.data || err.message);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // ---------------------------------------------------------
  // تعليم إشعار كمقروء (ينادي الباك ثم يحدث الـ UI محلياً)
  // ---------------------------------------------------------
  const markNotificationRead = async (notificationId) => {
    try {
      const res = await axios.post(
        "https://check-in-sy.com/api/hotel-admin/mark-read",
        { notification_id: notificationId },
        getAuthHeaders()
      );

      // تحديث محلي لتحسين UX
      setSavedNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_unread: false, read_at: new Date().toISOString() } : n
        )
      );

      // إذا أرسل السيرفر unread_count محدث نستخدمه
      if (res.data?.unread_count !== undefined) {
        setUnreadCount(res.data.unread_count);
      } else {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("فشل تعليم الاشعار كمقروء:", err.response?.data || err.message);
    }
  };

  // ---------------------------------------------------------
  // مسح الاشعارات اللحظية (تُستدعى عند فتح القائمة)
  // ---------------------------------------------------------
  const markLiveAsRead = () => {
    setLiveNotifications([]);
  };

  // ---------------------------------------------------------
  // Socket: تسجيل و Listeners
  // ---------------------------------------------------------
  useEffect(() => {
    // جلب المستخدمين والإشعارات عند تحميل الصفحة
    fetchUsers();
    fetchAdminNotifications();

    // افتح سوكيت بصلاحية admin
    // connectSocket يأخذ اسم الدور كما في كودك الثاني
    connectSocket("admin");

    // عند وصول إشعار تسجيل مستخدم جديد
    const onNewUser = (data) => {
      const msg = {
        id: `u-${Date.now()}`,
        title: "تسجيل مستخدم جديد 👤",
        body: `تم تسجيل مستخدم جديد باسم: ${data.name || data.full_name || "مستخدم"}`,
        created_at: new Date().toISOString(),
        is_unread: true,
      };
      setLiveNotifications((prev) => [msg, ...prev]);
      // جلب DB للتأكد من الإضافة الحقيقية والحصول على notification_reads
      fetchAdminNotifications();
      fetchUsers();
    };

    const onNewDelivery = (data) => {
      const msg = {
        id: `d-${Date.now()}`,
        title: "حجز توصيلة جديدة 🚚",
        body: `توصيلة من ${data.start || ""} إلى ${data.end || ""} — السعر: ${data.price ?? ""}`,
        created_at: new Date().toISOString(),
        is_unread: true,
      };
      setLiveNotifications((prev) => [msg, ...prev]);
      // إعادة جلب DB لأن الباك يضيف notification + notification_reads
      fetchAdminNotifications();
    };

    const onNewRoomBooking = (data) => {
      const msg = {
        id: `r-${Date.now()}`,
        title: "حجز غرفة جديد 🏨",
        body: `حجز من ${data.user?.name || "مستخدم"} في فندق ${data.hotel?.name || "غير محدد"} — الإجمالي: ${data.totals?.grand_total || ""}`,
        created_at: new Date().toISOString(),
        is_unread: true,
      };
      setLiveNotifications((prev) => [msg, ...prev]);
      fetchAdminNotifications();
    };

    const onUnreadCount = (payload) => {
      if (payload && typeof payload.unread_count !== "undefined") {
        setUnreadCount(payload.unread_count);
      } else if (typeof payload === "number") {
        setUnreadCount(payload);
      }
    };

    // اربط الأحداث بالسوكيت
    socket.on("newUser", onNewUser);
    socket.on("newDelivery", onNewDelivery);
    socket.on("newRoomBooking", onNewRoomBooking);
    socket.on("unreadCount", onUnreadCount);

    return () => {
      // نزيل اللِسِنرز ونقطع السوكيت عند تفريغ الكمبوننت
      socket.off("newUser", onNewUser);
      socket.off("newDelivery", onNewDelivery);
      socket.off("newRoomBooking", onNewRoomBooking);
      socket.off("unreadCount", onUnreadCount);
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------
  // دمج الإشعارات للعرض (live أولاً ثم saved) وترتيبها زمنيًا
  // ---------------------------------------------------------
  const allNotifications = [
    ...liveNotifications.map((n) => ({ ...n, is_read: n.is_unread ? 0 : 1 })),
    ...savedNotifications.map((n) => ({ ...n, is_read: n.is_unread ? 0 : 1 })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // ---------------------------------------------------------
  // واجهة المدير (نفس بنية الكود الأول + زر الإشعارات من الكود الثاني)
  // ---------------------------------------------------------
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Header role="admin" />

        {/* زر الإشعارات على اليمين */}
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "200px",
            zIndex: 1000,
            direction: "rtl",
          }}
        >
          <button
            onClick={() => {
              const next = !showNotifList;
              setShowNotifList(next);
              if (next) {
                markLiveAsRead();
                fetchAdminNotifications();
              }
            }}
            style={{
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              fontSize: "24px",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            🔔
          </button>

          {/* badge للعدد */}
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -5,
                left: -5,
                background: "red",
                color: "white",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                textAlign: "center",
                lineHeight: "24px",
              }}
            >
              {unreadCount}
            </span>
          )}

          {/* قائمة الإشعارات */}
          {showNotifList && (
            <div
              style={{
                position: "absolute",
                top: "60px",
                left: "-300px",
                width: "300px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                maxHeight: "400px",
                overflowY: "auto",
                direction: "rtl",
              }}
            >
              <h4
                style={{
                  margin: "0",
                  padding: "10px",
                  background: "#f8f9fa",
                  borderBottom: "1px solid #eee",
                  fontWeight: "bold",
                }}
              >
                الإشعارات
              </h4>

              {loadingNotifications ? (
                <p style={{ padding: "15px", textAlign: "center", color: "#888" }}>
                  ⏳ جاري جلب الإشعارات...
                </p>
              ) : allNotifications.length === 0 ? (
                <p style={{ padding: "15px", textAlign: "center", color: "#888" }}>
                  لا توجد إشعارات
                </p>
              ) : (
                allNotifications.map((n, idx) => (
                  <div
                    key={n.id || idx}
                    onClick={() => {
                      // لو من DB وغير مقروء نعلم الباك
                      if (n.id && savedNotifications.some((s) => s.id === n.id && s.is_unread)) {
                        markNotificationRead(n.id);
                      }
                      // لو كانت لحظية نمسحها محلياً
                      if (liveNotifications.some((l) => l.id === n.id)) {
                        setLiveNotifications((prev) => prev.filter((l) => l.id !== n.id));
                      }
                    }}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      fontSize: "14px",
                      backgroundColor: n.is_read === 0 ? "#fff3cd" : "white",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: "#333" }}>{n.title}</div>
                    <div style={{ color: "#555" }}>{n.body}</div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        marginTop: "4px",
                      }}
                    >
                      {n.created_at ? new Date(n.created_at).toLocaleString("ar-EG") : new Date().toLocaleString("ar-EG")}
                      {n.is_read === 0 ? " • غير مقروء" : ""}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="dashboard-sections" style={{ paddingTop: 20 }}>
          <AddUser onUserAdded={fetchUsers} />
          <UsersList users={users} onUsersChange={fetchUsers} />
        </div>
      </div>
    </div>
  );
}
