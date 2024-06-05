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
import { CartRepository } from "./modules/cart/CartRepository";
import { CartDetailRepository } from "./modules/cartDetail/CartDetailRepository";
import { CartDetailService } from "./modules/cartDetail/CartDetailService";
import { CartService } from "./modules/cart/CartService";
import { CartController } from "./controllers/CartController";
import { OrderRepository } from "./modules/order/OrderRepository";
import { OrderService } from "./modules/order/OrderService";
import { OrderController } from "./controllers/OrderController";
import { OrderDetailRepository } from "./modules/orderDetail/OrderDetailRepository";
import { OrderDetailService } from "./modules/orderDetail/OrderDetailService";
import { TransactionRepository } from "./modules/transaction/TransactionRepository";
import { TransactionService } from "./modules/transaction/TransactionService";
import { TransactionController } from "./controllers/TransactionController";
import { Transaction } from "./models/Transaction";

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

const cartDetailRepository = new CartDetailRepository(),
  cartDetailService = new CartDetailService(cartDetailRepository),
  cartRepository = new CartRepository(),
  cartService = new CartService(
    cartRepository,
    cartDetailService,
    productService,
    stockService
  ),
  cartController = new CartController(cartService);

const orderDetailRepository = new OrderDetailRepository(),
  orderDetailService = new OrderDetailService(orderDetailRepository);

const orderRepository = new OrderRepository(),
  orderService = new OrderService(
    orderRepository,
    cartService,
    stockService,
    orderDetailService
  ),
  orderController = new OrderController(orderService);

const transactionRepository = new TransactionRepository(),
  transactionService = new TransactionService(
    transactionRepository,
    orderService,
    addressService,
    userService
  ),
  transactionController = new TransactionController(transactionService);

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
  cartService,
  cartController,
  cartDetailService,
  orderController,
  orderService,
  transactionController,
  transactionService
};
