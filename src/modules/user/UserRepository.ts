import moment = require("moment");
import { logger } from "../../log";
import { User } from "../../models/User";
import { UserRepositoryInterface } from "./interfaces/UserRepositoryInterface";
import { BaseRepository } from "../base/BaseRepository";

export class UserRepository
  extends BaseRepository
  implements UserRepositoryInterface
{
  constructor() {
    super();
    this.model = User;
  }

  // insert new user
  async insert(data: any) {
    const user = new User();
    user.setDataValue("email", data.email);
    user.setDataValue("fullname", data.fullname);
    user.setDataValue("password", data.password);
    user.setDataValue("roleUser", data.roleUser);
    user.setDataValue("verifiedAt", data.verifiedAt);
    user.setDataValue("createdAt", data.createdAt);
    user.setDataValue("updatedAt", data.updatedAt);
    user.setDataValue("deletedAt", data.deletedAt);
    try {
      await user.save();
      return user;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  // verify the user email
  async verifyEmail(userId: number): Promise<boolean> {
    return await this.update(
      { id: userId },
      { verifiedAt: moment().format("YYYY-MM-DD") }
    );
  }
}
