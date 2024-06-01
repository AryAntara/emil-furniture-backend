import { Context } from "hono";
import { CartService } from "../modules/cart/CartService";
import { BaseController } from "./BaseController";
import { addItemSchemaValidator } from "../modules/cart/schemas/AddItemSchema";
import { removeItemSchemaValidator } from "../modules/cart/schemas/RemoveItemSchema";
import moment = require("moment");
import { toggleActiveItemSchemaValidator } from "../modules/cart/schemas/ToggleActiveItemStatuschema";

export class CartController extends BaseController {
  constructor(private cartService: CartService) {
    super();
  }

  // get detail of the cart
  async getDetail(c: Context) {
    const userId = parseInt(await c.get("userId")),
      cartEntry = await this.cartService.findByUserId(userId, [
        "id",
        "date",
        "priceTotal",
        "qtyTotal",
        "status",
      ]);

    if (!cartEntry)
      return c.json(this.respond(null, false, "Belum ada cart sama sekali."));

    return c.json(
      this.respond({ cartEntry }, true, "Berhasil mendapatkan data keranjang")
    );
  }

  // list items from cart
  async list(c: Context) {
    const userId = parseInt(await c.get("userId")),
      queries = c.req.query(),
      page = parseInt(queries.page ?? "1"),
      limit = parseInt(queries.limit ?? "10");

    const cartEntry = await this.cartService.findByUserId(userId, ["id"]);
    let cartId = cartEntry?.getDataValue("id");

    if (!cartId)
      return c.json(this.respond(null, false, "Belum ada cart sama sekali."));

    const response = (await this.cartService.findCartDetailWithPage(
      page,
      limit,
      cartId as number
    )) as any;
    response.queries = queries;
    return c.json(
      this.respond(response, true, "Mendapatkan list data pengguna.")
    );
  }

  // adding new item to cart
  async addItem(c: Context) {
    const userId = parseInt(await c.get("userId")),
      cartEntry = await this.cartService.findByUserId(userId, ["id"]),
      content = await c.req.json(),
      validation = await addItemSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    let cartId = cartEntry?.getDataValue("id");

    if (!cartId)
      cartId = (await this.cartService.create(userId))?.getDataValue("id");

    // return error if still get empty cart id
    if (!cartId)
      return c.json(this.respond(null, false, "Belum ada cart sama sekali."));

    const { data } = validation;
    if (!(await this.cartService.insertOrUpdateCartDetail(cartId, "add", data)))
      return c.json(
        this.respond(null, false, "Gagal menambahkan produk ke cart."),
        500
      );

    return c.json(
      this.respond(null, true, "Berhasil menambahkan produk ke cart.")
    );
  }

  // remove item from cart
  async removeItem(c: Context) {
    const userId = parseInt(await c.get("userId")),
      cartEntry = await this.cartService.findByUserId(userId, ["id"]),
      content = await c.req.json(),
      validation = await removeItemSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    let cartId = cartEntry?.getDataValue("id");

    if (!cartId)
      return c.json(this.respond(null, false, "Belum ada cart sama sekali."));

    const { data } = validation;
    if (
      !(await this.cartService.insertOrUpdateCartDetail(
        cartId,
        "subtract",
        data
      ))
    )
      return c.json(
        this.respond(null, false, "Tidak bisa mengurangi kuatiti.")
      );

    return c.json(this.respond(null, true, "Berhasil mengurangi kuatiti."));
  }

  async reaqcuire(c: Context) {
    const cartDetailId = parseInt(c.req.param().cartDetailId),
      userId = parseInt(c.get("userId")),
      cartEntry = await this.cartService.findByUserId(userId, ["id", "status"]);

    let cartId = cartEntry?.getDataValue("id");

    if (!cartId)
      return c.json(this.respond(null, false, "Belum ada cart sama sekali."));

    let cartDetailEntry = await this.cartService.findOneCartDetailById(
      cartDetailId
    );

    if (cartId !== cartDetailEntry?.getDataValue("cartId"))
      return c.json(this.respond(null, false, "Ini bukan cart kamu."), 403);

    if (!cartDetailEntry)
      return c.json(this.respond(null, false, "Produk tidak ada dalam cart."));

    const lockedIn = moment(cartDetailEntry.getDataValue("lockedIn") ?? ""),
      productId = cartDetailEntry.getDataValue("productId"),
      qty = cartDetailEntry.getDataValue("qty"),
      isExpired = lockedIn.diff(moment()) < 0;

    if (!isExpired) {
      const updatedStatus =
        await this.cartService.updateCartDetailStatusAndLock(
          cartDetailId,
          "ready",
          moment().add(1, "d").format("YYYY-MM-DD")
        );
      if (!updatedStatus)
        return c.json(
          this.respond(null, false, "Gagal melakukan pengecekan stok."),
          500
        );

      return c.json(
        this.respond(null, true, "Berhasil melakukan pengecekan stok")
      );
    }

    let isStockAvailable = await this.cartService.isProductStockAvailable(
      productId,
      qty
    );

    if (isStockAvailable) {
      const updatedStatus =
        await this.cartService.updateCartDetailStatusAndLock(
          cartDetailId,
          "ready",
          moment().add(1, "d").format("YYYY-MM-DD")
        );
      if (!updatedStatus)
        return c.json(
          this.respond(null, false, "Gagal melakukan pengecekan stok."),
          500
        );
    } else {
      const updatedStatus =
        await this.cartService.updateCartDetailStatusAndLock(
          cartDetailId,
          "out_of_stock"
        );
      if (!updatedStatus)
        return c.json(
          this.respond(null, false, "Gagal melakukan pengecekan stok."),
          500
        );
    }

    return c.json(
      this.respond(null, true, "Berhasil melakukan pengecekan stok.")
    );
  }

  // can check or uncheck the item list
  async toggleActiveItemStatus(c: Context) {
    const cartDetailId = parseInt(c.req.param().cartDetailId),
      userId = parseInt(c.get("userId")),
      cartEntry = await this.cartService.findByUserId(userId, ["id"]),
      content = await c.req.json(),
      validation = await toggleActiveItemSchemaValidator.with(content).run();

    if (!validation.success && validation.sendError)
      return validation.sendError(c);

    let { data } = validation,
      cartId = cartEntry?.getDataValue("id");

    if (!cartId)
      return c.json(this.respond(null, false, "Belum ada cart sama sekali."));

    let cartDetailEntry = await this.cartService.findOneCartDetailById(
      cartDetailId
    );

    if (cartId !== cartDetailEntry?.getDataValue("cartId"))
      return c.json(
        this.respond(null, false, "Ini bukan keranjang kamu."),
        403
      );

    if (
      !(await this.cartService.updateCartDetailIsUsed(
        cartDetailId,
        data.type == "check" ? "yes" : "no"
      ))
    )
      return c.json(
        this.respond(
          null,
          false,
          "Gagal melakukan perubahan centang produk ini."
        ),
        400
      );

    return c.json(
      this.respond(
        null,
        true,
        "Berhail melakukan perubahan centang produk ini."
      )
    );
  }
}
