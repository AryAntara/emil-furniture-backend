import { Op } from "sequelize";
import { Address } from "../../models/Address";
import { AddressRepository } from "./AddressRepository";
import { AddressServiceInterface } from "./interfaces/AddressServiceInterface";

export class AddressService implements AddressServiceInterface {
  constructor(private addressRepository: AddressRepository) {}

  static LIMIT_ADDRESS_COUNT = 3;

  // insert address
  async insert(data: any): Promise<Address | null> {
    data.isActived = data.is_actived; // mapping data
    delete data.is_activated;

    return await this.addressRepository.insert(data);
  }

  // check limit of addresses
  async isLimitReached(userId: number): Promise<boolean> {
    return (
      (await this.addressRepository.countBy({
        userId,
      })) > AddressService.LIMIT_ADDRESS_COUNT
    );
  }

  // find address by given user id
  async findByUserId(userId: number): Promise<Address[]> {
    return await this.addressRepository.find({ id: userId }, [
      "title",
      "description",
      "isActived",
      "id",
    ]);
  }

  // check address was exist or not by given address id
  async isExistsById(addressId: number, userId?: number): Promise<boolean> {
    if (userId)
      return await this.addressRepository.isExists({
        id: addressId,
        userId: userId,
      });

    return await this.addressRepository.isExists({ id: addressId });
  }

  // update address by given address id
  async updateById(addressId: number, data: any): Promise<boolean> {
    if (data.is_actived) {
      data.isActived = data.is_actived; // mapping data
      delete data.is_actived;
    }

    return await this.addressRepository.update({ id: addressId }, data);
  }

  // delete address by given address id
  async deleteById(addressId: number): Promise<boolean> {
    return await this.addressRepository.delete({ id: addressId });
  }

  // update an address to be actived
  async activeAddress(addressId: number): Promise<boolean> {
    // update actived of other address to no
    await this.addressRepository.update(
      {
        id: { [Op.ne]: addressId },
      },
      { isActived: "no" }
    );

    // update actived of current address to yes
    return await this.addressRepository.update(
      { id: addressId },
      {
        isActived: "yes",
      }
    );
  }
}
