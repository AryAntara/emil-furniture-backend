import { Transaction } from "sequelize";
import { logger } from "../../log";
import { Product } from "../../models/Product";
import { Stock } from "../../models/Stock";
import { BaseRepository } from "../base/BaseRepository";
import { StockRepositoryInterface } from "./interfaces/StockRepositoryInterface";

export class StockRepository
  extends BaseRepository
  implements StockRepositoryInterface
{
  constructor() {
    super();
    this.model = Stock;
  }

  async bulkInsert(data: any[]): Promise<boolean> {
    try {
      await this.model?.bulkCreate(data);
      return true;
    } catch (e) {
      console.log(e);
      logger.error(e);
      return false;
    }
  }

  // insert data
  async insert(data: any) {
    try {
      const stock = new Stock();

      stock.setDataValue("productId", data.productId);
      stock.setDataValue("qtyIn", data.qtyIn);
      stock.setDataValue("qtyOut", data.qtyOut);
      stock.setDataValue("qtyFinal", data.qtyFinal);
      stock.setDataValue("qtyInitial", data.qtyInitial);
      stock.setDataValue("commitedAt", data.commitedAt);

      return await stock.save({transaction: this.transaction});
    } catch (e) {
      console.log(e);
      logger.error(e);
      return null;
    }
  }
}
