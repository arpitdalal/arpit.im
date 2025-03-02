import { test, expect } from "vitest";
import app from "../src";

test('"/github" redirects to "github.com/arpitdalal" without utm params', async () => {
  const response = await app.request("/github");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://github.com/arpitdalal/"
  );
});

test('"/gh" redirects to "github.com/arpitdalal" without utm params', async () => {
  const response = await app.request("/gh");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://github.com/arpitdalal/"
  );
});

test('"/gh/arpit.im" redirects to "github.com/arpitdalal/arpit.im" without utm params', async () => {
  const response = await app.request("/gh/arpit.im");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://github.com/arpitdalal/arpit.im"
  );
});
