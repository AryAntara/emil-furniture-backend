import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { transactionService } from "../../../providers";
import {
  MUST_NUMBER_ERROR,
  REQUIRE_ERROR,
  TRANSACTION_NOT_FOUND_ERROR,
} from "./constants";

const updateSchema = z.object({
  transaction_id: z.string({ message: REQUIRE_ERROR }),
  resi: z.string({ message: REQUIRE_ERROR }),
  resi_link: z.string({ message: REQUIRE_ERROR }),
});

export const updateSchemaValidator = new Validator(updateSchema);

/**
 * Transaction was exists on db
 */
async function validateOrderWasInDB(item: { transaction_id: string }) {
  return await transactionService.isExistsById(item.transaction_id);
}
updateSchemaValidator.setARefineHandler({
  handle: validateOrderWasInDB,
  message: TRANSACTION_NOT_FOUND_ERROR + ":transaction_id",
});
