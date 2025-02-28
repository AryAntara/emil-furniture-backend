import {
  Attributes,
  IncludeOptions,
  ModelStatic,
  Order,
  Transaction,
  WhereOptions,
  where,
} from "sequelize";
import { BaseRepositoryInterface } from "./interfaces/BaseRepositoryInterface";
import { logger } from "../../log";
import { AllowedModels } from "./types/AllowedModels";
import { Hooks } from "sequelize/types/hooks";

export abstract class BaseRepository implements BaseRepositoryInterface {
  model?: ModelStatic<AllowedModels>;
  transaction?: Transaction;
  constructor() {}

  setTransaction(transaction: Transaction): void {
    this.transaction = transaction;
  }
  
  unsetTransaction() {
    this.transaction = undefined;
  }

  async sum(
    field: string,
    whereOptions?: WhereOptions,
    selectAttributes?: Attributes<AllowedModels | Hooks>
  ): Promise<number> {
    try {
      return (
        this.model?.sum(field, {
          where: whereOptions,
          transaction: this.transaction,
        }) ?? 0
      );
    } catch (e) {
      console.log(e);
      logger.error(e);
      return 0;
    }
  }

  // update data by a condition
  async update(whereOptions: WhereOptions, data: any): Promise<boolean> {
    try {
      await this.model?.update(data, {
        where: whereOptions,
        transaction: this.transaction,
      });
      return true;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  // count of entries
  async countAll() {
    try {
      return (await this.model?.count()) ?? 0;
    } catch (e) {
      logger.error(e);
      return 0;
    }
  }

  // find entries with offset and limit
  async findWithOffsetAndLimit(
    offset: number,
    limit: number,
    order: Order,
    selectAttributes?: Attributes<AllowedModels | Hooks>,
    whereOptions?: WhereOptions,
    relations?: IncludeOptions | IncludeOptions[]
  ): Promise<Array<AllowedModels>> {
    try {
      return (
        (await this.model?.findAll({
          limit,
          offset,
          attributes: selectAttributes,
          order,
          where: whereOptions,
          include: relations,
          transaction: this.transaction,
        })) ?? []
      );
    } catch (e) {
      console.log(e);
      logger.error(e);
      return [];
    }
  }

  // count data by given condition
  async countBy(
    whereOptions?: WhereOptions | null,
    relations?: IncludeOptions[] | IncludeOptions
  ): Promise<number> {
    try {
      if (!whereOptions) whereOptions = undefined;
      return (
        (
          await this.model?.findAndCountAll({
            where: whereOptions,
            include: relations,
            distinct: true,
            transaction: this.transaction,
          })
        )?.count ?? 0
      );
    } catch (e) {
      console.log(e);
      logger.error(e);
      return 0;
    }
  }

  // check is exist
  async isExists(whereOptions: WhereOptions): Promise<boolean> {
    return (await this.countBy(whereOptions)) > 0;
  }

  // delete data by a condition
  async delete(whereOptions: WhereOptions): Promise<boolean> {
    try {
      await this.model?.destroy({
        where: whereOptions,
        transaction: this.transaction,
      });
      return true;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  // find entries
  async find(
    whereOptions: WhereOptions,
    selectAttributes?: string[] | undefined,
    order?: Order,
    limit?: number,
    relations?: IncludeOptions
  ): Promise<AllowedModels[]> {
    try {
      return (
        (await this.model?.findAll({
          where: whereOptions,
          attributes: selectAttributes,
          order,
          include: relations,
          transaction: this.transaction,
        })) ?? []
      );
    } catch (e) {
      console.log(e);
      logger.error(e);
      return [];
    }
  }

  // find one item
  async findOne(
    whereOptions: WhereOptions,
    selectAttributes?: Array<string> | null,
    order?: Order | null,
    relations?: IncludeOptions[] | IncludeOptions
  ) {
    try {
      if (!selectAttributes) selectAttributes = undefined;
      if (!order) order = undefined;

      return (
        (await this.model?.findOne({
          where: whereOptions,
          attributes: selectAttributes,
          order,
          include: relations,
          transaction: this.transaction,
        })) ?? null
      );
    } catch (e) {      
      logger.error(e);
      return null;
    }
  }
}
