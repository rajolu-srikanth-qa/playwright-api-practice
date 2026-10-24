import {test,expect, request} from '@playwright/test';
test.describe.serial('Booking CURD Flow',()=>{
    let token :string;
    let bookingId: number;
    const payload ={
        firstname: 'Srikanth',
        lastname: 'rajolu',
        totalprice: 500,
        depositpaid: true,
        bookingdates: {checkin:'2026-10-24',checkout:'2026-10-27'},
        additionalneeds: 'Breakfast',
    };
    test ('1.Generate auth token',async({ request })=> {
        const res = await request.post('/auth',{
            data: {username:'admin', password: 'password123'},
        });
        expect(res.status()).toBe(200);
        const body =await res.json();
        token =body.token;
        expect(token).toBeTruthy();
    } );

    test ('2. Create booking (POST)',async ({request})=>
    {
        const res = await request.post('/booking',{data:payload});
        expect(res.status()).toBe(200);
        const body = await res.json();
        bookingId=body.bookingid;

        expect(bookingId).toBeTruthy();
        expect(body.booking.firstname).toBe(payload.firstname);
        expect(body.booking.totalprice).toBe(payload.totalprice);
        expect(body.booking.bookingdates.checkin).toBe('2026-10-24');
    });

    test ('3.Get booking (GET)', async ({request})=>
    {
        const res = await request.get(`/booking/${bookingId}`);
        expect(res.status()).toBe(200);

        const body = await res.json();
        expect(body.firstname).toBe(payload.firstname);
        expect(body.lastname).toBe(payload.lastname);
        expect(body.totalprice).toBe(payload.totalprice);
        expect(body.depositpaid).toBe(true);
        expect(body.bookingdates.checkout).toBe('2026-10-27');
    });


    test('4. Update booking (PUT)',async({request})=>
    {
        const updatedPayload ={
            ...payload,
            firstname: 'Updated',
            totalprice:900,
        };
        const res = await request.put(`/booking/${bookingId}`, {
            headers: {
                Cookie: `token=${token}`,
                Accept: 'application/json', 
            },
            data : updatedPayload,
        });
        expect(res.status()).toBe(200);
        const body = await res.json();

        expect(body.firstname).toBe('Updated');
        expect(body.totalprice).toBe(900);
        expect(body.lastname).toBe(payload.lastname);
    });

    test('5.Partial Update(PATCH)',async({request})=>
        {
          const res = await request.patch(`booking/${bookingId}`,
          {
           headers:
           {
            Cookie: `token=${token}`,
            Accept: 'application/json',
            },
            data: {additionalneeds:'Dinner'},
           });
           expect(res.status()).toBe(200);
           const body = await res.json();
           expect(body.additionalneeds).toBe('Dinner');
           expect(body.firstname).toBe('Updated');
           expect(body.totalprice).toBe(900);
      });

     test('6. Delete booking (DELETE)', async({request}) =>
      {
        const res = await request.delete(`/booking/${bookingId}`,
       {
           headers: 
           {
            Cookie: `token=${token}`,
           },
        });
        expect(res.status()).toBe(201);
      });
     test('7.verify booking is deleted (Get)',async({request})=>
        {
        const res = await request.get(`booking/${bookingId}`);
        expect(res.status()).toBe(404);
        });

    });
