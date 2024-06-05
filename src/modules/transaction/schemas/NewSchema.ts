import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { orderService, transactionService } from "../../../providers";
import {
  MUST_NUMBER_ERROR,
  ORDER_NOT_FOUND_ERROR,
  OREDR_IN_TRANSACTION_ERROR,
} from "./constants";

const newSchema = z.object({
  order_id: z.number({ message: MUST_NUMBER_ERROR }),
  address_id: z.optional(z.number({ message: MUST_NUMBER_ERROR })),
});

export const newSchemaValidator = new Validator(newSchema);

/**
 * Order was exists on db
 */
async function validateOrderWasInDB(item: { order_id: number }) {
  return await orderService.isExistsById(item.order_id);
}
newSchemaValidator.setARefineHandler({
  handle: validateOrderWasInDB,
  message: ORDER_NOT_FOUND_ERROR + ":order_id",
});

/**
 * Order must not in transaction
 */
async function validateOrderNotInTransaction(item: { order_id: number }) {
  return !(await transactionService.isExistsByOrderId(item.order_id));
}
newSchemaValidator.setARefineHandler({
  handle: validateOrderNotInTransaction,
  message: OREDR_IN_TRANSACTION_ERROR + ":order_id",
});
