import { test, expect } from "@playwright/test";

test('"/youtube" redirects to "youtube.com/@arpitdalal_dev" without utm params', async ({
  page,
}) => {
  await page.goto("/youtube");

  await expect(page).toHaveURL("https://www.youtube.com/@arpitdalal_dev");
});
test('"/yt" redirects to "youtube.com/@arpitdalal_dev" without utm params', async ({
  page,
}) => {
  await page.goto("/yt");

  await expect(page).toHaveURL("https://www.youtube.com/@arpitdalal_dev");
});
