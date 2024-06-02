import { Order, Transaction } from "sequelize";
import { OrderDetail } from "../../models/OrderDetail";
import { OrderDetailRepository } from "./OrderDetailRepository";

export class OrderDetailService {
  constructor(private orderDetailRepository: OrderDetailRepository) {}
  setTransaction(transaction: Transaction) {
    this.orderDetailRepository.setTransaction(transaction);
  }

  unsetTransaction() {
    this.orderDetailRepository.unsetTransaction();
  }

  async insert(data: any): Promise<OrderDetail | null> {
    return await this.orderDetailRepository.insert(data);
  }

  async findByOrderId(orderId: number, selectAttribute?: Array<string>): Promise<OrderDetail[]> {
    return await this.orderDetailRepository.find({ orderId }, selectAttribute);
  }
}
