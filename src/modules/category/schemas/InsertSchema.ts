import { z } from "zod"
import { Validator } from "../../../utils/validator";

const insertSchema = z.object({
    name: z.string(), 
})

export const insertSchemaValidator = new Validator(insertSchema);