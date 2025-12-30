"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const getIcon = () => {
        switch (theme) {
            case "light":
                return <Sun className="w-5 h-5" />;
            case "dark":
                return <Moon className="w-5 h-5" />;
            case "system":
                return <Monitor className="w-5 h-5" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors">
                    {getIcon()}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="cursor-pointer"
                >
                    <Sun className="w-4 h-4 mr-2" />
                    <span>Light</span>
                    {theme === "light" && (
                        <span className="ml-auto text-blue-600">✓</span>
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="cursor-pointer"
                >
                    <Moon className="w-4 h-4 mr-2" />
                    <span>Dark</span>
                    {theme === "dark" && (
                        <span className="ml-auto text-blue-600">✓</span>
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="cursor-pointer"
                >
                    <Monitor className="w-4 h-4 mr-2" />
                    <span>System</span>
                    {theme === "system" && (
                        <span className="ml-auto text-blue-600">✓</span>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
