import db from "../config/db.js";


export const createBooking = (data, connection) => {
  const { user_id, room_id, check_in, check_out, total_price, status } = data;
  return connection.query(
    "INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status) VALUES (?, ?, ?, ?, ?, ?)",
    [user_id, room_id, check_in, check_out, total_price, status]
  );
};


export const createBookingPaidService = (data, connection) => {
  const { booking_id, service_id, quantity, notes } = data;
  return connection.query(
    "INSERT INTO booking_paid_services (booking_id, service_id, quantity, notes) VALUES (?, ?, ?, ?)",
    [booking_id, service_id, quantity, notes]
  );
};

export const createDirectPaidService = (data, connection) => {
  const { user_id, service_id, quantity } = data;
  return connection.query(
    "INSERT INTO direct_paid_service_requests (user_id, service_id, quantity) VALUES (?, ?, ?)",
    [user_id, service_id, quantity]
  );
};
