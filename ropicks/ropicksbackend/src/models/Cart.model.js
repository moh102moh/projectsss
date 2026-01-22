// models/cart.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'carts',
    timestamps: true
  });

  return Cart;
};
