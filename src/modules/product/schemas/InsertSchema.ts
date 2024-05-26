import { z } from "zod";
import {
  FILE_SIZE_ERROR,
  PRICE_NOT_A_NUMBER_ERROR,
  REQUIRE_ERROR,
  WEIGHT_NOT_A_NUMBER_ERROR,
  CATEGORY_NOT_FOUND,
} from "./constants";
import { Validator } from "../../../utils/validator";
import { productService } from "../../../providers";

const maxFileSize = 500 * 1024;
const insertSchema = z.object({
  name: z.string({ message: REQUIRE_ERROR }),
  price: z.string({ message: REQUIRE_ERROR }),
  description: z.string({ message: REQUIRE_ERROR }),
  weight: z.string({ message: REQUIRE_ERROR }),
  file_size: z
    .number({ message: REQUIRE_ERROR })
    .max(maxFileSize, { message: FILE_SIZE_ERROR }),
  "category_id[]": z
    .array(z.string(), { message: REQUIRE_ERROR })
    .or(z.string({ message: REQUIRE_ERROR })),
});

export const insertSchemaValidator = new Validator(insertSchema);

/**
 * Price must be integer
 */
async function validatePriceWasNumber(item: { price: string }) {
  return !isNaN(parseInt(item.price));
}
insertSchemaValidator.setARefineHandler({
  handle: validatePriceWasNumber,
  message: PRICE_NOT_A_NUMBER_ERROR + ":price",
});

/**
 * Weight must be integer
 */
async function validateWeightWasNumber(item: { weight: string }) {
  return !isNaN(parseInt(item.weight));
}
insertSchemaValidator.setARefineHandler({
  handle: validateWeightWasNumber,
  message: WEIGHT_NOT_A_NUMBER_ERROR + ":weight",
});

/**
 * Category must be in db
 */
async function validateCategoryInDB(item: { "category_id[]": string[] }) {
  const categories = item["category_id[]"];
  console.log(categories);
  if (categories instanceof Array) {
    for (const category of categories) {
      if (!(await productService.isCategoryExistsById(parseInt(category))))
        return false;
    }

    return true;
  }
  return await productService.isCategoryExistsById(parseInt(categories));
}
insertSchemaValidator.setARefineHandler({
  handle: validateCategoryInDB,
  message: CATEGORY_NOT_FOUND + ":categories[]",
});
