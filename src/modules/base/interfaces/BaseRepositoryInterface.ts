import { IncludeOptions, Order, Transaction, WhereOptions } from "sequelize";
import { AllowedModels } from "../types/AllowedModels";

export interface BaseRepositoryInterface {
  setTransaction(transaction: Transaction): void;
  sum(field: string, whereOptions?: WhereOptions): Promise<number>;
  countAll(): Promise<number>;
  findWithOffsetAndLimit(
    offset: number,
    limit: number,
    order: Order,
    selectAttributes?: Array<string>,
    whereOptions?: WhereOptions,
    relations?: IncludeOptions
  ): Promise<Array<AllowedModels>>;
  isExists(whereOptions: WhereOptions): Promise<boolean>;
  countBy(
    whereOptions?: WhereOptions | null,
    relations?: IncludeOptions
  ): Promise<number>;
  update(whereOptions: WhereOptions, data: any): Promise<boolean>;
  delete(whereOptions: WhereOptions): Promise<boolean>;
  find(
    whereOptions: WhereOptions,
    selectAttributes?: Array<string>,
    order?: Order,
    limit?: number,
    relations?: IncludeOptions
  ): Promise<Array<AllowedModels>>;
  findOne(
    whereOptions: WhereOptions,
    selectAttributes: Array<string>,
    order?: Order | null,
    relations?: IncludeOptions[] | IncludeOptions,
    transaction?: Transaction
  ): Promise<AllowedModels | null>;
}
