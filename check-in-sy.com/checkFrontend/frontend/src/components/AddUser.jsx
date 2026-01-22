import React, { useState } from "react";
import axios from "axios";

export default function AddUser({ onUserAdded }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("/api/auth/register", form);
      setMessage("تم إضافة المستخدم بنجاح ✅");
      setForm({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        role: "customer",
      });
      if (onUserAdded) onUserAdded();
    } catch (err) {
      setMessage(err.response?.data?.message || "حدث خطأ ما ❌");
    }

    setLoading(false);
  };

  return (
    <div className="card add-user-card">
      <h2>إضافة مستخدم جديد</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="full_name"
          placeholder="الاسم الكامل"
          value={form.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="رقم الهاتف"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="تأكيد كلمة المرور"
          value={form.confirm_password}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="customer">زبون</option>
          <option value="admin">مدير</option>
          <option value="hotel">فندق</option>
          <option value="delivery">توصيل</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "جاري الإضافة..." : "إضافة مستخدم"}
        </button>
      </form>

      {/* --- CSS --- */}
      <style jsx>{`
        .add-user-card {
          width: 100%;
          max-width: 420px;
          margin: 20px auto;
          padding: 25px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          direction: rtl;
          text-align: right;
        }

        .add-user-card h2 {
          margin-bottom: 15px;
          font-size: 22px;
          color: #333;
        }

        .add-user-card form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .add-user-card input,
        .add-user-card select {
          padding: 12px;
          font-size: 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
          transition: 0.2s;
        }

        .add-user-card input:focus,
        .add-user-card select:focus {
          border-color: #007bff;
          box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
        }

        .add-user-card button {
          background: #007bff;
          color: #fff;
          padding: 12px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        .add-user-card button:hover:not(:disabled) {
          background: #005fcc;
        }

        .add-user-card button:disabled {
          background: #8cb9ff;
          cursor: not-allowed;
        }

        .message {
          margin-bottom: 10px;
          padding: 10px;
          background: #f7f7f7;
          color: #333;
          border-radius: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
