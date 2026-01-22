import express from 'express';
import { createCategory,listCategories,updateCategory,deleteCategoery} from '../controllers/category.controller.js';
import { auth, preimt } from '../middlewares/auth.middleware.js';


const router = express.Router();
router.post('/',auth , preimt('admin'),createCategory);
router.get('/',listCategories);
router.put('/:id',auth, preimt('admin'), updateCategory);
router.delete('/:id', auth, preimt('admin'),deleteCategoery);
export default router;