import { z } from "zod";
import {
  MUST_A_NUMBER_ERROR,  
  PRODUCT_NOT_FOUND_ERROR,
} from "./constants";
import { Validator } from "../../../utils/validator";
import { productService } from "../../../providers";

const detailSchema = z.object({
  param_product_id: z.number({message: MUST_A_NUMBER_ERROR}),
});

export const detailSchemaValidator = new Validator(detailSchema);

/**
 * product must in db
 */
async function validatePorductInDB(item: { param_product_id: number }) {
  return await productService.isExistsById(item.param_product_id);
}
detailSchemaValidator.setARefineHandler({
  handle: validatePorductInDB,
  message: PRODUCT_NOT_FOUND_ERROR + ":param_product_id",
});
