import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { productService } from "../../../providers";
import {
  MUST_A_NUMBER_ERROR,
  PRODUCT_NOT_FOUND_ERROR,
  QTY_IS_ZERO_ERROR,
} from "./constants";

const removeItemSchema = z.object({
  product_id: z.number({ message: MUST_A_NUMBER_ERROR }),
  qty: z
    .number({ message: MUST_A_NUMBER_ERROR })
    .min(1, { message: QTY_IS_ZERO_ERROR }),
});

export const removeItemSchemaValidator = new Validator(removeItemSchema);

/**
 * product must in db
 */
async function validatePorductInDB(item: { product_id: number }) {
  return await productService.isExistsById(item.product_id);
}
removeItemSchemaValidator.setARefineHandler({
  handle: validatePorductInDB,
  message: PRODUCT_NOT_FOUND_ERROR + ":product_id",
});
