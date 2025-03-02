import { test, expect } from "vitest";
import app from "../src";

test('"/b" redirects to "blog.arpitdalal.dev" with utm params', async () => {
  const response = await app.request("/b");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://blog.arpitdalal.dev/?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});
test('"/blog" redirects to "blog.arpitdalal.dev" with utm params', async () => {
  const response = await app.request("/blog");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://blog.arpitdalal.dev/?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});

test('"/b/notion-url" redirects to "blog.arpitdalal.dev/enhancing-user-experience-with-notion-style-url-architecture" with utm params', async () => {
  const response = await app.request("/b/notion-url");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://blog.arpitdalal.dev/enhancing-user-experience-with-notion-style-url-architecture?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});
test('"/blog/notion-url" redirects to "blog.arpitdalal.dev/enhancing-user-experience-with-notion-style-url-architecture" with utm params', async () => {
  const response = await app.request("/blog/notion-url");

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    "https://blog.arpitdalal.dev/enhancing-user-experience-with-notion-style-url-architecture?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener"
  );
});
