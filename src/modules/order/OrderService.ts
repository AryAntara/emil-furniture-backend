import moment = require("moment");

import { Cart } from "../../models/Cart";
import { CartService } from "../cart/CartService";
import { OrderRepository } from "./OrderRepository";
import { OrderServiceInterface } from "./interfaces/OrderServiceInterface";
import { Error, ServiceError } from "../../utils/serviceError";
import { Stock } from "../../models/Stock";
import { Product } from "../../models/Product";
import { StockService } from "../stock/StockService";
import { sequelize } from "../../database";
import { OrderDetailService } from "../orderDetail/OrderDetailService";
import { IncludeOptions, Op, Order, Sequelize, Transaction } from "sequelize";
import { OrderDetail } from "../../models/OrderDetail";
import { Order as OrderModel } from "../../models/Order";

export class OrderService implements OrderServiceInterface {
  constructor(
    private orderRepository: OrderRepository,
    private cartService: CartService,
    private stockService: StockService,
    private orderDetailService: OrderDetailService
  ) {}

  async updateStatusById(
    orderId: number,
    status: "pending" | "canceled" | "in_transaction"
  ) {
    return await this.orderRepository.update(
      {
        id: orderId,
      },
      { status }
    );
  }

  async isExistsById(orderId: number): Promise<boolean> {
    return this.orderRepository.isExists({ id: orderId });
  }

  // find order with pagging
  async findWithPage(
    page: number,
    limit: number,
    orderColumn = "id",
    orderType = "asc",
    userId: number
  ) {
    const relations = {
      model: OrderDetail,
    };
    const offset = (page - 1) * limit,
      order = [[orderColumn, orderType]] as Order,
      orderEntries = await this.orderRepository.findWithOffsetAndLimit(
        offset,
        limit,
        order,
        ["id", "qtyTotal", "priceTotal", "status"],
        { userId },
        relations
      ),
      orderCount = await this.orderRepository.countBy({ userId }, relations);

    return {
      orderEntries,
      orderCount,
    };
  }

  async findCartById(
    cartId: number,
    selectAttribute?: Array<string>
  ): Promise<Cart | null> {
    return this.cartService.findById(cartId, selectAttribute);
  }

