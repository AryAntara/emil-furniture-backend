import { z } from "zod";
import { MUST_A_NUMBER_ERROR, STOCK_NOT_FOUND_ERROR } from "./constants";
import { Validator } from "../../../utils/validator";
import { stockService } from "../../../providers";

const commitSchema = z.object({
  stock_id: z.number({ message: MUST_A_NUMBER_ERROR }),
});

export const commitSchemaValidator = new Validator(commitSchema);

/**
 * product must in db
 */
async function validatePorductInDB(item: { stock_id: number }) {
  return await stockService.isExistById(item.stock_id);
}
commitSchemaValidator.setARefineHandler({
  handle: validatePorductInDB,
  message: STOCK_NOT_FOUND_ERROR + ":param_stock_id",
});
