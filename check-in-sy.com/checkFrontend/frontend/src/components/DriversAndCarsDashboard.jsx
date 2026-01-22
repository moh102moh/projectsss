// DriversAndCarsDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { socket, connectSocket, disconnectSocket } from "../socketClient.js"; 
// 💡 المتغيرات الأساسية
const API_BASE = "https://check-in-sy.com/api/";
const BASE_URL = "https://check-in-sy.com/";

// دالة لتنسيق الوقت والتاريخ
const formatDateTime = (datetime) => {
  if (!datetime) return "-";
  const date = new Date(datetime);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// دالة لتلوين حالة الحجز
const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return { backgroundColor: "#ffc107", color: "#333", padding: "4px", borderRadius: "3px" };
    case "confirmed":
      return { backgroundColor: "#28a745", color: "white", padding: "4px", borderRadius: "3px" };
    case "canceled":
      return { backgroundColor: "#dc3545", color: "white", padding: "4px", borderRadius: "3px" };
    default:
      return {};
  }
};

export default function DriversAndCarsDashboard() {
  const navigate = useNavigate();

  // -------------------------
  // حالة إدارة الخدمات (القسم الأول)
  // -------------------------
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    service_type: "",
    name_en: "",
    name_ar: "",
    capacity: "",
    pricing_method: "",
    base_price: "",
    minimum_charge: "",
    is_available: true,
    notes: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [mode, setMode] = useState("create"); // create / edit

  // -------------------------
  // حالة الحجوزات (القسم الثاني)
  // -------------------------
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorBookings, setErrorBookings] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [savedNotifications, setSavedNotifications] = useState([]); // from API: {id,title,body,created_at,is_unread,type,...}
  const [liveNotifications, setLiveNotifications] = useState([]); // from socket
  const [showNotifList, setShowNotifList] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [computedUnread, setComputedUnreadState] = useState(0);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // -------------------------
  // Load all transport services
  // -------------------------
  const loadServices = async () => {
    setLoadingServices(true);
    try {
      // endpoint admin - include token if present
      const res = await axios.get(`${API_BASE}transports/admin/transport/services`, {
        headers: { ...getAuthHeaders() },
      });
      // backend might return { services: [...] } or array directly
      const data = res.data;
      setServices(data.services || data || []);
    } catch (err) {
      console.error("Error loading services:", err);
      alert("فشل في جلب خدمات النقل. تحقق من صلاحياتك ومسارات الـ API.");
    } finally {
      setLoadingServices(false);
    }
  };

  // -------------------------
  // Load bookings
  // -------------------------
  const loadBookings = async () => {
    setLoadingBookings(true);
    setErrorBookings(null);
    try {
      const res = await axios.get(`${API_BASE}transportsCar/admin/transport/bookings`, {
        headers: { ...getAuthHeaders() },
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setErrorBookings("فشل في جلب حجوزات التوصيل. تحقق من مسار الـ API وصلاحيات المستخدم.");
    } finally {
      setLoadingBookings(false);
    }
  };
  const fetchDeliveryNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const headers = { headers: getAuthHeaders() };
      // endpoint نفس المستخدم في مشروعك (مستعار من الكود الثاني)
      const res = await axios.get(`${API_BASE}hotel-admin/notifications`, { headers: getAuthHeaders() });

      const formatted = (res.data || [])
        .filter((n) => (n.type ? n.type === "delivery" : true))
        .map((n) => ({
          id: String(n.id),
          title: n.title || "إشعار نظام",
          body: n.body || n.message || "",
          created_at: n.created_at || new Date().toISOString(),
          is_unread: n.is_unread === 1 || n.is_unread === true || n.read_at == null,
          raw: n,
        }));

      setSavedNotifications(formatted);
      // نفض الإشعارات اللحظية لأن DB هو المصدر الحقيقي
      setLiveNotifications([]);
      setLoadingNotifications(false);
    } catch (err) {
      console.error("فشل جلب إشعارات التوصيل:", err.response?.data || err.message);
      setLoadingNotifications(false);
    }
  };

  // ---------------------------------------------------------
  // تعليم إشعار كمقروء (ينادي الباك ثم يحدث الواجهة محلياً)
  // ---------------------------------------------------------
  const markNotificationRead = async (notificationId) => {
    try {
      const res = await axios.post(
        `${API_BASE}hotel-admin/mark-read`,
        { notification_id: notificationId },
        { headers: getAuthHeaders() }
      );

      // تحديث محلي لتحسين UX
      setSavedNotifications((prev) =>
        prev.map((n) => (String(n.id) === String(notificationId) ? { ...n, is_unread: false, read_at: new Date().toISOString() } : n))
      );

      // إذا رجع السيرفر unread_count نستخدمه، وإلا نعيد احتساب
      if (res.data?.unread_count !== undefined) {
        const serverUnread = res.data.unread_count;
        setComputedUnreadState(serverUnread + liveNotifications.length);
      } else {
        // إعادة احتساب محلي
        const savedUnread = savedNotifications.filter((s) => s.is_unread).length;
        setComputedUnreadState(savedUnread + liveNotifications.length - 1);
      }
    } catch (err) {
      console.error("فشل تعليم الاشعار كمقروء:", err.response?.data || err.message);
    }

  };
 const recomputeUnread = (explicit) => {
    if (typeof explicit === "number") {
      setComputedUnreadState(explicit);
      return;
    }
    const savedUnread = savedNotifications.filter((s) => s.is_unread).length;
    const liveUnread = liveNotifications.length;
    setComputedUnreadState(savedUnread + liveUnread);
  };

  useEffect(() => {
    // أولاً: تحميل القوائم
    loadServices();
    loadBookings();
    fetchDeliveryNotifications();

    // افتح سوكيت بصلاحية "delivery"
    connectSocket("delivery");

    const onNewDelivery = (data) => {
      const msg = {
        id: data.notificationId ? String(data.notificationId) : `d-${Date.now()}`,
        notificationId: data.notificationId || null,
        title: "حجز توصيلة جديدة 🚚",
        body: `توصيلة من ${data.start || "-"} إلى ${data.end || "-"} — السعر: ${data.price || "-"}`,
        created_at: new Date().toISOString(),
        is_unread: true,
        raw: data,
      };
      // اضف كـ لحظي
      setLiveNotifications((prev) => [msg, ...prev]);

      // أعد جلب الحجوزات لأنها قديمة
      loadBookings();
    };

    const onUnreadCount = (payload) => {
      if (payload && typeof payload.unread_count !== "undefined") {
        setComputedUnreadState(payload.unread_count + liveNotifications.length);
      } else if (typeof payload === "number") {
        setComputedUnreadState(payload + liveNotifications.length);
      }
    };

    socket.on("newDelivery", onNewDelivery);
    socket.on("unreadCount", onUnreadCount);

    // حساب بادج ابتدائي
    recomputeUnread();

    return () => {
      socket.off("newDelivery", onNewDelivery);
      socket.off("unreadCount", onUnreadCount);
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // إعادة حساب البادج كلما تغيرت القوائم
  useEffect(() => {
    recomputeUnread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedNotifications, liveNotifications]);

  // ---------------------------------------------------------
  // دمج الإشعارات (لحظية أولاً ثم المحفوظة) وترتيب زمني
  // ---------------------------------------------------------
  const allNotifications = [
    ...liveNotifications.map((n) => ({ ...n, is_read: n.is_unread ? 0 : 1 })),
    ...savedNotifications.map((n) => ({ ...n, is_read: n.is_unread ? 0 : 1 })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const unreadCount = computedUnread;

  const markLiveAsRead = () => {
    setLiveNotifications([]);
  };

  // -------------------------
  // Handle form input (Services)
  // -------------------------
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        // revoke previous object URL? simple approach: just set new
        setPreviewImage(URL.createObjectURL(file));
      }
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // -------------------------
  // Validate form
  // -------------------------
  const validate = () => {
    const required = ["service_type", "name_ar", "name_en", "capacity", "pricing_method", "base_price"];
    for (const k of required) {
      if (!formData[k] && formData[k] !== 0) {
        alert("الرجاء ملء جميع الحقول المطلوبة.");
        return false;
      }
    }
    if (!["Rental", "Transfer"].includes(formData.service_type)) {
      alert("نوع الخدمة غير صالح. استخدم 'Rental' أو 'Transfer'.");
      return false;
    }
    if (!["Per_Day", "Per_KM"].includes(formData.pricing_method)) {
      alert("طريقة التسعير غير صالحة. استخدم 'Per_Day' أو 'Per_KM'.");
      return false;
    }
    if (mode === "create" && !formData.image) {
      alert("الرجاء اختيار صورة للخدمة الجديدة.");
      return false;
    }
    return true;
  };

  // -------------------------
  // Submit Form (Services)
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const fd = new FormData();

      // append required fields (explicit order)
      fd.append("service_type", formData.service_type);
      fd.append("name_en", formData.name_en);
      fd.append("name_ar", formData.name_ar);
      fd.append("capacity", String(formData.capacity));
      fd.append("pricing_method", formData.pricing_method);
      fd.append("base_price", String(formData.base_price));
      fd.append("minimum_charge", formData.minimum_charge ? String(formData.minimum_charge) : "0");
      fd.append("is_available", formData.is_available ? "1" : "0");
      if (formData.notes) fd.append("notes", formData.notes);

      if (formData.image) {
        fd.append("image", formData.image, formData.image.name);
      }

      const headers = {
        ...getAuthHeaders(),
        // DON'T set 'Content-Type' — browser sets it with boundary
      };

      let res;
      if (mode === "create") {
        res = await axios.post(`${API_BASE}transports/admin/transport/services`, fd, { headers });
      } else {
        res = await axios.put(`${API_BASE}transports/admin/transport/services/${formData.id}`, fd, { headers });
      }

      alert(res.data?.message || "تم الحفظ بنجاح");
      resetForm();
      await loadServices();
    } catch (err) {
      console.error("Transport save error:", err);
      if (err.response) {
        const serverMsg = err.response.data?.message || JSON.stringify(err.response.data);
        alert("خطأ من السيرفر: " + serverMsg);
      } else {
        alert("خطأ غير متوقع: " + err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // -------------------------
  // Edit service
  // -------------------------
  const handleEdit = (service) => {
    setMode("edit");

    setFormData({
      id: service.id,
      service_type: service.service_type || "",
      name_en: service.name_en || "",
      name_ar: service.name_ar || "",
      capacity: service.capacity || "",
      pricing_method: service.pricing_method || "",
      base_price: service.base_price || "",
      minimum_charge: service.minimum_charge || "",
      is_available: service.is_available ? true : false,
      notes: service.notes || "",
      image: null,
    });

    // preview — إذا المسار نسبي نضيف BASE_URL
    if (service.image_url) {
      const url = service.image_url.startsWith("http") ? service.image_url : `${BASE_URL}${service.image_url.replace(/^\//, "")}`;
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
    // scroll to form (optional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------
  // Delete service
  // -------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف الخدمة فعلاً؟")) return;
    try {
      const res = await axios.delete(`${API_BASE}transports/admin/transport/services/${id}`, {
        headers: { ...getAuthHeaders() },
      });
      alert(res.data?.message || "تم الحذف");
      loadServices();
    } catch (err) {
      console.error("Delete error:", err);
      if (err.response) {
        alert("خطأ من السيرفر: " + (err.response.data?.message || JSON.stringify(err.response.data)));
      } else {
        alert("خطأ غير متوقع: " + err.message);
      }
    }
  };

  // -------------------------
  // Reset form
  // -------------------------
  const resetForm = () => {
    setMode("create");
    setPreviewImage(null);
    setFormData({
      id: null,
      service_type: "",
      name_en: "",
      name_ar: "",
      capacity: "",
      pricing_method: "",
      base_price: "",
      minimum_charge: "",
      is_available: true,
      notes: "",
      image: null,
    });
  };

  // -------------------------
  // تفاصيل الحجوزات (Bookings Details)
  // -------------------------
  const openDetails = (booking) => setSelectedBooking(booking);
  const closeDetails = () => setSelectedBooking(null);

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="page-container" style={{ direction: "rtl", padding: "20px", fontFamily: "Arial" }}>
      <h1 className="title" style={{ textAlign: "center", marginBottom: "25px" }}>
        إدارة خدمات النقل / السيارات والحجوزات
      </h1>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Header role="delivery" />
            <button className="btn secondary" onClick={() => navigate("/dashboard/driverss")} style={buttonStyle}>
          إدارة السائقين
        </button>
      </div>

      {/* زر الإشعارات على اليمين (مضاف منطق الإشعارات هنا) */}
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
              fetchDeliveryNotifications();
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

        {/* badge */}
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

        {/* قائمة الإشعارات المنبثقة */}
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
            <h4 style={{ margin: 0, padding: "10px", background: "#f8f9fa", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
              الإشعارات
            </h4>

            {loadingNotifications ? (
              <p style={{ padding: "15px", textAlign: "center", color: "#888" }}>⏳ جاري جلب الإشعارات...</p>
            ) : allNotifications.length === 0 ? (
              <p style={{ padding: "15px", textAlign: "center", color: "#888" }}>لا توجد إشعارات</p>
            ) : (
              allNotifications.map((n, idx) => (
                <div
                  key={n.id || idx}
                  onClick={() => {
                    if (n.id && savedNotifications.some((s) => String(s.id) === String(n.id) && s.is_unread)) {
                      markNotificationRead(n.id);
                    }
                    if (n.notificationId) {
                      markNotificationRead(n.notificationId);
                    }
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
                  <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>{new Date(n.created_at).toLocaleString("ar-EG")}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* إشعارات لحظية مصغرة أعلى اليمين */}
      <div style={{ position: "fixed", top: 60, right: 10, width: 360, zIndex: 9999 }}>
        {liveNotifications.slice(0, 5).map((n) => (
          <div key={n.id} style={{ background: "#007bff", color: "#fff", padding: "10px", marginBottom: "8px", borderRadius: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
            <div style={{ fontWeight: 600 }}>{n.title}</div>
            <div style={{ marginTop: 6 }}>{n.body}</div>
            <div style={{ fontSize: 11, marginTop: 6 }}>{new Date(n.created_at).toLocaleString("ar-EG")}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <form className="form-card" onSubmit={handleSubmit} style={formCardStyle}>
        <h2>{mode === "create" ? "إضافة خدمة جديدة" : "تعديل خدمة"}</h2>

        <div className="grid" style={gridStyle}>
          <input name="service_type" placeholder="نوع الخدمة (Transfer / Rental)" value={formData.service_type} onChange={handleChange} style={inputStyle} required />
          <input name="pricing_method" placeholder="طريقة التسعير (Per_KM / Per_Day)" value={formData.pricing_method} onChange={handleChange} style={inputStyle} required />

          <input name="name_ar" placeholder="الاسم بالعربية" value={formData.name_ar} onChange={handleChange} style={inputStyle} required />
          <input name="name_en" placeholder="الاسم بالإنكليزية" value={formData.name_en} onChange={handleChange} style={inputStyle} required />

          <input name="capacity" placeholder="السعة" value={formData.capacity} onChange={handleChange} style={inputStyle} required />
          <input name="base_price" placeholder="السعر الأساسي" value={formData.base_price} onChange={handleChange} style={inputStyle} required />

          <input name="minimum_charge" placeholder="الحد الأدنى" value={formData.minimum_charge} onChange={handleChange} style={inputStyle} />
          <input type="file" name="image" onChange={handleChange} style={inputStyle} />

          <label style={checkboxStyle}>
            <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} />
            متاح
          </label>
          <input name="notes" placeholder="ملاحظات (اختياري)" value={formData.notes} onChange={handleChange} style={inputStyle} />
        </div>

        {previewImage && <img src={previewImage} style={previewImgStyle} alt="preview" />}

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px" }}>
          <button type="button" onClick={resetForm} className="btn" style={buttonStyle}>
            إلغاء
          </button>
          <button type="submit" className="btn primary" style={{ ...buttonStyle, backgroundColor: "#007bff", color: "white" }} disabled={saving}>
            {saving ? (mode === "create" ? "جارٍ الإضافة..." : "جارٍ التعديل...") : mode === "create" ? "إضافة" : "تعديل"}
          </button>
        </div>
      </form>

      {/* Table: Services */}
      <div className="table-card" style={tableCardStyle}>
        <h2>قائمة السيارات / الخدمات</h2>

        {loadingServices ? (
          <p>جاري تحميل الخدمات...</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>الصورة</th>
                <th style={thStyle}>الاسم</th>
                <th style={thStyle}>Capacity</th>
                <th style={thStyle}>Base Price</th>
                <th style={thStyle}>Minimum</th>
                <th style={thStyle}>Available</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
                    لا توجد خدمات
                  </td>
                </tr>
              ) : (
                services.map((s, i) => (
                  <tr key={s.id} style={i % 2 === 0 ? trEvenStyle : {}}>
                    <td style={tdStyle}>{s.id}</td>
                    <td style={tdStyle}>
                      {s.image_url ? <img src={s.image_url.startsWith("http") ? s.image_url : `${BASE_URL}${s.image_url.replace(/^\//, "")}`} style={tableImgStyle} alt={s.name_ar} /> : "—"}
                    </td>
                    <td style={tdStyle}>{s.name_ar}</td>
                    <td style={tdStyle}>{s.capacity}</td>
                    <td style={tdStyle}>{s.base_price}</td>
                    <td style={tdStyle}>{s.minimum_charge}</td>
                    <td style={tdStyle}>{s.is_available ? "Yes" : "No"}</td>
                    <td style={tdStyle}>
                      <button className="btn small" onClick={() => handleEdit(s)} style={{ ...buttonStyle, backgroundColor: "#6c757d", marginRight: "5px" }}>
                        تعديل
                      </button>
                      <button className="btn small danger" onClick={() => handleDelete(s.id)} style={{ ...buttonStyle, backgroundColor: "#dc3545" }}>
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Section: Bookings */}
      <div className="table-card" style={tableCardStyle}>
        <h2>حجوزات النقل الحالية للمستخدمين</h2>

        {loadingBookings ? (
          <p>جاري تحميل الحجوزات...</p>
        ) : errorBookings ? (
          <div className="error" style={{ textAlign: "center", padding: "1rem", color: "red" }}>
            {errorBookings}
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>اسم المستخدم</th>
                <th style={thStyle}>بريد المستخدم</th>
                <th style={thStyle}>السيارة (الخدمة)</th>
                <th style={thStyle}>السائق</th>
                <th style={thStyle}>نقطة البداية</th>
                <th style={thStyle}>نقطة النهاية</th>
                <th style={thStyle}>تاريخ/وقت الرحلة</th>
                <th style={thStyle}>الإجمالي</th>
                <th style={thStyle}>الحالة</th>
                <th style={thStyle}>تفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((b, i) => (
                  <tr key={b.booking_id || i} style={i % 2 === 0 ? trEvenStyle : {}}>
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={tdStyle}>{b.user_name || "غير محدد"}</td>
                    <td style={tdStyle}>{b.user_email || "غير متوفر"}</td>
                    <td style={tdStyle}>{b.service_name || "غير محدد"}</td>
                    <td style={tdStyle}>{b.driver_name || "غير محدد"}</td>
                    <td style={tdStyle}>{b.pickup_location_name || "-"}</td>
                    <td style={tdStyle}>{b.dropoff_location_name || "-"}</td>
                    <td style={tdStyle}>{formatDateTime(b.trip_datetime)}</td>
                    <td style={tdStyle}>{b.total_price ? `${parseFloat(b.total_price).toFixed(2)} $` : "-"}</td>
                    <td style={tdStyle}>
                      <span style={getStatusStyle(b.transport_status)}>{b.transport_status}</span>
                    </td>
                    <td style={tdStyle}>
                      <button className="details-btn" onClick={() => openDetails(b)} style={{ ...buttonStyle, backgroundColor: "#28a745" }}>
                        👁 عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "1rem", ...tdStyle }}>
                    لا يوجد حجوزات توصيل حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeDetails} style={modalOverlayStyle}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>تفاصيل حجز التوصيل #{selectedBooking.booking_id}</h3>

            <div className="modal-section" style={modalSectionStyle}>
              <h4>👤 بيانات المستخدم الحاجز</h4>
              <p>
                <strong>اسم المستخدم:</strong> {selectedBooking.user_name || "غير متوفر"}
              </p>
              <p>
                <strong>البريد الإلكتروني:</strong> {selectedBooking.user_email || "غير متوفر"}
              </p>
              <p>
                <strong>رقم الهاتف:</strong> {selectedBooking.user_phone || "غير متوفر"}
              </p>
            </div>

            <div className="modal-section" style={modalSectionStyle}>
              <h4>📅 معلومات الرحلة</h4>
              <p>
                <strong>الحالة:</strong> <span style={getStatusStyle(selectedBooking.transport_status)}>{selectedBooking.transport_status}</span>
              </p>
              <p>
                <strong>تاريخ/وقت الرحلة:</strong> {formatDateTime(selectedBooking.trip_datetime)}
              </p>
              <p>
                <strong>من:</strong> {selectedBooking.pickup_location_name}
              </p>
              <p>
                <strong>إلى:</strong> {selectedBooking.dropoff_location_name}
              </p>
              <p>
                <strong>المسافة المحسوبة:</strong> {selectedBooking.calculated_distance_km} كم
              </p>
              <p>
                <strong>عدد الضيوف:</strong> {selectedBooking.guests_count}
              </p>
            </div>

            <div className="modal-section" style={modalSectionStyle}>
              <h4>💰 الإجماليات</h4>
              <p>
                <strong>الإجمالي الكلي:</strong> {selectedBooking.total_price ? `${parseFloat(selectedBooking.total_price).toFixed(2)} $` : "-"}{" "}
              </p>
            </div>

            <div className="modal-section" style={modalSectionStyle}>
              <h4>🚗 معلومات السيارة والخدمة</h4>
              <p>
                <strong>اسم الخدمة:</strong> {selectedBooking.service_name}
              </p>
              <p>
                <strong>موديل السيارة:</strong> {selectedBooking.car_model || "-"}
              </p>
              <p>
                <strong>لون السيارة:</strong> {selectedBooking.car_color || "-"}
              </p>
            </div>

            <div className="modal-section" style={modalSectionStyle}>
              <h4>👤 تفاصيل السائق</h4>
              <p>
                <strong>الاسم:</strong> {selectedBooking.driver_name || "غير محدد"}
              </p>
              <p>
                <strong>رقم اللوحة:</strong> {selectedBooking.car_plate_number || "غير متوفر"}
              </p>
              <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
                <div>
                  <h5>صورة السائق:</h5>
                  {selectedBooking.driver_image ? <img src={`${BASE_URL}${selectedBooking.driver_image}`} alt="Driver" style={driverImageStyle} /> : <p>لا يوجد صورة</p>}
                </div>
                <div>
                  <h5>صورة السيارة:</h5>
                  {selectedBooking.image_url ? <img src={`${BASE_URL}${selectedBooking.image_url}`} alt="Car" style={carImageStyle} /> : <p>لا يوجد صورة</p>}
                </div>
              </div>
            </div>

            <button className="close-btn" onClick={closeDetails} style={closeButtonStyle}>
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* CSS inline */}
      <style>{`
        .page-container { direction: rtl; }
        .title { text-align: center; margin-bottom: 25px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .form-card, .table-card { background: #fff; padding: 20px; border-radius: 10px; margin-bottom: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}

// ----------------------------------------
// تصميم أساسي
// ----------------------------------------
const formCardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "30px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const tableCardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "30px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const gridStyle = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" };
const inputStyle = { padding: "10px", border: "1px solid #ddd", borderRadius: "6px" };
const checkboxStyle = { display: "flex", alignItems: "center", gap: "10px" };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", textAlign: "center" };
const thStyle = { backgroundColor: "#007bff", color: "white", padding: "12px 8px", border: "1px solid #ccc", textAlign: "center" };
const tdStyle = { padding: "10px 8px", border: "1px solid #eee", textAlign: "center", fontSize: "0.9rem", verticalAlign: "middle" };
const trEvenStyle = { backgroundColor: "#f8f9fa" };
const buttonStyle = { padding: "10px 16px", border: "none", background: "#ccc", marginRight: "10px", borderRadius: "6px", cursor: "pointer", color: "white" };
const tableImgStyle = { width: "65px", height: "45px", objectFit: "cover", borderRadius: "6px" };
const previewImgStyle = { width: "140px", margin: "10px 0", borderRadius: "8px" };

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalStyle = { backgroundColor: "white", padding: "30px", borderRadius: "8px", width: "90%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto", position: "relative", boxShadow: "0 5px 15px rgba(0,0,0,0.3)", direction: "rtl" };
const closeButtonStyle = { marginTop: "20px", padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", display: "block", width: "100%" };
const modalSectionStyle = { marginBottom: "20px", borderBottom: "1px dashed #ddd", paddingBottom: "15px" };
const driverImageStyle = { width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", border: "2px solid #ccc" };
const carImageStyle = { width: "150px", height: "100px", objectFit: "cover", borderRadius: "5px", border: "2px solid #ccc" };
