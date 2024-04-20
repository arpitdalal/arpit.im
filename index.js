const express = require("express");

const app = express();
const port = 3000;

const URLS = {
  website: "https://arpitdalal.dev",
  blog: "https://blog.arpitdalal.dev",
  github: "https://github.com/arpitdalal",
  linkedin: "https://linkedin.com/in/arpitdalal",
  twitter: "https://twitter.com/arpitdalal_dev",
  mail: "mailto:arpitdalalm@gmail.com",
};

app.get("/", (_, res) => {
  res.redirect(URLS.website);
});

app.get("/b", (_, res) => {
  res.redirect(URLS.blog);
});
app.get("/blog", (_, res) => {
  res.redirect(URLS.blog);
});

app.get("/gh", (_, res) => {
  res.redirect(URLS.github);
});
app.get("/github", (_, res) => {
  res.redirect(URLS.github);
});

app.get("/in", (_, res) => {
  res.redirect(URLS.linkedin);
});
app.get("/linkedin", (_, res) => {
  res.redirect(URLS.linkedin);
});

app.get("/x", (_, res) => {
  res.redirect(URLS.twitter);
});
app.get("/twitter", (_, res) => {
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
