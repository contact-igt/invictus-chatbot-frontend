import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phoneNumberId = searchParams.get("phone_number_id");

  console.log("FETCH DETAILS FOR:", phoneNumberId);

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.META_SYSTEM_USER_TOKEN}`,
      },
    }
  );

  const data = await res.json();

  console.log("META DETAILS RESPONSE:", data);

  return NextResponse.json({
    phone_number_id: data.id,
    display_phone_number: data.display_phone_number,
    quality_rating: data.quality_rating,
    waba_id: data.whatsapp_business_account?.id,
  });
}