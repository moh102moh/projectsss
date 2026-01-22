import express from 'express';
import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem
} from '../controllers/cart.controller.js';

import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', auth, getCartItems);
router.post('/', auth, addToCart);
router.put('/:id', auth, updateCartItem);
router.delete('/:id', auth, removeCartItem);

export default router;
