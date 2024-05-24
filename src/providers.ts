import { AddressController } from "./controllers/AddressController";
import { AuthController } from "./controllers/AuthController";
import { CategoryController } from "./controllers/CategoryController";
import { UserController } from "./controllers/UserController";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { AddressRepository } from "./modules/address/AddressRepository";
import { AddressService } from "./modules/address/AddressService";
import { AuthService } from "./modules/auth/AuthService";
import { CategoryRepository } from "./modules/category/CategoryRepository";
import { CategoryService } from "./modules/category/CategoryService";
import { UserRepository } from "./modules/user/UserRepository";
import { UserService } from "./modules/user/UserServices";
import { ProductService } from "./modules/product/ProductService";
import { ProductController } from "./controllers/ProductController";
import { ProductRepository } from "./modules/product/ProductRepository";
import { StockController } from "./controllers/StockController";
import { StockService } from "./modules/stock/StockService";
import { StockRepository } from "./modules/stock/StockRepository";

const userRepository = new UserRepository(),
  userService = new UserService(userRepository),
  userController = new UserController(userService);

const authService = new AuthService(userService),
  authController = new AuthController(authService),
  authMiddleware = new AuthMiddleware();

const addressRepository = new AddressRepository(),
  addressService = new AddressService(addressRepository),
  addressController = new AddressController(addressService);

const categoryRepository = new CategoryRepository(),
  categoryService = new CategoryService(categoryRepository),
  categoryController = new CategoryController(categoryService);

const productRepository = new ProductRepository(),
  productService = new ProductService(productRepository, categoryService),
  productController = new ProductController(productService);

const stockRepository = new StockRepository(),
  stockService = new StockService(stockRepository, productService),
  stockController = new StockController(stockService);

export {
  userController,
  userService,
  authController,
  authService,
  authMiddleware,
  addressController,
  addressService,
  categoryController,
  categoryService,
  productController,
  productService,
  stockController,
  stockService,
};
