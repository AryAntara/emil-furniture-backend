import { z } from "zod"
import { Validator } from "../../../utils/validator";
import { addressService } from "../../../providers";

const ADDRESS_NOT_FOUND = "Alamat tidak ditemukan."

const updateSchema = z.object({
    _user_id: z.number(),
    address_id: z.number(),
    title: z.string(), 
    description: z.string(), 
})

export const updateSchemaValidator = new Validator(updateSchema);

/**
 * check the address was in db
 */
async function validateAddressWasInDB(
    item: {
        address_id: number,
        _user_id: number
    }
): Promise<boolean> {
    return await addressService.isExistsById(item.address_id, item._user_id)
}

updateSchemaValidator.setARefineHandler({
    handle: validateAddressWasInDB, 
    message: ADDRESS_NOT_FOUND + ":param_address_id"
})
