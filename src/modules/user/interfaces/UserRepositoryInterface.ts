import { User } from "../../../models/User";

export interface UserRepositoryInterface {
    getAll(): Promise<Array<User>>;
    insertOne(data: any): Promise<User | null>
    findUserByEmail(email: string, selectAttributes?: Array<string>): Promise<User | null>;
    findUserById(id: number, selectAttributes?: Array<string>): Promise<User | null>;
    searchByEmail(email: string): Promise<boolean>;
    verifyEmail(userEntry: User): Promise<boolean>;
}