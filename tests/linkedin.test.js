import { test, expect } from "@playwright/test";

test('"/linkedin" redirects to "linkedin.com/in/arpitdalal" without utm params', async ({
  page,
}) => {
  await page.goto("/linkedin");

  // have to check if the url contains linkedin and my username because
  // linkedin redirects to the login page if the user is not logged in
  expect(page.url()).toContain("linkedin");
  expect(page.url()).toContain("arpitdalal");
});
test('"/in" redirects to "linkedin.com/in/arpitdalal" without utm params', async ({
  page,
}) => {
  await page.goto("/in");

  // have to check if the url contains linkedin and my username because
  // linkedin redirects to the login page if the user is not logged in
  expect(page.url()).toContain("linkedin");
  expect(page.url()).toContain("arpitdalal");
});
