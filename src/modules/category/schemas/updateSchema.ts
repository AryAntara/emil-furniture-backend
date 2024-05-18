import { z } from "zod"
import { Validator } from "../../../utils/validator";
import { categoryService } from "../../../providers";

const CATEGORY_NOT_FOUND = "Kategori tidak ditemukan."

const updateSchema = z.object({
    category_id: z.number(),
    name: z.string(), 
})

export const updateSchemaValidator = new Validator(updateSchema);

/**
 * Category was exist on db
 */
async function validateCategoryWasInDB(item: {
    category_id: number
}){
    return await categoryService.isExistsById(item.category_id);
}
updateSchemaValidator.setARefineHandler({
    handle: validateCategoryWasInDB, 
    message: CATEGORY_NOT_FOUND+":param_category_id"
})