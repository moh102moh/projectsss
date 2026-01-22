import sequelize from '../confing/db.js';
import defineUser from './User.model.js';
import defineCategory from './Category.model.js';
import defineProduct from './Product.model.js';
import defineProductImage from './ProductImage.model.js';
import defineOrderModel from './Order.model.js';
import defineProductColor from './ProductColor.model.js';
import defineReview from './Review.model.js';

import defineCart from './Cart.model.js';
import defineCartItem from './CartItem.model.js';

const Cart = defineCart(sequelize);
const CartItem = defineCartItem(sequelize);

const User = defineUser(sequelize);
const Category = defineCategory(sequelize);
const Product = defineProduct(sequelize);
const ProductImage = defineProductImage(sequelize);
const {Order , OrderItem} = defineOrderModel(sequelize);
const ProductColor = defineProductColor(sequelize);
const Review = defineReview(sequelize);

Category.hasMany(Product, {foreignKey : 'categoryId' , as : 'products'});
Product.belongsTo(Category, {foreignKey : 'categoryId', as : 'category'});

Product.hasMany(ProductImage, {foreignKey : 'productId' , as : 'images'});
ProductImage.belongsTo(Product, {foreignKey : 'productId' , as : 'product'});

User.hasMany(Order, { foreignKey : 'userId' , as : 'orders'});
Order.belongsTo(User, { foreignKey : 'userId' , as : 'user'});

 Order.hasMany(OrderItem , { foreignKey : 'orderId' , as : 'items'});
 OrderItem.belongsTo(Order , { foreignKey : 'orderId' , as : 'order'});

 OrderItem.belongsTo(Product , { foreignKey : 'productId' , as : 'product'});
 
 
 Product.hasMany(ProductColor ,{foreignKey :'productId' , as :'colors'});
 ProductColor.belongsTo(Product , {foreignKey :'productId' , as : 'product'});
 
 Product.hasMany(Review , {foreignKey : 'productId' ,as :'reviews'});
 Review.belongsTo(Product , {foreignKey : 'productId',as: 'product'});
 
 User.hasMany(Review , {foreignKey : 'userId' , as :'reviews'});
 Review.belongsTo(User, {foreignKey : 'userId' , as :'users'});
 
 
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
CartItem.belongsTo(ProductColor, { foreignKey: 'colorId', as: 'color' });

 export { sequelize , User , Category , Product , ProductImage , Order , OrderItem , ProductColor , Review,Cart,CartItem};
