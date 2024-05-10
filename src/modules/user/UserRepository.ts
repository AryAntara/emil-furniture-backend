import moment = require("moment");
import { logger } from "../../log";
import { User } from "../../models/User";
import { UserRepositoryInterface } from "./interfaces/UserRepositoryInterface";

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

    // search one by email
    async searchByEmail(email: string): Promise<boolean> {
        try {
            const userCount = await User.count({
                where: {
                    email
                }
            });

            return userCount > 0;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    // get one by email 
    async findUserByEmail(email: string, selectAttributes?: Array<string>): Promise<User | null> {
        try {
            const user = await User.findOne(
                {
                    where: {
                        email
                    },
                    attributes: selectAttributes
                }
            )
            return user;
        } catch (e) {
            logger.error(e);
            return null
        }
    }

    // get one by id 
    async findUserById(id: number): Promise<User | null> {
        try {
            const user = await User.findOne(
                {
                    where: {
                        id,
                    }
                }
            )

            return user;
        } catch (e) {
            logger.error(e)
            return null;
        }

    }

    // verify the user email
    async verifyEmail(userEntry: User): Promise<boolean> {
        try {
            userEntry.setDataValue('verifiedAt', moment().format('YYYY-MM-DD'))
            await userEntry.save();
            return true;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }
}