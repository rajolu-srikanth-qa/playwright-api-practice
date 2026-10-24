import { test, expect } from '@playwright/test';
import { validBooking, buildBooking } from '../../test-data/booking';
import { getToken, createBooking, authHeaders } from '../../helpers/api-helper';

test.describe.serial('Booking CRUD (clean version)', () => {
  let token: string;
  let bookingId: number;

  test('1. Setup: get token and create booking', async ({ request }) => {
    token = await getToken(request);
    bookingId = await createBooking(request);
    expect(bookingId).toBeTruthy();
  });

  test('2. GET returns the created booking', async ({ request }) => {
    const res = await request.get(`/booking/${bookingId}`);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(validBooking);
  });

  test('3. PUT updates the booking', async ({ request }) => {
    const updated = buildBooking({ firstname: 'Updated', totalprice: 900 });

    const res = await request.put(`/booking/${bookingId}`, {
      headers: authHeaders(token),
      data: updated,
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(updated);
  });

  test('4. PATCH changes one field only', async ({ request }) => {
    const res = await request.patch(`/booking/${bookingId}`, {
      headers: authHeaders(token),
      data: { additionalneeds: 'Dinner' },
    });
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.additionalneeds).toBe('Dinner');
    expect(body.firstname).toBe('Updated');
  });

  test('5. DELETE removes the booking', async ({ request }) => {
    const del = await request.delete(`/booking/${bookingId}`, {
      headers: authHeaders(token),
    });
    expect(del.status()).toBe(201);

    const check = await request.get(`/booking/${bookingId}`);
    expect(check.status()).toBe(404);
  });
});