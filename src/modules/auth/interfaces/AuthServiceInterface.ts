import { User } from "../../../models/User";

export interface AuthServiceInterface {
    insertUser(data: any): Promise<User|null>;
    findUserByEmail(email: string): Promise<boolean>;
    isUserVerified(email: string): Promise<boolean>;
    generateEmailVerificationToken(email: string, userId: number): Promise<string>;
    verifyUserEmail(token: string): Promise<boolean>; 
    sendVerifcationEmail(email: string, verificationUrl: string): Promise<void>;
    generateEmailVerificationToken(email: string, userId: number): Promise<string>;
    checkUserPassword(email: string, password: string): Promise<boolean>;
    generateAuthToken(userId: number): Promise<string>;
    generateRefreshToken(userId: number): Promise<string>;
}