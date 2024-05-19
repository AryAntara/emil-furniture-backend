import { ZodNumber, ZodObject, ZodString, z } from "zod";
import { Validator } from "../../../utils/validator";
import { authService } from "../../../providers";
import {
  REQUIRE_ERROR,
  PHONE_NUMBER_ERROR_MUST_BE_NUMERIC,
  PHONE_NUMBER_ERROR_MAX_12_DIGIT,
  EMAIL_ERROR_NOT_VALID,
  EMAIL_ERROR_USED,
  FULLNAME_ERROR_NOT_VALID,
  PASSWORD_ERROR_NOT_SAME,
  NUMBER_NEEDED_ERROR,
} from "./constants";

const registerSchema = z.object({
  email: z
    .string({ message: REQUIRE_ERROR })
    .email({ message: EMAIL_ERROR_NOT_VALID }),
  fullname: z
    .string({ message: REQUIRE_ERROR })
    .min(3, { message: FULLNAME_ERROR_NOT_VALID }),
  phone_number: z
    .number({ message: NUMBER_NEEDED_ERROR })
    .max(999999999999, { message: PHONE_NUMBER_ERROR_MAX_12_DIGIT }),
  password: z.string({ message: REQUIRE_ERROR }),
  confirm_password: z.string({ message: REQUIRE_ERROR }),
});

export const registerSchemaValidator = new Validator(registerSchema);

/**
 * The confirm password must be same as password
 */
async function ValidatePasswordMustBeSameAsConfirmPassowrd(item: {
  confirm_password: string;
  password: string;
}): Promise<boolean> {
  return item.password === item.confirm_password;
}
registerSchemaValidator.setARefineHandler({
  handle: ValidatePasswordMustBeSameAsConfirmPassowrd,
  message: PASSWORD_ERROR_NOT_SAME + ":password",
});

/**
 * The Phone number must be a number
 */
async function validatePhoneNumber(item: {
  phone_number: string;
}): Promise<boolean> {
  return !isNaN(parseInt(item.phone_number));
}
registerSchemaValidator.setARefineHandler({
  handle: validatePhoneNumber,
  message: PHONE_NUMBER_ERROR_MUST_BE_NUMERIC + ":phone_number",
});

/**
 * Email Was used
 */
async function validateUniqueEmail(item: { email: string }): Promise<boolean> {
  return !(await authService.findUserByEmail(item.email));
}
registerSchemaValidator.setARefineHandler({
  handle: validateUniqueEmail,
  message: EMAIL_ERROR_USED + ":email",
});
