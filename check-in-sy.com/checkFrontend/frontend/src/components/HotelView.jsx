import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function HotelView() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingHotel, setEditingHotel] = useState(false);
  const [hotelForm, setHotelForm] = useState({});

  const fetchHotel = async () => {
    try {
      const res = await axios.get(`/api/hotel-admin/admin/hotels/${id}`);
      setData(res.data);
      setHotelForm(res.data.hotel);
    } catch (err) {
      console.error("Error fetching hotel details:", err);
      alert("❌ خطأ في تحميل تفاصيل الفندق");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const handleHotelChange = (e) =>
    setHotelForm({ ...hotelForm, [e.target.name]: e.target.value });

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/hotel-admin/admin/hotels/${id}`,
        hotelForm
      );
      alert("✅ تم تحديث بيانات الفندق");
      setData({ ...data, hotel: hotelForm });
      setEditingHotel(false);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ فشل التحديث");
    }
  };

  if (loading) return <p>⏳ جاري تحميل بيانات الفندق...</p>;
  if (!data) return <p>❌ لم يتم العثور على بيانات الفندق</p>;

  const { hotel, rooms, amenities, additionalServices, offers, reviews } = data;

 const BASE_URL = "https://check-in-sy.com";

const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/100";

  if (path.startsWith("http")) return path; // صورة كاملة

  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

  return (
    <div style={{ direction: "rtl", padding: "20px" }}>
      {/* ================= بيانات الفندق ================= */}
      <h2>📋 بيانات الفندق</h2>
      {!editingHotel ? (
        <div>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>

              {/* 🖼 صف عرض صورة الفندق */}
              <tr>
                <td style={{ fontWeight: "bold" }}>صورة الفندق</td>
                <td>
                  <img
                    src={getImageUrl(hotel.main_image)}
                    alt="صورة الفندق"
                    width="200"
                    style={{ borderRadius: "10px" }}
                  />
                </td>
              </tr>

              {/* باقي معلومات الفندق بدون تكرار main_image */}
              {Object.entries(hotel).map(([key, value]) =>
                key !== "main_image" && (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value?.toString()}</td>
                  </tr>
                )
              )}

            </tbody>
          </table>

          <button onClick={() => setEditingHotel(true)}>✏️ تعديل البيانات</button>
        </div>
      ) : (
        <form onSubmit={handleHotelSubmit} style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
          {Object.keys(hotelForm).map(key => (
            <div key={key}>
              <label>{key}</label>
              <input name={key} value={hotelForm[key] || ""} onChange={handleHotelChange} />
            </div>
          ))}
          <button type="submit">💾 حفظ</button>
          <button type="button" onClick={() => setEditingHotel(false)}>❌ إلغاء</button>
        </form>
      )}

      {/* ================= الغرف ================= */}
      <h2>🛏 الغرف</h2>
      {rooms.length > 0 ? (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>النوع</th>
              <th>الوصف</th>
              <th>السعر</th>
              <th>السعة</th>
              <th>متاحة</th>
              <th>الكمية</th>
              <th>الحالة</th>
              <th>📸 صور الغرفة</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.description}</td>
                <td>{r.price_per_night}</td>
                <td>{r.capacity}</td>
                <td>{r.available}</td>
                <td>{r.quantity}</td>
                <td>{r.status}</td>

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
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>لا توجد غرف</p>
      )}

      {/* ================= الخدمات المجانية ================= */}
      <h2>💎 الخدمات المجانية</h2>
      {amenities.filter(a => a.is_free).length > 0 ? (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr><th>الاسم</th><th>الوصف</th><th>نوع الخدمة</th></tr>
          </thead>
          <tbody>
            {amenities.filter(a => a.is_free).map(a => (
              <tr key={a.id}>
                <td>{a.name}</td><td>{a.description}</td><td>مجانية</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>لا توجد خدمات مجانية</p>}

      {/* ================= الخدمات المدفوعة ================= */}
      <h2>💰 الخدمات المدفوعة</h2>
      {additionalServices.length > 0 ? (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr><th>الاسم</th><th>الوصف</th><th>السعر</th><th>متاحة</th></tr>
          </thead>
          <tbody>
            {additionalServices.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td><td>{s.description}</td><td>{s.price}</td><td>{s.available ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>لا توجد خدمات مدفوعة</p>}

      {/* ================= العروض ================= */}
      <h2>🏷 العروض</h2>
      {offers.length > 0 ? (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr><th>العنوان</th><th>الوصف</th><th>ملاحظات</th><th>الصورة</th><th>السعر</th></tr>
          </thead>
          <tbody>
            {offers.map(o => (
              <tr key={o.id}>
                <td>{o.title}</td>
                <td>{o.description}</td>
                <td>{o.notes}</td>
                <td>
                  {o.image_url ? (
                    <img
                      src={getImageUrl(o.image_url)}
                      alt={o.title}
                      width="120"
                      style={{ borderRadius: "8px" }}
                    />
                  ) : (
                    "—"
                  )}
                </td>

                <td>{o.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>لا توجد عروض</p>}

      {/* ================= التقييمات ================= */}
      <h2>⭐ التقييمات</h2>
      {reviews.length > 0 ? (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr><th>المقيم</th><th>التقييم</th><th>التعليق</th><th>التاريخ</th></tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id}>
                <td>{r.user_name || "مستخدم مجهول"}</td>
                <td>{r.rating}</td>
                <td>{r.comment}</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>لا توجد تقييمات</p>}
    </div>
  );
}
