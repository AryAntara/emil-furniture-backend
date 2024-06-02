import { Context } from "hono";
import { OrderService } from "../modules/order/OrderService";
import { BaseController } from "./BaseController";
import { newSchemaValidator } from "../modules/order/schemas/NewSchema";
import { ServiceError } from "../utils/serviceError";
import { cancelSchemaValidator } from "../modules/order/schemas/CancelSchema";

export class OrderController extends BaseController {
  constructor(private orderService: OrderService) {
    super();
  }
  async new(c: Context) {
    const userId = c.get("userId") as number,
      content = await c.req.json(),
      validation = await newSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation,
      cartId = data.cart_id as number,
      cartEntry = await this.orderService.findCartById(cartId, ["userId"]);

    if (userId !== cartEntry?.getDataValue("userId"))
      return c.json(this.respond(null, false, "Bukan keranjang milikmu."), 400);

    const createdStatus = await this.orderService.create(cartId, userId);

    if (ServiceError.check(createdStatus))
      return c.json(
        this.respond(createdStatus.errors, false, createdStatus.message),
        500
      );

    return c.json(this.respond(null, true, "Berhasil membuat pesanan baru."));
  }
  async list(c: Context) {
    const userId = c.get("userId") as number,
      queries = c.req.query(),
      page = parseInt(queries.page ?? "1"),
      limit = parseInt(queries.limit ?? "10"),
      orderColumn = queries.orderColumn,
      orderType = queries.orderType,
      orderableColumn = ["id"],
      orderableType = ["asc", "desc"];

    if (orderColumn && !orderableColumn.find((column) => orderColumn == column))
      return c.json(
        this.respond(
          {
            column: orderColumn,
            allowed: orderableColumn,
          },
          false,
          "Order field tidak valid."
        ),
        400
      );

    if (orderType && !orderableType.find((type) => orderType == type))
      return c.json(
        this.respond(
          {
            type: orderType,
            needed: orderableType,
          },
          false,
          "Order type tidak valid."
        ),
        400
      );

    const response = (await this.orderService.findWithPage(
      page,
      limit,
      orderColumn,
      orderType,
      userId
    )) as any;
    response.queries = queries;
    return c.json(
      this.respond(response, true, "Mendapatkan list data pengguna.")
    );
  }
  async cancel(c: Context) {
    const userId = c.get("userId") as number,
      orderId = parseInt(c.req.param().orderId),
      validation = await cancelSchemaValidator
        .with({ order_id: orderId })
        .run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const orderEntry = await this.orderService.findOneById(orderId, [
      "userId",
      "status",
    ]);

    if (orderEntry?.getDataValue("userId") !== userId)
      return c.json(this.respond(null, false, "Bukan pesanan milikmu."), 400);

    if (orderEntry?.getDataValue("status") !== "pending")
      return c.json(
        this.respond(null, false, "Status pesanan tidak valid."),
        400
      );
    const canceledStatus = await this.orderService.cancel(orderId);
    if (ServiceError.check(canceledStatus))
      return c.json(
        this.respond(canceledStatus.errors, false, canceledStatus.message)
      );

    return c.json(this.respond(null, true, "Berhasil membatalkan pembelian"));
  }
}
