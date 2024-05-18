import { ModelStatic, Order, WhereOptions } from "sequelize";
import { BaseRepositoryInterface } from "./interfaces/BaseRepositoryInterface";
import { Address } from "../../models/Address";
import { User } from "../../models/User";
import { Category } from "../../models/Category";
import { logger } from "../../log";
import { AllowedModels } from "./types/AllowedModels";

export abstract class BaseRepository implements BaseRepositoryInterface {
    model?: ModelStatic<AllowedModels>
    constructor() { }

    // update data by a condition
    async update(whereOptions: WhereOptions, data: any): Promise<boolean> {
        try {
            await this.model?.update(data, { where: whereOptions })
            return true;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    // count of entries
    async countAll() {
        try {
            return await this.model?.count() ?? 0;
        } catch (e) {
            logger.error(e)
            return 0
        }
    }

    // find entries with offset and limit 
    async findWithOffsetAndLimit(offset: number, limit: number, order: Order, selectAttributes?: Array<string>): Promise<Array<AllowedModels>> {
        try {
            return await this.model?.findAll({
                limit,
                offset,
                attributes: selectAttributes,
                order
            }) ?? []
        } catch (e) {
            logger.error(e)
            return []
        }
    }


    // count data by given condition
    async countBy(whereOptions: WhereOptions): Promise<number> {
        try {
            return await this.model?.count({
                where: whereOptions
            }) ?? 0
        } catch (e) {
            logger.error(e);
            return 0
        }
    }

    // check is exist
    async isExists(whereOptions: WhereOptions): Promise<boolean> {
        return await this.countBy(whereOptions) > 0;
    }

    // delete data by a condition
    async delete(whereOptions: WhereOptions): Promise<boolean> {
        try {
            await this.model?.destroy({
                where: whereOptions
            });
            return true;
        } catch (e) {
            logger.error(e);
            return false; 
        }
    }
}