import { User } from "./User";
import { Address } from "./Address";
import { Product } from "./Product";
import { Category } from "./Category";
import { ProductCategory } from "./ProductCategory";
import { Stock } from "./Stock";
import { Cart } from "./Cart";
import { CartDetail } from "./CartDetail";
import { OrderDetail } from "./OrderDetail";
import { Order } from "./Order";
import { Transaction } from "./Transaction";

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

// Cart M<->1 User
User.hasMany(Cart);
Cart.belongsTo(User);

// Cart 1<->1 Cart Detail
Cart.hasOne(CartDetail);
CartDetail.belongsTo(Cart);

// Cart Detail 1<->1 Product
Product.hasMany(CartDetail);
CartDetail.belongsTo(Product);

// Order 1<->M Order Detail
Order.hasMany(OrderDetail)
OrderDetail.belongsTo(Order)

// Order 1<->1 Transaction
Order.hasOne(Transaction);
Transaction.belongsTo(Order);