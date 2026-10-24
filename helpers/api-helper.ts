import { APIRequestContext, expect } from '@playwright/test';
import { credentials, validBooking } from '../test-data/booking';

// Logs in and returns the token
export async function getToken(request: APIRequestContext): Promise<string> {
  const res = await request.post('/auth', { data: credentials });
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.token).toBeTruthy();
  return body.token;
}

// Creates a booking and returns its ID
export async function createBooking(
  request: APIRequestContext,
  data: object = validBooking
): Promise<number> {
  const res = await request.post('/booking', { data });
  expect(res.status()).toBe(200);

  const body = await res.json();
  return body.bookingid;
}

// Headers needed for protected actions (PUT, PATCH, DELETE)
export function authHeaders(token: string) {
  return {
    Cookie: `token=${token}`,
    Accept: 'application/json',
  };
}