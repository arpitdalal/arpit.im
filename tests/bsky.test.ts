import { test, expect } from "vitest";
import app from "../src";

test('"/bsky" redirects to "bsky.app/profile/arpitdalal.dev" without utm params', async () => {
  const response = await app.request("/bsky");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://bsky.app/profile/arpitdalal.dev"
  );
});

test('"/🦋" redirects to "bsky.app/profile/arpitdalal.dev" without utm params', async () => {
  const response = await app.request("/🦋");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://bsky.app/profile/arpitdalal.dev"
  );
});
