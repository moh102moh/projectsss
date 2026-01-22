// src/components/HotelDashboard.jsx
import React, { useEffect, useState, useCallback,useRef } from "react";
import axios from "axios";

// ⚡ استيراد السوكيت المتصل مرة واحدة فقط
import { socket, connectSocket } from "../socketClient.js";
import HotelBooking from "./HotelBooking";
import "./HotelDashboard.css";
import Header from "./Header";
export default function HotelDashboard() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingHotel, setEditingHotel] = useState(false);
  const [hotelForm, setHotelForm] = useState({});
  const [hotelImageFile, setHotelImageFile] = useState(null);
  const [previewHotelImage, setPreviewHotelImage] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [roomForm, setRoomForm] = useState({});
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomImageFiles, setRoomImageFiles] = useState([]); // multiple
  const [previewRoomImages, setPreviewRoomImages] = useState([]);

  const [freeServices, setFreeServices] = useState([]);
  const [freeForm, setFreeForm] = useState({});
  const [editingFreeId, setEditingFreeId] = useState(null);

  const [paidServices, setPaidServices] = useState([]);
  const [paidForm, setPaidForm] = useState({});
  const [editingPaidId, setEditingPaidId] = useState(null);

  const [offers, setOffers] = useState([]);
  const [offerForm, setOfferForm] = useState({});
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [offerImageFile, setOfferImageFile] = useState(null);
  const [previewOfferImage, setPreviewOfferImage] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifList, setShowNotifList] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);


  const token = localStorage.getItem("token");
  const API = "/api/hotel-admin";

  // helper for image urls
