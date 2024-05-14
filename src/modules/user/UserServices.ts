import { User } from "../../models/User";
import { UserRepository } from "./UserRepository";
import { UserServiceInterface } from "./interfaces/UserServicesInterface";
import moment = require("moment");
import { logger } from "../../log";
import { Order } from "sequelize";

export class UserService implements UserServiceInterface {
    constructor(private userRepository: UserRepository) { }


    // find user with pagging
    async findWithPage(page: number, limit: number, orderColumn = "id", orderType = "asc") {
        const offset = (page - 1) * limit,
            order = [[orderColumn, orderType]] as Order,
            userEntries = await this.userRepository.findWithOffsetAndLimit(offset, limit, order, [
                'id', 'fullname', 'email', 'phoneNumber', 'roleUser', 'verifiedAt'
            ]),
            userCount = await this.userRepository.countAll();

        return {
            userEntries,
            userCount
        }
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
                createdAt: moment().format('YYYY-MM-DD'),
                updatedAt: null,
                deletedAt: null
            }
            return await this.userRepository.insertOne(userData);
        } catch (e) {
            logger.error(e);
            return null;
        }
    }

    // search user by id
    async searchById(userId: number): Promise<boolean> {
        return await this.userRepository.isExistsById(userId);
    }

    // search by email
    async searchByEmail(email: string): Promise<boolean> {
        return await this.userRepository.isExistsByEmail(email);
    }

    // check user has been verified or not
    async isVerified(email: string): Promise<boolean> {
        const userEntry = await this.userRepository.findOneByEmail(email, ['verifiedAt']);

        if (!userEntry) return false;

        return userEntry.getDataValue('verifiedAt') != null;
    }

    // verify email of a user
    async verifyEmail(email: string, userId: number): Promise<boolean> {

        // return true instead if the email was verified
        if (await this.isVerified(email)) return true;

        const userEntry = await this.userRepository.findOneById(userId);

        if (!userEntry || userEntry.getDataValue('email') != email) return false;

        return await this.userRepository.verifyEmail(userEntry.getDataValue('id') as number);
    }

    // is a valid password for the given email 
    async checkPassword(email: string, password: string): Promise<boolean> {
        try {
            const userEntry = await this.userRepository.findOneByEmail(email, ['password']);
            const hash = userEntry?.getDataValue('password') ?? '';
            return await Bun.password.verify(password, hash)
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    // get user by email
    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneByEmail(email);
    }

    // update password of an user by email 
    async updatePasswordByEmail(email: string, newPassword: string): Promise<boolean> {
        try {
            const password = await Bun.password.hash(newPassword);
            return await this.userRepository.update({ email }, { password })
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    // Promote the user into an admin
    async promoteToAdmin(userId: number): Promise<boolean> {
        return await this.userRepository.update({
            id: userId
        }, { roleUser: "admin" });
    }


    // Demote the user into an admin
    async demoteToNormalUser(userId: number): Promise<boolean> {
        return await this.userRepository.update({
            id: userId
        }, { roleUser: "normal" });
    }

    // Delete user by id
    async deleteById(userId: number): Promise<boolean> {
        return await this.userRepository.deleteOneById(userId)
    }

    // Get an user by their id 
    async getUserById(userId: number, selectAttributes?: Array<string>): Promise<User | null> {
        return await this.userRepository.findOneById(userId, selectAttributes)
    }

    // update user data base on userId
    async updateUserById(userId: number, data: any): Promise<boolean> {
        return await this.userRepository.update({ id: userId }, data);
    }
}