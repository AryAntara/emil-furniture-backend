import { WhereOptions } from "sequelize";
import { logger } from "../../log";
import { Address } from "../../models/Address";
import { AddressRepositoryInterface } from "./interfaces/AddressRepositoryInterface";

export class AddressRepository implements AddressRepositoryInterface {
    constructor(private address: Address) { }

    // insert address
    async insert(data: any): Promise<Address | null> {
        try {
            this.address.setDataValue('userId', data.userId);
            this.address.setDataValue('title', data.title);
            this.address.setDataValue('description', data.description);
            this.address.setDataValue('isActived', data.isActived ?? "no")

            return await this.address.save();
        } catch (e) {
            logger.error(e)
            return null;
        }
    }

    // Count data base on a condition
    async countBy(whereOptions: WhereOptions): Promise<number> {
        try {
            return await Address.count({
                where: whereOptions
            })
        } catch (e) {
            logger.error(e);
            return 0
        }
    }

    // find entries
    async find(whereOptions: WhereOptions, selectAttributes?: string[] | undefined): Promise<Address[]> {
        try {
            return await Address.findAll({
                where: whereOptions,
                attributes: selectAttributes
            })
        } catch (e) {
            logger.error(e);
            return [];
        }
    }

    // find addresses by user id 
    async findByUserId(userId: number, selectAttributes?: string[] | undefined): Promise<Address[]> {
        return await this.find({ userId }, selectAttributes)
    }

    // is record was exist by a condition
    async isExists(whereOptions: WhereOptions): Promise<boolean> {
        return await this.countBy(whereOptions) > 0;
    }

    // is record was exist by given address id
    async isExistsById(addressId: number): Promise<boolean> {
        return await this.isExists({ id: addressId });
    }

    // update data by a condition
    async update(whereOptions: WhereOptions, data: any): Promise<boolean> {
        try {
            await Address.update(data, { where: whereOptions })
            return true;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }

    // update data by given addressId
    async updateById(addressId: number, data: any): Promise<boolean> {
        return await this.update({ id: addressId }, data);
    }

    // delete data by a condition
    async delete(whereOptions: WhereOptions): Promise<boolean> {
        try {
            await Address.destroy({
                where: whereOptions
            });
            return true;
        } catch (e) {
            logger.error(e);
            return false; 
        }
    }

    // delete data by given id
    async deleteById(addressId: number): Promise<boolean> {
        return await this.delete({id: addressId})
    }
}