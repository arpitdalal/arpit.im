import { test, expect } from "@playwright/test";

test('"/live" redirects to "https://www.youtube.com/channel/UCKi0CBLeunUbvhdrnrLrr9Q/live"', async ({
  page,
}) => {
  await page.goto("/live");

  await expect(page).toHaveURL(
    "https://www.youtube.com/channel/UCKi0CBLeunUbvhdrnrLrr9Q/live"
  );
});
