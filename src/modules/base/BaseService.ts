import { BaseServiceInterface } from "./interfaces/BaseServiceInterface";
import { ZodObject, ZodError } from "zod";

export class BaseService implements BaseServiceInterface {
    validate(content: any, schema: ZodObject<any>, refineCallBack?: (...item: any) => boolean) {
        try {

            if(refineCallBack){
                schema.refine(refineCallBack)
            }

            schema.parse(content)
            return { success: true, data: content };
            
        } catch (e) {
            const zodErrors = (e as ZodError).errors;
            const validationError: any = {};

            for (const zodError of zodErrors) {
                validationError[zodError.path[0]] = zodError.message
            }

            return {
                success: false, errors: validationError
            }
        }
    }
}