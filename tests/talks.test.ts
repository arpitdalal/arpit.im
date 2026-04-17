import { test, expect } from 'vitest';
import app from '../src';

const utm =
  '?utm_source=arpit.im&utm_medium=redirect&utm_campaign=url-shortener';

test('"/talks" redirects to talks index with utm params', async () => {
  const response = await app.request('/talks');

  expect(response.status).toBe(302);
  expect(response.headers.get('Location')).toBe(
    `https://arpitdalal.dev/talks${utm}`,
  );
});

test('"/talks/steering" redirects to talks hash with utm params', async () => {
  const response = await app.request('/talks/steering');

  expect(response.status).toBe(302);
  expect(response.headers.get('Location')).toBe(
    `https://arpitdalal.dev/talks${utm}#steering`,
  );
});

test('"/talks/steering/unknown" falls back to talks hash when nested path missing', async () => {
  const response = await app.request('/talks/steering/unknown');

  expect(response.status).toBe(302);
  expect(response.headers.get('Location')).toBe(
    `https://arpitdalal.dev/talks${utm}#steering`,
  );
});
