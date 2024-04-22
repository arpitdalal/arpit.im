import { test, expect } from "@playwright/test";

test('"/linkedin" redirects to "linkedin.com/in/arpitdalal" without utm params', async ({
  page,
}) => {
  await page.goto("/linkedin");

  await expect(page).toHaveURL("https://www.linkedin.com/in/arpitdalal/");
});
test('"/in" redirects to "linkedin.com/in/arpitdalal" without utm params', async ({
  page,
}) => {
  await page.goto("/in");

  await expect(page).toHaveURL("https://www.linkedin.com/in/arpitdalal/");
});
