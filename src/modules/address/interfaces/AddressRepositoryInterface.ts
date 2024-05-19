import { WhereOptions } from "sequelize";
import { Address } from "../../../models/Address";

export interface AddressRepositoryInterface {
  insert(data: any): Promise<Address | null>;
}
