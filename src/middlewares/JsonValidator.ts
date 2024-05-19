import { Context, Next } from "hono";
import { respond } from "../utils/response";

export async function validateJsonContent(c: Context, next: Next) {
  if (c.req.method != "GET" && c.req.method != "HEAD")
    try {
      await c.req.json();
      return await next();
    } catch (e) {
      return c.json(
        respond(null, false, "Konten tidak valid, harus berupa json."),
        422
      );
    }

  await next();
}
