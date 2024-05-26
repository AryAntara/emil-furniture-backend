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
import { OrderRepository } from "./modules/order/OrderRepository";
import { OrderDetailRepository } from "./modules/orderDetail/OrderDetailRepository";
import { OrderDetailService } from "./modules/orderDetail/OrderDetailService";
import { OrderService } from "./modules/order/OrderService";
import { OrderController } from "./controllers/OrderController";

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

const orderDetailRepository = new OrderDetailRepository(),
  orderDetailService = new OrderDetailService(orderDetailRepository),
  orderRepository = new OrderRepository(),
  orderService = new OrderService(
    orderRepository,
    orderDetailService,
    productService
  ),
  orderController = new OrderController(orderService);

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
  orderController,
  orderDetailService,
};
