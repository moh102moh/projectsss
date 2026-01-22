import express from 'express';
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { auth, preimt } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js'; 

const router = express.Router();

router.post('/', auth, preimt('admin'), upload.array('images', 6), createProduct);
router.get('/', listProducts);
router.get('/:id', getProduct);
router.put('/:id', auth, preimt('admin'), upload.array('images', 6), updateProduct);
router.delete('/:id', auth, preimt('admin'), deleteProduct);

export default router;
