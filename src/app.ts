import { Context, Hono, MiddlewareHandler, Next } from "hono";
import {
  userController,
  authController,
  authMiddleware,
  addressController,
  categoryController,
} from "./providers";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { mapMiddleware } from "./utils/middlewareMapper";
import { respond } from "./utils/response";
import { validateJsonContent } from "./middlewares/JsonValidator";

export const app = new Hono();

const auth = new Hono();
const user = new Hono();
const address = new Hono();
const category = new Hono();

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
    ],
    credentials: true,
    origin: ["http://localhost:5174"],
    allowMethods: ["get", "post", "delete"],
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

// Login token
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

// Login token and admin access
mapMiddleware(
  category,
  [authMiddleware.validateAccessToken, authMiddleware.validateAdminAccess],
  ["/insert", "/delete/:categoryId", "/update/:categoryId"]
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
auth.post(
  "/reset-password/:token",
  async (c) => await authController.resetPassword(c)
);

// user routing
user.get("/list", async (c) => await userController.list(c));
user.post("/promote", async (c) => await userController.promote(c));
user.post("/demote", async (c) => await userController.demote(c));
user.delete("/delete/:userId", async (c) => await userController.delete(c));
user.get(
  "/profile",
  async (c) => await userController.getDetailProfileUserByUser(c)
);
user.post("/update", async (c) => await userController.updateByUser(c));
user.post(
  "/update/:userId",
  async (c) => await userController.updateByAdmin(c)
);

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

// cart routing

// transaction routing

// address routing
address.post("/insert", async (c) => await addressController.insert(c));
address.get("/list", async (c) => await addressController.list(c));
address.post(
  "/update/:addressId",
  async (c) => await addressController.update(c)
);
address.delete(
  "/delete/:addressId",
  async (c) => await addressController.delete(c)
);
address.post(
  "/set-active/:addressId",
  async (c) => await addressController.setActive(c)
);

// stock routing

app.route("/auth", auth);
app.route("/user", user);
app.route("/address", address);
app.route("/category", category);
