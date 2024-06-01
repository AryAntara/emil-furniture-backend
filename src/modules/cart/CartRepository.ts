import moment = require("moment");
import { logger } from "../../log";
import { Cart } from "../../models/Cart";
import { BaseRepository } from "../base/BaseRepository";
import { CartRepositoryInterface } from "./interfaces/CartRepositoryInterface";

export class CartRepository
  extends BaseRepository
  implements CartRepositoryInterface
{
  constructor() {
    super();
    this.model = Cart;
  }

  async insert(data: any): Promise<Cart | null> {
    try {
      const cart = new Cart();
      cart.setDataValue("userId", data.userId);
      cart.setDataValue("status", data.status);
      cart.setDataValue("date", data.date);
      cart.setDataValue("qtyTotal", data.qtyTotal);
      cart.setAttributes("priceTotal", data.priceTotal);

      return await cart.save();
    } catch (e) {
      console.log(e);
      logger.error(e);
      return null;
    }
  }
}
