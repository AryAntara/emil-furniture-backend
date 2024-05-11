import { User } from "../../../models/User"
export interface UserServiceInterface {
    searchByEmail(email: string): Promise<boolean>
    getUserByEmail(email: string): Promise<User | null>
    insert(data: any): Promise<User | null>
    isVerified(email: string): Promise<boolean>
    verifyEmail(email: string, userId: number): Promise<boolean>
    checkPassword(email: string, password: string): Promise<boolean>
    updatePasswordByEmail(email: string, newPassword: string): Promise<boolean>
}