import { Order, WhereOptions } from "sequelize";
import { AllowedModels } from "../types/AllowedModels";

export interface BaseRepositoryInterface {
  countAll(): Promise<number>;
  findWithOffsetAndLimit(
    offset: number,
    limit: number,
    order: Order,
    selectAttributes?: Array<string>
  ): Promise<Array<AllowedModels>>;
  isExists(whereOptions: WhereOptions): Promise<boolean>;
  countBy(whereOptions: WhereOptions): Promise<number>;
  update(whereOptions: WhereOptions, data: any): Promise<boolean>;
  delete(whereOptions: WhereOptions): Promise<boolean>;
  find(
    whereOptions: WhereOptions,
    selectAttributes?: Array<string>
  ): Promise<Array<AllowedModels>>;
  findOne(
    whereOptions: WhereOptions,
    selectAttributes: Array<string>
  ): Promise<AllowedModels | null>;
}