const BASE_URL = "https://check-in-sy.com";
const notificationsRef = useRef(notifications);
const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/100";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotifs(true);
      // ⚠️ تأكد من اسم المسار هنا: هل هو notifications أو notificationss ؟ سنفترض /notifications
      const res = await axios.get(`${API}/notifications`, { // 💡 تم تصحيح إلى /notifications
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetched = (res.data || []).map((n) => {
        // تبسيط منطق is_unread بالاعتماد على حقل is_unread الذي يرجعه الباك إند النظيف
        const is_unread = n.is_unread === 1 || n.read_at === null; 
        
        return {
          id: String(n.id),
          title: n.title || "إشعار نظام",
          body: n.body || n.message || "",
          created_at: n.created_at || new Date().toISOString(),
          is_unread: !!is_unread,
          read_at: n.read_at || null,
          raw: n,
        };
      });

      setNotifications(fetched);
      setUnreadCount(fetched.filter((x) => x.is_unread).length);
    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data || err);
    } finally {
      setLoadingNotifs(false);
    }
  }, [token, API]); // ⬅️ Dependencies for useCallback

    // 💡 تم نقل الدوال الأساسية هنا لتجنب تكرارها
  const markNotificationRead = useCallback(async (notificationId) => {
    if (!notificationId) return;
    if (String(notificationId).startsWith("live-")) {
        // إذا كان إشعار لحظي غير مسجل، فقط قم بتمييزه محلياً وتقليل العداد
        setNotifications((prev) =>
             prev.map((n) => (n.id === notificationId ? { ...n, is_unread: false } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        return;
    }

    try {
      const res = await axios.post(
        `${API}/mark-read`,
        { notification_id: notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // تحديث محلي لحالة الإشعار
      setNotifications((prev) =>
        prev.map((n) =>
          String(n.id) === String(notificationId) || String(n.notificationId) === String(notificationId)
            ? { ...n, is_unread: false, read_at: new Date().toISOString() }
            : n
        )
      );

      // 💡 تحديث Count: نستخدم قيمة السيرفر (DB Count) + عدد الـ live- (نستخدم الـ Ref للحصول على أحدث قيمة)
      if (res.data && typeof res.data.unread_count !== "undefined") {
        // نعتمد على الـ Ref للحصول على قائمة الإشعارات الأخيرة
        const currentNotifs = notificationsRef.current;
        const liveUn = currentNotifs.filter((x) => String(x.id).startsWith("live-") && x.is_unread).length;
        setUnreadCount(Number(res.data.unread_count) + liveUn);
      } else {
        // Fallback: تقليل العداد بواحد
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking notification read:", err.response?.data || err);
    }
  }, [token, API]); // ⬅️ Dependencies for useCallback

  // تعليم كل الإشعارات كمقروءة (تم تبسيطها)
  const markAllAsRead = useCallback(async () => {
    try {
      // نفلتر فقط الإشعارات غير المقروءة والمسجلة في DB
      const unread = notifications.filter((n) => n.is_unread && !String(n.id).startsWith("live-"));
      
      if (unread.length > 0) {
        const tokenHeader = { headers: { Authorization: `Bearer ${token}` } };
        // نرسل دفعة من الطلبات
        await Promise.all(unread.map((n) => axios.post(`${API}/mark-read`, { notification_id: n.id }, tokenHeader)));
      }

      // تحديث محلي شامل (يشمل Live-Notifs والـ DB Notifs)
      setNotifications((prev) => prev.map((n) => ({ ...n, is_unread: false, read_at: n.read_at || new Date().toISOString() })));
      setUnreadCount(0); // العداد يصبح صفراً
    } catch (err) {
      console.error("Error marking all as read:", err.response?.data || err);
    }
  }, [notifications, token, API]); // ⬅️ Dependencies for useCallback

  // عند النقر على إشعار في القائمة
  const handleNotificationClick = useCallback(async (n) => {
    if (!n) return;
    // نستخدم دالة markNotificationRead الموحدة
    const idToMark = n.notificationId || (String(n.id).startsWith("live-") ? n.id : n.id);
    await markNotificationRead(idToMark);
  }, [markNotificationRead]);

  // fetch all
 const fetchAll = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
      setHotel(res.data.hotel);
      setHotelForm(res.data.hotel || {});
      setRooms(res.data.rooms || []);
      setFreeServices(res.data.amenities || []);
      setPaidServices(res.data.additionalServices || []);
      setOffers(res.data.offers || []);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
}, [token, API]);

  useEffect(() => {
    fetchAll();
    fetchNotifications();
  }, [fetchAll, fetchNotifications]);
  useEffect(() => {
    if (!hotel?.id) return;

    axios
      .get(`${API}/reviews/${hotel.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setReviews(r.data || []))
      .catch(console.error);
  }, [hotel, token, API]);

   useEffect(() => {
      // connectSocket can accept no args (register done later) or accept role; original code used connectSocket()
      connectSocket();
    }, []);
  
    // 2️⃣ تسجيل دور صاحب الفندق عندما تتوفر بيانات hotel بعد التحميل + socket ready
// ... (داخل HotelDashboard function)

    // 3️⃣ الاستماع لحدث newRoomBooking و unreadCount
    useEffect(() => {
        const handleNewBooking = (data) => {
            const newNotif = {
                id: data.notificationId ? String(data.notificationId) : `live-${Date.now()}`,
                notificationId: data.notificationId || null,
                title: data.title || data.message || "حجز غرفة جديد ⚡",
                body: data.body || `حجز جديد من ${data.user?.name || "مستخدم"} لغرفة ${data.room?.name || ""}`,
                created_at: new Date().toISOString(),
                is_unread: true,
                booking_id: data.bookingId || null,
                raw: data,
            };

            // 💡 تحديث قائمة الإشعارات باستخدام دالة التحديث (prev)
            setNotifications((prev) => [newNotif, ...prev]);
            
            // 💡 تحديث العداد باستخدام دالة التحديث (prev)
            setUnreadCount((prev) => prev + 1);
        };

        const handleUnreadCount = (payload) => {
            if (!payload || typeof payload.unread_count === "undefined") return;

            // 💡 نستخدم دالة التحديث لـ setNotifications للوصول إلى أحدث قائمة (currentNotifs)
            setNotifications((currentNotifs) => {
                // حساب الإشعارات اللحظية غير المقروءة من القائمة الحالية (Current Snapshot)
                const liveUn = currentNotifs.filter((x) => String(x.id).startsWith("live-") && x.is_unread).length;
                
                // تحديث العداد بالقيمة القادمة من الباك إند + العداد اللحظي
                setUnreadCount(Number(payload.unread_count) + liveUn);
                
                return currentNotifs; // لا نغير قائمة الإشعارات هنا، فقط نستخدمها للحساب
            });
        };

        if (socket) {
            socket.on("newRoomBooking", handleNewBooking);
            socket.on("unreadCount", handleUnreadCount);
        }


        return () => {
            if (socket) {
                socket.off("newRoomBooking", handleNewBooking);
                socket.off("unreadCount", handleUnreadCount);
            }
        };
        
        // 💡 التبعيات: نعتمد على setNotifications و setUnreadCount (هما ثابتتان) وعلى الـ socket object
    }, [socket, setNotifications, setUnreadCount]);

  // HOTEL
  const handleHotelChange = (e) => setHotelForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleHotelImageChange = (e) => {
    const f = e.target.files[0] || null;
    setHotelImageFile(f);
    setPreviewHotelImage(f ? URL.createObjectURL(f) : null);
  };

  // build FormData only with changed fields (or explicit non-empty)
  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    if (!hotel) return alert("لا توجد بيانات الفندق");

    try {
      const formData = new FormData();

      // append only fields that changed OR if original was null and user filled
      for (const key of Object.keys(hotelForm)) {
        const newVal = hotelForm[key];
        const origVal = hotel[key];

        // skip metadata fields you don't want to send (id, created_at, updated_at, owner_id...)
        if (["id","owner_id","created_by","created_at","updated_at"].includes(key)) continue;

        // if user changed value OR explicitly wants to set empty -> append
        // treat numbers and booleans carefully — but here we append as sent
        if (String(newVal) !== String(origVal) && newVal !== undefined) {
          // avoid appending objects/arrays accidentally
          if (typeof newVal === "object") continue;
          formData.append(key, newVal === "" ? "" : newVal);
        }
      }

      if (hotelImageFile) {
        formData.append("image", hotelImageFile); // backend expects field 'image'
      }

      // if nothing to update, avoid PUT
      if (Array.from(formData.keys()).length === 0) {
        return alert("لا توجد تغييرات للحفظ");
      }

      await axios.put(`${API}/dashboard`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("✅ تم تحديث بيانات الفندق");
      setEditingHotel(false);
      setPreviewHotelImage(null);
      setHotelImageFile(null);
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ فشل التحديث");
    }
  };

  // ROOMS
  const handleRoomChange = (e) => setRoomForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleRoomImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setRoomImageFiles(files);
    setPreviewRoomImages(files.map(f => URL.createObjectURL(f)));
  };

  const handleRoomSubmit = async (e) => {
  e.preventDefault();
  try {
    // إذا في editingRoomId -> نعمل update للبيانات أول
    if (editingRoomId) {
      // تحديث بيانات الغرفة (بدون صور) باستخدام JSON عادي
      await axios.put(`${API}/rooms/${editingRoomId}`, roomForm, {
        headers: { Authorization: `Bearer ${token}` } // لا تحدد Content-Type هنا
      });


      if (roomImageFiles && roomImageFiles.length) {
        for (const file of roomImageFiles) {
          const fd = new FormData();
          fd.append("image", file); // server addRoomImage expects single field named "image"
          await axios.post(`${API}/rooms/${editingRoomId}/images`, fd, {
            headers: { Authorization: `Bearer ${token}` } // لا تحدد Content-Type
          });
        }
      }
    } else {
      // إنشاء غرفة جديدة مع صور متعددة — server expects field name "images"
      const formData = new FormData();
      Object.entries(roomForm).forEach(([k, v]) => { if (v !== undefined) formData.append(k, v); });
      if (roomImageFiles && roomImageFiles.length) {
        for (const f of roomImageFiles) formData.append("images", f);
      }

      // مهم: لا تحدد Content-Type يدوياً — اترك axios يضبطه
      await axios.post(`${API}/rooms`, formData, {
        headers: { Authorization: `Bearer ${token}` } 
      });
    }

    // تنظيف وإعادة جلب البيانات
    setRoomForm({});
    setEditingRoomId(null);
    setRoomImageFiles([]);
    setPreviewRoomImages([]);
    fetchAll();
  } catch (err) {
    console.error(err.response?.data || err);
    alert("❌ خطأ في حفظ الغرفة");
  }
};


  const handleRoomEdit = (room) => {
    setEditingRoomId(room.id);
    // copy only editable props (avoid nested arrays causing inputs to break)
    setRoomForm({
      name: room.name ?? "",
      type: room.type ?? "",
      description: room.description ?? "",
      price_per_night: room.price_per_night ?? "",
      capacity: room.capacity ?? "",
      available: room.available ?? "",
      quantity: room.quantity ?? "",
      status: room.status ?? "",
    });
  };

  const handleRoomDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الغرفة؟")) return;
    try {
      await axios.delete(`${API}/rooms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ خطأ في حذف الغرفة");
    }
  };

  // FREE services
  const handleFreeChange = (e) => setFreeForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFreeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFreeId) {
        await axios.put(`${API}/amenities/${editingFreeId}`, freeForm, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API}/amenities`, freeForm, { headers: { Authorization: `Bearer ${token}` } });
      }
      setFreeForm({});
      setEditingFreeId(null);
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ خطأ في حفظ الخدمة");
    }
  };
  const handleFreeEdit = (s) => { setEditingFreeId(s.id); setFreeForm({ name: s.name, description: s.description, is_free: s.is_free }); };
  const handleFreeDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الخدمة؟")) return;
    try {
      await axios.delete(`${API}/amenities/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ خطأ في حذف الخدمة");
    }
  };

  // PAID services
  const handlePaidChange = (e) => setPaidForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePaidSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...paidForm, price: Number(paidForm.price || 0), available: Number(paidForm.available ?? 1) };
      if (editingPaidId) {
        await axios.put(`${API}/additional-services/${editingPaidId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API}/additional-services`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setPaidForm({});
      setEditingPaidId(null);
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ خطأ في حفظ الخدمة المدفوعة");
    }
  };
  const handlePaidEdit = (s) => { setEditingPaidId(s.id); setPaidForm({ name: s.name, description: s.description, price: s.price, available: s.available }); };
  const handlePaidDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الخدمة؟")) return;
    try {
      await axios.delete(`${API}/additional-services/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ خطأ في حذف الخدمة");
    }
  };

  // OFFERS
  const handleOfferChange = (e) => setOfferForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleOfferImageChange = (e) => {
    const f = e.target.files[0] || null;
    setOfferImageFile(f);
    setPreviewOfferImage(f ? URL.createObjectURL(f) : null);
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(offerForm).forEach(([k, v]) => { if (v !== undefined) formData.append(k, v); });
      if (offerImageFile) formData.append("image", offerImageFile);

      if (editingOfferId) {
        await axios.put(`${API}/offers/${editingOfferId}`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
      } else {
        await axios.post(`${API}/offers`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
      }
      setOfferForm({});
      setEditingOfferId(null);
      setOfferImageFile(null);
      setPreviewOfferImage(null);
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ خطأ في حفظ العرض");
    }
  };

  const handleOfferEdit = (s) => { setEditingOfferId(s.id); setOfferForm({ title: s.title, description: s.description, notes: s.notes, price: s.price }); };
  const handleOfferDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف العرض؟")) return;
    try {
      await axios.delete(`${API}/offers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ خطأ في حذف العرض");
    }
  };
  

  if (loading) return <p>⏳ جاري التحميل...</p>;
  if (!hotel) return <p>❌ لم يتم العثور على بيانات الفندق</p>;

  return (
     <div style={{ padding: "20px", direction: "rtl", position: "relative" }}>
      {/* 🔔 جديد: زر الإشعارات العائم وقائمة الإشعارات */}
      <div style={{ position: "fixed", top: "20px", left: "20px", zIndex: 1000 }}>
        <button
          onClick={() => {
            const next = !showNotifList;
            setShowNotifList(next);
            if (next) {
              // عند فتح القائمة: جلب آخر الحالة من DB لتأكيد التزامن
              fetchNotifications();
            }
          }}
          style={{
            background: "#f39c12",
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
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
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

        {/* قائمة الإشعارات المنسدلة */}
        {showNotifList && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: "0",
              width: "340px",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              maxHeight: "500px",
              overflowY: "auto",
              direction: "rtl",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderBottom: "1px solid #eee" }}>
              <h4 style={{ margin: 0 }}>الإشعارات</h4>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    // تمييز الكل كمقروء
                    markAllAsRead();
                  }}
                  style={{ background: "#06b6d4", color: "white", padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer" }}
                >
                  تمييز الكل كمقروء
                </button>
                <button
                  onClick={() => {
                    fetchNotifications();
                  }}
                  title="تحديث"
                  style={{ background: "#f3f4f6", padding: "6px 8px", borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer" }}
                >
                  تحديث
                </button>
              </div>
            </div>

            {loadingNotifs ? (
              <p style={{ padding: "15px", textAlign: "center", color: "#888" }}>⏳ جاري جلب الإشعارات...</p>
            ) : notifications.length === 0 ? (
              <p style={{ padding: "15px", textAlign: "center", color: "#888" }}>لا توجد إشعارات</p>
            ) : (
              (notifications || []).map((n, idx) => (
                <div
                  key={n.id || idx}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    fontSize: "14px",
                    backgroundColor: n.is_unread ? "#fff3cd" : "white",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: "bold", color: "#333" }}>{n.title}</div>
                  <div style={{ color: "#555" }}>{n.body}</div>
                  <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                    {new Date(n.created_at).toLocaleString("ar-EG")}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <h2>📋 بيانات الفندق</h2>
  <Header role="hotel" />
      {!editingHotel ? (
        <div>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {Object.entries(hotel).map(([key, value]) => (
                <tr key={key}><td>{key}</td><td>{value?.toString()}</td></tr>
              ))}
              <tr>
                <td>الصورة الرئيسية</td>
                <td><img src={getImageUrl(hotel.main_image)} alt={hotel.name} width="200" style={{ borderRadius: "8px" }} /></td>
              </tr>
            </tbody>
          </table>
          <button onClick={() => setEditingHotel(true)}>✏️ تعديل البيانات</button>
        </div>
      ) : (
        <form onSubmit={handleHotelSubmit} style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
          {Object.keys(hotelForm).map(key => (
            // تجنب الحقول الغير قابلة للتعديل مثل id, owner_id
            !["id","owner_id","created_by","created_at","updated_at"].includes(key) && (
              <div key={key}>
                <label>{key}</label>
                <input name={key} value={hotelForm[key] ?? ""} onChange={handleHotelChange} />
              </div>
            )
          ))}
          <div>
            <label>تغيير/رفع الصورة الرئيسية</label>
            <input type="file" accept="image/*" onChange={handleHotelImageChange} />
            {previewHotelImage && <img src={previewHotelImage} width="200" style={{ borderRadius: "8px", marginTop: "5px" }} />}
          </div>
          <button type="submit">💾 حفظ</button>
          <button type="button" onClick={() => { setEditingHotel(false); setPreviewHotelImage(null); setHotelForm(hotel); }}>❌ إلغاء</button>
        </form>
      )}

      {/* ROOMS */}
      <h2>🛏️ إدارة الغرف</h2>
      <form onSubmit={handleRoomSubmit} style={{ marginBottom: "10px" }}>
        <input placeholder="اسم الغرفة" name="name" value={roomForm.name || ""} onChange={handleRoomChange} />
        <input placeholder="نوع الغرفة" name="type" value={roomForm.type || ""} onChange={handleRoomChange} />
        <input placeholder="الوصف" name="description" value={roomForm.description || ""} onChange={handleRoomChange} />
        <input placeholder="السعر لكل ليلة" type="number" name="price_per_night" value={roomForm.price_per_night || ""} onChange={handleRoomChange} />
        <input placeholder="السعة" type="number" name="capacity" value={roomForm.capacity || ""} onChange={handleRoomChange} />
        <input placeholder="متاحة" type="number" name="available" value={roomForm.available || ""} onChange={handleRoomChange} />
        <input placeholder="الكمية" type="number" name="quantity" value={roomForm.quantity || ""} onChange={handleRoomChange} />
        <input placeholder="الحالة" name="status" value={roomForm.status || ""} onChange={handleRoomChange} />
        <div>
          <label>صور الغرفة (يمكن رفع عدة صور)</label>
          <input type="file" accept="image/*" multiple onChange={handleRoomImagesChange} />
          {previewRoomImages.length > 0 && (
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "5px" }}>
              {previewRoomImages.map((p, i) => <img key={i} src={p} width="80" height="80" style={{ borderRadius: "8px", objectFit: "cover" }} />)}
            </div>
          )}
        </div>
        <button type="submit">{editingRoomId ? "💾 تعديل" : "➕ إضافة"}</button>
        {editingRoomId && <button type="button" onClick={() => { setRoomForm({}); setEditingRoomId(null); setRoomImageFiles([]); setPreviewRoomImages([]); }}>❌ إلغاء</button>}
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>الاسم</th><th>النوع</th><th>الوصف</th><th>السعر</th>
            <th>السعة</th><th>متاحة</th><th>الكمية</th><th>الحالة</th>
            <th>صور</th><th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td><td>{r.type}</td><td>{r.description}</td><td>{r.price_per_night}</td>
              <td>{r.capacity}</td><td>{r.available}</td><td>{r.quantity}</td><td>{r.status}</td>
           <td>
  {r.images && r.images.length > 0 ? (
    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
      {r.images.map((img) => (
        <img
          key={img.id}
          src={getImageUrl(img.image_url)}
          alt="صورة الغرفة"
          width="80"
          height="80"
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
      ))}
    </div>
  ) : (
    <span>لا توجد صور</span>
  )}
</td>

              <td>
                <button onClick={() => handleRoomEdit(r)}>✏️</button>
                <button onClick={() => handleRoomDelete(r.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FREE SERVICES */}
      <h2>💎 الخدمات المجانية</h2>
      <form onSubmit={handleFreeSubmit}>
        <input placeholder="اسم الخدمة" name="name" value={freeForm.name || ""} onChange={handleFreeChange} />
        <input placeholder="الوصف" name="description" value={freeForm.description || ""} onChange={handleFreeChange} />
        <select name="is_free" value={freeForm.is_free ?? 1} onChange={handleFreeChange}>
          <option value={1}>مجانية</option>
          <option value={0}>مدفوعة</option>
        </select>
        <button type="submit">{editingFreeId ? "💾 تعديل" : "➕ إضافة"}</button>
      </form>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>الاسم</th><th>الوصف</th><th>نوع الخدمة</th><th>إجراءات</th></tr>
        </thead>
        <tbody>
          {freeServices.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.description}</td>
              <td>{s.is_free ? "مجانية" : "مدفوعة"}</td>
              <td>
                <button onClick={() => handleFreeEdit(s)}>✏️</button>
                <button onClick={() => handleFreeDelete(s.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAID SERVICES */}
      <h2>💰 الخدمات المدفوعة</h2>
      <form onSubmit={handlePaidSubmit} style={{ marginBottom: "10px" }}>
        <input placeholder="اسم الخدمة" name="name" value={paidForm.name || ""} onChange={handlePaidChange} />
        <input placeholder="الوصف" name="description" value={paidForm.description || ""} onChange={handlePaidChange} />
        <input placeholder="السعر" type="number" name="price" value={paidForm.price || ""} onChange={handlePaidChange} />
        <input placeholder="متاحة؟" type="number" name="available" value={paidForm.available || ""} onChange={handlePaidChange} />
        <button type="submit">{editingPaidId ? "💾 تعديل" : "➕ إضافة"}</button>
        {editingPaidId && <button type="button" onClick={() => { setPaidForm({}); setEditingPaidId(null); }}>❌ إلغاء</button>}
      </form>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr><th>الاسم</th><th>الوصف</th><th>السعر</th><th>متاحة</th><th>إجراءات</th></tr>
        </thead>
        <tbody>
          {paidServices.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td><td>{s.description}</td><td>{s.price}</td><td>{s.available}</td>
              <td>
                <button onClick={() => handlePaidEdit(s)}>✏️</button>
                <button onClick={() => handlePaidDelete(s.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* OFFERS */}
      <h2>🏷️ عروض الفندق</h2>
      <form onSubmit={handleOfferSubmit}>
        <input placeholder="عنوان العرض" name="title" value={offerForm.title || ""} onChange={handleOfferChange} />
        <input placeholder="الوصف" name="description" value={offerForm.description || ""} onChange={handleOfferChange} />
        <input placeholder="ملاحظات" name="notes" value={offerForm.notes || ""} onChange={handleOfferChange} />
        <div>
          <label>صورة العرض</label>
          <input type="file" accept="image/*" onChange={handleOfferImageChange} />
          {previewOfferImage && <img src={previewOfferImage} width="120" style={{ borderRadius: "8px", marginTop: "5px" }} />}
        </div>
        <input placeholder="السعر" type="number" name="price" value={offerForm.price || ""} onChange={handleOfferChange} />
        <button type="submit">{editingOfferId ? "💾 تعديل" : "➕ إضافة"}</button>
      </form>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>العنوان</th><th>الوصف</th><th>ملاحظات</th><th>الصورة</th><th>السعر</th><th>إجراءات</th></tr>
        </thead>
        <tbody>
          {offers.map(o => (
            <tr key={o.id}>
              <td>{o.title}</td><td>{o.description}</td><td>{o.notes}</td>
              <td>{o.image_url ? <img src={getImageUrl(o.image_url)} width="120" style={{ borderRadius: "8px" }} /> : "—"}</td>
              <td>{o.price}</td>
              <td>
                <button onClick={() => handleOfferEdit(o)}>✏️</button>
                <button onClick={() => handleOfferDelete(o.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* REVIEWS */}
      <h2>تقييمات الفندق</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>المقيم</th><th>التقييم</th><th>التعليق</th><th>التاريخ</th></tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map(r => (
              <tr key={r.id}>
                <td>{r.user_name}</td><td>{r.rating}</td><td>{r.comment}</td><td>{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" style={{ textAlign: "center" }}>لا توجد تقييمات بعد</td></tr>
          )}
        </tbody>
      </table>
      {hotel?.id && (
  <div style={{ marginTop: "40px" }}>
    <HotelBooking hotelId={hotel.id} />
  </div>
)}

    </div>
  );
}
