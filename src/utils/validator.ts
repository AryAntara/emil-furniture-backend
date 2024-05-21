import { ZodSchema, RefinementCtx, ZodObject, ZodError } from "zod";
import { logger } from "../log";
import { Context } from "hono";
import { respond } from "./response";

type RefineHandler = {
  handle: (item?: any) => Promise<boolean>;
  message?: string;
};
export class Validator {
  data: any;

  private refineHandlers: Array<RefineHandler> = [];
  constructor(private schema: ZodSchema<any>) {}

  // set the multiple refine-handler
  setARefineHandler(refineHandler: RefineHandler) {
    this.refineHandlers.push(refineHandler);
    return this;
  }

  // bind a value to be parse
  with(content: any) {
    this.data = content;
    return this;
  }

  // run the validator
  async run() {
    let schema = this.schema,
      data = this.data;

    try {
      if (this.refineHandlers.length > 0)
        for (let refineHandler of this.refineHandlers) {
          logger.info("Runing refine handle "+ refineHandler.handle.name);
          schema = schema.refine(refineHandler.handle, refineHandler.message);
        }

      const safeData = await schema.parseAsync(data);
      return { success: true, data: safeData };
    } catch (e) {
      if (!(e instanceof ZodError)) return {};

      logger.error(e);
      const zodErrors = (e as ZodError).errors;
      const validationError: any = {};

      for (const zodError of zodErrors) {
        let path = zodError.path[0];
        if (path && (path as string)[0] !== "_")
          validationError[path] = zodError.message;
        else {
          let messages = zodError.message.split(":");
          let path = messages[1] ?? "custom";
          let message = messages[0];
          validationError[path] = message;
        }
      }

      return {
        success: false,
        errors: validationError,
        sendError: (c: Context) =>
          c.json(respond(validationError, false, "Validasi error."), 400),
      };
    }
  }
}
