import { UserService } from "../user/UserServices";
import { AuthServiceInterface } from "./interfaces/AuthServiceInterface";
import { Email } from "../../utils/email";
import verificationEmailHTML from "./views/verificationEmail";
import { logger } from "../../log";
import { JWT } from "../../utils/jwt";
import { User } from "../../models/User";
import resetPasswordEmailHTML from "./views/resetPasswordEmail";

export class AuthService implements AuthServiceInterface {
    constructor(private userService: UserService) { }

    // insert new user using userService
    async insertUser(data: any) {
        return await this.userService.insert(data);
    }

    async findUserByEmail(email: string): Promise<boolean> {
        return await this.userService.searchByEmail(email);
    }

    // is user verified
    async isUserVerified(email: string): Promise<boolean> {
        return await this.userService.isVerified(email);
    }

    // send verification to email
    async sendVerifcationEmail(email: string, verificationUrl: string): Promise<void> {
        const client = new Email(email);
        client.sendHTML(
            'Verifikasi email oleh emil furniture',
            verificationEmailHTML.render(verificationUrl)
        )
    }

    // generate token verification
    async generateEmailVerificationToken(email: string, userId: number) {
        return JWT.generate({
            email, userId
        }, '1d');
    }

    // verify a user
    async verifyUserEmail(token: string): Promise<boolean> {
        const { email, userId } = await JWT.verify(token)
        return await this.userService.verifyEmail(email as string, userId as number);
    }

    // check password was sent
    async checkUserPassword(email: string, password: string) {
        return await this.userService.checkPassword(email, password);
    }

    // get user data by given id 
    async getUserDataByEmail(email: string): Promise<User | null> {
        return await this.userService.getUserByEmail(email);
    }

    // generate auth token
    async generateAuthToken(userId: number, roleUser: string, email: string ): Promise<string> {
        return JWT.generate({ userId, isAdmin: roleUser === 'admin', email}, '2h');
    };

    // generate auth token
    async generateRefreshToken(userId: number, roleUser: string, email: string ): Promise<string> {
        return JWT.generate({ userId, roleUser, email }, '1d');
    };

    // generate reset password token 
    async generateResetPasswordToken(email: string): Promise<string> {
        return JWT.generate({ email }, '1d')
    }

    // send reset password to email
    async sendResetPasswordEmail(email: string, resetPasswordUrl: string): Promise<void> {
        const client = new Email(email);
        client.sendHTML(
            'Reset Password',
            resetPasswordEmailHTML.render(resetPasswordUrl)
        )
    }

    // update user password
    async updateUserPassword(token: string, newPassword: string): Promise<boolean> {
        const { email } = await JWT.verify(token);
        return await this.userService.updatePasswordByEmail(email as string, newPassword);
    }
}