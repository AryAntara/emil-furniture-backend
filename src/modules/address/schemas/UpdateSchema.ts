import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { addressService } from "../../../providers";
import { ADDRESS_NOT_FOUND_ERROR, REQUIRE_ERROR } from "./constans";

const updateSchema = z.object({
  _user_id: z.number({ message: REQUIRE_ERROR }),
  address_id: z.number({ message: REQUIRE_ERROR }),
  title: z.string({ message: REQUIRE_ERROR }),
  description: z.string({ message: REQUIRE_ERROR }),
});

export const updateSchemaValidator = new Validator(updateSchema);

/**
 * check the address was in db
 */
async function validateAddressWasInDB(item: {
  address_id: number;
  _user_id: number;
}): Promise<boolean> {
  return await addressService.isExistsById(item.address_id, item._user_id);
}

updateSchemaValidator.setARefineHandler({
  handle: validateAddressWasInDB,
  message: ADDRESS_NOT_FOUND_ERROR + ":param_address_id",
});
