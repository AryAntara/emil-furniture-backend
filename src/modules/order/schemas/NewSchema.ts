import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { cartService } from "../../../providers";
import { MUST_NUMBER_ERROR, CART_NOT_FOUND_ERROR } from "./constants";

const newSchema = z.object({
  cart_id: z.number({ message: MUST_NUMBER_ERROR }),
});

export const newSchemaValidator = new Validator(newSchema);

/**
 * Cart was exist on db
 */
async function validateOrderWasInDB(item: { cart_id: number }) {
  return await cartService.isExistsById(item.cart_id);
}
newSchemaValidator.setARefineHandler({
  handle: validateOrderWasInDB,
  message: CART_NOT_FOUND_ERROR + ":cart_id",
});
