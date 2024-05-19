import { Order, WhereOptions } from "sequelize";
import { User } from "../../../models/User";

export interface UserRepositoryInterface {
  insert(data: any): Promise<User | null>;
  verifyEmail(userId: number): Promise<boolean>;
}
