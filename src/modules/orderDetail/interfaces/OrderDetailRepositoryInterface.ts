import { OrderDetail } from "../../../models/OrderDetail";

export interface OrderDetailRepositoryInterface {
  insert(data: any): Promise<OrderDetail | null>;
}
