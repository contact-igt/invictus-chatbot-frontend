import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { phone_number, method } = body;

    const res = await fetch(
        `https://graph.facebook.com/v19.0/${process.env.WABA_ID}/phone_numbers`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.WA_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                cc: "91",
                phone_number: phone_number.slice(2),
                verified_name: "City Hospital",
                code_method: method,
                language: "en",

            })
        }
    );
    const data = await res.json();
    return NextResponse.json({
        phone_number_id: data.id
    })
}