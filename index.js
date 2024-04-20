const express = require("express");

const app = express();
const port = 3000;

const URLS = {
  website: "https://arpitdalal.dev",
  blog: "https://blog.arpitdalal.dev",
  github: "https://github.com/arpitdalal",
  linkedin: "https://linkedin.com/in/arpitdalal",
};

app.get("/", (_, res) => {
  res.redirect(301, URLS.website);
});

app.get("/b", (_, res) => {
  res.redirect(301, URLS.blog);
});
app.get("/blog", (_, res) => {
  res.redirect(301, URLS.blog);
});

app.get("/gh", (_, res) => {
  res.redirect(301, URLS.github);
});
app.get("/github", (_, res) => {
  res.redirect(301, URLS.github);
});

app.get("/in", (_, res) => {
  res.redirect(301, URLS.linkedin);
});
app.get("/linkedin", (_, res) => {
  res.redirect(301, URLS.linkedin);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
