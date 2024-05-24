import { Transaction, WhereOptions } from "sequelize";
import { logger } from "../../log";
import { Product } from "../../models/Product";
import { ProductCategory } from "../../models/ProductCategory";
import { BaseRepository } from "../base/BaseRepository";
import { BaseRepositoryInterface } from "../base/interfaces/BaseRepositoryInterface";
import { sequelize } from "../../database";

export class ProductRepository
  extends BaseRepository
  implements BaseRepositoryInterface
{
  constructor() {
    super();
    this.model = Product;
  }

  async update(whereOptions: WhereOptions, data: any): Promise<boolean> {
    try {
      return await sequelize.transaction(async (transaction) => {
        await Product.update(data, { where: whereOptions });
        const product = await this.findOne(whereOptions, ["id"]);
        const categories = data["category_id[]"];

        // delete old product and category relationship
        if (categories) {
          await ProductCategory.destroy({
            where: { productId: product?.getDataValue("id") },
            transaction,
          });

          for (const categoryId of categories) {
            const productCategory = new ProductCategory();
            productCategory.setDataValue(
              "productId",
              product?.getDataValue("id") ?? 0
            );
            productCategory.setDataValue("categoryId", parseInt(categoryId));

            // save new relationship
            productCategory.save({ transaction });
          }
        }
        return true;
      });
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  // insert new data of product
  async insert(data: any): Promise<Product | null> {
    try {
      return await sequelize.transaction(async (transaction) => {
        const categories = data["category_id[]"];
        const product = new Product();
        product.setDataValue("image", data.image);
        product.setDataValue("name", data.name);
        product.setDataValue("price", data.price);
        product.setDataValue("description", data.description);
        product.setDataValue("weight", data.weight);
        product.setDataValue("stock", data.stock);
        product.setDataValue("createdAt", data.createdAt);
        product.setDataValue("updatedAt", data.updatedAt);
        product.setDataValue("deletedAt", data.deletedAt);

        await product.save({ transaction });

        for (const categoryId of categories) {
          const productCategory = new ProductCategory();
          productCategory.setDataValue("productId", product.getDataValue("id"));
          productCategory.setDataValue("categoryId", parseInt(categoryId));
          productCategory.save({ transaction });
        }

        return product;
      });
    } catch (e) {
      logger.error(e);
      return null;
    }
  }
}
