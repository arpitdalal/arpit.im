const express = require("express");

const app = express();
const port = 3000;

const URLS = {
  website: "https://arpitdalal.dev/",
  blog: "https://blog.arpitdalal.dev/",
  github: "https://github.com/arpitdalal/",
  linkedin: "https://linkedin.com/in/arpitdalal/",
  twitter: "https://twitter.com/arpitdalal_dev/",
  mail: "mailto:arpitdalalm@gmail.com",
};

app.get("/", (req, res) => {
  res.redirect(prepareUrlWithQueryParams(req, URLS.website));
});

app.get("/b/:path(*)?", (req, res) => {
  res.redirect(prepareUrlWithPathAndQueryParams(req, URLS.blog));
});
app.get("/blog/:path(*)?", (req, res) => {
  res.redirect(prepareUrlWithPathAndQueryParams(req, URLS.blog));
});

app.get("/gh/:path(*)?", (req, res) => {
  console.log(prepareUrlWithPathAndQueryParams(req, URLS.github));
  res.redirect(prepareUrlWithPathAndQueryParams(req, URLS.github));
});
app.get("/github/:path(*)?", (req, res) => {
  res.redirect(prepareUrlWithPathAndQueryParams(req, URLS.github));
});

app.get("/in/:path(*)?", (_, res) => {
  res.redirect(URLS.linkedin);
});
app.get("/linkedin/:path(*)?", (_, res) => {
  res.redirect(URLS.linkedin);
});

app.get("/x/:path(*)?", (_, res) => {
  res.redirect(URLS.twitter);
});
app.get("/twitter/:path(*)?", (_, res) => {
  res.redirect(URLS.twitter);
});

app.get("/email", (_, res) => {
  res.redirect(URLS.mail);
});

app.get("/healthcheck", (_, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function prepareUrlWithPath(req, url) {
  const path = req.params.path ?? "";
  return `${url}${path}`;
}

function prepareUrlWithQueryParams(req, url) {
  const queryParams = req.query ?? "";
  const queryString = new URLSearchParams(queryParams).toString() ?? "";
  return `${url}?${queryString}`;
}

function prepareUrlWithPathAndQueryParams(req, url) {
  const urlWithPath = prepareUrlWithPath(req, url);
  return prepareUrlWithQueryParams(req, urlWithPath);
}
