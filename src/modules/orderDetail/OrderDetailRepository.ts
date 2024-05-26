import { logger } from "../../log";
import { OrderDetail } from "../../models/OrderDetail";
import { BaseRepository } from "../base/BaseRepository";
import { OrderDetailRepositoryInterface } from "./interfaces/OrderDetailRepositoryInterface";

export class OrderDetailRepository
  extends BaseRepository
  implements OrderDetailRepositoryInterface
{
  constructor() {
    super();
    this.model = OrderDetail;
  }

  async insert(data: any): Promise<OrderDetail | null> {
    try {
      const orderDetail = new OrderDetail();

      orderDetail.setDataValue("orderId", data.orderId);
      orderDetail.setDataValue("productId", data.productId);
      orderDetail.setDataValue("productName", data.productName);
      orderDetail.setDataValue("productImage", data.productImage);
      orderDetail.setDataValue("price", data.price);
      orderDetail.setDataValue("qty", data.qty);
      orderDetail.setDataValue("lockedIn", data.lockedIn);
      orderDetail.setDataValue("status", data.status);
      orderDetail.setDataValue("isUsed", data.isUsed);

      return await orderDetail.save();
    } catch (e) {
      console.log(e);
      logger.error(e);
      return null;
    }
  }
}