  async create(cartId: number, userId: number): Promise<{orderId: number} | Error> {
    const data = {
      userId,
      status: "pending",
      canceledIn: moment().add(1, "d").format("YYYY-MM-DD"),
    };

    const transaction = await sequelize.transaction();
    this.setTransaction(transaction);
    // create order
    const cartDetailEntries = await this.cartService.findCartDetailByCartId(
      cartId,
      ["id", "lockedIn", "qty", "price", "productId"],
      { isUsed: "yes", status: { [Op.ne]: "process" } }
    );

    if (cartDetailEntries.length <= 0)
      return { message: "Tidak ada produk untuk pemesanan." };

    let qtyTotal: number = 0;
    let priceTotal: number = 0;
    const orderEntry = await this.orderRepository.insert(data);

    if (!orderEntry) {
      await transaction.rollback();
      this.unsetTransaction();
      return { message: "Tidak dapat membuat data pemesanan." };
    }

    const orderId = orderEntry.getDataValue("id");
    for (let cartDetailEntry of cartDetailEntries) {
      const lockedIn = moment(cartDetailEntry.getDataValue("lockedIn")),
        dateNow = moment(),
        stockData: any = {};

      if (lockedIn.diff(dateNow) < 0) {
        await transaction.rollback();
        this.unsetTransaction();
        return {
          errors: [dateNow.diff(lockedIn)],
          message:
            "Terlalu lama diam, tidak bisa memastikan bahwa stok produk masih ada.",
        };
      }

      const qty = cartDetailEntry.getDataValue("qty"),
        price = cartDetailEntry.getDataValue("price");

      priceTotal += qty * price;
      qtyTotal += qty;

      stockData.qty = qty;
      stockData.productId = cartDetailEntry.getDataValue("productId");
      stockData.type = "out";

      const stockEntry = await this.stockService.insertAndCommit(
          stockData as { qty: number; productId: number; type: "in" | "out" },
          moment().format("YYYY-MM-DD")
        ),
        stockId = stockEntry?.getDataValue("id");

      if (!stockEntry) {
        await transaction.rollback();
        this.unsetTransaction();
        return {
          message: "Tidak dapat mengurangi stok barang.",
        };
      }

      const orderDetailData = {
        orderId,
        stockId,
        productId: cartDetailEntry.getDataValue("productId"),
        price,
        qty,
      };

      // insert order detail Id
      const stockDetailEntry = await this.orderDetailService.insert(
        orderDetailData
      );
      if (!stockDetailEntry) {
        await transaction.rollback();
        this.unsetTransaction();
        return {
          message: "Tidak dapat membuat detail pemesanan.",
        };
      }

      const updatedCartDetailStatus =
        await this.cartService.updateCartDetailStatusAndLock(
          cartDetailEntry.getDataValue("id"),
          "process"
        );
      if (!updatedCartDetailStatus) {
        await transaction.rollback();
        this.unsetTransaction();
        return {
          message: "Tidak dapat memproses produk menuju pemesanan.",
        };
      }
    }

    const updatedCartStatus = await this.cartService.updateQtyAndPriceTotal(
      cartId
    );
    if (!updatedCartStatus) {
      await transaction.rollback();
      this.unsetTransaction();
      return { message: "Gagal merubah total dan kuantiti dari keranjang." };
    }
    const updatedOrderStatus = await this.orderRepository.update(
      { id: orderId },
      {
        qtyTotal,
        priceTotal,
      }
    );
    if (!updatedOrderStatus) {
      await transaction.rollback();
      this.unsetTransaction();
      return {
        message: "Tidak dapat mengubah kuantiti dan biaya dipemesanan.",
      };
    }
    await transaction.commit();
    this.unsetTransaction();
    return {orderId: orderEntry.getDataValue("id")};
  }

  setTransaction(transaction: Transaction) {
    this.orderRepository.setTransaction(transaction);
    this.cartService.setTransaction(transaction);
    this.orderRepository.setTransaction(transaction);
    this.stockService.setTransaction(transaction);
    this.orderDetailService.setTransaction(transaction);
  }

  unsetTransaction() {
    console.log("Removing transaction...");
    this.orderRepository.unsetTransaction();
    this.cartService.unsetTransaction();
    this.orderRepository.unsetTransaction();
    this.stockService.unsetTransaction();
    this.orderDetailService.unsetTransaction();
  }

  async findOneById(
    orderId: number,
    selectAttributes?: Array<string>,
    relations?: IncludeOptions
  ): Promise<OrderModel | null> {
    return await this.orderRepository.findOne(
      { id: orderId },
      selectAttributes,
      undefined,
      relations
    );
  }

  async cancel(orderId: number): Promise<true | ServiceError> {
    const transaction = await sequelize.transaction();
    this.setTransaction(transaction);

    const orderDetailEntries = await this.orderDetailService.findByOrderId(
      orderId,
      ["qty", "productId"]
    );
    for (const orderDetailEntry of orderDetailEntries) {
      const qty = orderDetailEntry.getDataValue("qty") as number,
        productId = orderDetailEntry.getDataValue("productId") as number;

      const stockData = {
        qty,
        type: "in" as "in",
        productId,
      };

      const insertedStockStatus = await this.stockService.insertAndCommit(
        stockData,
        moment().format("YYYY-MM-DD")
      );

      if (!insertedStockStatus) {
        await transaction.rollback();
        this.unsetTransaction();
        return {
          message: "Kesalahan dalam mengembalikan stok barang.",
        };
      }
    }

    const updatedStatus = await this.orderRepository.update(
      { id: orderId },
      {
        status: "canceled",
      }
    );
    if (!updatedStatus) {
      await transaction.rollback();
      return {
        message: "Gagal membatalkan pesanan.",
      };
    }

    await transaction.commit();
    this.unsetTransaction();
    return true;
  }
}
