import { Context } from "hono";
import { BaseController } from "./BaseController";
import { insertSchemaValidator } from "../modules/category/schemas/InsertSchema";
import { CategoryService } from "../modules/category/CategoryService";
import { updateSchemaValidator } from "../modules/category/schemas/updateSchema";
import { deleteSchemaValidator } from "../modules/category/schemas/deleteSchema";

export class CategoryController extends BaseController {
  constructor(private categoryService: CategoryService) {
    super();
  }

  // list of category (Admin Access)
  async list(c: Context) {
    const queries = c.req.query(),
      page = parseInt(queries.page ?? "1"),
      limit = parseInt(queries.limit ?? "10"),
      orderColumn = queries.orderColumn ?? "name",
      orderType = queries.orderType ?? "desc",
      orderableColumn = ["id", "name"],
      orderableType = ["asc", "desc"];

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

    const response = (await this.categoryService.findWithPage(
      page,
      limit,
      orderColumn,
      orderType
    )) as any;
    response.queries = queries;
    return c.json(
      this.respond(response, true, "Mendapatkan list data kategori.")
    );
  }

  // insert new category (Admin Access)
  async insert(c: Context) {
    const content = await c.req.json();
    const validation = await insertSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation;
    if (!(await this.categoryService.insert(data)))
      return c.json(
        this.respond(null, false, "Tidak dapat menambahkan kategori."),
        500
      );

    return c.json(this.respond(null, true, "Berhasil menambahkan kategori."));
  }

  // update category (Admin Access)
  async update(c: Context) {
    const categoryId = parseInt(c.req.param().categoryId);
    const content = await c.req.json();
    content.category_id = categoryId;

    const validation = await updateSchemaValidator.with(content).run();
    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation;
    delete data.category_id;

    if (!(await this.categoryService.updateById(categoryId, data)))
      return c.json(
        this.respond(null, false, "Gagal memperbarui data kategori")
      );

    return c.json(
      this.respond(null, true, "Berhasil memperbarui data kategori.")
    );
  }

  // delete category entry
  async delete(c: Context) {
    const categoryId = parseInt(c.req.param().categoryId);
    const validaton = await deleteSchemaValidator
      .with({ category_id: categoryId })
      .run();

    if (!validaton.success && validaton.sendError)
      return validaton.sendError(c);
    if (!(await this.categoryService.deleteById(categoryId)))
      return c.json(this.respond(null, false, "Gagal menghapus data."), 400);

    return c.json(this.respond(null, true, "Berhasil menghapus data."));
  }
}
