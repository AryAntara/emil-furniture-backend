import { WhereOptions } from "sequelize";
import { Address } from "../../../models/Address";

export interface AddressRepositoryInterface {
    insert(data: any): Promise<Address | null>
    countBy(whereOptions: WhereOptions): Promise<number>
    find(whereOptions: WhereOptions, selectAttributes?: Array<string>): Promise<Array<Address>>
    findByUserId(userId: number, selectAttributes?: Array<string>): Promise<Array<Address>>
    isExists(whereOptions: WhereOptions): Promise<boolean>
    isExistsById(addressId: number): Promise<boolean>
    update(whereOptions: WhereOptions, data: any): Promise<boolean>
    updateById(addressId: number, data: any): Promise<boolean>
    delete(whereOptions: WhereOptions): Promise<boolean>
    deleteById(addressId: number, userId?: number): Promise<boolean>
}