import { MiddlewareHandler, Next } from "hono";
import { Context } from "hono";
import { HonoBase } from "hono/hono-base";

// Mapping middleware to list of routes
export function mapMiddleware(
  hono: HonoBase,
  middlewares: Array<MiddlewareHandler>,
  routes: Array<string>
) {
  for (const route of routes) {
    for (const middleware of middlewares) {
      hono.use(
        route,
        async (c: Context, next: Next) => await middleware(c, next)
      );
    }
  }
}
