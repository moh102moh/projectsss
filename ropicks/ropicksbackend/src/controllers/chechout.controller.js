// controllers/checkout.controller.js
import { Cart, CartItem, Product, Order, OrderItem, sequelize } from '../models/index.js';

export const checkout = async (req, res) => {
  const userId = req.user.id;
  const t = await sequelize.transaction();

  try {
    const cart = await Cart.findOne({ 
      where: { userId },
      include: [{ model: CartItem, as: 'items', include: ['product'] }]
    });

    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total = 0;
    const orderItemsData = [];

    for (const item of cart.items) {
      if (!item.product || item.product.quantity < item.quantity) {
        throw new Error(`Product ${item.productId} is out of stock`);
      }

      const price = item.product.discountedPrice || item.product.price;
      total += price * item.quantity;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: price,
        colorId: item.colorId
      });
    }

   
    const order = await Order.create({ userId, total, status: 'pending' }, { transaction: t });


    for (const oi of orderItemsData) {
      await OrderItem.create({ ...oi, orderId: order.id }, { transaction: t });
      await Product.decrement('quantity', { by: oi.quantity, where: { id: oi.productId }, transaction: t });
    }


    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};