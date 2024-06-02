import { Transaction, WhereOptions } from "sequelize";
import { Cart } from "../../../models/Cart";
import { CartDetail } from "../../../models/CartDetail";

export interface CartServiceInterface {
  findByUserId(
    userId: number,
    selectAttributes?: Array<string>
  ): Promise<Cart | null>;
  findCartDetailWithPage(
    page: number,
    limit: number,
    cartId: number
  ): Promise<{
    cartEntries: Array<CartDetail>;
    cartCount: number;
  }>;
  create(userId: number): Promise<Cart | null>;
  insertOrUpdateCartDetail(
    cartId: number,
    operation: "subtract" | "add",
    data: any
  ): Promise<CartDetail | null | boolean>;
  updateQtyAndPriceTotal(cartId: number): Promise<boolean>;
  isProductExistsCartDetail(
    cartId: number,
    proudctId: number
  ): Promise<boolean>;
  findOneCartDetailByProductIdAndCartId(
    cartId: number,
    proudctId: number
  ): Promise<CartDetail | null>;
  updateCartDetailStatusAndLock(
    cartDetailId: number,
    status: "ready" | "out_of_stock" | "process",
    lockedIn?: string
  ): Promise<boolean>;
  findOneCartDetailById(cartDetailId: number): Promise<CartDetail | null>;
  isProductStockAvailable(productId: number, qty: number): Promise<boolean>;
  updateCartDetailIsUsed(
    cartDetailId: number,
    isUsed: "yes" | "no"
  ): Promise<boolean>;
  isExistsById(cartId: number): Promise<boolean>;
  findById(
    cartId: number,
    selectAttributes?: Array<string>
  ): Promise<Cart | null>;
  findCartDetailByCartId(
    cartId: number,
    selectAttributes?: Array<string>,
    whereOptions?: WhereOptions
  ): Promise<CartDetail[]>;

  setTransaction(transaction: Transaction): void;
  unsetTransaction(): void;
}
