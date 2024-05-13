import { Order, WhereOptions } from "sequelize";
import { User } from "../../../models/User";

export interface UserRepositoryInterface {
    countAll(): Promise<number>;
    findWithOffsetAndLimit(offset: number, limit: number, order: Order, selectAttributes?: Array<string>): Promise<Array<User>>;
    getAll(): Promise<Array<User>>;
    insertOne(data: any): Promise<User | null>
    findOne(whereOptions: WhereOptions, selectAttributes: Array<string>): Promise<User| null>
    update(whereOptions: WhereOptions, data: any): Promise<boolean> 
    isExists(whereOptions: WhereOptions): Promise<boolean> 
    findOneByEmail(email: string, selectAttributes?: Array<string>): Promise<User | null>;
    findOneById(id: number, selectAttributes?: Array<string>): Promise<User | null>;
    isExistsByEmail(email: string): Promise<boolean>;
    isExistsById(id: number): Promise<boolean>;
    verifyEmail(userId: number): Promise<boolean>;
}