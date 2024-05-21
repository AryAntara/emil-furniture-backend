import { z } from "zod";
import {
  MUST_A_NUMBER_ERROR,
  PRICE_NOT_A_NUMBER_ERROR,
  PRODUCT_NOT_FOUND_ERROR,
  REQUIRE_ERROR,
  WEIGHT_NOT_A_NUMBER_ERROR,
  CATEGORY_NOT_FOUND,
} from "./constants";
import { Validator } from "../../../utils/validator";
import { productService } from "../../../providers";

const updateSchema = z.object({
  param_product_id: z.number({ message: MUST_A_NUMBER_ERROR }),
  name: z.string({ message: REQUIRE_ERROR }),
  price: z.string({ message: REQUIRE_ERROR }),
  description: z.string({ message: REQUIRE_ERROR }),
  weight: z.string({ message: REQUIRE_ERROR }),
  "category_id[]": z
    .array(z.string(), { message: REQUIRE_ERROR })
    .or(z.string()),
});

export const updateSchemaValidator = new Validator(updateSchema);

/**
 * product must in db
 */
async function validatePorductInDB(item: { param_product_id: number }) {
  return await productService.isExistsById(item.param_product_id);
}
updateSchemaValidator.setARefineHandler({
  handle: validatePorductInDB,
  message: PRODUCT_NOT_FOUND_ERROR + ":param_product_id",
});

/**
 * Price must be integer
 */
async function validatePriceWasNumber(item: { price: string }) {
  return !isNaN(parseInt(item.price));
}
updateSchemaValidator.setARefineHandler({
  handle: validatePriceWasNumber,
  message: PRICE_NOT_A_NUMBER_ERROR + ":price",
});

/**
 * Weight must be integer
 */
async function validateWeightWasNumber(item: { weight: string }) {
  return !isNaN(parseInt(item.weight));
}
updateSchemaValidator.setARefineHandler({
  handle: validateWeightWasNumber,
  message: WEIGHT_NOT_A_NUMBER_ERROR + ":weight",
});

/**
 * Category must be in db
 */
async function validateCategoryInDB(item: {
  "category_id[]": string[] | string;
}) {
  const categories = item["category_id[]"];
  if (categories instanceof Array) {
    for (const category of categories) {
      if (!(await productService.isCategoryExistsById(parseInt(category))))
        return false;
    }

    return true;
  }
  return await productService.isCategoryExistsById(parseInt(categories));
}
updateSchemaValidator.setARefineHandler({
  handle: validateCategoryInDB,
  message: CATEGORY_NOT_FOUND + ":categories[]",
});
