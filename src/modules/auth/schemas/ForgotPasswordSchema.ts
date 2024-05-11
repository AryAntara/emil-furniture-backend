import { RefinementCtx, ZodNumber, ZodObject, ZodString, boolean, z } from "zod";
import { Validator } from "../../../utils/validator";
import { authService } from "../../../providers";
import { logger } from "../../../log";

const STRING_ERROR = "Harus diisi.",
    EMAIL_ERROR_NOT_VALID = "Email tidak valid.",
    EMAIL_ERROR_NOT_VERIFIED = "Email belum terverikasi.";

type ForgotPasswordPayload = ZodObject<{
    email: ZodString,
}>

const ForgotPasswordSchema: ForgotPasswordPayload = z.object({
    email: z.string({ message: STRING_ERROR }).email({ message: EMAIL_ERROR_NOT_VALID }),
})

export const ForgotPasswordSchemaValidator = new Validator(ForgotPasswordSchema);


/**
 * Is email in db 
 */
async function validateEmailWasInDB(item: {
    email: string
}): Promise<boolean> {
    return await authService.findUserByEmail(item.email);
}

ForgotPasswordSchemaValidator.setARefineHandler({
    handle: validateEmailWasInDB,
    message: EMAIL_ERROR_NOT_VALID+":email"
})

/**  
 * Email Was verified
 */
async function validateVerifiedEmail(item: {
    email: string
}): Promise<boolean> {
    return await authService.isUserVerified(item.email);
}

ForgotPasswordSchemaValidator.setARefineHandler({
    handle: validateVerifiedEmail,
    message: EMAIL_ERROR_NOT_VERIFIED+":email"
})
