import { logger } from "../../log";
import { CartDetail } from "../../models/CartDetail";
import { BaseRepository } from "../base/BaseRepository";
import { CartDetailRepositoryInterface } from "./interfaces/CartDetailRepositoryInterface";

export class CartDetailRepository
  extends BaseRepository
  implements CartDetailRepositoryInterface
{
  constructor() {
    super();
    this.model = CartDetail;
  }

  async insert(data: any): Promise<CartDetail | null> {
    try {
      const cartDetail = new CartDetail();

      cartDetail.setDataValue("cartId", data.cartId);
      cartDetail.setDataValue("productId", data.productId);
      cartDetail.setDataValue("productName", data.productName);
      cartDetail.setDataValue("productImage", data.productImage);
      cartDetail.setDataValue("price", data.price);
      cartDetail.setDataValue("qty", data.qty);
      cartDetail.setDataValue("lockedIn", data.lockedIn);
      cartDetail.setDataValue("status", data.status);
      cartDetail.setDataValue("isUsed", data.isUsed);

      return await cartDetail.save();
    } catch (e) {
      console.log(e);
      logger.error(e);
      return null;
    }
  }
}
