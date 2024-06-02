import { Transaction } from "sequelize";
import { Stock } from "../../../models/Stock";

export interface StockServiceInterface {
  setTransaction(transaction: Transaction): void;
  unsetTransaction(): void;
  isProductExistsById(productId: number): Promise<boolean>;
  bulkInsert(data: Array<any>): Promise<boolean>;
  insertAndCommit(
    data: { qty: number; type: "in" | "out"; productId: number },
    commitedAt: string
  ): Promise<Stock | null>;
  insert(data: any): Promise<Stock | null>;
  getLastStock(productId: number): Promise<number>;
  areStockUncommited(productId: number): Promise<boolean>;
  isExistById(stockId: number): Promise<boolean>;
  isCommited(stockId: number): Promise<boolean>;
  commit(stockId: number): Promise<boolean>;
  updateById(stockId: number, data: any): Promise<boolean>;
  findWithPage(
    page: number,
    limit: number,
    orderColumn: string,
    orderType: string,
    filter: {
      productName?: string;
    }
  ): Promise<{ stockEntries: Array<Stock>; stockCount: number }>;
  deleteById(stockId: number): Promise<boolean>;
  findOneByid(
    stockId: number,
    selectAttributes?: Array<string>
  ): Promise<Stock | null>;
}
