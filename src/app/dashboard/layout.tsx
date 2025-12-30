"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isMinimized } = useSidebar();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <Sidebar />
            <div className={cn(
                "flex flex-col min-h-screen transition-all duration-300",
                isMinimized ? "md:pl-20" : "md:pl-64"
            )}>
                {/* Top Navbar */}
                <header className="h-16 border-b bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="font-semibold text-lg">Hospital Dashboard</h2>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 relative transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
