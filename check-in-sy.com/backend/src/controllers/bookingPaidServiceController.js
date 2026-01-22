import {
  createBookingPaidService,
  updateBookingPaidServiceInDB,
  getBookingPaidServicesByBookingId,
  deleteBookingPaidService,
  createDirectPaidService,
  getDirectPaidServicesByUserId,
  deleteDirectPaidService
} from "../models/bookingPaidServiceModel.js";


export const addBookingService = async (req, res) => {
  try {
    const { booking_id, service_id, quantity, notes } = req.body;
    if (!booking_id || !service_id || !quantity) {
      return res.status(400).json({ message: "الرجاء إدخال جميع الحقول المطلوبة." });
    }
    const newService = await createBookingPaidService({ booking_id, service_id, quantity, notes });
    res.status(201).json({ message: "تم إضافة الخدمة للحجز بنجاح.", service: newService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateBookingPaidService = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, notes } = req.body;

    if (!id) return res.status(400).json({ message: "معرّف الخدمة مطلوب." });
    if (!quantity && !notes)
      return res
        .status(400)
        .json({ message: "يرجى إدخال الحقول المطلوب تعديلها." });

    const updated = await updateBookingPaidServiceInDB(id, { quantity, notes });

    if (updated.affectedRows === 0)
      return res.status(404).json({ message: "الخدمة غير موجودة." });

    res.json({ message: "تم تعديل الخدمة بنجاح." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getServicesByBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    if (!booking_id) return res.status(400).json({ message: "رقم الحجز مطلوب." });
    const services = await getBookingPaidServicesByBookingId(booking_id);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeBookingService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "معرّف الخدمة مطلوب." });
    await deleteBookingPaidService(id);
    res.json({ message: "تم حذف الخدمة من الحجز بنجاح." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const addDirectService = async (req, res) => {
  try {
    const { user_id, service_id, quantity, notes } = req.body;
    if (!user_id || !service_id || !quantity) return res.status(400).json({ message: "الرجاء إدخال جميع الحقول المطلوبة." });
    const service = await createDirectPaidService({ user_id, service_id, quantity, notes });
    res.status(201).json({ message: "تم إنشاء الخدمة المباشرة بنجاح.", service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDirectServices = async (req, res) => {
  try {
    const { userId } = req.params;
    const services = await getDirectPaidServicesByUserId(userId);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeDirectService = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDirectPaidService(id);
    res.json({ message: "تم حذف الخدمة المباشرة بنجاح." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
