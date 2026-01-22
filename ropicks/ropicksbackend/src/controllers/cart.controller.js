import { Cart, CartItem, Product, ProductColor } from '../models/index.js';


async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
}

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getOrCreateCart(userId);
    
    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [
        { model: Product, as: 'product' },
        { model: ProductColor, as: 'color' }
      ]
    });

    let total = 0;
    const data = items.map(i => {
      const price = i.product.discountedPrice || i.product.price;
      const subtotal = price * i.quantity;
      total += subtotal;
      return {
        id: i.id,
        product: i.product,
        color: i.color,
        quantity: i.quantity,
        price,
        subtotal
      };
    });

    return res.json({ items: data, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body; 

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Missing data. Expecting: { items: [...] }' });
  }

  try {
    const cart = await getOrCreateCart(userId);
    const resultMessages = [];

    for (const item of items) {
      const { productId, colorId, quantity } = item;

      if (!productId || !quantity) continue;

      const product = await Product.findByPk(productId);
      if (!product) {
        resultMessages.push(`Product ID ${productId} not found.`);
        continue;
      }

      if (product.quantity < quantity) {
        resultMessages.push(`Product ID ${productId}: Insufficient stock.`);
        continue; 
      }

      const existing = await CartItem.findOne({
        where: { 
          cartId: cart.id, 
          productId, 
          colorId: colorId || null 
        }
      });

      if (existing) {
        
        await existing.update({ quantity: existing.quantity + quantity });
      } else {
       
        await CartItem.create({
          cartId: cart.id,
          productId,
          colorId: colorId || null,
          quantity
        });
      }
    }

    return res.status(200).json({ 
      message: 'Cart updated successfully', 
      details: resultMessages.length > 0 ? resultMessages : 'All items added'
    });

  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findByPk(req.params.id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (quantity <= 0) {
      await item.destroy();
      return res.json({ message: 'Item removed' });
    }

    await item.update({ quantity });
    return res.json({ message: 'Updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.destroy();
    return res.json({ message: 'Removed from cart' });
  } catch (error) {
    return res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};