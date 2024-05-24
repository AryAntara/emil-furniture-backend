import { User } from "./User";
import { Address } from "./Address";
import { Product } from "./Product";
import { Category } from "./Category";
import { ProductCategory } from "./ProductCategory";
import { Stock } from "./Stock";

// UserAddress
Address.belongsTo(User);
User.hasMany(Address);

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
