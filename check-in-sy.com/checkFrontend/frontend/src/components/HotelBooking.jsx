// src/components/HotelBookingsSection.jsx
import React, { useEffect, useState } from "react";
import "./HotelBookingsSection.css";
import axios from "axios";

const BASE_URL = "https://check-in-sy.com";

export default function HotelBookingsSection({ initialHotelId = null }) {
  const [hotelId, setHotelId] = useState(initialHotelId);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const token = localStorage.getItem("token");

  // 🔹 أولاً: تحديد الفندق
  useEffect(() => {
    const init = async () => {
      try {
        if (!hotelId) {
          const res = await axios.get(`${BASE_URL}/api/bookings/hotel`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit, status: statusFilter || undefined },
          });
          if (res.data.hotels?.length) {
            setHotelId(res.data.hotels[0].id);
          } else {
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error(err);
        alert("فشل الحصول على بيانات الفندق");
        setLoading(false);
      }
    };
    init();
  }, [hotelId, token]);

  // 🔹 تحميل الغرف
  useEffect(() => {
    if (!hotelId) return;
    const getRooms = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/bookings/hotel/${hotelId}/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data.rooms || []);
      } catch (err) {
        console.error("rooms fetch error", err);
      }
    };
    getRooms();
  }, [hotelId, token]);

  // 🔹 تحميل الحجوزات

 useEffect(() => {
    if (!hotelId) return;
    setLoading(true);
    const fetchBookings = async () => {
      try {
       const res = await axios.get(`${BASE_URL}/api/bookings/hotel/${hotelId}`,  {
          headers: { Authorization: `Bearer ${token}` },
        
        });
        setBookings(res.data.bookings || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error(err);
        alert("حدث خطأ أثناء تحميل الحجوزات");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [hotelId, page, limit, statusFilter, token]);
  // 🔹 تحديث الحالة
  const updateStatus = async (bookingId, newStatus) => {
    const prev = bookings.slice();
    setBookings((b) =>
      b.map((x) => (x.id === bookingId ? { ...x, status: newStatus } : x))
    );
    try {
      await axios.put(
        `${BASE_URL}/api/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      alert("فشل تحديث الحالة");
      setBookings(prev);
    }
  };

  // 🔹 فتح تفاصيل الحجز (جلب كامل البيانات)
  const openBooking = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedBooking(res.data.booking);
    } catch (err) {
      console.error("Booking fetch error:", err.response?.data || err.message);
      alert("فشل جلب تفاصيل الحجز");
    }
  };

  if (loading) return <p>⏳ جاري التحميل...</p>;
  if (!hotelId) return <p>لا يوجد فندق لعرض الحجوزات</p>;

  return (
    <div style={{ marginTop: 20 }}>
      <h2>حجوزات الفندق #{hotelId}</h2>

      <div style={{ marginBottom: 10 }}>
        <label>فلتر الحالة: </label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
        >
          <option value="">الكل</option>
          <option value="pending">معلق</option>
          <option value="confirmed">مؤكد</option>
          <option value="cancelled">ملغي</option>
          <option value="ongoing">جاري</option>
        </select>
      </div>

      <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th><th>الزبون</th><th>الغرفة</th><th>الضيوف</th><th>الدخول</th><th>الخروج</th><th>الحالة</th><th>الإجمالي</th><th>تحكم</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={b.id}>
              <td>{(page - 1) * limit + i + 1}</td>
              <td>{b.user?.name || "—"}</td>
              <td>{b.room?.name || "—"}</td>
              <td>{b.guests_count}</td>
              <td>{b.check_in ? new Date(b.check_in).toLocaleDateString("ar-EG") : "—"}</td>
              <td>{b.check_out ? new Date(b.check_out).toLocaleDateString("ar-EG") : "—"}</td>
              <td>
                <select value={b.status || "pending"} onChange={(e) => updateStatus(b.id, e.target.value)}>
                  <option value="pending">معلق</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="cancelled">ملغي</option>
                  <option value="ongoing">جاري</option>
                </select>
              </td>
              <td>{b.totals?.grand_total ?? "—"} $</td>
              <td>
                <button onClick={() => openBooking(b.id)}>👁 عرض</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedBooking && (
        <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
}

// ✅ مودال التفاصيل الكامل مثل BookingsDashboard
function BookingModal({ booking, onClose }) {
  if (!booking) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          width: "90%",
          maxWidth: 800,
          maxHeight: "90vh",
          overflowY: "auto",
          direction: "rtl",
        }}
      >
        <h3>تفاصيل الحجز #{booking.id}</h3>

        <div>
          <h4>📅 معلومات الحجز</h4>
          <p><b>الحالة:</b> {booking.status}</p>
          <p><b>تاريخ الدخول:</b> {booking.check_in}</p>
          <p><b>تاريخ الخروج:</b> {booking.check_out}</p>
          <p><b>عدد الضيوف:</b> {booking.guests_count}</p>
        </div>

        <div>
          <h4>🏨 الفندق</h4>
          <p><b>الاسم:</b> {booking.hotel?.name}</p>
          <p><b>العنوان:</b> {booking.hotel?.address}</p>
          <p><b>النجوم:</b> {booking.hotel?.stars}</p>
        </div>

        {booking.room && (
          <div>
            <h4>🛏 الغرفة</h4>
            <p><b>الاسم:</b> {booking.room.name}</p>
            <p><b>الوصف:</b> {booking.room.description}</p>
            <p><b>السعر لليلة:</b> {booking.room.price_per_night} $</p>
            <p><b>عدد الليالي:</b> {booking.room.nights}</p>
          </div>
        )}

        <div>
          <h4>👤 المستخدم</h4>
          <p><b>الاسم:</b> {booking.user?.name}</p>
          <p><b>البريد:</b> {booking.user?.email}</p>
          <p><b>الهاتف:</b> {booking.user?.phone}</p>
        </div>

        <div>
          <h4>💰 الإجماليات</h4>
          <p>سعر الغرفة: {booking.totals?.room_only_total} $</p>
          <p>إجمالي الخدمات: {booking.totals?.services_total} $</p>
          <p><b>الإجمالي الكلي:</b> {booking.totals?.grand_total} $</p>
        </div>

        <div>
          <h4>🧾 الخدمات</h4>

          {booking.services?.hotel_free_services?.length > 0 && (
            <>
              <h5>خدمات الفندق المجانية:</h5>
              <ul>
                {booking.services.hotel_free_services.map((s) => (
                  <li key={s.id}>{s.name} - {s.description}</li>
                ))}
              </ul>
            </>
          )}

          {booking.services?.hotel_paid_services?.length > 0 && (
            <>
              <h5>خدمات الفندق المدفوعة:</h5>
              <ul>
                {booking.services.hotel_paid_services.map((s) => (
                  <li key={s.id}>
                    {s.service_name} — {s.quantity} × {s.service_price} $
                  </li>
                ))}
              </ul>
            </>
          )}

          {booking.services?.user_direct_services?.length > 0 && (
            <>
              <h5>الخدمات المباشرة:</h5>
              <ul>
                {booking.services.user_direct_services.map((s) => (
                  <li key={s.id}>
                    {s.service_name} — {s.quantity} × {s.service_price} $
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <button onClick={onClose} style={{ marginTop: 15, background: "#ccc", padding: "8px 12px", borderRadius: 6 }}>إغلاق</button>
      </div>
    </div>
  );
}
