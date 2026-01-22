import express from "express";
import {
  createAdditionalService,
  updateAdditionalService,
  deleteAdditionalService,
  getHotelAdditionalServices
} from "../controllers/hotelAdditionalServicesController.js";

const router = express.Router();


router.post("/:hotelId/create", createAdditionalService);


router.put("/:id", updateAdditionalService);


router.delete("/:id", deleteAdditionalService);



router.get("/hotel/:hotelId", getHotelAdditionalServices);

export default router;
