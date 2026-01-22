// models/cartItem.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CartItem = sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cartId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    colorId: { type: DataTypes.INTEGER, allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
  }, {
    tableName: 'cart_items',
    timestamps: true
  });

  return CartItem;
};
