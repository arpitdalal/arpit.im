import posthog, { type PostHog } from "posthog-js";
import { createMiddleware } from "hono/factory";
import type { Context } from "hono";
import type { Env } from "./index";

declare module "hono" {
  interface ContextVariableMap {
    posthog: PostHog;
  }
}

let posthogClient: PostHog | null = null;

export const posthogMiddleware = createMiddleware<{ Bindings: Env }>(
  async (c, next) => {
    if (!posthogClient && c.env?.POSTHOG_API_KEY) {
      posthogClient = posthog.init(c.env?.POSTHOG_API_KEY, {
        api_host: "https://us.i.posthog.com",
      });

      c.set("posthog", posthogClient);
    } else if (posthogClient) {
      c.set("posthog", posthogClient);
    }
    if (posthogClient) {
      const cfRay = c.req.header("CF-Ray");
      const requestId = c.req.header("CF-Request-ID");
      const distinctId =
        cfRay ||
        requestId ||
        `anonymous-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}`;

      posthogClient.capture("$pageview", {
        distinctId: distinctId,
        properties: {
          $current_url: c.req.url,
          path: c.req.path,
          url: c.req.url,
          method: c.req.method,
          headers: c.req.header(),
        },
      });
    }

    await next();
  }
);

export function getPosthogClient(c: Context): PostHog | null {
  return c.get("posthog") || null;
}
