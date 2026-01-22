import { Navigate } from "react-router-dom";

export default function DeliveryDashboard() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "delivery") return <Navigate to="/login" replace />;

  return (
    <div>
      <h1>لوحة مسؤولي التوصيل</h1>
    </div>
  );
}
