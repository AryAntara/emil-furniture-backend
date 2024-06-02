import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { orderService } from "../../../providers";
import { MUST_NUMBER_ERROR, ORDER_NOT_FOUND_ERROR } from "./constants";

const cancelSchema = z.object({
  order_id: z.number({ message: MUST_NUMBER_ERROR }),
});

export const cancelSchemaValidator = new Validator(cancelSchema);

/**
 * Order was exist on db
 */
async function validateOrderWasInDB(item: { order_id: number }) {
  return await orderService.isExistsById(item.order_id);
}
cancelSchemaValidator.setARefineHandler({
  handle: validateOrderWasInDB,
  message: ORDER_NOT_FOUND_ERROR + ":order_id",
});
