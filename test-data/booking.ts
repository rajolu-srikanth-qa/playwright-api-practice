export const credentials = {
  username: 'admin',
  password: 'password123',
};

export const validBooking = {
  firstname: 'Srikanth',
  lastname: 'Rajolu',
  totalprice: 500,
  depositpaid: true,
  bookingdates: { checkin: '2026-10-24', checkout: '2026-10-27' },
  additionalneeds: 'Breakfast',
};

// Returns a copy of validBooking with some fields changed
export function buildBooking(overrides: Partial<typeof validBooking> = {}) {
  return { ...validBooking, ...overrides };
}