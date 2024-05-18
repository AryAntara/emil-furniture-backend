import { Address } from "../../../models/Address";

export interface AddressServiceInterface {
    insert(data: any): Promise<Address | null>
    isLimitReached(userId: number): Promise<boolean>
    findByUserId(userId: number): Promise<Address[]>
    isExistsById(addressId: number): Promise<boolean>
    updateById(addressId: number, data: any): Promise<boolean>
    deleteById(addressId: number): Promise<boolean>
    activeAddress(addressId: number): Promise<boolean>
}