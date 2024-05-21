import { User } from "./User";
import { Address } from "./Address";
import { Product } from "./Product";
import { Category } from "./Category";
import { ProductCategory } from "./ProductCategory";

// UserAddress
Address.belongsTo(User);
User.hasMany(Address);

// Product M<->M Category
Category.hasMany(Product);
Product.belongsToMany(Category, { through: { 
    model: ProductCategory
}}); 
