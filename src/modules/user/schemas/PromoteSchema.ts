import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { userService } from "../../../providers";
import { REQUIRE_ERROR, USER_ID_ERROR_NOT_IN_DB } from "./constans";

const promoteSchema = z.object({
  userId: z.string({ message: REQUIRE_ERROR }),
});

export const promoteSchemaValidator = new Validator(promoteSchema);

/**
 * Is user in db
 */
async function validateEmailWasInDB(item: {
  userId: string;
}): Promise<boolean> {
  const userId = parseInt(item.userId);
  return await userService.isExistsById(userId);
}

promoteSchemaValidator.setARefineHandler({
  handle: validateEmailWasInDB,
  message: USER_ID_ERROR_NOT_IN_DB + ":userId",
});
