import { Hono } from "hono";
import { userController, authController, authMiddleware } from "./providers";
import { serveStatic } from 'hono/bun'

export const app = new Hono();

const auth = new Hono();
const user = new Hono();

// Middleware 
app.use('/static/*', serveStatic({ root: './' }))

auth.use('/logout', async (c, next) => await authMiddleware.validateAccessToken(c, next));
auth.use('/logout', async (c, next) => await authMiddleware.validateAdminAccess(c, next));
auth.use('/renew', async (c, next) => await authMiddleware.validateRefreshToken(c, next));

user.use('/list', async (c, next) => await authMiddleware.validateAccessToken(c, next));
user.use('/list', async (c, next) => await authMiddleware.validateAdminAccess(c, next));

user.use('/promote', async (c, next) => await authMiddleware.validateAccessToken(c, next));
user.use('/promote', async (c, next) => await authMiddleware.validateAdminAccess(c, next));

user.use('/demote', async (c, next) => await authMiddleware.validateAccessToken(c, next));
user.use('/demote', async (c, next) => await authMiddleware.validateAdminAccess(c, next));

// auth routing
auth.post('/register', async (c) => await authController.register(c));
auth.post('/login', async (c) => await authController.login(c));
auth.get('/verify/:token', async (c) => await authController.verify(c));
auth.get('/logout', async (c) => await authController.logout(c));
auth.get('/renew', async (c) => await authController.renew(c));
auth.post('/forgot-password', async (c) => await authController.sendforgotPasswordEmail(c));
auth.get('/reset-password/:token', async (c) => await authController.showResetPasswordPage(c));
auth.post('/reset-password/:token', async (c) => await authController.resetPassword(c));

// user routing
user.get('/list', async (c) => await userController.list(c));
user.post('/promote', async(c) => await userController.promote(c));
user.post('/demote', async(c) => await userController.demote(c));

// product routing

// cart routing

// transaction routing

// address routing
 
// stock routing

app.route('/auth', auth)
app.route('/user', user)