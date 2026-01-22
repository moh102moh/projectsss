import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditHotel() {
  const { id } = useParams();
  const navigate = useNavigate();
const API_BASE = "https://check-in-sy.com/api"; // المسار الأساسي (بدون الشرطة المائلة في النهاية)
  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    address: "",
    stars: 0,
    phone: "",
    email: "",
    main_image: "",
    latitude: "",
    longitude: "",
    owner_id: "",
    created_by: "",
    status: "نشط",
    min_price: "",
    max_price: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/hotls/${id}`);

        setForm({
          name: data.hotel.name || "",
          description: data.hotel.description || "",
          city: data.hotel.city || "",
          address: data.hotel.address || "",
          stars: data.hotel.stars || 0,
          phone: data.hotel.phone || "",
          email: data.hotel.email || "",
          main_image: data.hotel.main_image || "",
          latitude: data.hotel.latitude || "",
          longitude: data.hotel.longitude || "",
          owner_id: data.hotel.owner_id || "",
          created_by: data.hotel.created_by || "",
          status: data.hotel.status || "نشط",
          min_price: data.hotel.min_price || "",
          max_price: data.hotel.max_price || "",
        });
      } catch (err) {
        console.error(err);
        alert("❌ فشل تحميل بيانات الفندق");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setMainImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== undefined && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      if (mainImage) formData.append("images", mainImage);

    await axios.put(`${API_BASE}/hotls/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
});
      alert("✅ تم تعديل الفندق بنجاح");
      navigate("/dashboard/hotels");
    } catch (err) {
      console.error(err);
      alert("❌ فشل التعديل");
    }
  };

  if (loading) return <p>⏳ جاري تحميل البيانات...</p>;

  return (
    <div className="content">
      <h2>✏️ تعديل بيانات الفندق</h2>
      <form onSubmit={handleSubmit} className="form">

        <label>الاسم</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>الوصف</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>المدينة</label>
        <input name="city" value={form.city} onChange={handleChange} required />

        <label>العنوان</label>
        <input name="address" value={form.address} onChange={handleChange} required />

        <label>عدد النجوم</label>
        <input
          type="number"
          name="stars"
          value={form.stars}
          onChange={handleChange}
          min="0"
          max="5"
        />

        <label>الهاتف</label>
        <input name="phone" value={form.phone} onChange={handleChange} />

        <label>الإيميل</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>الصورة الحالية</label>
        {form.main_image ? (
          <img
            src={`${form.main_image}`}
            alt="Hotel"
            width="120"
            style={{ borderRadius: "8px" }}
          />
        ) : (
          <p>— لا توجد صورة حالياً</p>
        )}

        <label>تغيير الصورة</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <label>خط العرض</label>
        <input name="latitude" value={form.latitude} onChange={handleChange} />

        <label>خط الطول</label>
        <input name="longitude" value={form.longitude} onChange={handleChange} />

        <label>المالك (Owner ID)</label>
        <input name="owner_id" value={form.owner_id} onChange={handleChange} />

        <label>تم الإنشاء بواسطة</label>
        <input name="created_by" value={form.created_by} onChange={handleChange} />

        <label>الحالة</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="نشط">نشط</option>
          <option value="غير نشط">غير نشط</option>
        </select>

        <label>الحد الأدنى للسعر</label>
        <input type="number" name="min_price" value={form.min_price} onChange={handleChange} />

        <label>الحد الأعلى للسعر</label>
        <input type="number" name="max_price" value={form.max_price} onChange={handleChange} />

        <button type="submit" className="btn">💾 حفظ التعديلات</button>
      </form>

      {/* 🔥 CSS داخل نفس الملف */}
      <style>{`
        .content {
          padding: 20px;
          direction: rtl;
          font-family: "Tajawal", sans-serif;
        }
        h2 {
          margin-bottom: 20px;
          color: #333;
          font-weight: bold;
        }
        .form {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr;
        }
        .form label {
          font-weight: bold;
          color: #444;
        }
        .form input,
        .form textarea,
        .form select {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
          width: 100%;
          transition: 0.2s;
          font-size: 15px;
        }
        .form input:focus,
        .form textarea:focus,
        .form select:focus {
          border-color: #007bff;
          box-shadow: 0 0 5px #007bff55;
        }
        .form textarea {
          resize: vertical;
          min-height: 90px;
        }
        .btn {
          grid-column: span 2;
          padding: 14px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 17px;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn:hover {
          background: #005fcc;
        }
      `}</style>
    </div>
  );
}
