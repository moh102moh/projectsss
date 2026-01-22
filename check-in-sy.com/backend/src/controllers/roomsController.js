import pool from "../config/db.js";
import fs from "fs";
import path from "path";

// ? ÅäÔÇÁ ÛÑÝÉ
export const createRoom = async (req, res) => {
  try {
    const { hotel_id, name, type, description, price_per_night, capacity } = req.body;

    const [result] = await pool.query(
      `INSERT INTO rooms (hotel_id, name, type, description, price_per_night, capacity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [hotel_id, name, type, description, price_per_night, capacity]
    );

    const roomId = result.insertId;

    // ÍÝÙ ÕæÑ ÇáÛÑÝÉ Åä æõÌÏÊ
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        url: `/uploads/rooms/${file.filename}`,
        is_main: index === 0 ? 1 : 0
      }));

      const placeholders = images.map(() => "(?, ?, ?)").join(",");
      const values = images.flatMap(img => [roomId, img.url, img.is_main]);
      await pool.query(
        `INSERT INTO room_images (room_id, image_url, is_main) VALUES ${placeholders}`,
        values
      );
    }

    return res.status(201).json({ message: "Room created successfully", roomId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ? ÊÍÏíË ÛÑÝÉ
export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { name, type, description, price_per_night, capacity, available } = req.body;

    const [result] = await pool.query(
      `UPDATE rooms SET name=?, type=?, description=?, price_per_night=?, capacity=?, available=?, updated_at=NOW() WHERE id=?`,
      [name, type, description, price_per_night, capacity, available, roomId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Room not found" });

    // ÍÐÝ ÕæÑ ÞÏíãÉ
    await pool.query(`DELETE FROM room_images WHERE room_id=?`, [roomId]);

    // ÅÖÇÝÉ ÕæÑ ÌÏíÏÉ
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        url: `/uploads/rooms/${file.filename}`,
        is_main: index === 0 ? 1 : 0
      }));
      const placeholders = images.map(() => "(?, ?, ?)").join(",");
      const values = images.flatMap(img => [roomId, img.url, img.is_main]);
      await pool.query(
        `INSERT INTO room_images (room_id, image_url, is_main) VALUES ${placeholders}`,
        values
      );
    }

    return res.json({ message: "Room updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ? ÍÐÝ ÛÑÝÉ
export const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    // ÍÐÝ ÕæÑ ÇáÛÑÝÉ ãä ÇáÓíÑÝÑ
    const [images] = await pool.query(`SELECT image_url FROM room_images WHERE room_id=?`, [roomId]);
    images.forEach(img => {
      const filePath = path.join("uploads/rooms", path.basename(img.image_url));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await pool.query(`DELETE FROM room_images WHERE room_id=?`, [roomId]);
    const [result] = await pool.query(`DELETE FROM rooms WHERE id=?`, [roomId]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Room not found" });

    return res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ? ÌáÈ ßá ÇáÛÑÝ ÇáÊÇÈÚÉ áÝäÏÞ ãÚ ÎÏãÇÊå ÇáãÌÇäíÉ æÇáãÏÝæÚÉ
export const getRoomsByHotel = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;

    const [rooms] = await pool.query(`
      SELECT r.*, 
        (SELECT image_url FROM room_images WHERE room_id=r.id AND is_main=1 LIMIT 1) AS main_image
      FROM rooms r
      WHERE r.hotel_id=?
    `, [hotelId]);

    // ? ÇáÎÏãÇÊ ÇáãÌÇäíÉ
    const [hotelAmenities] = await pool.query(
      `SELECT id, name, description, is_free FROM hotel_amenities WHERE hotel_id=?`,
      [hotelId]
    );

    // ? ÇáÎÏãÇÊ ÇáãÏÝæÚÉ
    const [hotelPaidServices] = await pool.query(
      `SELECT id, name, description, price, available FROM hotel_additional_services WHERE hotel_id=?`,
      [hotelId]
    );

    // ÏãÌ ÇáÈíÇäÇÊ Èßá ÛÑÝÉ
    for (let room of rooms) {
      const [images] = await pool.query(
        `SELECT image_url, is_main FROM room_images WHERE room_id=?`,
        [room.id]
      );
      room.images = images;
      room.free_services = hotelAmenities;
      room.paid_services = hotelPaidServices;
    }

    return res.json(rooms);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ? ÌáÈ ÛÑÝÉ æÇÍÏÉ ãÚ ÎÏãÇÊ ÇáÝäÏÞ ÇáãÌÇäíÉ æÇáãÏÝæÚÉ
export const getRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;
    const [[room]] = await pool.query(`SELECT * FROM rooms WHERE id=?`, [roomId]);

    if (!room) return res.status(404).json({ message: "Room not found" });

    const [images] = await pool.query(
      `SELECT image_url, is_main FROM room_images WHERE room_id=?`,
      [roomId]
    );

    const [hotelAmenities] = await pool.query(
      `SELECT id, name, description, is_free FROM hotel_amenities WHERE hotel_id=?`,
      [room.hotel_id]
    );

    const [hotelPaidServices] = await pool.query(
      `SELECT id, name, description, price, available FROM hotel_additional_services WHERE hotel_id=?`,
      [room.hotel_id]
    );

    room.images = images;
    room.free_services = hotelAmenities;
    room.paid_services = hotelPaidServices;

    return res.json(room);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
