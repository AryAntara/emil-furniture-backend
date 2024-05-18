import { z } from "zod"
import { Validator } from "../../../utils/validator";
import { addressService } from "../../../providers";

const ADDRESS_NOT_FOUND = "Alamat tidak ditemukan."

const deleteSchema = z.object({
    address_id: z.number(),
    _user_id: z.number()
})

export const deleteSchemaValidator = new Validator(deleteSchema);

/**
 * check the address was in db
 */
async function validateAddressWasInDB(
    item: {
        address_id: number
        _user_id: number
    }
): Promise<boolean> {
    return await addressService.isExistsById(item.address_id, item._user_id)
}

deleteSchemaValidator.setARefineHandler({
    handle: validateAddressWasInDB, 
    message: ADDRESS_NOT_FOUND + ":param_address_id"
})
