import { ZodObject } from "zod";

export interface BaseServiceInterface {
    validate(content: any, schema: ZodObject<any>, refineCallBack?: () => boolean): any;
}