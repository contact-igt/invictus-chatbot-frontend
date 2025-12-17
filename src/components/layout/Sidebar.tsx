"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Users, Calendar, Settings, Smartphone, Megaphone, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Smartphone, label: "Connect WhatsApp", href: "/dashboard/connect" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
    { icon: Megaphone, label: "Campaigns", href: "/dashboard/campaigns" },
    { icon: BookOpen, label: "Knowledge Base", href: "/dashboard/knowledge" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/appointments" },
    { icon: Users, label: "Doctors", href: "/dashboard/doctors" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-white w-64 md:flex flex-col h-screen fixed left-0 top-0 z-20">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-primary">MedChat<span className="text-secondary">AI</span></h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="text-xs">
                        <p className="font-medium text-slate-900">Dr. Smith</p>
                        <p className="text-slate-500">City Hospital</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
