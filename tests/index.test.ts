import { test, expect } from "vitest";
import app from "../src";

test('"/" redirects to "arpitdalal.dev/" with utm params', async () => {
  const response = await app.request("/");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://arpitdalal.dev/?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});

test('"/?utm_source=twitter&utm_medium=referrer&utm_campaign=social" redirects to "arpitdalal.dev/?utm_source=twitter&utm_medium=referrer&utm_campaign=social" with utm params', async () => {
  const response = await app.request(
    "/?utm_source=twitter&utm_medium=referrer&utm_campaign=social"
  );

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://arpitdalal.dev/?utm_source=twitter&utm_medium=referrer&utm_campaign=social"
  );
});

test('"/" with referer as t.co redirects to "arpitdalal.dev/?utm_source=t.co&utm_medium=social&utm_campaign=url-shortener" with utm params', async () => {
  const response = await app.request("/", {
    headers: {
      referer: "https://t.co",
    },
  });

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://arpitdalal.dev/?utm_source=t.co&utm_medium=social&utm_campaign=url-shortener"
  );
});

test('"/does-not-exist" redirects to "arpitdalal.dev/does-not-exist" with utm params', async () => {
  const response = await app.request("/does-not-exist");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://arpitdalal.dev/does-not-exist?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});
