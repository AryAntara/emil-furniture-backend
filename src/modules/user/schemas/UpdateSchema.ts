import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { userService } from "../../../providers";
import {
  REQUIRE_ERROR,
  USER_ID_ERROR_NOT_IN_DB,
  PHONE_NUMBER_ERROR_MUST_BE_NUMERIC,
  PHONE_NUMBER_ERROR_MAX_12_DIGIT,
  FULLNAME_ERROR_NOT_VALID,
  PASSWORD_ERROR_NOT_SAME,
} from "./constans";

const updateSchema = z.object({
  userId: z.string({ message: REQUIRE_ERROR }),
  fullname: z
    .string({ message: REQUIRE_ERROR })
    .min(3, { message: FULLNAME_ERROR_NOT_VALID }),
  phone_number: z
    .string({ message: REQUIRE_ERROR })
    .max(14, { message: PHONE_NUMBER_ERROR_MAX_12_DIGIT }),
  password: z.string({ message: REQUIRE_ERROR }),
  confirm_password: z.string({ message: REQUIRE_ERROR }),
});

export const updateSchemaValidator = new Validator(updateSchema);

/**
 * Is user in db
 */
async function validateEmailWasInDB(item: {
  userId: string;
}): Promise<boolean> {
  const userId = parseInt(item.userId);
  return await userService.isExistsById(userId);
}

updateSchemaValidator.setARefineHandler({
  handle: validateEmailWasInDB,
  message: USER_ID_ERROR_NOT_IN_DB + ":userId",
});

/**
 * The confirm password must be same as password
 */
async function ValidatePasswordMustBeSameAsConfirmPassowrd(item: {
  confirm_password: string;
  password: string;
}): Promise<boolean> {
  return item.password === item.confirm_password;
}
updateSchemaValidator.setARefineHandler({
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
updateSchemaValidator.setARefineHandler({
  handle: validatePhoneNumber,
  message: PHONE_NUMBER_ERROR_MUST_BE_NUMERIC + ":phone_number",
});
