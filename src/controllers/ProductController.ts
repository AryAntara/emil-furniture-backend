import { Context } from "hono";
import { BaseController } from "./BaseController";
import { insertSchemaValidator } from "../modules/product/schemas/InsertSchema";
import { ProductService } from "../modules/product/ProductService";
import { updateSchemaValidator } from "../modules/product/schemas/UpdateSchema";
import { deleteSchemaValidator } from "../modules/product/schemas/DeleteSchema";
import { detailSchemaValidator } from "../modules/product/schemas/DetailSchema";

export class ProductController extends BaseController {
  constructor(private productService: ProductService) {
    super();
  }

  // list of data products
  async list(c: Context) {
    const queries = c.req.query(),
      page = parseInt(queries.page ?? "1"),
      limit = parseInt(queries.limit ?? "10"),
      orderColumn = queries.orderColumn ?? "name",
      orderType = queries.orderType ?? "desc",
      filter: any = {},
      filterFields: string[] = [],
      filterableFields = ["description", "name", 'categoryId'],
      orderableColumn = ["id", "name", "price", "weight"],
      orderableType = ["asc", "desc"];

    for (let query of Object.keys(queries)) {
      if (query.slice(0, 7) == "filter.") {
        const field = query.slice(7);
        filter[field] = queries[query];

        // validate filters
        if (!filterableFields.find((filterableField) => filterableField == field) )
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

    const response = (await this.productService.findWithPage(
      page,
      limit,
      orderColumn,
      orderType,
      filter
    )) as any;
    response.queries = queries;
    return c.json(
      this.respond(response, true, "Mendapatkan list data product.")
    );
  }


  // insert new product data (Admin Access)
  async insert(c: Context) {
    const content: any = await c.req.parseBody();
    const file = content.image as Blob;
    content.file_size = file.size;

    const validation = await insertSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation;
    const fileId = await this.productService.saveImage(file);
    if (!fileId)
      return c.json(
        this.respond(null, false, "Tidak dapat menyimpan file gambar."),
        500
      );

    data.image = fileId;
    delete data.file_size;

    if (!(await this.productService.insert(data)))
      return c.json(
        this.respond(null, false, "Tidak dapat menyimpan data produk"),
        500
      );

    return c.json(this.respond(null, true, "Berhasil menyimpan data produk."));
  }

  // update product (Admin Access)
  async update(c: Context) {
    const productId = parseInt(c.req.param().productId);
    const maxFileSize = 500 * 1024;
    const content: any = await c.req.parseBody();

    content.param_product_id = productId;
    const validation = await updateSchemaValidator.with(content).run();
    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const { data } = validation;
    if (content.image) {
      const file = content.image as Blob;
      const fileSize = file.size;
      if (fileSize > maxFileSize)
        return c.json(
          this.respond(null, false, "Ukuran file terlalu besar."),
          422
        );

      const fileId = await this.productService.saveImage(file);
      if (!fileId)
        return c.json(
          this.respond(null, false, "Tidak dapat menyimpan file gambar."),
          500
        );

      data.image = fileId;
    }

    if (!(await this.productService.updateById(productId, data)))
      return c.json(
        this.respond(null, false, "Tidak dapat memperbarui data produk"),
        500
      );

    return c.json(
      this.respond(null, true, "Berhasil memperbarui data produk.")
    );
  }

  // delete an product
  async delete(c: Context) {
    const productId = parseInt(c.req.param().productId);
    const validation = await deleteSchemaValidator
      .with({ param_product_id: productId })
      .run();
    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    if (!(await this.productService.deleteById(productId)))
      return c.json(
        this.respond(null, false, "Tidak dapat menghapus produk."),
        500
      );

    return c.json(this.respond(null, false, "Berhasil menghapus produk."), 200);
  }

  async getDetail(c: Context) {
    const productId = parseInt(c.req.param().productId);
    const validation = await detailSchemaValidator
      .with({ param_product_id: productId })
      .run();
    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    const productEntry = await this.productService.findOneById(productId);

    if (!productEntry)
      return c.json(
        this.respond(null, false, "Tidak bisa mendapatkan detail produk.")
      );

    return c.json(
      this.respond(
        { productEntry },
        true,
        "Berhasil mendapatkan detail prodcut."
      )
    );
  }
}
