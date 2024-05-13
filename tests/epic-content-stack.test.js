import { test, expect } from "@playwright/test";

test('"/epic-content-stack" redirects to "github.com/arpitdalal/epic-content-stack" without utm params', async ({
  page,
}) => {
  await page.goto("/epic-content-stack");

  await expect(page).toHaveURL(
    "https://github.com/arpitdalal/epic-content-stack"
  );
});
test('"/epc" redirects to "github.com/arpitdalal/epic-content-stack" without utm params', async ({
  page,
}) => {
  await page.goto("/epc");

  await expect(page).toHaveURL(
    "https://github.com/arpitdalal/epic-content-stack"
  );
});
