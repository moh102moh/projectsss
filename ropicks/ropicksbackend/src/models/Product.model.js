import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discountedPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
      
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    warrantyMonths:{
    type :DataTypes.INTEGER, 
    allowNull:true
    },
    warrantyLabel : {
    type: DataTypes.STRING, 
    allowNull :true},
    specs : { 
    type:DataTypes.JSON , 
    allowNull : true},
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'products',
    timestamps: true
  });

  return Product;
};

