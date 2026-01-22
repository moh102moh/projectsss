// src/components/TransportBookingsDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./transport-bookings-dashboard.css";

export default function TransportBookingsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const BASE_URL = "https://check-in-sy.com"; // رابط السيرفر كامل

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/transportsCar/admin/transport/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching transport bookings:", err);
        setError(err.response?.data?.message || "فشل في جلب حجوزات التوصيل. تحقق من مسار الـ API وصلاحيات المستخدم.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const openDetails = (booking) => setSelectedBooking(booking);
  const closeDetails = () => setSelectedBooking(null);

  const formatDateTime = (datetime) => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    return date.toLocaleDateString("ar-EG", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ---------- Styles ---------- //
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "1rem" };
  const thStyle = { border: "1px solid #ddd", padding: "8px", backgroundColor: "#f7f7f7" };
  const tdStyle = { border: "1px solid #ddd", padding: "8px", textAlign: "center" };
  const trEvenStyle = { backgroundColor: "#fafafa" };
  const buttonStyle = { padding: "5px 10px", cursor: "pointer" };
  const closeButtonStyle = { marginTop: "15px", padding: "8px 15px", cursor: "pointer" };
  const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
  const modalStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "10px", maxWidth: "800px", width: "90%", maxHeight: "90%", overflowY: "auto" };
  const modalSectionStyle = { marginBottom: "15px" };
  const getStatusStyle = (status) => {
    switch(status) {
      case "pending": return { color: "#ff9800" };
      case "confirmed": return { color: "#4caf50" };
      case "cancelled": return { color: "#f44336" };
      default: return { color: "#000" };
    }
  };

  // ---------- Render ---------- //
  if (loading) return <div className="loading" style={{ textAlign: "center", padding: "2rem" }}>جارِ تحميل حجوزات التوصيل...</div>;
  if (error) return <div className="error" style={{ textAlign: "center", padding: "2rem", color: "red" }}>{error}</div>;

  return (
    <div className="bookings-dashboard-container" style={{ direction: "rtl", padding: "2rem" }}>
      <h2 className="title" style={{ borderBottom: "2px solid #eee", paddingBottom: "1rem" }}>كل حجوزات التوصيل في النظام</h2>

      <table className="bookings-table" style={tableStyle}>
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
                  <span className={`status ${b.transport_status}`} style={getStatusStyle(b.transport_status)}>
                    {b.transport_status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button className="details-btn" onClick={() => openDetails(b)} style={buttonStyle}>
                    👁 عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" style={{ textAlign: "center", padding: "1rem", ...tdStyle }}>لا يوجد حجوزات توصيل حالياً</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* نافذة التفاصيل */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeDetails} style={modalOverlayStyle}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>تفاصيل حجز التوصيل #{selectedBooking.booking_id}</h3>

            <div className="modal-section" style={modalSectionStyle}>
              <h4>👤 بيانات المستخدم الحاجز</h4>
              <p><strong>اسم المستخدم:</strong> {selectedBooking.user_name || "غير متوفر"}</p>
              <p><strong>البريد الإلكتروني:</strong> {selectedBooking.user_email || "غير متوفر"}</p>
              <p><strong>رقم الهاتف:</strong> {selectedBooking.user_phone || "غير متوفر"}</p>
            </div>

            <div className="modal-section" style={modalSectionStyle}>
              <h4>📅 معلومات الرحلة</h4>
              <p><strong>الحالة:</strong> {selectedBooking.transport_status}</p>
              <p><strong>تاريخ/وقت الرحلة:</strong> {formatDateTime(selectedBooking.trip_datetime)}</p>
              <p><strong>من:</strong> {selectedBooking.pickup_location_name}</p>
              <p><strong>إلى:</strong> {selectedBooking.dropoff_location_name}</p>
              <p><strong>المسافة المحسوبة:</strong> {selectedBooking.calculated_distance_km} كم</p>
              <p><strong>عدد الضيوف:</strong> {selectedBooking.guests_count}</p>
            </div>

            <div className="modal-section" style={modalSectionStyle}>
              <h4>💰 الإجماليات</h4>
              <p><strong>الإجمالي الكلي:</strong> {selectedBooking.total_price ? `${parseFloat(selectedBooking.total_price).toFixed(2)} $` : "-"} </p>
            </div>

            <div className="modal-section" style={modalSectionStyle}>
              <h4>🚗 معلومات السيارة والخدمة</h4>
              <p><strong>اسم الخدمة:</strong> {selectedBooking.service_name}</p>
              <p><strong>موديل السيارة:</strong> {selectedBooking.car_model || "-"}</p>
              <p><strong>لون السيارة:</strong> {selectedBooking.car_color || "-"}</p>
            </div>

            <div className="modal-section" style={modalSectionStyle}>
              <h4>👤 تفاصيل السائق</h4>
              <p><strong>الاسم:</strong> {selectedBooking.driver_name || "غير محدد"}</p>
              <p><strong>رقم اللوحة:</strong> {selectedBooking.car_plate_number || "غير متوفر"}</p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                <div>
                  <h5>صورة السائق:</h5>
                  {selectedBooking.driver_image ? (
                    <img
                      src={`${BASE_URL}${selectedBooking.driver_image}`}
                      alt="Driver"
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", border: "2px solid #ccc" }}
                    />
                  ) : <p>لا يوجد صورة</p>}
                </div>

                <div>
                  <h5>صورة السيارة:</h5>
                  {selectedBooking.image_url ? (
                    <img
                      src={`${BASE_URL}${selectedBooking.image_url}`}
                      alt="Car"
                      style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "5px", border: "2px solid #ccc" }}
                    />
                  ) : <p>لا يوجد صورة</p>}
                </div>
              </div>
            </div>

            <button className="close-btn" onClick={closeDetails} style={closeButtonStyle}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}



// ----------------------------------------
// تصميم أساسي (يمكنك نقله إلى ملف CSS)
// ----------------------------------------
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'right' // المحاذاة الافتراضية للجدول
};

const thStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 8px',
    border: '1px solid #ccc',
    textAlign: 'center', // محاذاة العناوين في الوسط
};

const tdStyle = {
    padding: '10px 8px',
    border: '1px solid #eee',
    textAlign: 'center', // محاذاة محتوى الخلايا في الوسط
    fontSize: '0.9rem'
};

const trEvenStyle = {
    backgroundColor: '#f8f9fa'
};

const buttonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem'
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    direction: 'rtl',
};

const closeButtonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
};

const modalSectionStyle = {
    marginBottom: '20px',
    borderBottom: '1px dashed #ddd',
    paddingBottom: '15px',
};

// دالة لتلوين حالة الحجز
const getStatusStyle = (status) => {
    switch (status) {
        case 'pending':
            return { backgroundColor: '#ffc107', color: '#333', padding: '4px', borderRadius: '3px' };
        case 'confirmed':
            return { backgroundColor: '#28a745', color: 'white', padding: '4px', borderRadius: '3px' };
        case 'canceled':
            return { backgroundColor: '#dc3545', color: 'white', padding: '4px', borderRadius: '3px' };
        default:
            return {};
    }
};