import { Sidebar } from "@/components/layout/Sidebar";
import { Bell } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-slate-900">
            <Sidebar />
            <div className="md:pl-64 flex flex-col min-h-screen">
                {/* Top Navbar */}
                <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="font-semibold text-lg">Hospital Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
