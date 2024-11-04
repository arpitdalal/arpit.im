import { test, expect } from "@playwright/test";

test('"/bsky" redirects to "bsky.app/profile/arpitdalal.dev" without utm params', async ({
  page,
}) => {
  await page.goto("/bsky");

  expect(page.url()).toContain("bsky");
  expect(page.url()).toContain("arpitdalal.dev");
});

test('"/🦋" redirects to "bsky.app/profile/arpitdalal.dev" without utm params', async ({
  page,
}) => {
  await page.goto("/🦋");

  expect(page.url()).toContain("bsky");
  expect(page.url()).toContain("arpitdalal.dev");
});
