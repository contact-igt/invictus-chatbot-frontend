import { NextResponse } from "next/server";

// Dummy API for sending WhatsApp messages
// Replace this with actual backend API integration later
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { recipient, message, chatId } = body;

        // TODO: Replace with actual WhatsApp Business API call
        // For now, simulate a successful API response
        console.log("Sending message:", { recipient, message, chatId });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return dummy success response
        return NextResponse.json({
            success: true,
            message: {
                id: `msg_${Date.now()}`,
                text: message,
                sender: "ai",
                time: new Date().toLocaleTimeString(),
                timestamp: new Date().toISOString(),
                status: "sent"
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to send message"
            },
            { status: 500 }
        );
    }
}
