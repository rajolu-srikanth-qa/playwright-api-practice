import { test, expect } from '@playwright/test';
import { validBooking } from '../../test-data/booking';
import {
  bookingSchema,
  createBookingResponseSchema,
  bookingListSchema,
} from '../../schemas/booking-schema';

test.describe('Schema validation', () => {

  test('S1. Booking list matches schema', async ({ request }) => {
    const res = await request.get('/booking');
    expect(res.status()).toBe(200);

    const result = bookingListSchema.safeParse(await res.json());
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
  });

  test('S2. Create response matches schema', async ({ request }) => {
    const res = await request.post('/booking', { data: validBooking });
    expect(res.status()).toBe(200);

    const result = createBookingResponseSchema.safeParse(await res.json());
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
  });

  test('S3. Single booking matches schema', async ({ request }) => {
    const create = await request.post('/booking', { data: validBooking });
    const { bookingid } = await create.json();

    const res = await request.get(`/booking/${bookingid}`);
    expect(res.status()).toBe(200);

    const result = bookingSchema.safeParse(await res.json());
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
  });
});