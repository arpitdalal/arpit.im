import { test, expect } from "vitest";
import app from "../src";

test('"/epic-content-stack" redirects to "github.com/arpitdalal/epic-content-stack" without utm params', async () => {
  const response = await app.request("/epic-content-stack");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://github.com/arpitdalal/epic-content-stack"
  );
});

test('"/ecs" redirects to "github.com/arpitdalal/epic-content-stack" without utm params', async () => {
  const response = await app.request("/ecs");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://github.com/arpitdalal/epic-content-stack"
  );
});
