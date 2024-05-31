import { Op, Order } from "sequelize";
import { CartDetailRepository } from "./CartDetailRepository";
import { CartDetailServiceInterface } from "./interfaces/CartDetailServiceInterface";
import { CartDetail } from "../../models/CartDetail";
import moment = require("moment");

export class CartDetailService implements CartDetailServiceInterface {
  constructor(private cartDetailRepository: CartDetailRepository) {}

  async findWithPage(
    page: number,
    limit: number,
    cartColumn: string,
    cartType: "asc" | "desc",
    cartId: number
  ): Promise<{ cartEntries: CartDetail[]; cartCount: number }> {
    const offset = (page - 1) * limit,
      cart = [[cartColumn, cartType]] as Order,
      cartEntries = await this.cartDetailRepository.findWithOffsetAndLimit(
        offset,
        limit,
        cart,
        ["id", "productImage", "productName", "price", "qty"],
        { cartId }
      ),
      cartCount = await this.cartDetailRepository.countBy({ cartId });

    return {
      cartEntries,
      cartCount,
    };
  }

  async getLockedStock(productId: number): Promise<number> {
    return await this.cartDetailRepository.sum("qty", {
      productId,
      lockedIn: {
        [Op.gte]: moment().format("YYYY-MM-DD"),
      },
    });
  }

  async updateById(cartDetailId: number, data: any): Promise<boolean> {
    return this.cartDetailRepository.update({ id: cartDetailId }, data);
  }

  async updateByCartIdAndProductId(
    cartId: number,
    productId: number,
    data: any
  ): Promise<boolean> {
    // delete it if the stock was 0 or minus
    console.log(data);
    if (data.qty && (data.qty as number) < 1)
      return await this.cartDetailRepository.delete({ cartId, productId });

    return await this.cartDetailRepository.update({ cartId, productId }, data);
  }

  async updateStatusAndLockedInById(
    cartDetailId: number,
    status: "ready" | "out_of_stock" | "process",
    lockedIn?: string
  ): Promise<boolean> {
    const data = {
      status,
      lockedIn,
    };

    return this.updateById(cartDetailId, data);
  }

  async insert(data: any): Promise<CartDetail | null> {
    if (!data.isUsed) data.isUsed = "yes";
    if (!data.status) data.status = "ready";

    return await this.cartDetailRepository.insert(data);
  }
  async findOneById(cartDetailId: number): Promise<CartDetail | null> {
    return await this.cartDetailRepository.findOne({
      id: cartDetailId,
    });
  }

  async findOneByProductIdAndCartId(
    productId: number,
    cartId: number
  ): Promise<CartDetail | null> {
    return await this.cartDetailRepository.findOne({
      productId,
      cartId,
    });
  }

  async isProductExists(cartId: number, productId: number): Promise<boolean> {
    return await this.cartDetailRepository.isExists({
      cartId,
      productId,
    });
  }

  async updateIsUsed(
    cartDetailId: number,
    isUsed: "yes" | "no"
  ): Promise<boolean> {
    return await this.updateById(cartDetailId, {
      isUsed,
    });
  }
}
