import { test, expect } from '@playwright/test';

test('Rooms shown on the home page match the API data', async ({ page, request }) => {
  // 1. Get the data from the API
  const res = await request.get('/api/room');
  expect(res.status()).toBe(200);
  const { rooms } = await res.json();
  const apiPrices: number[] = rooms.map((r: any) => r.roomPrice);

  // 2. Open the page and wait until the room prices are shown
  await page.goto('/');
  await expect(page.getByText(/per night/).first()).toBeVisible();

  // 3. Read every "£<number> per night" shown on the page
  const text = await page.locator('body').innerText();
  const shownPrices = [...text.matchAll(/£(\d+) per night/g)].map((m) => Number(m[1]));

  // 4. Everything shown on the page must exist in the API
  expect(shownPrices.length).toBeGreaterThan(0);
  expect(shownPrices.length).toBeLessThanOrEqual(rooms.length);
  expect(apiPrices).toEqual(expect.arrayContaining(shownPrices));
});