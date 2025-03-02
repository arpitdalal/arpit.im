import { test, expect } from "vitest";
import app from "../src";

test('"/xman" redirects to "xman.arpitdalal.dev/" with utm params', async () => {
  const response = await app.request("/xman");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://xman.arpitdalal.dev/?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});

test('"/xman/app/dashboard" redirects to "xman.arpitdalal.dev/app/dashboard" with utm params', async () => {
  const response = await app.request("/xman/app/dashboard");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://xman.arpitdalal.dev/app/dashboard?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});

test('"/xman/app/dashboard?utm_source=twitter&utm_medium=referrer&utm_campaign=social" redirects to "xman.arpitdalal.dev/app/dashboard?utm_source=twitter&utm_medium=referrer&utm_campaign=social" with utm params', async () => {
  const response = await app.request(
    "/xman/app/dashboard?utm_source=twitter&utm_medium=referrer&utm_campaign=social"
  );

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://xman.arpitdalal.dev/app/dashboard?utm_source=twitter&utm_medium=referrer&utm_campaign=social"
  );
});
