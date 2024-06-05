import { Transaction as TransactionModel } from "../../../models/Transaction";
import { Transaction } from "sequelize";
import { Error } from "../../../utils/serviceError";

export interface TransactionServiceInterface {
  createPayment(
    transactionId: string,
    userId: number
  ): Promise<{ token: string } | Error>;
  findWithPage(
    page: number,
    limit: number,
    orderColumn: string,
    orderType: string
  ): Promise<{
    transactionEntries: TransactionModel[];
    transactionCount: number;
  }>;
  create(
    orderId: number,
    userId: number,
    addressId?: number
  ): Promise<{ transactionId: string } | Error>;
  insert(data: any): Promise<TransactionModel | null>;
  setTransaction(transaction: Transaction): void;
  unsetTransaction(): void;
  isExistsByOrderId(orderId: number): Promise<boolean>;
  isExistsById(transactionId: string): Promise<boolean>;
  updateById(transactionId: string, data: any): Promise<boolean>;
  findOneByOrderId(
    orderId: number,
    selectAttributes?: Array<string>
  ): Promise<TransactionModel | null>;
  findOneById(
    transactionId: string,
    selectAttributes?: string[] | undefined
  ): Promise<TransactionModel | null>;
  updateStatusById(
    transactionId: string,
    status: "failure" | "success"
  ): Promise<boolean>;
}
