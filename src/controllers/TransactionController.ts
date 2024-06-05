import { Context } from "hono";
import { BaseController } from "./BaseController";
import { newSchemaValidator } from "../modules/transaction/schemas/NewSchema";
import { TransactionService } from "../modules/transaction/TransactionService";
import { ServiceError } from "../utils/serviceError";
import { updateSchemaValidator } from "../modules/transaction/schemas/UpdateSchema";

export class TransactionController extends BaseController {
  constructor(private transactionService: TransactionService) {
    super();
  }

  async new(c: Context) {
    const userId = c.get("userId"),
      content = await c.req.json(),
      validation = await newSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation;

    const addressId = data.address_id as number,
      orderId = data.order_id;

    const createdStatus = await this.transactionService.create(
      orderId,
      userId,
      addressId
    );

    if (ServiceError.check(createdStatus))
      return c.json(
        this.respond(createdStatus.errors, false, createdStatus.message),
        500
      );

    return c.json(
      this.respond(
        { transactionId: createdStatus.transactionId },
        true,
        "Berhasil membuat transaksi baru."
      )
    );
  }
  async list(c: Context) {
    const queries = c.req.query(),
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

    const response = (await this.transactionService.findWithPage(
      page,
      limit,
      orderColumn,
      orderType
    )) as any;
    response.queries = queries;
    return c.json(
      this.respond(response, true, "Mendapatkan list data pengguna.")
    );
  }
  async update(c: Context) {
    const transactionId = c.req.param().transactionId,
      content: any = await c.req.json();

    content.transaction_id = transactionId;
    const validation = await updateSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation;
    data.resiLink = data.resi_link;

    delete data.transaction_id;
    delete data.resi_link;
    if (!(await this.transactionService.updateById(transactionId, data)))
      return c.json(
        this.respond(null, false, "Gagal memperbarui data transaksi.")
      );

    return c.json(
      this.respond(null, true, "Berhasil memperbarui data transaksi.")
    );
  }
  async pay(c: Context) {
    const transactionId = c.req.param().transactionId,
      userId = c.get("userId");

    const createdStatus = await this.transactionService.createPayment(
      transactionId,
      userId
    );
    if (ServiceError.check(createdStatus))
      return c.json(
        this.respond(createdStatus.errors, false, createdStatus.message)
      );

    const { token } = createdStatus;
    return c.json(
      this.respond({ token }, true, "Berhasil membuat pembayaran.")
    );
  }

  async captureNotification(c: Context) {
    const content = await c.req.json();
    const { transaction_id, transaction_status } = content;
    let status: "success" | "failure" = "success";

    if (
      transaction_status == "deny" ||
      transaction_status == "cancel" ||
      transaction_status == "expire" ||
      transaction_status == "failure"
    )
      status = "failure";

    await this.transactionService.updateStatusById(transaction_id, status);

    return c.json(this.respond(null, true, "OK."));
  }
}
