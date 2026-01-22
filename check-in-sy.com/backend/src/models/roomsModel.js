import db from "../config/db.js";

export const getRoomById = async (id) => {
  const [rows] = await db.query("SELECT * FROM rooms WHERE id = ?", [id]);
  return rows[0];
};
