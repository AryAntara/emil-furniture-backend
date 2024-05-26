import { IncludeOptions, Op, Order } from "sequelize";
import { OrderDetailRepository } from "./OrderDetailRepository";
import { OrderDetailServiceInterface } from "./interfaces/OrderDetailServiceInterface";
import { OrderDetail } from "../../models/OrderDetail";
import moment = require("moment");

export class OrderDetailService implements OrderDetailServiceInterface {
  constructor(private orderDetailRepository: OrderDetailRepository) {}

  async findWithPage(
    page: number,
    limit: number,
    orderColumn: string,
    orderType: "asc" | "desc",
    orderId: number
  ): Promise<{ orderEntries: OrderDetail[]; orderCount: number }> {
    const offset = (page - 1) * limit,
      order = [[orderColumn, orderType]] as Order,
      orderEntries = await this.orderDetailRepository.findWithOffsetAndLimit(
        offset,
        limit,
        order,
        ["id", "productImage", "productName", "price", "qty"],
        { orderId }
      ),
      orderCount = await this.orderDetailRepository.countBy({ orderId });

    return {
      orderEntries,
      orderCount,
    };
  }

  async getLockedStock(productId: number): Promise<number> {
    return await this.orderDetailRepository.sum("qty", {
      productId,
      lockedIn: {
        [Op.gte]: moment().format("YYYY-MM-DD"),
      },
    });
  }

  async updateByOrderIdAndProductId(
    orderId: number,
    productId: number,
    data: any
  ): Promise<boolean> {
    return await this.orderDetailRepository.update(
      { orderId, productId },
      data
    );
  }

  async insert(data: any): Promise<OrderDetail | null> {
    if (!data.isUsed) data.isUsed = "yes";
    if (!data.status) data.status = "ready";

    return await this.orderDetailRepository.insert(data);
  }

  async findOneByProductIdAndOrderId(
    productId: number,
    orderId: number
  ): Promise<OrderDetail | null> {
    return await this.orderDetailRepository.findOne({
      productId,
      orderId,
    });
  }
}
