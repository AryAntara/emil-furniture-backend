import { User } from "../../models/User";
import { UserRepository } from "./UserRepository";
import { UserServiceInterface } from "./interfaces/UserServicesInterface";
import moment = require("moment");
import { logger } from "../../log";
import { Op, Order } from "sequelize";

export class UserService implements UserServiceInterface {
  constructor(private userRepository: UserRepository) {}

  // find user with pagging
  async findWithPage(
    page: number,
    limit: number,
    orderColumn = "id",
    orderType = "asc",
    filter: {
      fullname?: string;
      email?: string;
    }
  ) {
    const whereOptions: any = {
      fullname: {
        [Op.like]: `%${filter.fullname ?? ""}%`,
      },

      email: {
        [Op.like]: `%${filter.email ?? ""}%`,
      },
    };
    const offset = (page - 1) * limit,
      order = [[orderColumn, orderType]] as Order,
      userEntries = await this.userRepository.findWithOffsetAndLimit(
        offset,
        limit,
        order,
        ["id", "fullname", "email", "phoneNumber", "roleUser", "verifiedAt"],
        whereOptions
      ),
      userCount = await this.userRepository.countBy(whereOptions);

    return {
      userEntries,
      userCount,
    };
  }

  // insert new user to database
  async insert(data: any) {
    try {
      const password = await Bun.password.hash(data.password);
      const userData = {
        email: data.email,
        fullname: data.fullname,
        password: password,
        refreshToken: null,
        roleUser: "normal",
        verifiedAt: null,
        createdAt: moment().format("YYYY-MM-DD"),
        updatedAt: null,
        deletedAt: null,
      };
      return await this.userRepository.insert(userData);
    } catch (e) {
      logger.error(e);
      return null;
    }
  }

  // is exists user by id
  async isExistsById(userId: number): Promise<boolean> {
    return await this.userRepository.isExists({ id: userId });
  }

  // is exists by email
  async isExistsByEmail(email: string): Promise<boolean> {
    return await this.userRepository.isExists({ email });
  }

  // check user has been verified or not
  async isVerified(email: string): Promise<boolean> {
    const userEntry = await this.userRepository.findOne({ email }, [
      "verifiedAt",
    ]);

    if (!userEntry) return false;

    return userEntry.getDataValue("verifiedAt") != null;
  }

  // verify email of a user
  async verifyEmail(email: string, userId: number): Promise<boolean> {
    // return true instead if the email was verified
    if (await this.isVerified(email)) return true;

    const userEntry = await this.userRepository.findOne({ id: userId });

    if (!userEntry || userEntry.getDataValue("email") != email) return false;

    return await this.userRepository.verifyEmail(
      userEntry.getDataValue("id") as number
    );
  }

  // is a valid password for the given email
  async checkPassword(email: string, password: string): Promise<boolean> {
    try {
      const userEntry = await this.userRepository.findOne({ email }, [
        "password",
      ]);
      const hash = userEntry?.getDataValue("password") ?? "";
      return await Bun.password.verify(password, hash);
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  // find an user by email
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ email });
  }

  // update password of an user by email
  async updatePasswordByEmail(
    email: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const password = await Bun.password.hash(newPassword);
      return await this.userRepository.update({ email }, { password });
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  // promote the user into an admin
  async promoteToAdmin(userId: number): Promise<boolean> {
    return await this.userRepository.update(
      {
        id: userId,
      },
      { roleUser: "admin" }
    );
  }

  // demote the user into an admin
  async demoteToNormalUser(userId: number): Promise<boolean> {
    return await this.userRepository.update(
      {
        id: userId,
      },
      { roleUser: "normal" }
    );
  }

  // delete user by id
  async deleteById(userId: number): Promise<boolean> {
    return await this.userRepository.delete({ id: userId });
  }

  // find an user by their id
  async findOneById(
    userId: number,
    selectAttributes?: Array<string>
  ): Promise<User | null> {
    return await this.userRepository.findOne({ id: userId }, selectAttributes);
  }

  // update user data base on userId
  async updateById(userId: number, data: any): Promise<boolean> {
    return await this.userRepository.update({ id: userId }, data);
  }
}
