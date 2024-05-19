import { Category } from "../../../models/Category";

export interface CategoryServiceInterface {
  insert(data: any): Promise<Category | null>;
  findWithPage(
    page: number,
    limit: number,
    orderColumn: string,
    orderType: string
  ): Promise<{ categoryEntries: Array<Category>; categoryCount: number }>;
  isExistsById(categoryId: number): Promise<boolean>;
  updateById(categoryId: number, data: any): Promise<boolean>;
  deleteById(categoryId: number): Promise<boolean>;
}
