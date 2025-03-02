import { test, expect } from "vitest";
import app from "../src";

test('"/linkedin" redirects to "linkedin.com/in/arpitdalal" without utm params', async () => {
  const response = await app.request("/linkedin");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://linkedin.com/in/arpitdalal/"
  );
});

test('"/in" redirects to "linkedin.com/in/arpitdalal" without utm params', async () => {
  const response = await app.request("/in");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://linkedin.com/in/arpitdalal/"
  );
});
