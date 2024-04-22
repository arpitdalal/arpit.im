import { test, expect } from "@playwright/test";

test('"/" redirects to "arpitdalal.dev/" with utm params', async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(
    "https://arpitdalal.dev/?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});

test('"/does-not-exist" redirects to "arpitdalal.dev/does-not-exist" with utm params', async ({
  page,
}) => {
  await page.goto("/does-not-exist");

  await expect(page).toHaveURL(
    "https://arpitdalal.dev/does-not-exist?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});
