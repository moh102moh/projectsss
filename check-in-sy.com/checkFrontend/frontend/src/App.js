import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Loginhotel from "./components/LoginHotel";
import LoginDelivery from "./components/LoginDelivery";

import AdminDashboard from "./components/AdminDashboard";
import HotelDashboard from "./components/HotelDashboard";
import HotelsList from "./components/HotelsList";
import AddHotel from "./components/AddHotel";
import EditHotel from "./components/EditHotel";
import HotelView from "./components/HotelView";
import AdminServicesOffers from "./components/AdminServicesOffers";
import BookingsDashboard from "./components/BookingsDashboard";
import AdminSupportTickets from "./components/AdminSupportTickets";
import TransportBookingsDashboard from "./components/TransportBookingsDashboard";
import DriversAndCarsDashboard from "./components/DriversAndCarsDashboard";
import DriversAndCars from "./components/DriversAndCars";

import { getRedirectByRole } from "./utils/authHandler";

// ----------------------------------------
const PrivateRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token || !userRole) {
    const redirectPath =
      role === "hotel" ? "/login-hotel" :
      role === "delivery" ? "/login-delivery" :
      role === "admin" ? "/login" :
      "/login";
    return <Navigate to={redirectPath} replace />;
  }

  return userRole === role ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔑 تسجيل الدخول */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-hotel" element={<Loginhotel />} />
        <Route path="/login-delivery" element={<LoginDelivery />} />

        {/* 👑 مسارات الأدمن */}
        <Route path="/admin-dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/dashboard/hotels" element={<PrivateRoute role="admin"><HotelsList /></PrivateRoute>} />
        <Route path="/dashboard/hotels/add" element={<PrivateRoute role="admin"><AddHotel /></PrivateRoute>} />
        <Route path="/dashboard/hotels/edit/:id" element={<PrivateRoute role="admin"><EditHotel /></PrivateRoute>} />
        <Route path="/dashboard/bookings" element={<PrivateRoute role="admin"><BookingsDashboard /></PrivateRoute>} />
        <Route path="/dashboard/support" element={<PrivateRoute role="admin"><AdminSupportTickets /></PrivateRoute>} />
        <Route path="/dashboard/transport-bookings" element={<PrivateRoute role="admin"><TransportBookingsDashboard /></PrivateRoute>} />
        <Route path="/dashboard/offers" element={<PrivateRoute role="admin"><AdminServicesOffers /></PrivateRoute>} />
        <Route path="/dashboard/hotels/view/:id" element={<PrivateRoute role="admin"><HotelView /></PrivateRoute>} />

        {/* 🏨 مسار الفندق */}
        <Route path="/hotel-dashboard" element={<PrivateRoute role="hotel"><HotelDashboard /></PrivateRoute>} />

        {/* 🚚 مسارات التوصيل */}
        <Route path="/dashboard/drivers" element={<PrivateRoute role="delivery"><DriversAndCarsDashboard /></PrivateRoute>} />
        <Route path="/dashboard/driverss" element={<PrivateRoute role="delivery"><DriversAndCars /></PrivateRoute>} />

        {/* أي مسار غير معروف */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
