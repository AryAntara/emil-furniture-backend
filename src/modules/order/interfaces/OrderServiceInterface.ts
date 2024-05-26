import { Order } from "../../../models/Order";
import { OrderDetail } from "../../../models/OrderDetail";

export interface OrderServiceInterface {
  findByUserId(
    userId: number,
    selectAttributes?: Array<string>
  ): Promise<Order | null>;
  findOrderDetailWithPage(
    page: number,
    limit: number,
    orderId: number
  ): Promise<{
    orderEntries: Array<OrderDetail>;
    orderCount: number;
  }>;
  create(userId: number): Promise<Order | null>;
  insertOrUpdateOrderDetail(
    orderId: number,
    data: any
  ): Promise<OrderDetail | null | boolean>;
}
