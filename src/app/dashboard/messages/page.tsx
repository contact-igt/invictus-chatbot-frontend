"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Bot, User } from "lucide-react";
import { useAddMessageMutation, useGetAllChatsQuery, useMessagesByPhoneQuery } from "@/hooks/useMessagesQuery";

const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays =
        (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7)
        return date.toLocaleDateString("en-US", { weekday: "long" });

    return date.toLocaleDateString("en-GB");
};

const formattedTime = (dateString: any) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}
export default function MessagesPage() {
    const {
        data: chatList,
        isLoading: isChatsLoading,
        isError: isChatsError,
    } = useGetAllChatsQuery();

    const { mutate: sendMessageMutation, isPending } = useAddMessageMutation();
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const {
        data: messagesData,
        isLoading: isMessagesLoading,
        isError: isMessagesError,
    } = useMessagesByPhoneQuery(selectedChat?.phone);

    const [message, setMessage] = useState<string>("");
    const handleInputChange = (e: any) => {
        setMessage(e.target.value);
    }
    console.log(chatList);

    const handleSelectChat = (chat: any) => {
        setSelectedChat({
            phone: chat.phone,
            name: chat.name ?? chat.phone,
        });
    };

    const groupMessagesByDate = (messages: any[] = []) => {
        return messages?.reduce((groups: any, msg: any) => {
            const label = getDateLabel(msg.created_at || msg.timestamp);

            if (!groups[label]) {
                groups[label] = [];
            }

            groups[label].push(msg);
            return groups;
        }, {});
    };

    const sendMessage = () => {
        if (!message.trim() || isPending) return;

        const messageText = message.trim();
        sendMessageMutation({
            phone: selectedChat?.phone,
            message: messageText,
        });
        setMessage("");
    }

    useEffect(() => {
        if (chatList?.data?.length && !selectedChat) {
            setSelectedChat({
                phone: chatList.data[0].phone,
                name: chatList.data[0].name ?? chatList.data[0].phone,
            });
        }
    }, [chatList, selectedChat]);

    const groupedMessages = groupMessagesByDate(messagesData);
    const groupedEntries = Object.entries(groupedMessages).reverse();
    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input className="pl-9" placeholder="Search patients..." />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chatList?.data?.map((chat: any, index: number) => (
                        <div
                            key={index}
                            onClick={() => handleSelectChat(chat)}
                            className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition ${selectedChat?.phone === chat.phone ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex justify-start items-center gap-2 mb-1">
                                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center mr-1 shadow-sm">
                                    <User className="!w-10 !min-w-5 !h-5" />
                                </div>
                                <div className="flex justify-between w-full items-center">
                                    <span className="font-semibold text-slate-900">{chat.phone}</span>
                                    <span className="text-sm text-slate-500"> {new Date(chat.last_message_time).toLocaleDateString("en-GB")}</span>
                                </div>
                            </div>
                            {/* <p className="text-sm text-slate-500 truncate">{message.lastMsg}</p> */}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-50/50">
                <div className="p-4 border-b bg-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center mr-1 shadow-sm">
                            <User className="!w-10 !min-w-5 !h-5" />
                        </div>
                        <h3 className="font-bold text-md">{selectedChat?.name}</h3>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">WhatsApp</span>
                </div>

                <div className="flex-1 p-6 space-y-4 bg-black overflow-y-auto bg-[url('/assets/messageBg.png')] bg-cover bg-center bg-no-repeat">
                    {groupedEntries?.map(([dateLabel, msgs]: any, index: number) => (
                        <div key={dateLabel}>
                            <div className="flex justify-center my-4">
                                <span className="px-3 py-1 text-xs bg-slate-200 text-slate-600 rounded-full">
                                    {dateLabel}
                                </span>
                            </div>
                            {msgs.map((msg: any, index: number) => (
                                <div key={index} className={`flex gap-1 my-2 items-center ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                                    {msg.sender === 'bot' ?
                                        <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center mr-2 shadow-sm">
                                            <Bot className="w-4 h-4" />
                                        </div> : msg.sender === 'admin' ?
                                            <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center mr-2 shadow-sm">
                                                <User className="w-4 h-4" />
                                            </div> : ""
                                    }
                                    <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${msg.sender === 'bot' || msg.sender == 'admin' ? 'bg-[#d9fdd3] text-slate-800 rounded-tl-none' : 'bg-white text-black rounded-tr-none'}`}>
                                        <p>{msg.message}</p>
                                        <span className="text-xs">{formattedTime(msg?.created_at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white border-t flex gap-2">
                    <Input onChange={handleInputChange} value={message} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            sendMessage();
                            setMessage("");
                        }
                    }} placeholder="Type a reply..." />
                    <Button
                        onClick={sendMessage}
                        disabled={message.length === 0 || isPending}
                        size="icon"
                    >
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};