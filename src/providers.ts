import { AddressController } from "./controllers/AddressController";
import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { Address } from "./models/Address";
import { User } from "./models/User";
import { AddressRepository } from "./modules/address/AddressRepository";
import { AddressService } from "./modules/address/AddressService";
import { AuthService } from "./modules/auth/AuthService";
import { UserRepository } from "./modules/user/UserRepository";
import { UserService } from "./modules/user/UserServices";

const user = new User(),
    userRepository = new UserRepository(user),
    userService = new UserService(userRepository),
    userController = new UserController(userService)

const authService = new AuthService(userService),
    authController = new AuthController(authService),
    authMiddleware = new AuthMiddleware

const address = new Address,
    addressRepository = new AddressRepository(address),
    addressService = new AddressService(addressRepository),
    addressController = new AddressController(addressService)

export {
    userController,
    userService,

    authController,
    authService,
    authMiddleware,

    addressController,
    addressService
}