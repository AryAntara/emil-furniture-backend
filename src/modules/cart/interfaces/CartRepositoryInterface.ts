import { Order } from "../../../models/Cart";

export interface OrderRepositoryInterface {
    insert(data: any): Promise<Order|null>
}