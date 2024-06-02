import { Transaction } from "sequelize";
import { Order } from "../../models/Order";
import { OrderRepositoryInterface } from "./interfaces/OrderRepositoryInterface";
import { logger } from "../../log";
import { BaseRepository } from "../base/BaseRepository";
import moment = require("moment");

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
      order.setDataValue("cartId", data.cartId);
      order.setDataValue("status", data.status);
      order.setDataValue("canceledIn", data.canceledIn);

      return await order.save({ transaction: this.transaction });
    } catch (e) {
      console.log(e);
      logger.error(e);
      return null;
    }
  }
}
