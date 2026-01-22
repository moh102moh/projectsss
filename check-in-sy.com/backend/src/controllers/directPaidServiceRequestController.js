import * as DirectRequest from "../models/directPaidServiceRequestModel.js";

export const createRequest = async (req, res) => {
  try {
    const user_id = req.user.id; 
    const { service_id, quantity } = req.body;
    if (!service_id) return res.status(400).json({ message: "الحقل مفقود" });

    const id = await DirectRequest.createDirectRequest(user_id, service_id, quantity || 1);
    res.status(201).json({ message: "تم إنشاء الطلب المباشر", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "القيمة الجديدة غير صالحة." });
    }

    const result = await DirectRequest.updateDirectRequest(id, quantity);

    if (result === 0) {
      return res.status(404).json({ message: "الطلب غير موجود أو لم يتم التعديل." });
    }

    res.json({ message: "تم تعديل الطلب بنجاح." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getRequests = async (req, res) => {
  try {
    const user_id = req.user.id;
    const requests = await DirectRequest.getDirectRequestsByUser(user_id);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await DirectRequest.deleteDirectRequest(id);
    res.json({ message: "تم حذف الطلب المباشر" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
