import { test, expect } from "@playwright/test";

test('"/xman" redirects to "xman.arpitdalal.dev/" with utm params', async ({
  page,
}) => {
  await page.goto("/xman");

  await expect(page).toHaveURL(
    "https://xman.arpitdalal.dev/?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});

test('"/xman/app/dashboard" redirects to "xman.arpitdalal.dev/login" with utm params', async ({
  page,
}) => {
  await page.goto("/xman/app/dashboard");

  await expect(page).toHaveURL(
    "https://xman.arpitdalal.dev/login?redirectTo=%2Fapp%2Fdashboard%3Futm_source%3Darpit.im%26utm_medium%3Dredirect%26utm_campaign%3Durl-shortener"
  );
});
