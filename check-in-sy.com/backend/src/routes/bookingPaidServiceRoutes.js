import express from "express";
import {
  addBookingService,
  getServicesByBooking,
  removeBookingService,
  updateBookingPaidService,
  addDirectService,
  getDirectServices,
  removeDirectService
} from "../controllers/bookingPaidServiceController.js";

const router = express.Router();


router.post("/add", addBookingService);
router.put("/:id", updateBookingPaidService);
router.get("/:booking_id", getServicesByBooking);
router.delete("/:id", removeBookingService);


router.post("/direct", addDirectService);
router.get("/direct/:userId", getDirectServices);
router.delete("/direct/:id", removeDirectService);

export default router;
