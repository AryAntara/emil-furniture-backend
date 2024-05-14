import { ZodObject, ZodString, z } from "zod";
import { Validator } from "../../../utils/validator";
import { userService } from "../../../providers";


const STRING_ERROR = "Harus diisi.",
    USER_ID_ERROR_NOT_IN_DB = "User dengan id tersebut tidak dapat ditemukan.",   
    PHONE_NUMBER_ERROR_MUST_BE_NUMERIC = "No HP harus berupa angka.",
    PHONE_NUMBER_ERROR_MAX_12_DIGIT = "No HP tidak boleh lebih dari 14 digit.",   
    FULLNAME_ERROR_NOT_VALID = "Nama lengkap harus lebih dari 3 huruf",
    PASSWORD_ERROR_NOT_SAME = "Password tidak sama dengan Confirm Password"

type UpdateSchema = ZodObject<{
    userId: ZodString,    
    fullname: ZodString,
    phone_number: ZodString,
    password: ZodString,
    confirm_password: ZodString
}>

const updateSchema: UpdateSchema = z.object({
    userId: z.string({ message: STRING_ERROR }),   
    fullname: z.string({ message: STRING_ERROR }).min(3, { message: FULLNAME_ERROR_NOT_VALID }),
    phone_number: z.string({ message: STRING_ERROR }).max(14, { message: PHONE_NUMBER_ERROR_MAX_12_DIGIT }),
    password: z.string({ message: STRING_ERROR }),
    confirm_password: z.string({ message: STRING_ERROR })
})

export const updateSchemaValidator = new Validator(updateSchema);


/**
 * Is user in db 
 */
async function validateEmailWasInDB(item: {
    userId: string
}): Promise<boolean> {
    const userId = parseInt(item.userId);
    return await userService.searchById(userId)
}

updateSchemaValidator.setARefineHandler({
    handle: validateEmailWasInDB,
    message: USER_ID_ERROR_NOT_IN_DB+":userId"
})


/**
 * The confirm password must be same as password 
 */
async function ValidatePasswordMustBeSameAsConfirmPassowrd(item: {
    confirm_password: string,
    password: string
}): Promise<boolean> {
    return item.password === item.confirm_password;
}
updateSchemaValidator.setARefineHandler({
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
updateSchemaValidator.setARefineHandler({
    handle: validatePhoneNumber,
    message: PHONE_NUMBER_ERROR_MUST_BE_NUMERIC+":phone_number"
});
