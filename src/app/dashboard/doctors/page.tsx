"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

// Simple Table Component
export default function DoctorsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Doctors</h1>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Add Doctor
                </Button>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-semibold border-b">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Speciality</th>
                            <th className="p-4">Availability</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {[
                            { name: "Dr. Smith", spec: "Cardiology", time: "Mon-Fri, 9am - 5pm", status: "Active" },
                            { name: "Dr. Emily", spec: "Pediatrics", time: "Tue-Sat, 10am - 6pm", status: "On Leave" },
                            { name: "Dr. House", spec: "Diagnostics", time: "Mon-Wed, 8am - 12pm", status: "Active" },
                        ].map((doc, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                                <td className="p-4 font-medium text-slate-900">{doc.name}</td>
                                <td className="p-4">{doc.spec}</td>
                                <td className="p-4">{doc.time}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${doc.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {doc.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
