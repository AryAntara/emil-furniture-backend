import { Context, Hono, MiddlewareHandler, Next } from "hono";
import {
  userController,
  authController,
  authMiddleware,
  addressController,
  categoryController,
  productController,
  stockController,
  cartController,
  orderController,
  transactionController,
} from "./providers";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { mapMiddleware } from "./utils/middlewareMapper";
import { validateJsonContent } from "./middlewares/JsonValidator";

export const app = new Hono();

const auth = new Hono(),
  user = new Hono(),
  address = new Hono(),
  category = new Hono(),
  product = new Hono(),
  stock = new Hono(),
  cart = new Hono(),
  order = new Hono(),
  transaction = new Hono();

// Middleware
app.use("/static/*", serveStatic({ root: "./" }));
app.use(
  cors({
    allowHeaders: [
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
      "Content-Type",
      "Set-Cookie",
      "X-PINGOTHER",
      "Authorization",
    ],
    credentials: true,
    origin: ["http://localhost:5174", "http://localhost:5173"],
    allowMethods: ["get", "post", "delete", "put"],
  })
);

auth.use(
  "/logout",
  async (c, next) => await authMiddleware.validateAccessToken(c, next)
);
auth.use(
  "/renew",
  async (c, next) => await authMiddleware.validateRefreshToken(c, next)
);

// json validator
mapMiddleware(
  cart,
  [validateJsonContent],
  ["/add", "/subtract", "/toggle-active/:cartDetailId"]
);

mapMiddleware(
  stock,
  [validateJsonContent],
  ["/in", "/out", "/update/:stockId"]
);

mapMiddleware(
  auth,
  [validateJsonContent],
  ["/register", "/login", "/forgot-password", "/reset-password/:token"]
);

mapMiddleware(
  user,
  [validateJsonContent],
  ["/promote", "/demote", "/update", "/update/:userId"]
);

mapMiddleware(
  category,
  [validateJsonContent],
  ["/insert", "/update/:categoryId"]
);

mapMiddleware(
  address,
  [validateJsonContent],
  ["/insert", "/update/:addressId", "/set-active/:addressId"]
);

mapMiddleware(order, [validateJsonContent], ["/new"]);
mapMiddleware(transaction, [validateJsonContent], ["/new", "/update/:transactionId"]);

// Login token
mapMiddleware(
  cart,
  [authMiddleware.validateAccessToken],
  [
    "/",
    "/list",
    "/add",
    "/subtract",
    "/reaqcuire/:cartDetailId",
    "/toggle-active/:cartDetailId",
  ]
);

mapMiddleware(
  user,
  [authMiddleware.validateAccessToken],
  ["/profile", "/update"]
);
mapMiddleware(
  address,
  [authMiddleware.validateAccessToken],
  [
    "/insert",
    "/list",
    "/update/:addressId",
    "/delete/:addressId",
    "/set-active/:addressId",
  ]
);
mapMiddleware(category, [authMiddleware.validateAccessToken], ["/list"]);
mapMiddleware(
  order,
  [authMiddleware.validateAccessToken],
  ["/new", "/list", "/cancel/:orderId"]
);
mapMiddleware(
  transaction,
  [authMiddleware.validateAccessToken],
  ["/new", "/pay/:transactionId"]
);
// Login token and admin access
mapMiddleware(
  transaction,
  [authMiddleware.validateAccessToken, authMiddleware.validateAdminAccess],
  ["/list", "/update/:transactionId"]
);
mapMiddleware(
  stock,
  [authMiddleware.validateAccessToken, authMiddleware.validateAdminAccess],
  [
    "/in",
    "/out",
    "/list",
    "/commit/:stockId",
    "/update/:stockId",
    "/delete/:stockId",
  ]
);

mapMiddleware(
  category,
  [authMiddleware.validateAccessToken, authMiddleware.validateAdminAccess],
  ["/insert", "/delete/:categoryId", "/update/:categoryId"]
);
mapMiddleware(
  product,
  [authMiddleware.validateAccessToken, authMiddleware.validateAdminAccess],
  ["/insert", "/update/:productId", "/delete/:addressId"]
);
mapMiddleware(
  user,
  [authMiddleware.validateAccessToken, authMiddleware.validateAdminAccess],
  ["/update/:userId", "/list", "/promote", "/demote", "/delete/:userId"]
);

