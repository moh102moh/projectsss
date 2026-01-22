// controllers/review.controller.js
import { Review, Product, User } from '../models/index.js';


export const createReview = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ message: 'productId and rating are required' });
    }


    const exists = await Review.findOne({ where: { userId, productId } });
    if (exists) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    const review = await Review.create({
      userId,
      productId,
      rating,
      title: title || null,
      comment: comment || null
    });

    return res.status(201).json(review);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { productId },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(reviews);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const reviews = await Review.findAll({
      where: { userId },
      include: [{ model: Product, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(reviews);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
