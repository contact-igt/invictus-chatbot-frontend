"use client";
import { useState, useEffect } from "react";

// TypeScript declarations for Facebook SDK
declare global {
    interface Window {
        FB: {
            init: (params: {
                appId: string;
                xfbml: boolean;
                version: string;
            }) => void;
            login: (
                callback: (response: {
                    authResponse?: {
                        code: string;
                        accessToken?: string;
                    };
                    status?: string;
                }) => void,
                options: {
                    config_id: string;
                    response_type: string;
                    override_default_response_type: boolean;
                    scope: string;
                }
            ) => void;
        };
        fbAsyncInit: () => void;
    }
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    CheckCircle2,
    Smartphone,
    ArrowLeft,
    Phone,
    Shield,
    Loader2
} from "lucide-react";

type WizardStep = "initial" | "phone-input" | "otp-verify" | "success";
type VerificationMethod = "SMS" | "VOICE";

interface ConnectionData {
    phoneNumber: string;
    countryCode: string;
    verificationMethod: VerificationMethod;
    otp: string;
    phoneNumberId?: string;
}

export default function ConnectWhatsApp() {
    const [currentStep, setCurrentStep] = useState<WizardStep>("initial");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [connectionData, setConnectionData] = useState<ConnectionData>({
        phoneNumber: "",
        countryCode: "+91",
        verificationMethod: "SMS",
        otp: "",
    });

    // Load Facebook SDK on client side only
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if SDK is already loaded
        if (window.FB) {
            setSdkLoaded(true);
            return;
        }

        // Define the async init function
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: process.env.NEXT_PUBLIC_META_APP_ID || "",
                xfbml: false,
                version: "v19.0",
            });
            setSdkLoaded(true);
        };

        // Load the SDK script
        if (!document.getElementById("facebook-jssdk")) {
            const script = document.createElement("script");
            script.id = "facebook-jssdk";
            script.src = "https://connect.facebook.net/en_US/sdk.js";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleStartConnection = () => {
        setCurrentStep("phone-input");
        setError("");
    };

    const handleSendOTP = async () => {
        setError("");

        // Validate phone number
        if (!connectionData.phoneNumber || connectionData.phoneNumber.length < 10) {
            setError("Please enter a valid phone number");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/whatsapp/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: connectionData.countryCode + connectionData.phoneNumber,
                    method: connectionData.verificationMethod
                })
            });

            await new Promise(resolve => setTimeout(resolve, 1500));

            setCurrentStep("otp-verify");
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setError("");

        // Validate OTP
        if (!connectionData.otp || connectionData.otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/whatsapp/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number_id: connectionData.phoneNumberId,
                    otp: connectionData.otp
                })
            });

            await new Promise(resolve => setTimeout(resolve, 1500));

            setCurrentStep("success");
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setError("");
        if (currentStep === "otp-verify") {
            setCurrentStep("phone-input");
        } else if (currentStep === "phone-input") {
            setCurrentStep("initial");
        }
    };

    const getStepNumber = () => {
        switch (currentStep) {
            case "phone-input": return 1;
            case "otp-verify": return 2;
            case "success": return 3;
            default: return 0;
        }
    };

    const connectWhatsApp = () => {
        // Check if FB SDK is loaded
        if (!sdkLoaded || typeof window.FB === 'undefined') {
            setError("Facebook SDK is still loading. Please wait a moment and try again.");
            return;
        }

        const configId = process.env.NEXT_PUBLIC_EMBEDDED_SIGNUP_CONFIG_ID;

        if (!configId) {
            console.error("Missing NEXT_PUBLIC_EMBEDDED_SIGNUP_CONFIG_ID");
            setError("Meta configuration missing. Contact support.");
            return;
        }

        setIsLoading(true);
        setError("");

        window.FB.login(
            function (response: any) {
                setIsLoading(false);

                if (!response.authResponse) {
                    console.log("User cancelled signup");
                    setError("WhatsApp connection was cancelled. Please try again.");
                    return;
                }

                // IMPORTANT:
                // Do NOT store this token
                // Only used by Meta to finish embedded signup
                const code = response.authResponse.code;

                // Send code to backend
                fetch("/api/meta/embedded-signup/callback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        code,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            setCurrentStep("success");
                            // Optionally update connection data with returned info
                            if (data.phoneNumber) {
                                setConnectionData({
                                    ...connectionData,
                                    phoneNumber: data.phoneNumber,
                                });
                            }
                        } else {
                            setError(data.error || "Failed to connect WhatsApp. Please try again.");
                        }
                    })
                    .catch((err) => {
                        console.error("Error connecting WhatsApp:", err);
                        setError("Failed to connect WhatsApp. Please try again.");
                    });
            },
            {
                config_id: configId,
                response_type: "code",
                override_default_response_type: true,
                scope: "whatsapp_business_management,whatsapp_business_messaging",
            }
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Connect WhatsApp</h1>
                <p className="text-slate-500">Link your hospital&apos;s business number to start the AI.</p>
            </div>

            <Card className="border-2 border-slate-200 shadow-lg">
                <CardContent className="py-12 px-8">
                    {/* Step Indicator */}
                    {currentStep !== "initial" && currentStep !== "success" && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between max-w-md mx-auto">
                                <div className={`flex items-center gap-2 ${getStepNumber() >= 1 ? 'text-primary' : 'text-slate-300'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getStepNumber() >= 1 ? 'bg-primary text-white' : 'bg-slate-200'}`}>
                                        1
                                    </div>
                                    <span className="text-sm font-medium hidden sm:inline">Phone</span>
                                </div>
                                <div className={`flex-1 h-1 mx-2 ${getStepNumber() >= 2 ? 'bg-primary' : 'bg-slate-200'}`} />
                                <div className={`flex items-center gap-2 ${getStepNumber() >= 2 ? 'text-primary' : 'text-slate-300'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getStepNumber() >= 2 ? 'bg-primary text-white' : 'bg-slate-200'}`}>
                                        2
                                    </div>
                                    <span className="text-sm font-medium hidden sm:inline">Verify</span>
                                </div>
                                <div className={`flex-1 h-1 mx-2 ${getStepNumber() >= 3 ? 'bg-primary' : 'bg-slate-200'}`} />
                                <div className={`flex items-center gap-2 ${getStepNumber() >= 3 ? 'text-primary' : 'text-slate-300'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getStepNumber() >= 3 ? 'bg-primary text-white' : 'bg-slate-200'}`}>
                                        3
                                    </div>
                                    <span className="text-sm font-medium hidden sm:inline">Done</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Initial Screen */}
                    {currentStep === "initial" && (
                        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 text-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <Smartphone className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Link with Meta Business</h2>
                            <p className="text-slate-500 max-w-md mb-8">
                                Connect your WhatsApp Business number using OTP verification. No Facebook login required.
                            </p>
                            <Button
                                size="lg"
                                className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                                onClick={connectWhatsApp}
                                disabled={!sdkLoaded || isLoading}
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                {!sdkLoaded ? "Loading..." : "Connect WhatsApp Number"}
                            </Button>
                        </div>
                    )}

                    {/* Phone Input Screen */}
                    {currentStep === "phone-input" && (
                        <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right duration-300">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                className="mb-4 -ml-2"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 text-[#25D366] rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    Step 1 of 3: Enter WhatsApp Business Number
                                </h2>
                                <p className="text-slate-500">
                                    We&apos;ll send you a verification code
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-3">
                                    <div className="w-28">
                                        <Label htmlFor="countryCode" className="text-sm font-medium">
                                            Country Code
                                        </Label>
                                        <select
                                            id="countryCode"
                                            value={connectionData.countryCode}
                                            onChange={(e) => setConnectionData({ ...connectionData, countryCode: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="+91">+91</option>
                                            <option value="+1">+1</option>
                                            <option value="+44">+44</option>
                                            <option value="+971">+971</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="phoneNumber" className="text-sm font-medium">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phoneNumber"
                                            type="tel"
                                            placeholder="9876543210"
                                            value={connectionData.phoneNumber}
                                            onChange={(e) => setConnectionData({ ...connectionData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                                            className="mt-1"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-3 block">
                                        Verification Method
                                    </Label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                            <input
                                                type="radio"
                                                name="method"
                                                value="SMS"
                                                checked={connectionData.verificationMethod === "SMS"}
                                                onChange={(e) => setConnectionData({ ...connectionData, verificationMethod: e.target.value as VerificationMethod })}
                                                className="w-4 h-4 text-primary"
                                            />
                                            <span className="font-medium">SMS</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                            <input
                                                type="radio"
                                                name="method"
                                                value="VOICE"
                                                checked={connectionData.verificationMethod === "VOICE"}
                                                onChange={(e) => setConnectionData({ ...connectionData, verificationMethod: e.target.value as VerificationMethod })}
                                                className="w-4 h-4 text-primary"
                                            />
                                            <span className="font-medium">Voice Call</span>
                                        </label>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    size="lg"
                                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white"
                                    onClick={handleSendOTP}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Sending OTP...
                                        </>
                                    ) : (
                                        "Send OTP"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* OTP Verification Screen */}
                    {currentStep === "otp-verify" && (
                        <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right duration-300">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                className="mb-4 -ml-2"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    Step 2 of 3: Verify OTP
                                </h2>
                                <p className="text-slate-500">
                                    Enter 6-digit OTP sent to{" "}
                                    <span className="font-semibold text-slate-700">
                                        {connectionData.countryCode} {connectionData.phoneNumber}
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="otp" className="text-sm font-medium">
                                        OTP Code
                                    </Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="000000"
                                        value={connectionData.otp}
                                        onChange={(e) => setConnectionData({ ...connectionData, otp: e.target.value.replace(/\D/g, '') })}
                                        className="mt-1 text-center text-2xl tracking-widest font-bold"
                                        maxLength={6}
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    size="lg"
                                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white"
                                    onClick={handleVerifyOTP}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </Button>

                                <button
                                    className="w-full text-sm text-primary hover:underline"
                                    onClick={handleSendOTP}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Success Screen */}
                    {currentStep === "success" && (
                        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl animate-in zoom-in duration-700">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                ✅ WhatsApp Connected Successfully
                            </h2>
                            <p className="text-slate-500 mb-8">
                                Your WhatsApp Business account is now active
                            </p>

                            <div className="w-full max-w-md bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 space-y-4 border border-slate-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Connected Number:</span>
                                    <span className="text-slate-900 font-bold">
                                        {connectionData.countryCode} {connectionData.phoneNumber}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Status:</span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                        Active
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Messaging Quality:</span>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                        Green
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="lg"
                                className="mt-8"
                                onClick={() => {
                                    setCurrentStep("initial");
                                    setConnectionData({
                                        phoneNumber: "",
                                        countryCode: "+91",
                                        verificationMethod: "SMS",
                                        otp: "",
                                    });
                                }}
                            >
                                Disconnect
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Cards - Only show on initial screen */}
            {currentStep === "initial" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Phone, title: "Enter Phone Number", desc: "Provide your WhatsApp Business number" },
                        { icon: Shield, title: "Verify OTP", desc: "Confirm with the code sent to you" },
                        { icon: CheckCircle2, title: "Start Messaging", desc: "Begin using AI-powered responses" }
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0">
                                <step.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 mb-1">{step.title}</div>
                                <p className="text-sm text-slate-500">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
