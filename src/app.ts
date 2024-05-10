import { Hono } from "hono";
import { userController, authController, authMiddleware } from "./providers";

export const app = new Hono();

// Middleware 
app.use('/auth/logout', async (c, next) => await authMiddleware.accessTokenValidation(c, next));
app.use('/auth/renew', async (c, next) => await authMiddleware.refreshTokenValidation(c, next));

// auth routing
app.post('/auth/register', async (c) => await authController.register(c));
app.post('/auth/login', async (c) => await authController.login(c));
app.get('/auth/verify/:token', async (c) => await authController.verify(c));
app.get('/auth/logout', async (c) => await authController.logout(c));
app.get('/auth/renew', async (c) => await authController.renew(c));
