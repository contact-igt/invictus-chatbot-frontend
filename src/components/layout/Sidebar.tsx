"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Users, Calendar, Settings, Smartphone, Megaphone, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";

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
    const { isMinimized, toggle } = useSidebar();

    return (
        <div className={cn(
            "hidden border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300",
            isMinimized ? "w-20" : "w-64"
        )}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                {!isMinimized && (
                    <h1 className="text-2xl font-bold text-primary">MedChat<span className="text-secondary">AI</span></h1>
                )}
                <button
                    onClick={toggle}
                    className={cn(
                        "p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300",
                        isMinimized && "mx-auto"
                    )}
                >
                    {isMinimized ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
                                isMinimized && "justify-center"
                            )}
                            title={isMinimized ? item.label : undefined}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isMinimized && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className={cn(
                    "flex items-center gap-3",
                    isMinimized && "justify-center"
                )}>
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                    {!isMinimized && (
                        <div className="text-xs">
                            <p className="font-medium text-slate-900 dark:text-slate-100">Dr. Smith</p>
                            <p className="text-slate-500 dark:text-slate-400">City Hospital</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
