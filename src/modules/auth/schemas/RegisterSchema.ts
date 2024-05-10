import { RefinementCtx, ZodNumber, ZodObject, ZodString, boolean, z } from "zod";
import { Validator } from "../../../utils/validator";
import { authService } from "../../../providers";

const STRING_ERROR = "Harus diisi.",
    PHONE_NUMBER_ERROR_MUST_BE_NUMERIC = "No HP harus berupa angka.",
    PHONE_NUMBER_ERROR_MAX_12_DIGIT = "No HP tidak boleh lebih dari 14 digit.",
    EMAIL_ERROR_NOT_VALID = "Email tidak valid.",
    EMAIL_ERROR_USED = "Email Sudah digunakan",
    FULLNAME_ERROR_NOT_VALID = "Nama lengkap harus lebih dari 3 huruf",
    PASSWORD_ERROR_NOT_SAME = "Password tidak sama dengan Confirm Password"

type RegisterPayload = ZodObject<{
    email: ZodString,
    fullname: ZodString,
    phone_number: ZodString,
    password: ZodString,
    confirm_password: ZodString
}>

const registerSchema: RegisterPayload = z.object({
    email: z.string({ message: STRING_ERROR }).email({ message: EMAIL_ERROR_NOT_VALID }),
    fullname: z.string({ message: STRING_ERROR }).min(3, { message: FULLNAME_ERROR_NOT_VALID }),
    phone_number: z.string().max(14, { message: PHONE_NUMBER_ERROR_MAX_12_DIGIT }),
    password: z.string(),
    confirm_password: z.string()
})

export const registerSchemaValidator = new Validator(registerSchema);

/**
 * The confirm password must be same as password 
 */
async function ValidatePasswordMustBeSameAsConfirmPassowrd(item: {
    confirm_password: string,
    password: string
}): Promise<boolean> {
    return item.password === item.confirm_password;
}
registerSchemaValidator.setARefineHandler({
    handle: ValidatePasswordMustBeSameAsConfirmPassowrd,
    message: PASSWORD_ERROR_NOT_SAME+":password"
});

/**
 * The Phone number must be a number
 */
async function validatePhoneNumber(item: {
    phone_number: string
}): Promise<boolean> {
    return !isNaN(parseInt(item.phone_number));
}
registerSchemaValidator.setARefineHandler({
    handle: validatePhoneNumber,
    message: PHONE_NUMBER_ERROR_MUST_BE_NUMERIC+":phone_number"
});

/**  
 * Email Was used
 */
async function validateUniqueEmail(item: {
    email: string
}): Promise<boolean> {
    return !await authService.findUserByEmail(item.email);
}
registerSchemaValidator.setARefineHandler({
    handle: validateUniqueEmail,
    message: EMAIL_ERROR_USED+":email"
})