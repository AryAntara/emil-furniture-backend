import { app } from "../app";
import { Context } from "hono";
import { UserService } from "../modules/user/UserServices";
import { BaseController } from "./BaseController";


export class UserController extends BaseController {
    constructor(public userService: UserService){
        super()
    }
}
