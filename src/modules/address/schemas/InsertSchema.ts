import { ZodEnum, ZodString, z } from "zod"
import { Validator } from "../../../utils/validator";

const insertSchema = z.object({
    title: z.string(), 
    description: z.string(), 
    is_actived : z.enum(["yes", "no"])
})

export const insertSchemaValidator = new Validator(insertSchema);