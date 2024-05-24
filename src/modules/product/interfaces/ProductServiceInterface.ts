import { Product } from "../../../models/Product";

export interface ProductServiceInterface {
  findWithPage(
    page: number,
    limit: number,
    orderColumn: string,
    orderType: string,
    filter: {
      description?: string;
      name?: string;
    }
  ): Promise<{ productEntries: Array<Product>; productCount: number }>;
  insert(data: any): Promise<Product | null>;
  saveImage(file: Blob): Promise<string | null>;
  isExistsById(productId: number): Promise<boolean>;
  updateById(productId: number, data: any): Promise<boolean>;
  deleteById(productId: number): Promise<boolean>;
  isCategoryExistsById(categoryId: number): Promise<boolean>;
  findOneById(productId: number): Promise<Product | null>;
}
