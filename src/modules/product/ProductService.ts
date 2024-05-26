import { IncludeOptions, Order } from "sequelize";
import { Product } from "../../models/Product";
import { Storage } from "../../utils/storage";
import { ProductRepository } from "./ProductRepository";
import { ProductServiceInterface } from "./interfaces/ProductServiceInterface";
import { Op } from "sequelize";
import { CategoryService } from "../category/CategoryService";
import { Category } from "../../models/Category";
import { ProductCategory } from "../../models/ProductCategory";

export class ProductService implements ProductServiceInterface {
  constructor(
    private productRepository: ProductRepository,
    private categoryService: CategoryService
  ) {}

  // find user with pagging
  async findWithPage(
    page: number,
    limit: number,
    orderColumn = "id",
    orderType = "asc",
    filter: {
      description?: string;
      name?: string;
      categoryId?: string;
    }
  ) {
    const whereOptions: any = {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${filter.name ?? ""}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${filter.description ?? ""}%`,
          },
        },
      ],
    };

    const relations: IncludeOptions = {
      model: Category,
      where: filter.categoryId ? { id: filter.categoryId } : undefined,
      attributes: ["name", "id"],
      required: true,
      through: {
        attributes: ["id"],
      },
    };
    const offset = (page - 1) * limit,
      order = [[orderColumn, orderType]] as Order,
      productEntries = await this.productRepository.findWithOffsetAndLimit(
        offset,
        limit,
        order,
        ["id", "image", "name", "price", "weight"],
        whereOptions,
        relations
      ),
      productCount = await this.productRepository.countBy(
        whereOptions,
        relations
      );

    return {
      productEntries,
      productCount,
    };
  }

  // insert new product
  async insert(data: any): Promise<Product | null> {
    data.stock = 0;
    return this.productRepository.insert(data);
  }

  // store image into telegram
  async saveImage(file: Blob): Promise<string | null> {
    return await Storage.store(file);
  }

  // is exists by id
  async isExistsById(productId: number): Promise<boolean> {
    return await this.productRepository.isExists({ id: productId });
  }

  // update product by id
  async updateById(productId: number, data: any): Promise<boolean> {
    return await this.productRepository.update(
      {
        id: productId,
      },
      data
    );
  }

  // delete product by id
  async deleteById(productId: number): Promise<boolean> {
    return await this.productRepository.delete({
      id: productId,
    });
  }

  // is category exists by id
  async isCategoryExistsById(categoryId: number) {
    return await this.categoryService.isExistsById(categoryId);
  }

  async findOneById(productId: number): Promise<Product | null> {
    return await this.productRepository.findOne(
      {
        id: productId,
      },
      null,
      null,
      {
        model: Category,
        attributes: ["name"],
        through: {
          attributes: ["id"],
        },
      }
    );
  }
}
