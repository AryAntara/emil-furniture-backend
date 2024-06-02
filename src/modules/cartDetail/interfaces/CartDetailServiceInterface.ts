import { Hooks } from "sequelize/types/hooks";
import { CartDetail } from "../../../models/CartDetail";
import {
  Attributes,
  IncludeOptions,
  Transaction,
  WhereOptions,
} from "sequelize";

export interface CartDetailServiceInterface {
  findByCartId(
    cartId: number,
    selectAttributes?: Attributes<CartDetail | Hooks>,
    relations?: IncludeOptions,
    whereOptions?: WhereOptions
  ): Promise<CartDetail[]>;
  findWithPage(
    page: number,
    limit: number,
    cartColumn: string,
    cartType: "asc" | "desc",
    cartId: number
  ): Promise<{
    cartEntries: Array<CartDetail>;
    cartCount: number;
  }>;
  getLockedStock(productId: number): Promise<number>;
  insert(data: any): Promise<CartDetail | null>;
  updateByCartIdAndProductId(
    cartId: number,
    productId: number,
    data: any
  ): Promise<boolean>;
  findOneByProductIdAndCartId(
    productId: number,
    cartId: number
  ): Promise<CartDetail | null>;
  updateStatusAndLockedInById(
    cartDetailId: number,
    lockedIn: string,
    status: "ready" | "out_of_stock" | "process"
  ): Promise<boolean>;
  isProductExists(cartId: number, productId: number): Promise<boolean>;
  updateById(cartDetailId: number, data: any): Promise<boolean>;
  findOneById(cartDetailId: number): Promise<CartDetail | null>;
  updateIsUsed(cartDetailId: number, isUsed: "yes" | "no"): Promise<boolean>;
  setTransaction(transaction: Transaction): void;
  unsetTransaction(): void;
}
