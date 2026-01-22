import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const menu = [
    { name: "المستخدمين", path: "/admin-dashboard" },
    { name: "الفنادق", path: "/dashboard/hotels" },
 
    { name: "العروض والحجوزات", path: "/dashboard/offers" },
    { name: "الحجوزات الفنادق", path: "/dashboard/bookings" },
    { name: "حجوزات التوصيل", path: "/dashboard/transport-bookings" },
     { name: "طلبات الدعم الفني", path: "/dashboard/support" },
  ];

  return (
    <div className="sidebar">
      <h1 className="sidebar-title">لوحة التحكم</h1>
      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
