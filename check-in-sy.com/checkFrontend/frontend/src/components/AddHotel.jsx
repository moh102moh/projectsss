import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddHotel() {
  const API_BASE = "https://check-in-sy.com";
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    address: "",
    stars: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
    owner_id: "",
    created_by: "",
    status: "نشط",
    min_price: "",
    max_price: ""
  });

  const [mainImage, setMainImage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setMainImage(e.target.files[0]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();

    // append fields (حول الأرقام إلى سلاسل رقمية لتفادي مشاكل النوع)
    Object.keys(form).forEach((key) => {
      let value = form[key];
      if (["stars", "owner_id", "min_price", "max_price"].includes(key)) {
        // لو الحقل فارغ نخلي قيمة افتراضية أو ما نضيفه
        if (value === "" || value == null) return formData.append(key, "");
        value = String(Number(value)); // "453"
      }
      formData.append(key, value == null ? "" : value);
    });

    // Append file — مهم: لا تضف هيدر Content-Type يدوياً
    if (mainImage) {
      // لو الباك ينتظر حقل باسم images (array) فهذه صيغة مقبولة:
      formData.append("images", mainImage, mainImage.name);
      // لو الباك يتوقع array بإسم images[] جرب:
      // formData.append("images[]", mainImage, mainImage.name);
    }

    // Debug: show all formData entries (في الكونسول)
    for (let pair of formData.entries()) {
      console.log("FormData:", pair[0], pair[1]);
    }

    // مهم: لا تضبط headers: axios سيضع Content-Type مع الباوندري تلقائياً
    const res = await axios.post(`${API_BASE}/api/hotls/create`, formData);

    console.log("server response:", res.data);
    alert("✅ تمت إضافة الفندق بنجاح");
    navigate("/dashboard/hotels");
  } catch (err) {
    // عرض تفصيلي للخطأ يساعدنا نعرف السبب الحقيقي
    console.error("Error submitting hotel:", err);
    if (err.response) {
      console.error("Server responded with:", err.response.status, err.response.data);
      alert("❌ فشل في الإضافة — خطأ من السيرفر: " + (err.response.data?.message || err.response.status));
    } else if (err.request) {
      console.error("No response received. Request:", err.request);
      alert("❌ فشل في الإضافة — لم يصل رد من السيرفر");
    } else {
      alert("❌ فشل في الإضافة — " + err.message);
    }
  }
};


  return (
    <div className="add-hotel-container">
      <h2>➕ إضافة فندق جديد</h2>

      <form onSubmit={handleSubmit} className="form">

        <label>الاسم</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>الوصف</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <label>المدينة</label>
        <input name="city" value={form.city} onChange={handleChange} required />

        <label>العنوان</label>
        <input name="address" value={form.address} onChange={handleChange} required />

        <label>عدد النجوم</label>
        <input type="number" name="stars" value={form.stars} onChange={handleChange} min="0" max="5" />

        <label>الهاتف</label>
        <input name="phone" value={form.phone} onChange={handleChange} />

        <label>الإيميل</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>الصورة الرئيسية</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <label>خط العرض (Latitude)</label>
        <input name="latitude" value={form.latitude} onChange={handleChange} />

        <label>خط الطول (Longitude)</label>
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

        <button type="submit" className="btn">💾 حفظ</button>
      </form>

      {/* CSS */}
      <style jsx>{`
        .add-hotel-container {
          max-width: 550px;
          margin: 25px auto;
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          direction: rtl;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
          font-size: 24px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        label {
          font-weight: bold;
          margin-bottom: 3px;
          color: #444;
        }

        input,
        textarea,
        select {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          transition: 0.2s;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #007bff;
          box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
        }

        textarea {
          min-height: 90px;
          resize: vertical;
        }

        .btn {
          margin-top: 15px;
          background: #007bff;
          color: #fff;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 17px;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn:hover {
          background: #005fcc;
        }
      `}</style>
    </div>
  );
}
