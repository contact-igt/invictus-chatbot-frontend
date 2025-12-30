"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, MessageSquare, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', patients: 40 },
    { name: 'Tue', patients: 30 },
    { name: 'Wed', patients: 55 },
    { name: 'Thu', patients: 45 },
    { name: 'Fri', patients: 60 },
    { name: 'Sat', patients: 25 },
    { name: 'Sun', patients: 15 },
];

export default function DashboardOverview() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Welcome back, Dr. Smith.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Patients Today", val: "124", icon: Users, color: "text-blue-600" },
                    { label: "Appointments Booked", val: "38", icon: Calendar, color: "text-purple-600" },
                    { label: "AI Conversations", val: "412", icon: MessageSquare, color: "text-green-600" },
                    { label: "Response Rate", val: "99.8%", icon: Activity, color: "text-orange-600" },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-2 text-slate-900 dark:text-slate-100">{stat.val}</h3>
                            </div>
                            <div className={`p-3 bg-slate-50 dark:bg-slate-800 rounded-full ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart */}
            <Card className="h-[400px]">
                <CardHeader>
                    <CardTitle>Patient Inquiries (This Week)</CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="patients" fill="#007bff" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
