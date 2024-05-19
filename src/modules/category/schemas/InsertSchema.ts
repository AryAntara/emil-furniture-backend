import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { REQUIRE_ERROR } from "./constants";

const insertSchema = z.object({
  name: z.string({message: REQUIRE_ERROR}),
});

export const insertSchemaValidator = new Validator(insertSchema);
