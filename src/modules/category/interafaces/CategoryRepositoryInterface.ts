import { Category } from "../../../models/Category";
import { Order, WhereOptions } from "sequelize";

export interface CategoryRepositoryInterface {
    insert(data: any): Promise<Category|null>
}