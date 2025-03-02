import { test, expect } from "vitest";
import app from "../src";

test('"/youtube" redirects to "youtube.com/@arpitdalal_dev" without utm params', async () => {
  const response = await app.request("/youtube");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://youtube.com/@arpitdalal_dev/"
  );
});

test('"/yt" redirects to "youtube.com/@arpitdalal_dev" without utm params', async () => {
  const response = await app.request("/yt");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://youtube.com/@arpitdalal_dev/"
  );
});
