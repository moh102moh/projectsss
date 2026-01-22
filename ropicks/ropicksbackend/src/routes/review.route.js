// routes/review.route.js
import express from 'express';
import {
  createReview,
  getProductReviews,
  getUserReviews
} from '../controllers/review.controller.js';

import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.post('/', auth, createReview);


router.get('/product/:productId', getProductReviews);


router.get('/user/:userId', auth, getUserReviews);

export default router;
