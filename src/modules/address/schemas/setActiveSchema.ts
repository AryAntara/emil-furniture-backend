import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { addressService } from "../../../providers";
import { REQUIRE_ERROR, ADDRESS_NOT_FOUND_ERROR } from "./constans";

const setActiveSchema = z.object({
  address_id: z.number({message: REQUIRE_ERROR}),
  _user_id: z.number({message: REQUIRE_ERROR}),
});

export const setActiveSchemaValidator = new Validator(setActiveSchema);

/**
 * check the address was in db
 */
async function validateAddressWasInDB(item: {
  address_id: number;
  _user_id: number;
}): Promise<boolean> {
  return await addressService.isExistsById(item.address_id, item._user_id);
}

setActiveSchemaValidator.setARefineHandler({
  handle: validateAddressWasInDB,
  message: ADDRESS_NOT_FOUND_ERROR + ":param_address_id",
});
