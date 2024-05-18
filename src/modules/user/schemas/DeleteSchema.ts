import { ZodObject, ZodString, z } from "zod";
import { Validator } from "../../../utils/validator";
import { userService } from "../../../providers";


const STRING_ERROR = "Harus diisi.",
    USER_ID_ERROR_NOT_IN_DB = "User dengan id tersebut tidak dapat ditemukan.";

type DeleteSchema = ZodObject<{
    userId: ZodString,
}>

const deleteSchema: DeleteSchema = z.object({
    userId: z.string({ message: STRING_ERROR }),
})

export const deleteSchemaValidator = new Validator(deleteSchema);


/**
 * Is user in db 
 */
async function validateUserIdWasInDB(item: {
    userId: string
}): Promise<boolean> {
    const userId = parseInt(item.userId);
    return await userService.searchById(userId)
}

deleteSchemaValidator.setARefineHandler({
    handle: validateUserIdWasInDB,
    message: USER_ID_ERROR_NOT_IN_DB+":userId"
})


