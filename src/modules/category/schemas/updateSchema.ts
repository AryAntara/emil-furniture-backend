import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { categoryService } from "../../../providers";
import { CATEGORY_NOT_FOUND, MUST_NUMBER_ERROR, REQUIRE_ERROR } from "./constants";

const updateSchema = z.object({
  category_id: z.number({message: MUST_NUMBER_ERROR}),
  name: z.string({message: REQUIRE_ERROR}),
});

export const updateSchemaValidator = new Validator(updateSchema);

/**
 * Category was exist on db
 */
async function validateCategoryWasInDB(item: { category_id: number }) {
  return await categoryService.isExistsById(item.category_id);
}
updateSchemaValidator.setARefineHandler({
  handle: validateCategoryWasInDB,
  message: CATEGORY_NOT_FOUND + ":param_category_id",
});
