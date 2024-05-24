import { IncludeOptions, Op, Order } from "sequelize";
import { Stock } from "../../models/Stock";
import { ProductService } from "../product/ProductService";
import { StockRepository } from "./StockRepository";
import { StockServiceInterface } from "./interfaces/StockServiceInteraface";
import moment = require("moment");
import { Product } from "../../models/Product";

export class StockService implements StockServiceInterface {
  constructor(
    private stockRepository: StockRepository,
    private productService: ProductService
  ) {}

  async isProductExistsById(productId: number): Promise<boolean> {
    return await this.productService.isExistsById(productId);
  }

  // getting last final stock
  async getLastStock(productId: number) {
    const stockEntry = await this.stockRepository.findOne(
      {
        productId,
      },
      ["qtyFinal"],
      [["commitedAt", "desc"]]
    );

    return stockEntry?.getDataValue("qtyFinal") ?? 0;
  }

  async insert(data: any): Promise<Stock | null> {
    const stockData = {
      qtyIn: 0,
      qtyOut: 0,
      qtyInitial: 0,
      qtyFinal: 0,
      productId: data.product_id,
    };

    stockData.qtyInitial = await this.getLastStock(data.product_id);
    if (data.type == "in") {
      stockData.qtyIn = data.qty;
      stockData.qtyFinal = stockData.qtyInitial + stockData.qtyIn;
    } else {
      stockData.qtyOut = data.qty;
      stockData.qtyFinal = stockData.qtyInitial - stockData.qtyOut;
    }

    return await this.stockRepository.insert(stockData);
  }

  // check there no others uncommited stock
  async areStockUncommited(productId: number): Promise<boolean> {
    return (
      (await this.stockRepository.countBy({
        id: productId,
        commitedAt: null,
      })) > 0
    );
  }

  async isExistById(stockId: number): Promise<boolean> {
    return await this.stockRepository.isExists({
      id: stockId,
    });
  }

  async isCommited(stockId: number): Promise<boolean> {
    return await this.stockRepository.isExists({
      id: stockId,
      commitedAt: { [Op.not]: null },
    });
  }

  async commit(stockId: number): Promise<boolean> {
    const stockEntry = await this.stockRepository.findOne(
      {
        id: stockId,
      },
      ["qtyFinal", "productId"]
    );

    if (!stockEntry) return false;

    const productId = stockEntry.getDataValue("productId");
    const finalStock = stockEntry.getDataValue("qtyFinal");

    if (
      !(await this.productService.updateById(productId, {
        stock: finalStock,
      }))
    )
      return false;

    return await this.updateById(stockId, {
      commitedAt: moment().format("YYYY-MM-DD"),
    });
  }

  async updateById(stockId: number, data: any) {
    const stockData = {
      qtyIn: data.qtyIn,
      qtyOut: data.qtyOut,
      qtyInitial: data.qtyInitial,
      qtyFinal: data.qtyFinal,
      productId: data.productId,
      commitedAt: data.commitedAt,
    };

    if (data.type)
      if (data.type == "in") {
        stockData.qtyIn = data.qty;
        stockData.qtyFinal = stockData.qtyInitial + stockData.qtyIn;
      } else {
        stockData.qtyOut = data.qty;
        stockData.qtyFinal = stockData.qtyInitial - stockData.qtyOut;
      }

    return this.stockRepository.update(
      {
        id: stockId,
      },
      stockData
    );
  }

  async findWithPage(
    page: number,
    limit: number,
    orderColumn = "id",
    orderType = "asc",
    filter: {
      productName?: string;
    }
  ) {
    const whereOptions = {
      "$product.name$": {
        [Op.like]: `%${filter.productName ?? ""}%`,
      },
    };
    const relation: IncludeOptions = {
      model: Product,
      required: true,
      attributes: ["name", "price", "id"]
    };
    const offset = (page - 1) * limit,
      order = [[orderColumn, orderType]] as Order,
      stockEntries = await this.stockRepository.findWithOffsetAndLimit(
        offset,
        limit,
        order,
        [
          "id",
          "qtyIn",
          "qtyOut",
          "qtyFinal",
          "qtyInitial",
          "commitedAt",          
        ],
        whereOptions,
        relation
      ),
      stockCount = await this.stockRepository.countBy(null, relation);

    return {
      stockEntries,
      stockCount,
    };
  }

  async deleteById(stockId: number): Promise<boolean> {
    return await this.stockRepository.delete({
      id: stockId,
    });
  }

  async findOneByid(
    stockId: number,
    selectAttributes?: Array<string>
  ): Promise<Stock | null> {
    return await this.stockRepository.findOne(
      {
        id: stockId,
      },
      selectAttributes
    );
  }
}
