import { Cart } from "../../../models/Cart";

export interface CartRepositoryInterface {
    insert(data: any): Promise<Cart|null>
}