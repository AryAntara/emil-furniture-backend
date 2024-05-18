import { z } from "zod"
import { Validator } from "../../../utils/validator";
import { categoryService } from "../../../providers";

const CATEGORY_NOT_FOUND = "Kategori tidak ditemukan."

const deleteSchema = z.object({
    category_id: z.number(),
})

export const deleteSchemaValidator = new Validator(deleteSchema);

/**
 * Category was exist on db
 */
async function validateCategoryWasInDB(item: {
    category_id: number
}){
    return await categoryService.isExistsById(item.category_id);
}
deleteSchemaValidator.setARefineHandler({
    handle: validateCategoryWasInDB, 
    message: CATEGORY_NOT_FOUND+":param_category_id"
})