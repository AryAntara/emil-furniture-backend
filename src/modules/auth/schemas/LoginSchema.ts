import { RefinementCtx, ZodNumber, ZodObject, ZodString, boolean, z } from "zod";
import { Validator } from "../../../utils/validator";
import { authService } from "../../../providers";
import { logger } from "../../../log";

const STRING_ERROR = "Harus diisi.",
    EMAIL_ERROR_NOT_VALID = "Email tidak valid.",
    EMAIL_ERROR_NOT_VERIFIED = "Email belum terverikasi.",
    PASSWORD_ERROR_NOT_VALID = "Password salah."

type LoginPayload = ZodObject<{
    email: ZodString,
    password: ZodString,
}>

const loginSchema: LoginPayload = z.object({
    email: z.string({ message: STRING_ERROR }).email({ message: EMAIL_ERROR_NOT_VALID }),
    password: z.string(),
})

export const loginSchemaValidator = new Validator(loginSchema);


/**
 * Is email in db 
 */
async function validateEmailWasInDB(item: {
    email: string
}): Promise<boolean> {
    return await authService.findUserByEmail(item.email);
}

loginSchemaValidator.setARefineHandler({
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

loginSchemaValidator.setARefineHandler({
    handle: validateVerifiedEmail,
    message: EMAIL_ERROR_NOT_VERIFIED+":email"
})

/**
 * Verified password 
 */
async function validatePassword(item: {
    email: string,
    password: string
}): Promise<boolean> {
    return await authService.checkUserPassword(item.email, item.password)
}

loginSchemaValidator.setARefineHandler({
    handle: validatePassword,
    message: PASSWORD_ERROR_NOT_VALID+":password"
})