// src/controllers/driversController.js
import db from "../config/db.js";
import fs from "fs";
import path from "path";

// -----------------------------------------------------------
// إنشاء سائق
// -----------------------------------------------------------
export const createDriver = async (req, res) => {
  try {
    const { service_id, driver_name, driver_phone, car_color, car_plate_number, car_model } = req.body;

    if (!service_id || !driver_name) {
      return res.status(400).json({ message: "الرجاء إدخال service_id و driver_name" });
    }

    const driverImagePath = req.file ? "/uploads/drivers/" + req.file.filename : null;

    const [insert] = await db.execute(
      `INSERT INTO drivers (service_id, driver_name, driver_phone, driver_image, car_color, car_plate_number, car_model)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [service_id, driver_name, driver_phone, driverImagePath, car_color, car_plate_number, car_model]
    );

    res.status(201).json({ message: "تم إنشاء السائق بنجاح", driver_id: insert.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const driverId = req.params.id;

    const { service_id, driver_name, driver_phone, car_color, car_plate_number, car_model } = req.body;

    const [existing] = await db.execute(`SELECT * FROM drivers WHERE id = ?`, [driverId]);
    if (!existing[0]) return res.status(404).json({ message: "السائق غير موجود" });

    let imgPath = existing[0].driver_image;

    if (req.file) {
      // احذف الصورة القديمة إن وُجدت
      if (imgPath && fs.existsSync("src" + imgPath)) {
        fs.unlinkSync("src" + imgPath);
      }
      imgPath = "/uploads/drivers/" + req.file.filename;
    }

    await db.execute(
      `UPDATE drivers SET service_id=?, driver_name=?, driver_phone=?, driver_image=?, car_color=?, car_plate_number=?, car_model=?
       WHERE id=?`,
      [service_id, driver_name, driver_phone, imgPath, car_color, car_plate_number, car_model, driverId]
    );

    res.json({ message: "تم تحديث بيانات السائق بنجاح" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------------
// حذف سائق
// -----------------------------------------------------------
export const deleteDriver = async (req, res) => {
  try {
    const driverId = req.params.id;

    const [row] = await db.execute(`SELECT driver_image FROM drivers WHERE id = ?`, [driverId]);
    if (!row.length) return res.status(404).json({ message: "السائق غير موجود" });

    if (row[0].driver_image && fs.existsSync("src" + row[0].driver_image)) {
      fs.unlinkSync("src" + row[0].driver_image);
    }

    await db.execute(`DELETE FROM drivers WHERE id = ?`, [driverId]);

    res.json({ message: "تم حذف السائق بنجاح" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------------
// عرض كل السائقين
// -----------------------------------------------------------
export const getAllDrivers = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT d.*, ts.name_ar AS service_name
      FROM drivers d
      LEFT JOIN transport_services ts ON d.service_id = ts.id
      ORDER BY d.id DESC
    `);

    res.json({ drivers: rows });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------------
// عرض سائق واحد
// -----------------------------------------------------------
export const getDriverById = async (req, res) => {
  try {
    const driverId = req.params.id;

    const [rows] = await db.execute(`
      SELECT d.*, ts.name_ar AS service_name
      FROM drivers d
      LEFT JOIN transport_services ts ON d.service_id = ts.id
      WHERE d.id = ?
      LIMIT 1
    `, [driverId]);

    if (!rows.length) return res.status(404).json({ message: "السائق غير موجود" });

    res.json({ driver: rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
