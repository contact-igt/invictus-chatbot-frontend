import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json(
                { success: false, error: "Authorization code is required" },
                { status: 400 }
            );
        }

        // Exchange the authorization code for an access token
        // This is where you would call Meta's API to exchange the code
        const tokenResponse = await fetch(
            `https://graph.facebook.com/v19.0/oauth/access_token?` +
            `client_id=${process.env.NEXT_PUBLIC_META_APP_ID}` +
            `&client_secret=${process.env.META_APP_SECRET}` +
            `&code=${code}`,
            {
                method: "GET",
            }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Meta API error:", tokenData);
            return NextResponse.json(
                { success: false, error: "Failed to exchange authorization code" },
                { status: 500 }
            );
        }

        // Get WhatsApp Business Account details
        const wabaid = tokenData.waba_id || process.env.WABA_ID;
        const accessToken = tokenData.access_token;

        // Optionally: Store the access token and WABA ID in your database
        // For now, we'll just return success

        // Get phone number details if available
        let phoneNumber = null;
        if (wabaid && accessToken) {
            try {
                const phoneResponse = await fetch(
                    `https://graph.facebook.com/v19.0/${wabaid}/phone_numbers`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const phoneData = await phoneResponse.json();
                if (phoneData.data && phoneData.data.length > 0) {
                    phoneNumber = phoneData.data[0].display_phone_number;
                }
            } catch (error) {
                console.error("Error fetching phone number:", error);
            }
        }

        return NextResponse.json({
            success: true,
            message: "WhatsApp Business connected successfully",
            phoneNumber,
            wabaid,
        });
    } catch (error) {
        console.error("Error in embedded signup callback:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
