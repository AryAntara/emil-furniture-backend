import { Transaction } from "sequelize";
import { Cart } from "../../../models/Cart";
import { ServiceError } from "../../../utils/serviceError";
import { Order } from "../../../models/Order";

export interface OrderServiceInterface {
  findWithPage(
    page: number,
    limit: number,
    orderColumn: string,
    orderType: string,
    userId: number
  ): Promise<{ orderEntries: Order[]; orderCount: number }>;
  findCartById(
    cartId: number,
    selectAttribute?: Array<string>
  ): Promise<Cart | null>;
  create(cartId: number, userId: number): Promise<true | ServiceError>;
  setTransaction(transaction: Transaction): void;
  unsetTransaction(): void;
  isExistsById(orderId: number): Promise<boolean>;
  findOneById(
    orderId: number,
    selectAttributes?: Array<string>
  ): Promise<Order | null>;
  cancel(orderId: number): Promise<true | ServiceError>;
}
