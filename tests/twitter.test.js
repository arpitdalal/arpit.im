import { test, expect } from "@playwright/test";

test('"/twitter" redirects to "x.com/arpitdalal_dev" without utm params', async ({
  page,
}) => {
  await page.goto("/twitter");

  // have to check if the url contains twitter and my username because
  // twitter redirects to the login page if the user is not logged in
  expect(page.url()).toContain("x");
  expect(page.url()).toContain("arpitdalal_dev");
});
test('"/x" redirects to "x.com/arpitdalal_dev" without utm params', async ({
  page,
}) => {
  await page.goto("/x");

  // have to check if the url contains twitter and my username because
  // twitter redirects to the login page if the user is not logged in
  expect(page.url()).toContain("x");
  expect(page.url()).toContain("arpitdalal_dev");
});
