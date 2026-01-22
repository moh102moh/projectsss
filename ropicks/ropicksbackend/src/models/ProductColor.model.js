import {DataTypes} from 'sequelize' ;

export default (sequelize)=>{

const ProductColor = sequelize.define('ProductColor' , { 

id: {type : DataTypes.INTEGER , primaryKey:true, autoIncrement :true },
productId:{type: DataTypes.INTEGER , allowNull:false},
colorName:{type: DataTypes.STRING , allowNull:false},
quantity : {type: DataTypes.INTEGER , allowNull :false , defaultValue : 0}

},{
 tableName :'Product_colors',
 timestamps:true
 

});
return ProductColor ;
};