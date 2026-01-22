// src/controllers/specialOffersController.js
import pool from "../config/db.js";

export const createSpecialOffer = async (req, res) => {
  try {
    console.log("createSpecialOffer req.file:", req.file);
    const { title, description, price, notes, type, image_url } = req.body;
    const uploadedImage = req.file ? `/uploads/special_offers/${req.file.filename}` : image_url || null;

    const [result] = await pool.query(
      `INSERT INTO special_offers (title, description, price, notes, type, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description || "", price || null, notes || "", type || "other", uploadedImage]
    );

    res.status(201).json({ message: "✅ Special offer created", offerId: result.insertId, image_url: uploadedImage });
  } catch (err) {
    console.error("❌ Error in createSpecialOffer:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateSpecialOffer = async (req, res) => {
  try {
    console.log("updateSpecialOffer req.file:", req.file);
    const { id } = req.params;
    const { title, description, price, notes, type, image_url } = req.body;
    const uploadedImage = req.file ? `/uploads/special_offers/${req.file.filename}` : image_url || null;

    const [result] = await pool.query(
      `UPDATE special_offers
       SET title=?, description=?, price=?, notes=?, type=?, image_url=?, updated_at=NOW()
       WHERE id=?`,
      [title, description, price, notes, type, uploadedImage, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Offer not found" });

    res.json({ message: "✅ Special offer updated", image_url: uploadedImage });
  } catch (err) {
    console.error("❌ Error in updateSpecialOffer:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// الباقي كما لديك (delete/get)
export const deleteSpecialOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM special_offers WHERE id=?`, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Offer not found" });
    res.json({ message: "✅ Special offer deleted" });
  } catch (err) {
    console.error("❌ Error in deleteSpecialOffer:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllSpecialOffers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM special_offers ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error in getAllSpecialOffers:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getSpecialOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const [[offer]] = await pool.query("SELECT * FROM special_offers WHERE id=?", [id]);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json(offer);
  } catch (err) {
    console.error("❌ Error in getSpecialOfferById:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
