import { test, expect } from '@playwright/test';

test('A room created through the API appears in the admin rooms list', async ({ page, request }) => {
  // 1. Log in through the API
  const login = await request.post('/api/auth/login', {
    data: { username: 'admin', password: 'password' },
  });
  expect(login.status()).toBe(200);
  const { token } = await login.json();
  const auth = { Cookie: `token=${token}` };

  // 2. Create a room with a unique price (the site allows 999 at most)
  const uniquePrice = 300 + Math.floor(Math.random() * 699); // 300 to 998
  const create = await request.post('/api/room', {
    headers: auth,
    data: {
      roomName: '999',
      type: 'Single',
      accessible: true,
      description: 'Practice room created by an automated test',
      image: '/images/room1.jpg',
      features: ['WiFi'],
      roomPrice: uniquePrice,
    },
  });
  expect(create.status()).toBe(200);

  // 3. Verify through the API that the room exists with the right data
  const list = await (await request.get('/api/room')).json();
  const mine = list.rooms.find((r: any) => r.roomPrice === uniquePrice);
  expect(mine).toBeTruthy();
  expect(mine.roomName).toBe('999');

  // 4. Log in to the admin page through the browser
  await page.goto('/admin');
  await page.getByPlaceholder('Enter username').fill('admin');
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/admin\/rooms/);

  // 5. Verify the new room is listed on the admin page
  await expect(page.getByText(String(uniquePrice), { exact: true }).first()).toBeVisible();
});