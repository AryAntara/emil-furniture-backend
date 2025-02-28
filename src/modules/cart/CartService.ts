import moment = require("moment");
import { Cart } from "../../models/Cart";
import { CartDetail } from "../../models/CartDetail";
import { CartDetailService } from "../cartDetail/CartDetailService";
import { CartRepository } from "./CartRepository";
import { CartServiceInterface } from "./interfaces/CartServiceInterface";
import { ProductService } from "../product/ProductService";
import { StockService } from "../stock/StockService";
import {
  IncludeOptions,
  Op,
  Sequelize,
  Transaction,
  WhereOptions,
} from "sequelize";
import { Product } from "../../models/Product";
import { Stock } from "../../models/Stock";

export class CartService implements CartServiceInterface {
  constructor(
    private cartRepository: CartRepository,
    private cartDetailService: CartDetailService,
    private productService: ProductService,
    private stockService: StockService
  ) {}

  setTransaction(transaction: Transaction) {
    this.cartRepository.setTransaction(transaction);
    this.cartDetailService.setTransaction(transaction);
  }

  unsetTransaction() {
    this.cartRepository.unsetTransaction();
    this.cartDetailService.unsetTransaction();
  }

  async create(userId: number): Promise<Cart | null> {
    const data: any = {};
    data.userId = userId;
    data.status = "pending";
    data.date = moment().format("YYYY-MM-DD");
    data.qtyTotal = 0;
    data.priceTotal = 0.0;
    return await this.cartRepository.insert(data);
  }

  async findByUserId(
    userId: number,
    selectAttributes?: Array<string>
  ): Promise<Cart | null> {
    return await this.cartRepository.findOne(
      {
        userId,
      },
      selectAttributes
    );
  }

  async findCartDetailWithPage(
    page: number,
    limit: number,
    cartId: number
  ): Promise<{
    cartEntries: Array<CartDetail>;
    cartCount: number;
  }> {
    const cartColumn = "id";
    const cartType = "desc";
    return this.cartDetailService.findWithPage(
      page,
      limit,
      cartColumn,
      cartType,
      cartId
    );
  }

  async updateQtyAndPriceTotal(cartId: number): Promise<boolean> {
    const cartDetailEntries = await this.cartDetailService.findByCartId(
      cartId,
      ["qty", "price"],
      undefined,
      { status: { [Op.ne]: "process" } }
    );

    let priceTotal = 0,
      qtyTotal = 0;
    for (let cartDetailEntry of cartDetailEntries ?? []) {
      qtyTotal += cartDetailEntry?.getDataValue("qty") ?? 0;
      priceTotal += (cartDetailEntry?.getDataValue("price") ?? 0) * qtyTotal;
    }

    const data = {
      qtyTotal,
      priceTotal,
    };

    return await this.cartRepository.update({ id: cartId }, data);
  }

  async insertOrUpdateCartDetail(
    cartId: number,
    operation: "subtract" | "add",
    data: any
  ): Promise<CartDetail | null | boolean> {
    const productId = data.product_id as number;
    const productEntry = await this.productService.findOneById(productId);

    if (!data.lockedIn)
      data.lockedIn = moment().add(1, "d").format("YYYY-MM-DD");

    const cartDetailEntry =
        await this.cartDetailService.findOneByProductIdAndCartId(
          productId,
          cartId
        ),
      productPrice =
        cartDetailEntry?.getDataValue("price") ??
        productEntry?.getDataValue("price") ??
        0;

    if (cartDetailEntry) {
      data.qty =
        operation == "add"
          ? data.qty + cartDetailEntry.getDataValue("qty")
          : cartDetailEntry.getDataValue("qty") - data.qty;
      if (
        !(await this.cartDetailService.updateByCartIdAndProductId(
          cartId,
          productId,
          data
        ))
      )
        return false;
    } else {
      data.productId = productId;
      data.price = productPrice;
      data.productName = productEntry?.getDataValue("name");
      data.productImage = productEntry?.getDataValue("image");
      data.cartId = cartId;

      delete data.product_id;
      if (!(await this.cartDetailService.insert(data))) return false;
    }

    return this.updateQtyAndPriceTotal(cartId);
  }

  async isProductExistsCartDetail(
    cartId: number,
    proudctId: number
  ): Promise<boolean> {
    return this.cartDetailService.isProductExists(cartId, proudctId);
  }

  async findOneCartDetailById(
    cartDetailId: number
  ): Promise<CartDetail | null> {
    return this.cartDetailService.findOneById(cartDetailId);
  }

  async findOneCartDetailByProductIdAndCartId(
    cartId: number,
    proudctId: number
  ): Promise<CartDetail | null> {
    return this.cartDetailService.findOneByProductIdAndCartId(
      cartId,
      proudctId
    );
  }

  async updateCartDetailStatusAndLock(
    cartDetailId: number,
    status: "ready" | "out_of_stock" | "process",
    lockedIn?: string
  ): Promise<boolean> {
    return this.cartDetailService.updateStatusAndLockedInById(
      cartDetailId,
      status,
      lockedIn
    );
  }

  async isProductStockAvailable(
    productId: number,
    qty: number
  ): Promise<boolean> {
    const stock = await this.stockService.getLastStock(productId),
      lockedStock = await this.cartDetailService.getLockedStock(productId);

    return qty <= stock - lockedStock;
  }

  async updateCartDetailIsUsed(
    cartDetailId: number,
    isUsed: "yes" | "no"
  ): Promise<boolean> {
    const cartDetailEntry = await this.findOneCartDetailById(cartDetailId);

    if (!cartDetailEntry) return false;

    const cartId = cartDetailEntry.getDataValue("cartId");

    if (!(await this.updateQtyAndPriceTotal(cartId))) return false;

    return await this.cartDetailService.updateIsUsed(cartDetailId, isUsed);
  }

  async isExistsById(cartId: number): Promise<boolean> {
    return this.cartRepository.isExists({ id: cartId });
  }

  async findById(
    cartId: number,
    selectAttributes?: Array<string>
  ): Promise<Cart | null> {
    return this.cartRepository.findOne({ id: cartId }, selectAttributes);
  }

  async findCartDetailByCartId(
    cartId: number,
    selectAttributes?: Array<string>,
    whereOptions?: WhereOptions
  ): Promise<CartDetail[]> {
    return (
      this.cartDetailService.findByCartId(
        cartId,
        selectAttributes,
        undefined,
        whereOptions
      ) ?? []
    );
  }
}
