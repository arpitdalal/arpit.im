import { test, expect } from "@playwright/test";

test('"/" redirects to "arpitdalal.dev/" with utm params', async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(
    "https://arpitdalal.dev/?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});

test('"/?utm_source=twitter&utm_medium=referrer&utm_campaign=social" redirects to "arpitdalal.dev/?utm_source=twitter&utm_medium=referrer&utm_campaign=social" with utm params', async ({
  page,
}) => {
  await page.goto(
    "/?utm_source=twitter&utm_medium=referrer&utm_campaign=social"
  );

  await expect(page).toHaveURL(
    "https://arpitdalal.dev/?utm_source=twitter&utm_medium=referrer&utm_campaign=social"
  );
});

test('"/" with referer as t.co redirects to "arpitdalal.dev/?utm_source=t.co&utm_medium=social&utm_campaign=url-shortener" with utm params', async () => {
  const a = await fetch("http://localhost:3000", {
    headers: {
      referer: "https://t.co",
    },
  });

  expect(a.url).toBe(
    "https://arpitdalal.dev/?utm_source=t.co&utm_medium=social&utm_campaign=url-shortener"
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
