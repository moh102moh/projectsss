import React, { useState } from "react";
import axios from "axios";

export default function EditUser({ user, onUserUpdated }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    full_name: user.full_name,
    phone: user.phone,
    role: user.role
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/auth/users/${user.id}`, form);
      setShow(false);
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      console.error("خطأ في التعديل:", err);
    }
  };

  return (
    <>
      <button className="edit-btn" onClick={() => setShow(!show)}>
        ✏ تعديل
      </button>

      {show && (
        <form onSubmit={handleSubmit} className="edit-user-form">
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="customer">زبون</option>
            <option value="admin">مدير</option>
            <option value="hotel">فندق</option>
            <option value="delivery">توصيل</option>
          </select>

          <button type="submit" className="save-btn">
            💾 حفظ
          </button>
        </form>
      )}

      {/* === CSS داخل نفس الملف === */}
      <style jsx>{`
        .edit-btn {
          padding: 6px 12px;
          background: #ffc107;
          color: #333;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: 0.2s;
        }

        .edit-btn:hover {
          background: #e0a800;
        }

        .edit-user-form {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #fff;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          direction: rtl;
          max-width: 280px;
        }

        .edit-user-form input,
        .edit-user-form select {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          transition: 0.2s;
        }

        .edit-user-form input:focus,
        .edit-user-form select:focus {
          border-color: #007bff;
          box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
        }

        .save-btn {
          padding: 10px;
          background: #28a745;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          transition: 0.2s;
        }

        .save-btn:hover {
          background: #1e7e34;
        }
      `}</style>
    </>
  );
}