// root route
app.get("/", async (c) => c.text("APi is live in " + new Date()));

// auth routing
auth.post("/register", async (c) => await authController.register(c));
auth.post("/login", async (c) => await authController.login(c));
auth.get("/verify/:token", async (c) => await authController.verify(c));
auth.get("/logout", async (c) => await authController.logout(c));
auth.get("/renew", async (c) => await authController.renew(c));
auth.post(
  "/forgot-password",
  async (c) => await authController.sendforgotPasswordEmail(c)
);
auth.get(
  "/reset-password/:token",
  async (c) => await authController.showResetPasswordPage(c)
);
auth.put(
  "/reset-password/:token",
  async (c) => await authController.resetPassword(c)
);

// user routing
user.get("/list", async (c) => await userController.list(c));
user.put("/promote", async (c) => await userController.promote(c));
user.put("/demote", async (c) => await userController.demote(c));
user.delete("/delete/:userId", async (c) => await userController.delete(c));
user.get(
  "/profile",
  async (c) => await userController.getDetailProfileUserByUser(c)
);
user.put("/update", async (c) => await userController.updateByUser(c));
user.put("/update/:userId", async (c) => await userController.updateByAdmin(c));

//category routing
category.post("/insert", async (c) => await categoryController.insert(c));
category.get("/list", async (c) => await categoryController.list(c));
category.post(
  "/update/:categoryId",
  async (c) => await categoryController.update(c)
);
category.delete(
  "/delete/:categoryId",
  async (c) => await categoryController.delete(c)
);

// product routing
product.post("/insert", async (c) => await productController.insert(c));
product.put(
  "/update/:productId",
  async (c) => await productController.update(c)
);
product.get("/list", async (c) => await productController.list(c));
product.get(
  "/detail/:productId",
  async (c) => await productController.getDetail(c)
);
product.delete(
  "/delete/:productId",
  async (c) => await productController.delete(c)
);

// stock routing
stock.post("/in", async (c) => await stockController.insertIn(c));
stock.post("/out", async (c) => await stockController.insertOut(c));
stock.get("/list", async (c) => await stockController.list(c));
stock.put("/commit/:stockId", async (c) => await stockController.commit(c));
stock.put("/update/:stockId", async (c) => await stockController.update(c));
stock.delete("/delete/:stockId", async (c) => await stockController.delete(c));

// cart routing
cart.get("/", async (c) => await cartController.getDetail(c));
cart.get("/list", async (c) => await cartController.list(c));
cart.post("/add", async (c) => await cartController.addItem(c));
cart.post("/subtract", async (c) => await cartController.removeItem(c));
cart.put(
  "/reaqcuire/:cartDetailId",
  async (c) => await cartController.reaqcuire(c)
);
cart.put(
  "/toggle-active/:cartDetailId",
  async (c) => await cartController.toggleActiveItemStatus(c)
);

// order routing
order.post("/new", async (c) => await orderController.new(c));
order.get("/list", async (c) => await orderController.list(c));
order.put("/cancel/:orderId", async (c) => await orderController.cancel(c));

// transaction routing
transaction.post("/new", async (c) => await transactionController.new(c));
transaction.get("/list", async (c) => await transactionController.list(c));
transaction.put("/update/:transactionId", async (c) => await transactionController.update(c));
transaction.post("/pay/:transactionId", async (c) => await transactionController.pay(c));
transaction.post("/capture-notification", async (c) => await transactionController.captureNotification(c));

// address routing
address.post("/insert", async (c) => await addressController.insert(c));
address.get("/list", async (c) => await addressController.list(c));
address.put(
  "/update/:addressId",
  async (c) => await addressController.update(c)
);
address.delete(
  "/delete/:addressId",
  async (c) => await addressController.delete(c)
);
address.put(
  "/set-active/:addressId",
  async (c) => await addressController.setActive(c)
);

app.route("/auth", auth);
app.route("/user", user);
app.route("/address", address);
app.route("/category", category);
app.route("/product", product);
app.route("/stock", stock);
app.route("/cart", cart);
app.route("/order", order);
app.route("/transaction", transaction);
