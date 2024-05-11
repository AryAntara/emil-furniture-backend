import moment = require("moment");
import { logger } from "../../log";
import { User } from "../../models/User";
import { UserRepositoryInterface } from "./interfaces/UserRepositoryInterface";
import { WhereOptions } from "sequelize";

export class UserRepository implements UserRepositoryInterface {
    constructor(private user: User) { }
   
    async getAll(): Promise<User[]> {
        try {
            return await User.findAll()
        } catch (e) {
            logger.error(e);
            return []
        }
    }

    // insert new user
    async insertOne(data: any) {
        this.user.setDataValue('email', data.email);
        this.user.setDataValue('fullname', data.fullname);
        this.user.setDataValue('password', data.password);
        this.user.setDataValue('roleUser', data.roleUser);
        this.user.setDataValue('verifiedAt', data.verifiedAt);
        this.user.setDataValue('createdAt', data.createdAt);
        this.user.setDataValue('updatedAt', data.updatedAt);
        this.user.setDataValue('deletedAt', data.deletedAt);
        try {
            await this.user.save()
            return this.user;
        } catch (e) {
            logger.error(e);
            return null;
        }
    }

    // update users
    async update(whereOptions: WhereOptions, data: any) {
        try {
            await User.update(data, { where: whereOptions })
            return true;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    // find one user 
    async findOne(whereOptions: WhereOptions, selectAttributes?: Array<string>) {
        try {
            return await User.findOne(
                {
                    where: whereOptions,
                    attributes: selectAttributes
                }
            )
        } catch (e) {
            logger.error(e);
            return null
        }
    }

    // is exist 
    async isExists(whereOptions: WhereOptions) {
        try {
            const userCount = await User.count({
                where: whereOptions
            });
            return userCount > 0;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    // search one by email
    async isExistsByEmail(email: string): Promise<boolean> {
        return await this.isExists({ email });
    }

    // get one by email 
    async findOneByEmail(email: string, selectAttributes?: Array<string>): Promise<User | null> {
        return await this.findOne({ email }, selectAttributes);
    }

    // get one by id 
    async findOneById(id: number, selectAttributes?: Array<string>): Promise<User | null> {
        return await this.findOne({ id }, selectAttributes);
    }

    // verify the user email
    async verifyEmail(userId: number): Promise<boolean> {
        return await this.update({ id: userId }, { verifiedAt: moment().format('YYYY-MM-DD') });
    }
}