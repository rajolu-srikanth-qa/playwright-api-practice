import {test,expect} from '@playwright/test';

test('GET ALL bookings returns 200', async({request})=>{
    const response = await request.get('/booking');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect (body[0]).toHaveProperty('bookingid');
});


