import { User } from "../../models/User";
import { UserRepository } from "./UserRepository";
import { UserServiceInterface } from "./interfaces/UserServicesInterface";
import moment = require("moment");
import { logger } from "../../log";

export class UserService implements UserServiceInterface {
    constructor(private userRepository: UserRepository) { }

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

    // search by email
    async searchByEmail(email: string): Promise<boolean> {
        return await this.userRepository.searchByEmail(email);
    }

    // check user has been verified or not
    async isVerified(email: string): Promise<boolean> {
        const userEntry = await this.userRepository.findUserByEmail(email, ['verifiedAt']);

        if (!userEntry) return false;

        return userEntry.getDataValue('verifiedAt') != null;
    }

    // verify email of a user
    async verifyEmail(email: string, userId: number): Promise<boolean> {

        // return true instead if the email was verified
        if (await this.isVerified(email)) return true;

        const userEntry = await this.userRepository.findUserById(userId);

        if (!userEntry || userEntry.getDataValue('email') != email) return false;

        return await this.userRepository.verifyEmail(userEntry);
    }

    // is a valid password for the given email 
    async checkPassword(email: string, password: string): Promise<boolean> {
        try {
            const userEntry = await this.userRepository.findUserByEmail(email, ['password']);
            const hash = userEntry?.getDataValue('password') ?? '';
            return await Bun.password.verify(password, hash)
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    // get user by email
    async getUserByEmail(email: string): Promise<User|null> {
        return await this.userRepository.findUserByEmail(email);
    }

}