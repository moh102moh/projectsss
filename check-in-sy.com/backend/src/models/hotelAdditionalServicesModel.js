import db from "../config/db.js";

export const getHotelServiceById = async (id) => {
  const [rows] = await db.query("SELECT * FROM hotel_additional_services WHERE id = ?", [id]);
  return rows[0];
};
