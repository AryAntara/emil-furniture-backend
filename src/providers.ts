import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { User } from "./models/User";
import { AuthService } from "./modules/auth/AuthService";
import { BaseService } from "./modules/base/BaseService";
import { UserRepository } from "./modules/user/UserRepository";
import { UserService } from "./modules/user/UserServices";

const baseService = new BaseService

const user = new User(),
    userRepository = new UserRepository(user),
    userService = new UserService(userRepository),
    userController = new UserController(userService)

const authService = new AuthService(userService),
    authController = new AuthController(authService),
    authMiddleware = new AuthMiddleware

export {
    userController,
    
    authController,
    authService,
    authMiddleware
}