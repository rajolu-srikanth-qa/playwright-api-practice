import { test, expect, APIRequestContext } from '@playwright/test';

const validPayload = {
  firstname: 'Srikanth',
  lastname: 'Rajolu',
  totalprice: 500,
  depositpaid: true,
  bookingdates: { checkin: '2026-10-24', checkout: '2026-10-27' },
  additionalneeds: 'Breakfast',
};

// Helper: creates a booking and returns its ID
async function createBooking(request: APIRequestContext): Promise<number> {
  const res = await request.post('/booking', { data: validPayload });
  expect(res.status()).toBe(200);
  const body = await res.json();
  return body.bookingid;
}

test.describe('Negative tests', () => {

  test('N1. Wrong password does not return a token', async ({ request }) => {
    const res = await request.post('/auth', {
      data: { username: 'admin', password: 'wrongpassword' },
    });
    const body = await res.json();

    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('N2. Create booking with missing lastname fails', async ({ request }) => {
    const { lastname, ...incompletePayload } = validPayload;

    const res = await request.post('/booking', { data: incompletePayload });

    expect(res.status()).not.toBe(200);
    console.log('Missing field status:', res.status());
  });

  test('N3. GET a booking that does not exist returns 404', async ({ request }) => {
    const res = await request.get('/booking/99999999');
    expect(res.status()).toBe(404);
  });

  test('N4. PUT without token returns 403', async ({ request }) => {
    const id = await createBooking(request);

    const res = await request.put(`/booking/${id}`, {
      headers: { Accept: 'application/json' },
      data: { ...validPayload, firstname: 'Hacker' },
    });

    expect(res.status()).toBe(403);
  });

  test('N5. DELETE without token returns 403', async ({ request }) => {
    const id = await createBooking(request);

    const res = await request.delete(`/booking/${id}`);
    expect(res.status()).toBe(403);

    // Booking must still exist after the failed delete
    const check = await request.get(`/booking/${id}`);
    expect(check.status()).toBe(200);
  });

  test('N6. PUT with an invalid token returns 403', async ({ request }) => {
    const id = await createBooking(request);

    const res = await request.put(`/booking/${id}`, {
      headers: { Cookie: 'token=invalidtoken123', Accept: 'application/json' },
      data: validPayload,
    });

    expect(res.status()).toBe(403);
  });
});