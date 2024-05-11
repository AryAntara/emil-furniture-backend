import { RefinementCtx, ZodNumber, ZodObject, ZodString, boolean, z } from "zod";
import { Validator } from "../../../utils/validator";
import { authService } from "../../../providers";

const STRING_ERROR = "Harus diisi.",
    PASSWORD_ERROR_NOT_SAME = "Password tidak sama dengan Confirm Password"

type ResetPasswordPayload = ZodObject<{
    password: ZodString,
    confirm_password: ZodString
}>

const resetPasswordSchema: ResetPasswordPayload = z.object({
    password: z.string({message: STRING_ERROR}),
    confirm_password: z.string({message: STRING_ERROR})
})

export const resetPasswordSchemaValidator = new Validator(resetPasswordSchema);

/**
 * The confirm password must be same as password 
 */
async function ValidatePasswordMustBeSameAsConfirmPassowrd(item: {
    confirm_password: string,
    password: string
}): Promise<boolean> {
    return item.password === item.confirm_password;
}
resetPasswordSchemaValidator.setARefineHandler({
    handle: ValidatePasswordMustBeSameAsConfirmPassowrd,
    message: PASSWORD_ERROR_NOT_SAME+":password"
});


