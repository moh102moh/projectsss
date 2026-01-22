import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createRoom, updateRoom, deleteRoom, getRoomsByHotel, getRoomById } from "../controllers/roomsController.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join("uploads", "rooms");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});


const upload = multer({ storage });




router.post("/create", upload.array("images"), createRoom);
router.put("/:id", upload.array("images"), updateRoom);
router.delete("/:id", deleteRoom);
router.get("/hotel/:hotelId", getRoomsByHotel);
router.get("/:id", getRoomById);

export default router;
