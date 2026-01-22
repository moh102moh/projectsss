import pool from "../config/db.js";


export const createAdditionalService = async (req, res) => {
  try {
    const { name, description, price, available } = req.body;
    const { hotelId } = req.params;

    if (!name || !hotelId)
      return res.status(400).json({ message: "Hotel ID and name are required" });

    const [result] = await pool.query(
      `INSERT INTO hotel_additional_services (hotel_id, name, description, price, available)
       VALUES (?, ?, ?, ?, ?)`,
      [hotelId, name, description || null, price || 0, available ?? true]
    );

    return res.status(201).json({
      message: "Additional service created successfully",
      serviceId: result.insertId,
    });
  } catch (err) {
    console.error("❌ createAdditionalService error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const updateAdditionalService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, available } = req.body;

    const [result] = await pool.query(
      `UPDATE hotel_additional_services
       SET name=?, description=?, price=?, available=?, updated_at=NOW()
       WHERE id=?`,
      [name, description, price, available, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Service not found" });

    return res.json({ message: "Service updated successfully" });
  } catch (err) {
    console.error("❌ updateAdditionalService error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteAdditionalService = async (req, res) => {
  try {
    
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM hotel_additional_services WHERE id=?`,
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Service not found" });

    return res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("❌ deleteAdditionalService error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getHotelAdditionalServices = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const [services] = await pool.query(
      `SELECT id, name, description, price, available, created_at
       FROM hotel_additional_services
       WHERE hotel_id=?`,
      [hotelId]
    );

    return res.json(services);
  } catch (err) {
    console.error("❌ getHotelAdditionalServices error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
