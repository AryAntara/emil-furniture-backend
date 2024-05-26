import { OrderDetail } from "../../../models/OrderDetail";

export interface OrderDetailServiceInterface {
  findWithPage(
    page: number,
    limit: number,
    orderColumn: string,
    orderType: "asc" | "desc",
    orderId: number
  ): Promise<{
    orderEntries: Array<OrderDetail>;
    orderCount: number;
  }>;
  getLockedStock(productId: number): Promise<number>;
  insert(data: any): Promise<OrderDetail | null>;
  updateByOrderIdAndProductId(
    orderId: number,
    productId: number,
    data: any
  ): Promise<boolean>;
  findOneByProductIdAndOrderId(
    productId: number,
    orderId: number
  ): Promise<OrderDetail | null>;
}
