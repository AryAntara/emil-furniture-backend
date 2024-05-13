import { Context } from "hono";
import { UserService } from "../modules/user/UserServices";
import { BaseController } from "./BaseController";
import { promoteSchemaValidator } from "../modules/user/schemas/PromoteSchema";


export class UserController extends BaseController {
    constructor(public userService: UserService) {
        super()
    }

    // list data of users (Admin access)
    async list(c: Context) {
        const queries = c.req.query(),
            page = parseInt(queries.page ?? "1"),
            limit = parseInt(queries.limit ?? "10"),
            orderColumn = queries.orderColumn,
            orderType = queries.orderType,
            orderableColumn = ["id", "fullname", "email", "verifiedAt", "creeatedAt"],
            orderableType = ['asc', 'desc'];

        if (!orderableColumn.find(column => orderColumn == column)) return c.json(this.respond(
            {
                'column': orderColumn, 'allowed': orderableColumn
            }, false, "Order field tidak valid"
        ), 400)

        if (!orderableType.find(type => orderType == type)) return c.json(this.respond(
            {
                'type': orderType,
                'needed': orderableType
            }, false, "Order type tidak valid"
        ), 400)


        const response = await this.userService.findWithPage(page, limit, orderColumn, orderType) as any;
        response.queries = queries;
        return c.json(this.respond(response, true, 'Mendapatkan list data pengguna.'))

    }

    // Promote user into an admin (Admin Access)
    async promote(c: Context) {
        const content = await c.req.parseBody();
        const validation = await promoteSchemaValidator.with(content).run()

        if (!validation.success) return c.json(this.respond(
            validation.errors, false, "Validasi error."
        ), 400);

        const { userId } = validation.data;
        if (!await this.userService.promoteToAdmin(parseInt(userId))) return c.json(this.respond(
            null, false, "Gagal mempromosikan pengguna menjadi admin."), 500);

        return c.json(this.respond(null, true, "Berhasil mempromosikan pengguna menjadi admin"))

    }

    // Demote back an admin into normal user (Admin Access)
    async demote(c: Context) {
        const content = await c.req.parseBody();
        const validation = await promoteSchemaValidator.with(content).run();

        if (!validation.success) return c.json(this.respond(
            validation.errors, false, "Validasi error."
        ), 400);

        const { userId } = validation.data;
        if (!await this.userService.demoteToNormalUser(parseInt(userId))) return c.json(this.respond(
            null, false, "Gagal merubah role dari admin menjadi pengguna."), 500);

        return c.json(this.respond(null, true, "Berhasil merubah role admin menjadi admin"))

    }

    // Delete an user (Admin access)
    async delete(c: Context) { } // Admin access

    async update(c: Context) { }
    async getDetailProfile(c: Context) { }
}
