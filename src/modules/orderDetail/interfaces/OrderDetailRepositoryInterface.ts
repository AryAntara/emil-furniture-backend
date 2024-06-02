import { Transaction } from "sequelize";
import { OrderDetail } from "../../../models/OrderDetail";

export interface OrderDetailRepositoryInterface {
  insert(data: any, transaction?: Transaction): Promise<OrderDetail | null>;
}
