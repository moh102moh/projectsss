// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🧹 نظف الـ localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // 🔄 توجه لصفحة تسجيل الدخول حسب الدور
    if (role === "admin") navigate("/login");
    else if (role === "hotel") navigate("/login-hotel");
    else if (role === "delivery") navigate("/login-delivery");
    else navigate("/login");
  };

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      background: "#f0f0f0",
      borderBottom: "1px solid #ddd"
    }}>
      <h2>{role.toUpperCase()} Dashboard</h2>
      <button onClick={handleLogout} style={{
        padding: "6px 12px",
        background: "#ff4d4f",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}>
        تسجيل الخروج
      </button>
    </header>
  );
}
