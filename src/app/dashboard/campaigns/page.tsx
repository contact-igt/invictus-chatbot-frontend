"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Megaphone, Send, Users, Clock } from "lucide-react";

export default function CampaignsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Broadcast Campaigns</h1>
                    <p className="text-slate-500">Send bulk WhatsApp messages to your patients.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> New Campaign
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Sent", val: "12,450", icon: Send, color: "text-blue-600" },
                    { label: "Delivered", val: "98.2%", icon: Users, color: "text-green-600" },
                    { label: "Read Rate", val: "84%", icon: Megaphone, color: "text-purple-600" },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold">{stat.val}</h3>
                            </div>
                            <div className={`p-3 bg-slate-50 rounded-full ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Campaigns</CardTitle>
                    <CardDescription>History of your broadcast messages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-semibold border-b">
                            <tr>
                                <th className="p-4">Campaign Name</th>
                                <th className="p-4">Audience</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Sent Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {[
                                { name: "Flu Shot Reminder", audience: "All Patients (>60yo)", status: "Completed", date: "Oct 20, 2024" },
                                { name: "Diwali Health Tips", audience: "Active Patients", status: "Scheduled", date: "Oct 28, 2024" },
                                { name: "Dr. Smith Leave Alert", audience: "Appointments (Tomorrow)", status: "Sent", date: "Yesterday" },
                            ].map((camp, i) => (
                                <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="p-4 font-medium text-slate-900">{camp.name}</td>
                                    <td className="p-4">{camp.audience}</td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1.5 w-fit px-2 py-1 rounded-full text-xs font-medium 
                                    ${camp.status === 'Completed' || camp.status === 'Sent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {camp.status === 'Scheduled' && <Clock className="w-3 h-3" />}
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{camp.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
