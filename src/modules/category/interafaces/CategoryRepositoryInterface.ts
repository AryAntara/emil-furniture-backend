import { Category } from "../../../models/Category";

export interface CategoryRepositoryInterface {
  insert(data: any): Promise<Category | null>;
}
