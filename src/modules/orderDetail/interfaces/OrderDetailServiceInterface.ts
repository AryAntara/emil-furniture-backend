import { Transaction } from "sequelize";
import { OrderDetail } from "../../../models/OrderDetail";

export interface OrderDetailServiceInterface {
  setTransaction(transaction: Transaction): void;
  unsertTransaction(): void;
  insert(data: any, transaction?: Transaction): Promise<OrderDetail | null>;
  findByOrderId(orderId: number, selectAttribute?: Array<string>): Promise<OrderDetail[]>;
}
