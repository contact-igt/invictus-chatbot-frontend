"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Smartphone } from "lucide-react";

export default function ConnectWhatsApp() {
    const [isConnected, setIsConnected] = useState(false);



    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Connect WhatsApp</h1>
                <p className="text-slate-500">Link your hospital's business number to start the AI.</p>
            </div>

            <Card className="border-2 border-dashed border-slate-200">
                <CardContent className="py-20 flex flex-col items-center justify-center text-center">
                    {isConnected ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Number Connected!</h2>
                            <p className="text-slate-500 mb-6">+1 (555) 123-4567 is active.</p>
                            <Button variant="outline" onClick={() => setIsConnected(false)}>Disconnect</Button>
                        </div>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6">
                                <Smartphone className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Link with Meta Business</h2>
                            <p className="text-slate-500 max-w-md mb-8">
                                Clicking the button below will open the Meta (Facebook) login popup to authorize your WhatsApp Business number.
                            </p>
                            <Button size="lg" className="bg-[#25D366] hover:bg-[#20bd5a]" >
                                Connect WhatsApp Number
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Steps Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    "Login to Meta Business",
                    "Approve Permissions",
                    "Select Phone Number"
                ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">{i + 1}</div>
                        <span className="font-medium">{step}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
