"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Stethoscope, Save } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Appointment {
    date: string;
    patient: string;
    doc: string;
    reason: string;
    src: string;
}

export default function AppointmentsPage() {
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [action, setAction] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleConsult = (appt: Appointment) => {
        setSelectedAppt(appt);
        setIsDialogOpen(true);
    };

    const handleComplete = () => {
        // Mock logic to handle different actions
        if (!selectedAppt) return;

        if (action === "surgery") {
            alert(`AI Agent: Initiated post-surgery follow-up sequence for ${selectedAppt.patient}. First check-in scheduled for tomorrow.`);
        } else if (action === "reschedule") {
            alert(`AI Agent: Sent rescheduling template to ${selectedAppt.patient} with next week's available slots.`);
        } else {
            alert(`AI Agent: Sent summary and contact info to ${selectedAppt.patient}. Case closed.`);
        }
        setIsDialogOpen(false);
        setAction("");
        setDiagnosis("");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Appointments</h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search patient or doctor..." className="pl-8" />
                </div>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-semibold border-b">
                        <tr>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4">Patient</th>
                            <th className="p-4">Doctor</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Source</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {[
                            { date: "Oct 24, 10:30 AM", patient: "Sarah Connor", doc: "Dr. Smith", reason: "Fever", src: "WhatsApp AI" },
                            { date: "Oct 24, 11:00 AM", patient: "Mike Ross", doc: "Dr. Emily", reason: "Checkup", src: "Manual" },
                            { date: "Oct 25, 09:15 AM", patient: "Harvey Specter", doc: "Dr. Smith", reason: "Heart Rate", src: "WhatsApp AI" },
                        ].map((appt, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                                <td className="p-4">{appt.date}</td>
                                <td className="p-4 font-medium text-slate-900">{appt.patient}</td>
                                <td className="p-4">{appt.doc}</td>
                                <td className="p-4">{appt.reason}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium border border-blue-100">
                                        {appt.src}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Button size="sm" variant="outline" className="gap-2" onClick={() => handleConsult(appt)}>
                                        <Stethoscope className="w-3.5 h-3.5" /> Consult
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Consultation Details</DialogTitle>
                        <DialogDescription>
                            Enter diagnosis and select next steps for {selectedAppt ? selectedAppt.patient : "Patient"}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="diagnosis" className="text-right">
                                Diagnosis
                            </Label>
                            <Input id="diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Viral Fever" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="action" className="text-right">
                                Action
                            </Label>
                            <Select onValueChange={setAction} value={action}>
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Select follow-up action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="info">Info Only (Reply Contact Info)</SelectItem>
                                    <SelectItem value="surgery">Surgery Recommended (Follow-up)</SelectItem>
                                    <SelectItem value="reschedule">Reschedule Appointment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {action === 'reschedule' && (
                            <div className="grid grid-cols-4 items-center gap-4 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="date" className="text-right">New Date</Label>
                                <Input id="date" type="date" className="col-span-3" />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleComplete} disabled={!action}>
                            <Save className="mr-2 h-4 w-4" /> Complete Consultation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
