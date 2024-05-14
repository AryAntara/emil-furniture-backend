import { User } from "../../../models/User"
export interface UserServiceInterface {
    findWithPage(page: number, limit: number, orderColumn: string, orderType: string): Promise<{ userEntries: Array<User>, userCount: number }>
    searchByEmail(email: string): Promise<boolean>
    searchById(userId: number): Promise<boolean>
    getUserByEmail(email: string, selectAttributes?: Array<string>): Promise<User | null>
    getUserById(userId: number, selectAttributes?: Array<string>): Promise<User | null>
    insert(data: any): Promise<User | null>
    isVerified(email: string): Promise<boolean>
    verifyEmail(email: string, userId: number): Promise<boolean>
    checkPassword(email: string, password: string): Promise<boolean>
    updatePasswordByEmail(email: string, newPassword: string): Promise<boolean>
    promoteToAdmin(userId: number): Promise<boolean>
    demoteToNormalUser(userId: number): Promise<boolean>
    deleteById(userId: number): Promise<boolean>
    updateUserById(userId: number, data: any): Promise<boolean>
}