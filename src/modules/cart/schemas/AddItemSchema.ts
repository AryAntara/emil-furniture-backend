import { z } from "zod";
import { Validator } from "../../../utils/validator";
import {
  cartDetailService,
  productService,
  stockService,
} from "../../../providers";
import {
  MUST_A_NUMBER_ERROR,
  PRODUCT_NOT_FOUND_ERROR,
  QTY_IS_ZERO_ERROR,
  STOCK_NOT_ENOUGH_ERROR,
} from "./constants";

const addItemSchema = z.object({
  product_id: z.number({ message: MUST_A_NUMBER_ERROR }),
  qty: z
    .number({ message: MUST_A_NUMBER_ERROR })
    .min(1, { message: QTY_IS_ZERO_ERROR }),
});

export const addItemSchemaValidator = new Validator(addItemSchema);

/**
 * product must in db
 */
async function validatePorductInDB(item: { product_id: number }) {
  return await productService.isExistsById(item.product_id);
}
addItemSchemaValidator.setARefineHandler({
  handle: validatePorductInDB,
  message: PRODUCT_NOT_FOUND_ERROR + ":product_id",
});

/**
 * Stock must be enough
 */
async function validationStockWasEnough(item: {
  qty: number;
  product_id: number;
}) {
  const productId = item.product_id,
    stock = await stockService.getLastStock(productId),
    lockedStock = await cartDetailService.getLockedStock(productId);

  return item.qty <= stock - lockedStock;
}
addItemSchemaValidator.setARefineHandler({
  handle: validationStockWasEnough,
  message: STOCK_NOT_ENOUGH_ERROR + ":qty",
});
