import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { INVALID_TYPE_ERROR } from "./constants";

const toggleActiveItemSchema = z.object({
  type: z.enum(["check", "uncheck"], { message: INVALID_TYPE_ERROR }),
});

export const toggleActiveItemSchemaValidator = new Validator(toggleActiveItemSchema);
