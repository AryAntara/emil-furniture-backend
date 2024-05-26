import moment = require("moment");
import { Order } from "../../models/Order";
import { OrderDetail } from "../../models/OrderDetail";
import { OrderDetailService } from "../orderDetail/OrderDetailService";
import { OrderRepository } from "./OrderRepository";
import { OrderServiceInterface } from "./interfaces/OrderServiceInterface";
import { ProductService } from "../product/ProductService";

export class OrderService implements OrderServiceInterface {
  constructor(
    private orderRepository: OrderRepository,
    private orderDetailService: OrderDetailService,
    private productService: ProductService
  ) {}

  async create(userId: number): Promise<Order | null> {
    const data: any = {};
    data.userId = userId;
    data.status = "pending";
    data.date = moment().format("YYYY-MM-DD");
    data.qtyTotal = 0;
    data.priceTotal = 0.0;
    return await this.orderRepository.insert(data);
  }

  async findByUserId(
    userId: number,
    selectAttributes?: Array<string>
  ): Promise<Order | null> {
    return await this.orderRepository.findOne(
      {
        userId,
        status: "pending",
      },
      selectAttributes
    );
  }

  async findOrderDetailWithPage(
    page: number,
    limit: number,
    orderId: number
  ): Promise<{
    orderEntries: Array<OrderDetail>;
    orderCount: number;
  }> {
    const orderColumn = "id";
    const orderType = "desc";
    return this.orderDetailService.findWithPage(
      page,
      limit,
      orderColumn,
      orderType,
      orderId
    );
  }

  async updateQtyAndPriceTotal(
    orderId: number,
    qty: number,
    price: number
  ): Promise<boolean> {
    const orderEntry = await this.orderRepository.findOne({ id: orderId });
    const data = {
      qtyTotal: orderEntry?.getDataValue("qtyTotal") ?? 0,
      priceTotal: orderEntry?.getDataValue("priceTotal") ?? 0,
    };

    data.qtyTotal += qty;
    data.priceTotal += qty * price;

    return await this.orderRepository.update({ id: orderId }, data);
  }

  async insertOrUpdateOrderDetail(
    orderId: number,
    data: any
  ): Promise<OrderDetail | null | boolean> {
    const productId = data.product_id as number;
    const productEntry = await this.productService.findOneById(productId);

    if (!data.lockedIn)
      data.lockedIn = moment().add(1, "d").format("YYYY-MM-DD");

    const orderDetailEntry =
        await this.orderDetailService.findOneByProductIdAndOrderId(
          productId,
          orderId
        ),
      productPrice =
        orderDetailEntry?.getDataValue("price") ??
        productEntry?.getDataValue("price") ??
        0;

    if (orderDetailEntry) {
      data.qty = data.qty + orderDetailEntry.getDataValue("qty");
      if (
        !(await this.orderDetailService.updateByOrderIdAndProductId(
          orderId,
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
      data.orderId = orderId;

      delete data.product_id;
      if (!(await this.orderDetailService.insert(data))) return false;
    }

    return this.updateQtyAndPriceTotal(orderId, data.qty, productPrice);
  }
}
