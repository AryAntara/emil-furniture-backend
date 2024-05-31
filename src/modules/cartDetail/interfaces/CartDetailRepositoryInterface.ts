import { CartDetail } from "../../../models/CartDetail";

export interface CartDetailRepositoryInterface {
  insert(data: any): Promise<CartDetail | null>;
}
