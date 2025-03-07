import { sentry } from "@hono/sentry";
import umami from "@umami/node";
import { type Toucan as Sentry } from "toucan-js";
import { Hono, type HonoRequest, type Context } from "hono";
import { literal, union, safeParse } from "valibot";
import { rateLimiterMiddleware } from "./kv-store-middleware";

type Redirect = Context["redirect"];
export interface Env {
  UMAMI_SITE_ID: string;
  UMAMI_HOST_URL: string;
  SENTRY_DSN: string;
  RATE_LIMIT_KV: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();
app.use(
  "*",
  sentry({
    denyUrls: [/\/healthcheck/, /\/favicons\//, /\/favicon.ico/],
    tracesSampler(samplingContext) {
      // ignore healthcheck transactions by other services (consul, etc.)
      if (samplingContext.normalizedRequest?.url?.includes("/healthcheck")) {
        return 0;
      }
      return 1;
    },
    beforeSendTransaction(event) {
      // ignore all healthcheck related transactions
      // note that name of header here is case-sensitive
      if (
        event.request?.headers?.["x-healthcheck"] === "true" ||
        event.request?.url?.includes("healthcheck")
      ) {
        return null;
      }

      return event;
    },
  })
);

app.use("*", (c, next) => {
  if (!c.env?.RATE_LIMIT_KV || c.req.url.includes("healthcheck")) return next();
  return rateLimiterMiddleware(c, next);
});

app.use("*", (c, next) => {
  // '?.' is necessary in tests where env is undefined
  if (c.env?.UMAMI_SITE_ID && c.env?.UMAMI_HOST_URL) {
    umami.init({
      websiteId: c.env.UMAMI_SITE_ID,
      hostUrl: c.env.UMAMI_HOST_URL,
    });

    if (!c.req.url.includes("healthcheck")) {
      c.executionCtx.waitUntil(
        umami.send({
          website: c.env.UMAMI_SITE_ID,
          hostname: "arpit.im",
          referrer: c.req.header("Referer"),
          url: c.req.url,
          language: c.req.header("Accept-Language") || "en-US",
        })
      );
      c.executionCtx.waitUntil(
        umami.track("pageview", {
          url: c.req.url,
          hostname: "arpit.im",
          language: c.req.header("Accept-Language") || "en-US",
        })
      );
    }
  }

  return next();
});

const URLS = {
  website: "https://arpitdalal.dev/",
  blog: {
    home: "https://blog.arpitdalal.dev/",
    "notion-url":
      "https://blog.arpitdalal.dev/enhancing-user-experience-with-notion-style-url-architecture",
    "ai-divide":
      "https://blog.arpitdalal.dev/the-ai-developer-divide-autonomous-agents-vs-coding-companions",
    "posthog-proxy":
      "https://blog.arpitdalal.dev/setup-posthog-reverse-proxy-with-remix-react-router",
    "cf-migration":
      "https://blog.arpitdalal.dev/my-cloudflare-workers-migration-the-good-the-bad-and-the-confusing",
  },
  github: "https://github.com/arpitdalal/",
  linkedin: "https://linkedin.com/in/arpitdalal/",
  x: "https://x.com/arpitdalal_dev/",
  bsky: "https://bsky.app/profile/arpitdalal.dev",
  youtube: "https://youtube.com/@arpitdalal_dev/",
  live: "https://www.youtube.com/channel/UCKi0CBLeunUbvhdrnrLrr9Q/live",
  mail: "mailto:arpitdalalm@gmail.com",
  xman: "https://xman.arpitdalal.dev/",
  "epic-content-stack": "https://github.com/arpitdalal/epic-content-stack",
};

type BlogKey = keyof typeof URLS.blog;
const blogNames = Object.keys(URLS.blog).filter(
  (key): key is BlogKey => key in URLS.blog
);
const blogNamesSchema = union(blogNames.map((name) => literal(name)));

function removePathFromUrl(originalPath: string, pathToRemove: string) {
  const regex = new RegExp("^" + pathToRemove + "/?", "g");
  return originalPath.replace(regex, "");
}

function prepareUrlWithPath(
  req: HonoRequest,
  pathToRemove: string,
  redirectToUrl: string
) {
  return `${redirectToUrl}${removePathFromUrl(req.path, pathToRemove)}`;
}

function prepareUrlWithUtmParams(
  req: HonoRequest,
  url: string,
  sentry: Sentry
) {
  const referer = req.header("referer");
  const requestUrl = new URL(req.url);
  const queryParams = requestUrl.searchParams;
  let refererHostname = null;
  // @ts-expect-error - canParse is not typed for some reason, works fine
  if (referer && URL.canParse(referer)) {
    try {
      const refererUrl = referer ? new URL(referer) : null;
      if (refererUrl) {
        refererHostname = refererUrl.hostname;
      }
    } catch (error) {
      console.error(error);
      sentry.captureException(error);
    }
  }
  const utmSource =
    queryParams.get("utm_source") ?? refererHostname ?? "arpit.im";
  const utmMedium =
    queryParams.get("utm_medium") ?? (referer ? "social" : "redirect");
  const utmCampaign = queryParams.get("utm_campaign") ?? "url-shortener";
  queryParams.set("utm_source", utmSource);
  queryParams.set("utm_medium", utmMedium);
  queryParams.set("utm_campaign", utmCampaign);
  const redirectToUrl = new URL(url);
  redirectToUrl.searchParams.forEach((value, key) => {
    redirectToUrl.searchParams.delete(key);
  });
  queryParams.forEach((value, key) => {
    redirectToUrl.searchParams.set(key, value);
  });

  return redirectToUrl.toString();
}

/**
 * @param {express.Request} req - The request object
 * @param {string} pathToRemove - The path to remove with a starting /
 * @param {string} redirectToUrl - The URL to redirect to
 * @example
 * prepareUrlWithUtmParamsAndPath({
 *  req,
 *  pathToRemove: "/b",
 *  url: "https://blog.arpitdalal.dev/"
 * });
 */
function prepareUrlWithUtmParamsAndPath(
  req: HonoRequest,
  pathToRemove: string,
  redirectToUrl: string,
  sentry: Sentry
) {
  return prepareUrlWithUtmParams(
    req,
    prepareUrlWithPath(req, pathToRemove, redirectToUrl),
    sentry
  );
}

function blogHandler(
  req: HonoRequest,
  redirect: Redirect,
  rawPath: string,
  pathToRemove: string,
  sentry: Sentry
) {
  const path = rawPath.replace(pathToRemove + "/", "");

  const result = safeParse(blogNamesSchema, path);

  if (result.success) {
    const validPath = result.output;
    return redirect(prepareUrlWithUtmParams(req, URLS.blog[validPath], sentry));
  }

  return redirect(
    prepareUrlWithUtmParamsAndPath(req, pathToRemove, URLS.blog.home, sentry)
  );
}

function generateRouteMap() {
  const website = {
    category: "Website",
    items: [{ path: "/", url: URLS.website, shortforms: ["/ or /*"] }],
  };

  const blog = {
    category: "Blog",
    items: [
      { path: "/blog", url: URLS.blog.home, shortforms: ["/b/* or /blog/*"] },
      ...Object.entries(URLS.blog)
        .filter(([key]) => key !== "home")
        .map(([key, url]) => ({
          path: `/${key}`,
          url,
          shortforms: [`/${key}`],
        })),
    ],
  };

  const socialAndOther = {
    category: "Social & Other",
    items: [
      ...Object.entries(URLS)
        .filter(([key]) => !["website", "blog"].includes(key))
        .map(([key, url]) => {
          let shortforms: string[] = [];
          switch (key) {
            case "github":
              shortforms = ["/gh/* or /github/*"];
              break;
            case "linkedin":
              shortforms = ["/in/* or /linkedin/*"];
              break;
            case "x":
              shortforms = ["/x/* or /twitter/*"];
              break;
            case "bsky":
              shortforms = ["/bsky/* or /🦋/*"];
              break;
            case "youtube":
              shortforms = ["/yt/* or /youtube/*"];
              break;
            case "live":
              shortforms = ["/live/*"];
              break;
            case "epic-content-stack":
              shortforms = ["/ecs/* or /epic-content-stack/*"];
              break;
            case "mail":
              shortforms = ["/email"];
              break;
            case "xman":
              shortforms = ["/xman/*"];
              break;
            default:
              shortforms = [`/${key}/*`];
          }

          return {
            path: `/${key}`,
            url,
            shortforms,
          };
        }),
    ],
  };

  return [website, blog, socialAndOther];
}

function githubHandler(
  req: HonoRequest,
  redirect: Redirect,
  pathToRemove: string
) {
  return redirect(prepareUrlWithPath(req, pathToRemove, URLS.github));
}
function linkedinHandler(redirect: Redirect) {
  return redirect(URLS.linkedin);
}
function xHandler(redirect: Redirect) {
  return redirect(URLS.x);
}
function bskyHandler(redirect: Redirect) {
  return redirect(URLS.bsky);
}
function youtubeHandler(redirect: Redirect) {
  return redirect(URLS.youtube);
}
function epicContentStackHandler(redirect: Redirect) {
  return redirect(URLS["epic-content-stack"]);
}

app.get("/b/*", ({ req, redirect, get }) => {
  return blogHandler(req, redirect, req.path, "/b", get("sentry"));
});
app.get("/blog/*", ({ req, redirect, get }) => {
  return blogHandler(req, redirect, req.path, "/blog", get("sentry"));
});

app.get("/notion-url", ({ req, redirect, get }) => {
  return redirect(
    prepareUrlWithUtmParamsAndPath(
      req,
      "notion-url",
      URLS.blog["notion-url"],
      get("sentry")
    )
  );
});

app.get("/gh/*", ({ req, redirect }) => {
  return githubHandler(req, redirect, "/gh");
});
app.get("/github/*", ({ req, redirect }) => {
  return githubHandler(req, redirect, "/github");
});

app.get("/in/*", ({ redirect }) => {
  return linkedinHandler(redirect);
});
app.get("/linkedin/*", ({ redirect }) => {
  return linkedinHandler(redirect);
});

app.get("/x/*", ({ redirect }) => {
  return xHandler(redirect);
});
app.get("/twitter/*", ({ redirect }) => {
  return xHandler(redirect);
});

app.get("/bsky/*", ({ redirect }) => {
  return bskyHandler(redirect);
});
app.get("/🦋/*", ({ redirect }) => {
  return bskyHandler(redirect);
});

app.get("/yt/*", ({ redirect }) => {
  return youtubeHandler(redirect);
});
app.get("/youtube/*", ({ redirect }) => {
  return youtubeHandler(redirect);
});

app.get("/live/*", ({ redirect }) => {
  return redirect(URLS.live);
});

app.get("/ecs/*", ({ redirect }) => {
  return epicContentStackHandler(redirect);
});
app.get("/epic-content-stack/*", ({ redirect }) => {
  return epicContentStackHandler(redirect);
});

app.get("/email", ({ redirect }) => {
  return redirect(URLS.mail);
});

app.get("/xman/*", ({ req, redirect, get }) => {
  return redirect(
    prepareUrlWithUtmParamsAndPath(req, "/xman", URLS.xman, get("sentry"))
  );
});

app.get("/healthcheck", (c) => {
  return c.text("OK");
});

app.get("/links", (c) => {
  const routeMap = generateRouteMap();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>arpit.im - Available Links</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #e4e4e4;
          background-color: #121212;
        }
        h1, h2 {
          border-bottom: 1px solid #333;
          padding-bottom: 10px;
          color: #ffffff;
        }
        a {
          color: #58a6ff;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
          color: #79c0ff;
        }
        .shortform {
          display: inline-block;
          min-width: 120px;
          font-weight: bold;
          margin-right: 10px;
          color:#b4b4b4;
        }
        ul {
          list-style-type: none;
          padding-left: 0;
        }
        li {
          margin-bottom: 8px;
          padding: 8px;
          border-radius: 4px;
        }
        li:hover {
          background-color: #1f1f1f;
        }
        section {
          margin-bottom: 30px;
          padding: 15px;
          background-color: #1a1a1a;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
      </style>
    </head>
    <body>
      <h1>arpit.im - Available Links</h1>
      
      ${routeMap
        .map(
          (category) => `
        <section>
          <h2>${category.category}</h2>
          <ul>
            ${category.items
              .map(
                (item) => `
              <li>
                <span class="shortform">${item.shortforms.join(", ")}</span>
                <a href="${item.url}" target="_blank">${item.url}</a>
              </li>
            `
              )
              .join("")}
          </ul>
        </section>
      `
        )
        .join("")}
    </body>
    </html>
  `;

  return c.html(html);
});

app.get("/*", ({ req, redirect, get }) => {
  return redirect(
    prepareUrlWithUtmParamsAndPath(req, "", URLS.website, get("sentry"))
  );
});

export default app;
