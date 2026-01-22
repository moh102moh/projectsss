import db from "../config/db.js";


export const createBookingPaidService = ({ booking_id, service_id, quantity, notes }) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO booking_paid_services (booking_id, service_id, quantity, notes)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [booking_id, service_id, quantity, notes || null], (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, booking_id, service_id, quantity, notes });
    });
  });
};
export const updateBookingPaidServiceInDB = ({ id, quantity, notes }) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE booking_paid_services
      SET quantity = ?, notes = ?
      WHERE id = ?
    `;
    db.query(query, [quantity, notes || null, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
export const getBookingPaidServicesByBookingId = (booking_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT bps.id, bps.booking_id, s.name AS service_name, s.type AS service_type, bps.quantity, bps.notes
      FROM booking_paid_services bps
      JOIN paid_services s ON bps.service_id = s.id
      WHERE bps.booking_id = ?
    `;
    db.query(query, [booking_id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const deleteBookingPaidService = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM booking_paid_services WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const createDirectPaidService = ({ user_id, service_id, quantity, notes }) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO direct_paid_services (user_id, service_id, quantity, notes)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [user_id, service_id, quantity, notes || null], (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, user_id, service_id, quantity, notes });
    });
  });
};

export const getDirectPaidServicesByUserId = (user_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT dps.id, s.name AS service_name, s.type AS service_type, dps.quantity, dps.notes
      FROM direct_paid_services dps
      JOIN paid_services s ON dps.service_id = s.id
      WHERE dps.user_id = ?
    `;
    db.query(query, [user_id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const deleteDirectPaidService = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM direct_paid_services WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
