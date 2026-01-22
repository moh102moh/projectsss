// models/review.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },

    title: {
      type: DataTypes.STRING,
      allowNull: true
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }

  }, {
    tableName: 'reviews',
    timestamps: true
  });

  return Review;
};
