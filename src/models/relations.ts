import { User } from "./User";
import { Address } from "./Address";
import { Product } from "./Product";
import { Category } from "./Category";
import { ProductCategory } from "./ProductCategory";
import { Stock } from "./Stock";
import { Order } from "./Order";
import { OrderDetail } from "./OrderDetail";

// User M<->1 Address
User.hasMany(Address);
Address.belongsTo(User);


// Product M<->M Category
Category.belongsToMany(Product, {
  through: {
    model: ProductCategory,
  },
});
Product.belongsToMany(Category, {
  through: {
    model: ProductCategory,
  },
});

// Product M<->1 Stock
Product.hasMany(Stock);
Stock.belongsTo(Product);

// Order M<->1 User
User.hasMany(Order);
Order.belongsTo(User);

// Order 1<->1 Order Detail
Order.hasOne(OrderDetail);
OrderDetail.belongsTo(Order);

// Order Detail 1<->1 Product
// OrderDetail.hasOne(Product);
// Product.belongsTo(OrderDetail);
