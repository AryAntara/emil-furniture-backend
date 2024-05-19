import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { REQUIRE_ERROR, PASSWORD_ERROR_NOT_SAME } from "./constants";

const resetPasswordSchema = z.object({
  password: z.string({ message: REQUIRE_ERROR }),
  confirm_password: z.string({ message: REQUIRE_ERROR }),
});

export const resetPasswordSchemaValidator = new Validator(resetPasswordSchema);

/**
 * The confirm password must be same as password
 */
async function ValidatePasswordMustBeSameAsConfirmPassowrd(item: {
  confirm_password: string;
  password: string;
}): Promise<boolean> {
  return item.password === item.confirm_password;
}
resetPasswordSchemaValidator.setARefineHandler({
  handle: ValidatePasswordMustBeSameAsConfirmPassowrd,
  message: PASSWORD_ERROR_NOT_SAME + ":password",
});
