"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Bot } from "lucide-react";

// Mock Data
const chats = [
    { id: 1, name: "Sarah Connor", lastMsg: "Is Dr. Smith available?", time: "2m", unread: 1 },
    { id: 2, name: "John Doe", lastMsg: "Appointment confirmed.", time: "1h", unread: 0 },
    { id: 3, name: "Alice Wonderland", lastMsg: "Thanks!", time: "3h", unread: 0 },
];

const messages = [
    { id: 1, text: "Hello, I have a fever. Is Dr. Smith in today?", sender: "user", time: "10:30 AM" },
    { id: 2, text: "Hello! Yes, Dr. Smith is available from 2 PM to 6 PM today. Would you like to book a slot?", sender: "ai", time: "10:30 AM" },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState(chats[0]);

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white border rounded-xl overflow-hidden shadow-sm">
            {/* Sidebar List */}
            <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input className="pl-9" placeholder="Search patients..." />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition ${selectedChat.id === chat.id ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex justify-between mb-1">
                                <span className="font-semibold text-slate-900">{chat.name}</span>
                                <span className="text-xs text-slate-400">{chat.time}</span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">{chat.lastMsg}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-slate-50/50">
                <div className="p-4 border-b bg-white flex justify-between items-center">
                    <h3 className="font-bold text-lg">{selectedChat.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">WhatsApp</span>
                </div>

                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center mr-2 shadow-sm">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}
                            <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${msg.sender === 'ai' ? 'bg-white text-slate-800 rounded-tl-none' : 'bg-primary text-white rounded-tr-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white border-t flex gap-2">
                    <Input placeholder="Type a reply..." />
                    <Button size="icon"><Send className="w-4 h-4" /></Button>
                </div>
            </div>
        </div>
    );
}
