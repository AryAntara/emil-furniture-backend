import { Transaction } from "../../../models/Transaction";

export interface TransactionRepositoryInterface {
  insert(data: any): Promise<Transaction | null>;
}
