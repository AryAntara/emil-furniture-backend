import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../log";
import { Transaction } from "../../models/Transaction";
import { BaseRepository } from "../base/BaseRepository";
import { TransactionRepositoryInterface } from "./interfaces/TransactionRepositoryInterface";

export class TransactionRepository
  extends BaseRepository
  implements TransactionRepositoryInterface
{
  constructor() {
    super();
    this.model = Transaction;
  }

  async insert(data: any): Promise<Transaction | null> {
    try {
      const transaction = new Transaction();
      transaction.setDataValue("id", uuidv4());
      transaction.setDataValue("orderId", data.orderId);
      transaction.setDataValue("address", data.address);
      transaction.setDataValue("orderId", data.orderId);
      transaction.setDataValue("priceTotal", data.priceTotal);
      transaction.setDataValue("qtyTotal", data.qtyTotal);
      transaction.setDataValue("status", data.status);

      return await transaction.save({ transaction: this.transaction });
    } catch (e) {
      console.log(e);
      logger.error(e);
      return null;
    }
  }
}
