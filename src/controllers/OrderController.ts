import { Context } from "hono";
import { OrderService } from "../modules/order/OrderService";
import { BaseController } from "./BaseController";
import { use } from "hono/jsx";
import { insertSchemaValidator } from "../modules/order/schemas/InsertSchemaValidator";

export class OrderController extends BaseController {
  constructor(private orderService: OrderService) {
    super();
  }

  // list items from order
  async list(c: Context) {
    const userId = parseInt(await c.get("userId")),
      queries = c.req.query(),
      page = parseInt(queries.page ?? "1"),
      limit = parseInt(queries.limit ?? "10");

    const orderEntry = await this.orderService.findByUserId(userId, ["id"]);
    let orderId = orderEntry?.getDataValue("id");

    if (!orderId)
      return c.json(this.respond(null, false, "Belum ada order sama sekali."));

    const response = (await this.orderService.findOrderDetailWithPage(
      page,
      limit,
      orderId as number
    )) as any;
    response.queries = queries;
    return c.json(
      this.respond(response, true, "Mendapatkan list data pengguna.")
    );
  }

  // adding new item to order
  async addItem(c: Context) {
    const userId = parseInt(await c.get("userId")),
      orderEntry = await this.orderService.findByUserId(userId, ["id"]),
      content = await c.req.json(),
      validation = await insertSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    let orderId = orderEntry?.getDataValue("id");
    
    if (!orderId)
      orderId = (await this.orderService.create(userId))?.getDataValue("id");
    if (!orderId)
      return c.json(this.respond(null, false, "Belum ada order sama sekali."));

    const { data } = validation;
    if (!(await this.orderService.insertOrUpdateOrderDetail(orderId, data)))
      return c.json(
        this.respond(null, false, "Gagal menambahkan produk ke order."),
        500
      );

    return c.json(
      this.respond(null, true, "Berhasil menambahkan produk ke order.")
    );
  }
  // remove item from order
  async removeItem() {
    // productId
  }
  // edit stock item in order
  async editQty() {
    // type: "minus" or "plus";
  }
  // can check or uncheck the item list
  async setActiveItemStatus() {}
}
