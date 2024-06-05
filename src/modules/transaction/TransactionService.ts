import { Order, Transaction } from "sequelize";
import { sequelize } from "../../database";
import { TransactionRepository } from "./TransactionRepository";
import { TransactionServiceInterface } from "./interfaces/TransactionServiceInterface";
import { OrderService } from "../order/OrderService";
import { AddressService } from "../address/AddressService";
import { Error, ServiceError } from "../../utils/serviceError";
import { Address } from "../../models/Address";
import { Transaction as TransactionModel } from "../../models/Transaction";
import { Order as OrderModel } from "../../models/Order";
import { OrderDetail } from "../../models/OrderDetail";
import moment = require("moment");
import { UserService } from "../user/UserServices";
import { generateSnapToken } from "../../midtrans";
import { logger } from "../../log";

export class TransactionService implements TransactionServiceInterface {
  constructor(
    private transactionRepository: TransactionRepository,
    private orderService: OrderService,
    private addressService: AddressService,
    private userService: UserService
  ) {}

  async createPayment(
    transactionId: string,
    userId: number
  ): Promise<{ token: string } | Error> {
    const transactionEntry = await this.findOneById(transactionId),
      userEntry = await this.userService.findOneById(userId);

    if (!userEntry)
      return {
        message: "Pengguna tidak ditemukan.",
      };

    if (!transactionEntry)
      return {
        message: "Data transaksi tidak ditemukan.",
      };

    const token = await generateSnapToken(transactionEntry, userEntry);
    if (!token) return { message: "Aplikasi pihak ketiga sedang bermasalah." };

    return { token };
  }

  // find order with pagging
  async findWithPage(
    page: number,
    limit: number,
    orderColumn = "id",
    orderType = "asc"
  ) {
    const relations = {
      model: OrderModel,
    };
    const offset = (page - 1) * limit,
      order = [[orderColumn, orderType]] as Order,
      transactionEntries =
        await this.transactionRepository.findWithOffsetAndLimit(
          offset,
          limit,
          order,
          ["id", "qtyTotal", "priceTotal", "status", "resi", "resiLink"],
          {},
          relations
        ),
      transactionCount = await this.transactionRepository.countBy(
        {},
        relations
      );

    return {
      transactionEntries,
      transactionCount,
    };
  }

  setTransaction(transaction: Transaction) {
    this.transactionRepository.setTransaction(transaction);
    this.orderService.setTransaction(transaction);
  }

  unsetTransaction() {
    this.transactionRepository.unsetTransaction();
    this.orderService.unsetTransaction();
  }

  async create(
    orderId: number,
    userId: number,
    addressId?: number | undefined
  ): Promise<{ transactionId: string } | Error> {
    const transaction = await sequelize.transaction();
    this.setTransaction(transaction);

    let addressEntry: Address | null = null;
    if (addressId) {
      addressEntry = await this.addressService.findOneById(addressId);
    } else {
      addressEntry = await this.addressService.findOneByUserId(userId);
    }

    if (!addressEntry) {
      await transaction.rollback();
      return { message: "Gagal membuat transaksi, tidak ada alamat." };
    }

    const orderEntry = await this.orderService.findOneById(orderId, [
      "status",
      "canceledIn",
      "qtyTotal",
      "priceTotal",
    ]);
    const canceledIn = moment(orderEntry?.getDataValue("canceledIn")),
      dateNow = moment();

    if (canceledIn.diff(dateNow) < 0) {
      const canceledStatus = await this.orderService.cancel(orderId);
      if (ServiceError.check(canceledStatus)) return canceledStatus;

      return {
        message: "Pesanan sudah di batalkan.",
      };
    }

    if (orderEntry?.getDataValue("status") !== "pending") {
      await transaction.rollback();
      this.unsetTransaction();
      return { message: "Data pesanan tidak dalam status menunggu." };
    }

    const qtyTotal = orderEntry.getDataValue("qtyTotal"),
      priceTotal = orderEntry.getDataValue("priceTotal");

    const transactionData = {
      address: addressEntry.getDataValue("description"),
      orderId,
      priceTotal,
      qtyTotal,
      status: "unpaid",
    };

    const transactionEntry = await this.insert(transactionData);
    if (!transactionEntry) {
      await transaction.rollback();
      this.unsetTransaction();
      return {
        message: "Tidak dapat membuat transaksi.",
      };
    }

    if (
      !(await this.orderService.updateStatusById(orderId, "in_transaction"))
    ) {
      await transaction.rollback();
      this.unsetTransaction();
      return {
        message: "Tidak dapat merubah status order menjadi transaksi.",
      };
    }

    await transaction.commit();
    this.unsetTransaction();
    return { transactionId: transactionEntry.getDataValue("id") };
  }

  async insert(data: any): Promise<TransactionModel | null> {
    return await this.transactionRepository.insert(data);
  }

  async findOneByOrderId(
    orderId: number,
    selectAttributes?: string[] | undefined
  ): Promise<TransactionModel | null> {
    return await this.transactionRepository.findOne(
      { orderId },
      selectAttributes
    );
  }
  async findOneById(
    transactionId: string,
    selectAttributes?: string[] | undefined
  ): Promise<TransactionModel | null> {
    return await this.transactionRepository.findOne(
      { id: transactionId },
      selectAttributes
    );
  }

  async updateById(transactionId: string, data: any): Promise<boolean> {
    return await this.transactionRepository.update({ id: transactionId }, data);
  }

  async isExistsByOrderId(orderId: number): Promise<boolean> {
    return await this.transactionRepository.isExists({ orderId });
  }

  async isExistsById(transactionId: string): Promise<boolean> {
    return await this.transactionRepository.isExists({ id: transactionId });
  }

  async updateStatusById(
    transactionId: string,
    status: "failure" | "success"
  ): Promise<boolean> {
    const data: { status: string } = { status: "paid" };
    const transactionEntry = await this.findOneById(transactionId, ["orderId"]);

    if (!transactionEntry) {
      logger.error("Transction not found.");
      return false;
    }

    if (status == "failure") {
      data.status = "canceled";
      const orderId = transactionEntry.getDataValue("orderId");
      if (ServiceError.check(await this.orderService.cancel(orderId))) {
        logger.error({message: "Error canceling order.", orderId});
        return false;
      }
    }

    await this.transactionRepository.update({ id: transactionId }, data);
    return true;
  }
}
