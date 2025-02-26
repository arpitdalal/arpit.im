import { sentry } from "@hono/sentry";
import { type Toucan as Sentry } from "toucan-js";
import { Hono, type HonoRequest, type Context } from "hono";
import { literal, union, safeParse } from "valibot";

type Redirect = Context["redirect"];
export interface Bindings {
  NODE_ENV: string;
}

const app = new Hono<{ Bindings: Bindings }>();
app.use("*", sentry());

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

app.get("/*", ({ req, redirect, get }) => {
  return redirect(
    prepareUrlWithUtmParamsAndPath(req, "", URLS.website, get("sentry"))
  );
});

export default app;
