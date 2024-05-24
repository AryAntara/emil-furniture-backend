import { Stock } from "../../../models/Stock";

export interface StockRepositoryInterface {
  insert(data: any): Promise<Stock | null>;
}
