import { WhereOptions } from "sequelize";
import { logger } from "../../log";
import { Address } from "../../models/Address";
import { AddressRepositoryInterface } from "./interfaces/AddressRepositoryInterface";
import { BaseRepository } from "../base/BaseRepository";

export class AddressRepository extends BaseRepository implements AddressRepositoryInterface {
  constructor() {
    super()
    this.model = Address
  }

  // insert address
  async insert(data: any): Promise<Address | null> {
    try {
      const address = new Address();
      address.setDataValue("userId", data.userId);
      address.setDataValue("title", data.title);
      address.setDataValue("description", data.description);
      address.setDataValue("isActived", data.isActived ?? "no");

      return await address.save();
    } catch (e) {
      logger.error(e);
      return null;
    }
  }
}
