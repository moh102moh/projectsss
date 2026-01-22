import React, { useEffect, useState } from "react";
import axios from "axios";
import "./bookings-dashboard.css";

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const openDetails = (booking) => setSelectedBooking(booking);
  const closeDetails = () => setSelectedBooking(null);

  if (loading) {
    return <div className="loading">جارِ تحميل الحجوزات...</div>;
  }

  return (
    <div className="bookings-dashboard-container">
      <h2 className="title">كل الحجوزات في النظام</h2>

      <table className="bookings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>الفندق</th>
            <th>الغرفة</th>
            <th>الزبون</th>
            <th>تاريخ الدخول</th>
            <th>تاريخ الخروج</th>
            <th>عدد الضيوف</th>
            <th>الإجمالي</th>
            <th>الحالة</th>
            <th>تفاصيل</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b, i) => (
              <tr key={b.id}>
                <td>{i + 1}</td>
                <td>{b.hotel?.name || "-"}</td>
                <td>{b.room?.name || "بدون غرفة"}</td>
                <td>{b.user?.name || "غير معروف"}</td>
                <td>{b.check_in ? new Date(b.check_in).toLocaleDateString("ar-EG") : "-"}</td>
                <td>{b.check_out ? new Date(b.check_out).toLocaleDateString("ar-EG") : "-"}</td>
                <td>{b.guests_count}</td>
                <td>{b.totals?.grand_total} $</td>
                <td className={`status ${b.status}`}>{b.status}</td>
                <td>
                  <button className="details-btn" onClick={() => openDetails(b)}>
                    👁 عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "1rem" }}>
                لا يوجد حجوزات حالياً
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ نافذة التفاصيل */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>تفاصيل الحجز #{selectedBooking.id}</h3>

            <div className="modal-section">
              <h4>📅 معلومات الحجز</h4>
              <p><strong>الحالة:</strong> {selectedBooking.status}</p>
              <p><strong>تاريخ الدخول:</strong> {selectedBooking.check_in}</p>
              <p><strong>تاريخ الخروج:</strong> {selectedBooking.check_out}</p>
              <p><strong>عدد الضيوف:</strong> {selectedBooking.guests_count}</p>
            </div>

            <div className="modal-section">
              <h4>🏨 الفندق</h4>
              <p><strong>الاسم:</strong> {selectedBooking.hotel?.name}</p>
              <p><strong>العنوان:</strong> {selectedBooking.hotel?.address}</p>
              <p><strong>النجوم:</strong> {selectedBooking.hotel?.stars}</p>
            </div>

            {selectedBooking.room && (
              <div className="modal-section">
                <h4>🛏 الغرفة</h4>
                <p><strong>الاسم:</strong> {selectedBooking.room.name}</p>
                <p><strong>الوصف:</strong> {selectedBooking.room.description}</p>
                <p><strong>السعر لليلة:</strong> {selectedBooking.room.price_per_night} $</p>
                <p><strong>عدد الليالي:</strong> {selectedBooking.room.nights}</p>
              </div>
            )}

            <div className="modal-section">
              <h4>👤 المستخدم</h4>
              <p><strong>الاسم:</strong> {selectedBooking.user?.name}</p>
              <p><strong>البريد:</strong> {selectedBooking.user?.email}</p>
              <p><strong>الهاتف:</strong> {selectedBooking.user?.phone}</p>
            </div>

            <div className="modal-section">
              <h4>💰 الإجماليات</h4>
              <p>سعر الغرفة: {selectedBooking.totals?.room_only_total} $</p>
              <p>إجمالي الخدمات: {selectedBooking.totals?.services_total} $</p>
              <p><strong>الإجمالي الكلي:</strong> {selectedBooking.totals?.grand_total} $</p>
            </div>

            <div className="modal-section">
              <h4>🧾 الخدمات</h4>

              {selectedBooking.services?.hotel_free_services?.length > 0 && (
                <>
                  <h5>خدمات الفندق المجانية:</h5>
                  <ul>
                    {selectedBooking.services.hotel_free_services.map((s) => (
                      <li key={s.id}>{s.name} - {s.description}</li>
                    ))}
                  </ul>
                </>
              )}

              {selectedBooking.services?.hotel_paid_services?.length > 0 && (
                <>
                  <h5>خدمات الفندق المدفوعة:</h5>
                  <ul>
                    {selectedBooking.services.hotel_paid_services.map((s) => (
                      <li key={s.id}>
                        {s.service_name} — {s.quantity} × {s.service_price} $
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {selectedBooking.services?.user_direct_services?.length > 0 && (
                <>
                  <h5>الخدمات المباشرة:</h5>
                  <ul>
                    {selectedBooking.services.user_direct_services.map((s) => (
                      <li key={s.id}>
                        {s.service_name} — {s.quantity} × {s.service_price} $
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <button className="close-btn" onClick={closeDetails}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}
