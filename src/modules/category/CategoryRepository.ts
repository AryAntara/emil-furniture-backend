import { logger } from "../../log";
import { Category } from "../../models/Category";
import { BaseRepository } from "../base/BaseRepository";
import { CategoryRepositoryInterface } from "./interafaces/CategoryRepositoryInterface";
import { Order, WhereOptions } from "sequelize";

export class CategoryRepository
  extends BaseRepository
  implements CategoryRepositoryInterface
{
  constructor() {
    super();
    this.model = Category;
  }

  // insert category
  async insert(data: any): Promise<Category | null> {
    try {
      const category = new Category();
      category.setDataValue("name", data.name);
      return await category.save();
    } catch (e) {
      console.log(e);
      logger.error(e);
      return null;
    }
  }

  // check exist by id
  async isExistsById(categoryId: number): Promise<boolean> {
    return await this.isExists({ id: categoryId });
  }

  // update by id
  async updateById(categoryId: number, data: any): Promise<boolean> {
    return this.update({ id: categoryId }, data);
  }

  // delete by id
  async deleteById(categoryId: number): Promise<boolean> {
    return this.delete({ id: categoryId });
  }
}
