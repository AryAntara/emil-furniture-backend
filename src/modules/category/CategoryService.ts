import { Order } from "sequelize";
import { Category } from "../../models/Category";
import { CategoryRepository } from "./CategoryRepository";
import { CategoryServiceInterface } from "./interafaces/CategoryServiceInterface";
import { logger } from "../../log";

export class CategoryService implements CategoryServiceInterface {
  constructor(private categoryRepository: CategoryRepository) {}

  // insert category
  async insert(data: any): Promise<Category | null> {
    return await this.categoryRepository.insert(data);
  }

  // find cateogry entries based on given page, order and limit
  async findWithPage(
    page: number,
    limit: number,
    orderColumn: string,
    orderType: string
  ): Promise<{ categoryEntries: Array<Category>; categoryCount: number }> {
    const offset = (page - 1) * limit,
      order = [[orderColumn, orderType]] as Order,
      categoryEntries = await this.categoryRepository.findWithOffsetAndLimit(
        offset,
        limit,
        order,
        ["id", "name"]
      ),
      categoryCount = await this.categoryRepository.countAll();

    return {
      categoryEntries,
      categoryCount,
    };
  }

  // is record exist by given id
  async isExistsById(categoryId: number): Promise<boolean> {
    return this.categoryRepository.isExists({ id: categoryId });
  }

  // update category by given id
  async updateById(categoryId: number, data: any): Promise<boolean> {
    return await this.categoryRepository.update({ id: categoryId }, data);
  }

  async deleteById(categoryId: number): Promise<boolean> {
    return await this.categoryRepository.delete({ id: categoryId });
  }
}
