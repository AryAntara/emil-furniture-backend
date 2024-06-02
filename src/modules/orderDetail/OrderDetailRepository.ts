import { Transaction } from "sequelize";
import { logger } from "../../log";
import { OrderDetail } from "../../models/OrderDetail";
import { OrderDetailRepositoryInterface } from "./interfaces/OrderDetailRepositoryInterface";
import { BaseRepository } from "../base/BaseRepository";

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
      orderDetail.setDataValue("stockId", data.stockId);
      orderDetail.setDataValue("qty", data.qty);
      orderDetail.setDataValue("price", data.price);

      return await orderDetail.save({ transaction: this.transaction });
    } catch (e) {
      console.error(e);
      logger.error(e);
      return null;
    }
  }
}
