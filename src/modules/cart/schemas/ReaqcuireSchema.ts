import { z } from "zod";
import { Validator } from "../../../utils/validator";
import {
  cartDetailService,
  productService,
  stockService,
} from "../../../providers";
import { MUST_A_NUMBER_ERROR, PRODUCT_NOT_FOUND_ERROR } from "./constants";

const addItemSchema = z.object({
  product_id: z.number({ message: MUST_A_NUMBER_ERROR }),
});

export const addItemSchemaValidator = new Validator(addItemSchema);

/**
 * product must in cart
 */
async function validatePorductInDB(item: { product_id: number }) {
  return await productService.isExistsById(item.product_id);
}
addItemSchemaValidator.setARefineHandler({
  handle: validatePorductInDB,
  message: PRODUCT_NOT_FOUND_ERROR + ":product_id",
});
