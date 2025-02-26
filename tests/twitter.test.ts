import { test, expect } from "bun:test";
import app from "../src";

test('"/twitter" redirects to "x.com/arpitdalal_dev" without utm params', async () => {
  const response = await app.request("/twitter");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://x.com/arpitdalal_dev/"
  );
});

test('"/x" redirects to "x.com/arpitdalal_dev" without utm params', async () => {
  const response = await app.request("/x");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://x.com/arpitdalal_dev/"
  );
});
