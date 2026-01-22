import db from "../config/db.js";

/**
 * جدول paid_services بعد التعديل:
 * id, name, images (JSON), description, price, active, created_at, updated_at
 */

export const getAllPaidServices = async () => {
  const [rows] = await db.execute("SELECT * FROM paid_services WHERE active=1");
  return rows;
};

export const getPaidServiceById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM paid_services WHERE id=?", [id]);
  return rows[0];
};

export const createPaidService = async (name, images, description, price) => {
  const [result] = await db.execute(
    "INSERT INTO paid_services (name, images, description, price) VALUES (?,?,?,?)",
    [
      name || null,
      images ? JSON.stringify(images) : null,
      description || null,
      price != undefined ? price : null,
    ]
  );
  return result.insertId;
};

export const updatePaidService = async (id, fields) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return; // لا يوجد شيء لتحديثه

  const setClause = keys.map((key) => `${key}=?`).join(", ");
  const values = keys.map((key) => fields[key]);

  await db.execute(`UPDATE paid_services SET ${setClause} WHERE id=?`, [...values, id]);
};
export const deletePaidService = async (id) => {
  await db.execute("DELETE FROM paid_services WHERE id=?", [id]);
};
