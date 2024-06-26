import "dotenv/config";
import express from "express";
import * as Sentry from "@sentry/node";
import { PostHog } from "posthog-node";

if (!process.env.SENTRY_DSN) {
  throw new Error("SENTRY_DSN is not defined in the environment variables.");
}
if (!process.env.POSTHOG_API_KEY) {
  throw new Error(
    "POSTHOG_API_KEY is not defined in the environment variables."
  );
}

const posthogClient = new PostHog(process.env.POSTHOG_API_KEY, {
  host: "https://us.i.posthog.com",
});

const MODE = process.env.NODE_ENV;

const app = express();
const port = 3000;

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: MODE,
  tracesSampleRate: MODE === "production" ? 1 : 0,
  denyUrls: [/\/healthcheck/],
  beforeSend(event) {
    // ignore all healthcheck related transactions
    //  note that name of header here is case-sensitive
    if (event.request?.headers?.["x-healthcheck"] === "true") {
      return null;
    }

    return event;
  },
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use((req, _, next) => {
  if (req.url !== "/healthcheck") {
    posthogClient.capture({
      distinctId: req.ip,
      event: "pageview",
      properties: {
        path: req.path,
        url: req.originalUrl,
        method: req.method,
        headers: req.headers,
      },
    });
  }

  next();
});

const URLS = {
  website: "https://arpitdalal.dev/",
  blog: "https://blog.arpitdalal.dev/",
  github: "https://github.com/arpitdalal/",
  linkedin: "https://linkedin.com/in/arpitdalal/",
  twitter: "https://twitter.com/arpitdalal_dev/",
  youtube: "https://youtube.com/@arpitdalal_dev/",
  mail: "mailto:arpitdalalm@gmail.com",
  xman: "https://xman.arpitdalal.dev/",
  "epic-content-stack": "https://github.com/arpitdalal/epic-content-stack",
};

function blogHandler(req, res, pathToRemove) {
  res.redirect(prepareUrl(req, pathToRemove, URLS.blog));
}
function githubHandler(req, res, pathToRemove) {
  res.redirect(prepareUrlWithPath(req, pathToRemove, URLS.github));
}
function linkedinHandler(res) {
  res.redirect(URLS.linkedin);
}
function twitterHandler(res) {
  res.redirect(URLS.twitter);
}
function youtubeHandler(res) {
  res.redirect(URLS.youtube);
}
function epicContentStackHandler(res) {
  res.redirect(URLS["epic-content-stack"]);
}

app.get("/b/:path(*)?", (req, res) => {
  blogHandler(req, res, "/b");
});
app.get("/blog/:path(*)?", (req, res) => {
  blogHandler(req, res, "/blog");
});

app.get("/gh/:path(*)?", (req, res) => {
  githubHandler(req, res, "/gh");
});
app.get("/github/:path(*)?", (req, res) => {
  githubHandler(req, res, "/github");
});

app.get("/in/:path(*)?", (_, res) => {
  linkedinHandler(res);
});
app.get("/linkedin/:path(*)?", (_, res) => {
  linkedinHandler(res);
});

app.get("/x/:path(*)?", (_, res) => {
  twitterHandler(res);
});
app.get("/twitter/:path(*)?", (_, res) => {
  twitterHandler(res);
});

app.get("/yt/:path(*)?", (_, res) => {
  youtubeHandler(res);
});
app.get("/youtube/:path(*)?", (_, res) => {
  youtubeHandler(res);
});

app.get("/epc/:path(*)?", (_, res) => {
  epicContentStackHandler(res);
});
app.get("/epic-content-stack/:path(*)?", (_, res) => {
  epicContentStackHandler(res);
});

app.get("/email", (_, res) => {
  res.redirect(URLS.mail);
});

app.get("/xman/:path(*)?", (req, res) => {
  res.redirect(prepareUrl(req, "/xman", URLS.xman));
});

app.get("/healthcheck", (_, res) => {
  res.send("OK");
});

app.get("/:path(*)?", (req, res) => {
  res.redirect(prepareUrl(req, "", URLS.website));
});

app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/**
 * @param {express.Request} req
 * @param {string} pathToRemove
 * @param {string} url
 */
function prepareUrlWithPath(req, pathToRemove, url) {
  const regex = new RegExp("^" + pathToRemove + "/?", "g");
  return `${url}${req.url.replace(regex, "")}`;
}

/**
 * @param {express.Request} req
 * @param {string} url
 */
function prepareUrlWithUtmParams(req, url) {
  const referer = req.headers.referer;
  const actualUrl = new URL(url);
  const queryParams = actualUrl.searchParams;
  let refererHostname = null;
  try {
    const refererUrl = referer ? new URL(referer) : null;
    if (refererUrl) {
      refererHostname = refererUrl.hostname;
    }
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
  }
  const utmSource =
    queryParams.get("utm_source") ?? refererHostname ?? "arpit.im";
  const utmMedium =
    queryParams.get("utm_medium") ?? (referer ? "social" : "redirect");
  const utmCampaign = queryParams.get("utm_campaign") ?? "url-shortener";
  queryParams.set("utm_source", utmSource);
  queryParams.set("utm_medium", utmMedium);
  queryParams.set("utm_campaign", utmCampaign);
  return actualUrl.toString();
}

/**
 * @param {express.Request} req - The request object
 * @param {string} pathToRemove - The path to remove with a starting /
 * @param {string} url - The URL to redirect to
 * @example
 * prepareUrl({
 *  req,
 *  pathToRemove: "/b",
 *  url: "https://blog.arpitdalal.dev/"
 * });
 */
function prepareUrl(req, pathToRemove, url) {
  return prepareUrlWithUtmParams(
    req,
    prepareUrlWithPath(req, pathToRemove, url)
  );
}
