import db from "../config/db.js";

export const createDirectRequest = async (user_id, service_id, quantity = 1) => {
  const [result] = await db.execute(
    "INSERT INTO direct_paid_service_requests (user_id, service_id, quantity) VALUES (?,?,?)",
    [user_id, service_id, quantity]
  );
  return result.insertId;
};
export const updateDirectRequest = async (id, quantity) => {
  const [result] = await db.execute(
    "UPDATE direct_paid_service_requests SET quantity=? WHERE id=?",
    [quantity, id]
  );
  return result.affectedRows;
};


export const getDirectRequestsByUser = async (user_id) => {
  const [rows] = await db.execute(
    `SELECT dps.id, ps.name, ps.type, ps.price, dps.quantity
     FROM direct_paid_service_requests dps
     JOIN paid_services ps ON dps.service_id = ps.id
     WHERE dps.user_id=?`,
    [user_id]
  );
  return rows;
};

export const deleteDirectRequest = async (id) => {
  await db.execute("DELETE FROM direct_paid_service_requests WHERE id=?", [id]);
};
