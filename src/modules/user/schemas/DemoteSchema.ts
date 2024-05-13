import { RefinementCtx, ZodNumber, ZodObject, ZodString, boolean, z } from "zod";
import { Validator } from "../../../utils/validator";
import { userService } from "../../../providers";
import { logger } from "../../../log";


const STRING_ERROR = "Harus diisi.",
    USER_ID_ERROR_NOT_IN_DB = "User dengan id tersebut tidak dapat ditemukan.";

type DemoteSchema = ZodObject<{
    userId: ZodString,
}>

const demoteSchema: DemoteSchema = z.object({
    userId: z.string({ message: STRING_ERROR }),
})

export const demoteSchemaValidator = new Validator(demoteSchema);


/**
 * Is user in db 
 */
async function validateEmailWasInDB(item: {
    userId: string
}): Promise<boolean> {
    const userId = parseInt(item.userId);
    return await userService.searchById(userId)
}

demoteSchemaValidator.setARefineHandler({
    handle: validateEmailWasInDB,
    message: USER_ID_ERROR_NOT_IN_DB+":userId"
})


