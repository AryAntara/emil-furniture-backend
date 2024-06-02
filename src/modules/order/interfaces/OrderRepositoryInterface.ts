import { Order } from "../../../models/Order";

export interface OrderRepositoryInterface {
    insert(data: any): Promise<Order| null>
}