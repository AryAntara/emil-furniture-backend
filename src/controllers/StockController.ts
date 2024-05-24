import { StockService } from "../modules/stock/StockService";
import { Context } from "hono";
import { insertSchemaValidator } from "../modules/stock/schemas/InsertSchema";
import { BaseController } from "./BaseController";
import { commitSchemaValidator } from "../modules/stock/schemas/CommitSchema";
import { deleteSchemaValidator } from "../modules/stock/schemas/DeleteSchema";
import { updateSchemaValidator } from "../modules/stock/schemas/UpdateSchema";

export class StockController extends BaseController {
  constructor(private stockService: StockService) {
    super();
  }

  // insert new stock for a product
  async insertIn(c: Context) {
    const content = await c.req.json();
    const validation = await insertSchemaValidator.with(content).run();
    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation;
    const productId = data.product_id;
    data.type = "in";

    // You cannot have 1 or more uncommited stock
    if (await this.stockService.areStockUncommited(productId))
      return c.json(
        this.respond(
          null,
          false,
          "Ada beberapa stock yang harus di commit terlebih dahulu."
        ),
        400
      );

    if (!(await this.stockService.insert(data)))
      return c.json(
        this.respond(null, false, "Tidak bisa menambahkan stok."),
        500
      );

    return c.json(this.respond(null, true, "Stok berhasil di tambahkan."));
  }

  // subtract stock from product
  async insertOut(c: Context) {
    const content = await c.req.json();
    const validation = await insertSchemaValidator.with(content).run();
    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation;
    const { productId } = data;
    data.type = "out";

    // You cannot have 1 or more uncommited stock
    if (!(await this.stockService.areStockUncommited(productId)))
      return c.json(
        this.respond(
          null,
          false,
          "Ada beberapa stock yang harus di commit terlebih dahulu."
        ),
        400
      );

    if ((await this.stockService.getLastStock(data.productId)) - data.qty < 0)
      return c.json(this.respond(null, false, "Stok menjadi invalid."));

    if (await this.stockService.insert(data))
      return c.json(
        this.respond(null, false, "Tidak bisa menambahkan stok."),
        500
      );

    return c.json(this.respond(null, true, "Stok berhasil di tambahkan."));
  }

  // commit stock
  async commit(c: Context) {
    const stockId = parseInt(c.req.param().stockId);
    const validation = await commitSchemaValidator
      .with({ stock_id: stockId })
      .run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    // check stock was commited
    if (await this.stockService.isCommited(stockId))
      return c.json(this.respond(null, false, "Stok sudah di commit."), 202);

    // commit the stock
    if (!(await this.stockService.commit(stockId)))
      return c.json(
        this.respond(null, false, "Tidak dapat melakukan commit."),
        500
      );

    return c.json(this.respond(null, true, "Berhasil melakukan commmit."));
  }

  async list(c: Context) {
    const queries = c.req.query(),
      page = parseInt(queries.page ?? "1"),
      limit = parseInt(queries.limit ?? "10"),
      orderColumn = queries.orderColumn ?? "qtyInitial",
      orderType = queries.orderType ?? "desc",
      filter: any = {},
      filterFields: string[] = [],
      filterableFields = ["productName"],
      orderableColumn = ["id", "qtyFinal", "qtyInitial"],
      orderableType = ["asc", "desc"];

    for (let query of Object.keys(queries)) {
      if (query.slice(0, 7) == "filter.") {
        const field = query.slice(7);
        filter[field] = queries[query];

        // validate filters
        if (!filterableFields.find((field) => field == field))
          return c.json(
            this.respond(
              {
                filterableFields,
                filterFields,
              },
              false,
              "Filter tidak valid."
            ),
            422
          );
      }
    }

    // validate orderable column
    if (!orderableColumn.find((column) => orderColumn == column))
      return c.json(
        this.respond(
          {
            column: orderColumn,
            allowed: orderableColumn,
          },
          false,
          "Order field tidak valid"
        ),
        400
      );

    // validate type orderable column
    if (!orderableType.find((type) => orderType == type))
      return c.json(
        this.respond(
          {
            type: orderType,
            needed: orderableType,
          },
          false,
          "Order type tidak valid"
        ),
        400
      );

    const response = (await this.stockService.findWithPage(
      page,
      limit,
      orderColumn,
      orderType,
      filter
    )) as any;
    response.queries = queries;
    return c.json(this.respond(response, true, "Mendapatkan list data stok."));
  }

  async update(c: Context) {
    const stockId = parseInt(c.req.param().stockId);
    const content = await c.req.json();
    const validation = await updateSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    // check stock was commited
    if (await this.stockService.isCommited(stockId))
      return c.json(
        this.respond(
          null,
          false,
          "Stok sudah di commit, tidak dapat memperbarui data."
        ),
        400
      );

    const { data } = validation;
    const productId = data.product_id;

    // You cannot have 1 or more uncommited stock
    if (await this.stockService.areStockUncommited(productId))
      return c.json(
        this.respond(
          null,
          false,
          "Ada beberapa stock yang harus di commit terlebih dahulu."
        ),
        400
      );

    const stockEntry = await this.stockService.findOneByid(stockId, [
      "qtyOut",
      "qtyInitial",
    ]);
    const isQtyOut = stockEntry?.getDataValue("qtyOut") > 0;

    if (
      isQtyOut &&
      (await this.stockService.getLastStock(data.productId)) - data.qty < 0
    )
      return c.json(this.respond(null, false, "Stok menjadi invalid."));

    data.type = isQtyOut ? "out" : "in";
    data.qtyInitial = stockEntry?.getDataValue("qtyInitial");
    if (!(await this.stockService.updateById(stockId, data)))
      return c.json(
        this.respond(null, false, "Gagal melakukan pembaruan data stok"),
        400
      );

    return c.json(
      this.respond(null, true, "Berhasil melakukan pembaruan data stok")
    );
  }

  async delete(c: Context) {
    const stockId = parseInt(c.req.param().stockId);
    const validation = await deleteSchemaValidator
      .with({ stock_id: stockId })
      .run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    // check stock was commited
    if (await this.stockService.isCommited(stockId))
      return c.json(
        this.respond(
          null,
          false,
          "Stok sudah di commit, tidak dapat menghapus."
        ),
        400
      );

    if (!(await this.stockService.deleteById(stockId)))
      return c.json(this.respond(null, false, "Gagal menghapus stok."), 500);

    return c.json(this.respond(null, true, "Berhasil menghapus stok."));
  }
}
