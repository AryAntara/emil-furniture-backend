import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { userService } from "../../../providers";
import { REQUIRE_ERROR, USER_ID_ERROR_NOT_IN_DB } from "./constans";

const deleteSchema = z.object({
  userId: z.string({ message: REQUIRE_ERROR }),
});

export const deleteSchemaValidator = new Validator(deleteSchema);

/**
 * Is user in db
 */
async function validateUserIdWasInDB(item: {
  userId: string;
}): Promise<boolean> {
  const userId = parseInt(item.userId);
  return await userService.isExistsById(userId);
}

deleteSchemaValidator.setARefineHandler({
  handle: validateUserIdWasInDB,
  message: USER_ID_ERROR_NOT_IN_DB + ":userId",
});
