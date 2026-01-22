import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
    createTransportService, 
    getAllTransportServices,
    getTransportServiceById,
    updateTransportService,
    deleteTransportService,
    // ⭐️ يجب إضافة الدالة هنا 
    calculateTransferPrice, 
    getAvailableTransferServices 
} from '../controllers/transportServiceController.js'; 

const router = express.Router();

const UPLOADS_FS_ROOT = path.join(process.cwd(), "src", "uploads", "transport_services");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        cb(null, UPLOADS_FS_ROOT); 
    },
    filename: function (req, file, cb) {
    
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `transport-${uniqueSuffix}${ext}`);
    },
});


const upload = multer({ storage: storage }).single('image');

router.get('/transport/calculate-price', calculateTransferPrice);
router.post('/admin/transport/services', upload, createTransportService); 
router.put('/admin/transport/services/:id', upload, updateTransportService);
router.delete('/admin/transport/services/:id', deleteTransportService);
router.get('/admin/transport/services', getAllTransportServices); 


router.get('/transport/calculate-price', calculateTransferPrice);

// مسارات جلب الخدمات العامة (لعرضها بشكل عام)
router.get('/transport/services', getAvailableTransferServices); // ⭐️ يستخدم الدالة التي تعطي سعر تقديري
router.get('/transport/services/all', getAllTransportServices); // يمكن استخدام هذا لغرض جلب الكل
router.get('/transport/services/:id', getTransportServiceById); 

export default router;