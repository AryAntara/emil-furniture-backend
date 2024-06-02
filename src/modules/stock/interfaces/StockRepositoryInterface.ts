import { Transaction } from "sequelize";
import { Stock } from "../../../models/Stock";

export interface StockRepositoryInterface {
  insert(data: any): Promise<Stock | null>;
  bulkInsert(data: Array<any>): Promise<boolean>;
  setTransaction(transaction: Transaction): void;
}
