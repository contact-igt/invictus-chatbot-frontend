import { NextResponse } from "next/server";

export async function POST(req: Request){
    const body = await req.json();
    const {phone_number_id, otp} = body;

     const res = await fetch(
    `https://graph.facebook.com/v19.0/${phone_number_id}/verify_code`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.META_SYSTEM_USER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: otp,
      }),
    }
  );

  const data = await res.json();

  console.log("META VERIFY OTP RESPONSE:", data);

  return NextResponse.json({
    success: data.success === true,
  });
}