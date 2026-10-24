import { z } from 'zod';

const dateText = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD');

// Shape of one booking
export const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: dateText,
    checkout: dateText,
  }),
  additionalneeds: z.string().optional(),
});

// Shape of the response when creating a booking
export const createBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: bookingSchema,
});

// Shape of the list of bookings
export const bookingListSchema = z.array(
  z.object({ bookingid: z.number() })
);