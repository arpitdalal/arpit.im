import { test, expect } from "@playwright/test";

test('"/github" redirects to "github.com/arpitdalal" without utm params', async ({
  page,
}) => {
  await page.goto("/github", {
    waitUntil: "networkidle",
  });

  await expect(page).toHaveURL("https://github.com/arpitdalal/");
});
test('"/gh" redirects to "github.com/arpitdalal" without utm params', async ({
  page,
}) => {
  await page.goto("/gh", {
    waitUntil: "networkidle",
  });

  await expect(page).toHaveURL("https://github.com/arpitdalal/");
});

test('"/gh/arpit.im" redirects to "github.com/arpitdalal/arpit.im" without utm params', async ({
  page,
}) => {
  await page.goto("/gh/arpit.im");

  await expect(page).toHaveURL("https://github.com/arpitdalal/arpit.im");
});
