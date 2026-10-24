import { test, expect } from '@playwright/test';

test('Rooms from the API are shown on the home page', async ({ page, request }) => {
  // 1. Get the data from the API (fast and reliable)
  const res = await request.get('/api/room');
  expect(res.status()).toBe(200);

  const { rooms } = await res.json();
  expect(rooms.length).toBeGreaterThan(0);

  // 2. Open the website in a real browser
  await page.goto('/');

  // 3. Check that what the API says is shown on screen
  for (const room of rooms) {
    await expect(page.getByText(room.type).first()).toBeVisible();
    await expect(page.getByText(String(room.roomPrice)).first()).toBeVisible();
  }
});
