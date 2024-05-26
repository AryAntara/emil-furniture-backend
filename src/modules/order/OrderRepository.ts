import moment = require("moment");
import { logger } from "../../log";
import { Order } from "../../models/Order";
import { BaseRepository } from "../base/BaseRepository";
import { OrderRepositoryInterface } from "./interfaces/OrderRepositoryInterface";

export class OrderRepository
  extends BaseRepository
  implements OrderRepositoryInterface
{
  constructor() {
    super();
    this.model = Order;
  }

  async insert(data: any): Promise<Order | null> {
    try {
      const order = new Order();
      order.setDataValue("userId", data.userId);
      order.setDataValue("status", data.status);
      order.setDataValue("date", data.date);
      order.setDataValue("qtyTotal", data.qtyTotal);
      order.setAttributes("priceTotal", data.priceTotal);

      return await order.save();
    } catch (e) {
      console.log(e);
      logger.error(e);
      return null;
    }
  }
}
