import { WhereOptions } from "sequelize";
import { Product } from "../../../models/Product";

export interface ProductRepositoryInterface {
    insert(data: any): Promise<Product|null>
    update(whereOptions: WhereOptions, data: any):  Promise<boolean>
}