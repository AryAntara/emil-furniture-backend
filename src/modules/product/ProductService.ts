import { IncludeOptions, Order } from "sequelize";
import { Product } from "../../models/Product";
import { Storage } from "../../utils/storage";
import { ProductRepository } from "./ProductRepository";
import { ProductServiceInterface } from "./interfaces/ProductServiceInterface";
import { Op } from "sequelize";
import { CategoryService } from "../category/CategoryService";
import { Category } from "../../models/Category";

export class ProductService implements ProductServiceInterface {
  constructor(private productRepository: ProductRepository, private categoryService: CategoryService) {}

  // find user with pagging
  async findWithPage(
    page: number,
    limit: number,
    orderColumn = "id",
    orderType = "asc",
    filter: {
      description?: string;
      name?: string;
    }
  ) {
    console.log(filter);
    const whereOptions = {
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
    const offset = (page - 1) * limit,
      order = [[orderColumn, orderType]] as Order,
      productEntries = await this.productRepository.findWithOffsetAndLimit(
        offset,
        limit,
        order,
        ["id", "image", "name", "price", "weight", "description"],
        whereOptions, 
        Category as IncludeOptions
      ),
      productCount = await this.productRepository.countAll();

    return {
      productEntries,
      productCount,
    };
  }

  // insert new product
  async insert(data: any): Promise<Product | null> {
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
  async isCategoryExistsById(categoryId: number){
    return await this.categoryService.isExistsById(categoryId)
  }
}
