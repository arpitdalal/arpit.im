import { test, expect } from "bun:test";
import app from "../src";

test('"/live" redirects to "https://www.youtube.com/channel/UCKi0CBLeunUbvhdrnrLrr9Q/live"', async () => {
  const response = await app.request("/live");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://www.youtube.com/channel/UCKi0CBLeunUbvhdrnrLrr9Q/live"
  );
});
