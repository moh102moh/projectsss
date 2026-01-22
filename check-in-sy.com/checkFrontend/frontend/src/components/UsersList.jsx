import React from "react";
import EditUser from "./EditUser";
import axios from "axios";

export default function UsersList({ users, onUsersChange }) {
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      await axios.delete(`/api/auth/users/${id}`);
      onUsersChange();
    } catch (err) {
      console.error("خطأ في الحذف:", err);
    }
  };

  return (
    <div className="users-card">
      <h2>📋 المستخدمين</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>البريد</th>
            <th>الهاتف</th>
            <th>الدور</th>
            <th>إجراءات</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.full_name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.role}</td>
              <td className="actions">
                <EditUser user={u} onUserUpdated={onUsersChange} />
                <button className="delete-btn" onClick={() => handleDelete(u.id)}>
                  🗑 حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CSS */}
      <style jsx>{`
        .users-card {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
          direction: rtl;
          margin-top: 20px;
        }

        h2 {
          margin-bottom: 15px;
          color: #333;
          font-size: 22px;
          text-align: center;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
        }

        .users-table th {
          background: #007bff;
          color: #fff;
          padding: 12px;
          font-size: 15px;
          border: none;
        }

        .users-table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          font-size: 14px;
          color: #333;
        }

        .users-table tr:hover td {
          background: #f4f9ff;
        }

        .actions {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
        }

        .delete-btn {
          padding: 6px 12px;
          background: #dc3545;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.2s;
          font-size: 14px;
        }

        .delete-btn:hover {
          background: #b02a37;
        }
      `}</style>
    </div>
  );
}
