import { z } from "zod";
import { Validator } from "../../../utils/validator";
import { REQUIRE_ERROR } from "./constans";

const insertSchema = z.object({
  title: z.string({ message: REQUIRE_ERROR }),
  description: z.string({ message: REQUIRE_ERROR }),
  is_actived: z.enum(["yes", "no"]),
});

export const insertSchemaValidator = new Validator(insertSchema);
