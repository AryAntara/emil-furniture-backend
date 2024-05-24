import { z } from "zod";
import {
  MUST_A_NUMBER_ERROR,  
  PRODUCT_NOT_FOUND_ERROR,
} from "./constants";
import { Validator } from "../../../utils/validator";
import { stockService } from "../../../providers";

const updateSchema = z.object({
  product_id: z.number({ message: MUST_A_NUMBER_ERROR }),
  qty: z.number({ message: MUST_A_NUMBER_ERROR }),
});

export const updateSchemaValidator = new Validator(updateSchema);

/**
 * product must in db
 */
async function validatePorductInDB(item: { product_id: number }) {
  return await stockService.isProductExistsById(item.product_id);
}
updateSchemaValidator.setARefineHandler({
  handle: validatePorductInDB,
  message: PRODUCT_NOT_FOUND_ERROR + ":product_id",
});
