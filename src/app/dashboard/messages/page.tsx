"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Bot, User, MoreVertical } from "lucide-react";
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
    const [filteredChats, setFilteredChats] = useState(chatList?.data);
    const { mutate: sendMessageMutation, isPending } = useAddMessageMutation();
    const [messageSearchText, setMessageSearchText] = useState("");
    const [filteredMessage, setFilteredMessage] = useState<any[]>([]);
    const [chatSearchText, setChatSearchText] = useState("");
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const {
        data: messagesData,
        isLoading: isMessagesLoading,
        isError: isMessagesError,
    } = useMessagesByPhoneQuery(selectedChat?.phone);

    const [message, setMessage] = useState<string>("");

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleInputChange = (e: any) => {
        setMessage(e.target.value);
    }

    console.log(chatList);

    const handleChatSearch = (e: any) => {
        setChatSearchText(e.target.value);
    }

    const handleMessageSearch = (e: any) => {
        setMessageSearchText(e.target.value);
    }

    const handleSelectChat = (chat: any) => {
        setSelectedChat({
            phone: chat.phone,
            name: chat.name ?? chat.phone,
        });
    };

    const groupMessagesByDate = (messages: any[] = []) => {
        console.log(messages)
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
        const timer = setTimeout(() => {
            const value = chatSearchText.trim().toLowerCase();
            if (!value) {
                setFilteredChats(chatList?.data)
                return;
            }
            setFilteredChats(chatList?.data?.filter((chat: any) => chat?.name?.toLowerCase().includes(value) || chat?.phone?.includes(value)))
        }, 400);

        return () => clearTimeout(timer);
    }, [chatSearchText, chatList])

    useEffect(() => {
        const value = messageSearchText?.trim().toLowerCase();
        console.log("value", value)
        let messagesToFilter = messagesData?.data;
        console.log("messagesData", messagesData)

        if (!value) {
            setFilteredMessage(messagesToFilter);
            return;
        }
        console.log("messagesToFilter", messagesToFilter)
        const filtered = messagesToFilter?.filter((msg: any) =>
            msg?.message?.toLowerCase().includes(value)
        );
        console.log("filtered", filtered)
        setFilteredMessage(filtered);

    }, [messageSearchText, selectedChat, messagesData]);
    console.log("selectedChat", selectedChat)
    useEffect(() => {
        if (chatList?.data?.length && !selectedChat) {
            setSelectedChat({
                phone: chatList.data[0].phone,
                name: chatList.data[0].name ?? chatList.data[0].phone,
            });
        }
    }, [chatList, selectedChat]);
    const isSearching = messageSearchText.trim().length > 0;

    const displayMessages = isSearching
        ? filteredMessage
        : messagesData?.data || [];
    const groupedMessages = groupMessagesByDate(displayMessages);
    const groupedEntries = Object.entries(groupedMessages);

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50/30">
                <div className="p-5 border-b border-slate-200 bg-white">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <Input
                            onChange={handleChatSearch}
                            className="pl-10 h-11 text-base bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-3xl"
                            placeholder="Search conversations..."
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredChats?.map((chat: any, index: number) => (
                        <div
                            key={index}
                            onClick={() => handleSelectChat(chat)}
                            className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 ${selectedChat?.phone === chat.phone
                                ? 'bg-blue-50 border-l-4 border-l-blue-500'
                                : 'hover:bg-white hover:shadow-sm border-l-4 border-l-transparent'
                                }`}
                        >
                            <div className="flex justify-start items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex justify-between w-full items-start gap-2 min-w-0">
                                    <div className="min-w-0 flex-1">
                                        <span className="font-semibold text-base text-slate-900 block">{chat.phone}</span>
                                        <p className="text-sm text-slate-500 truncate mt-0.5">{chat.message.length > 40
                                            ? chat.message.slice(0, 40) + "..."
                                            : chat.message}</p>
                                    </div>
                                    <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">{new Date(chat.created_at).toLocaleDateString("en-GB")}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col bg-slate-50">
                <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm h-[84px]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">{selectedChat?.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isSearchOpen ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSearchOpen(true)}
                                className="text-slate-500 hover:text-blue-600"
                            >
                                <Search className="w-5 h-5" />
                            </Button>) :
                            (
                                <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <Input
                                            autoFocus
                                            value={messageSearchText}
                                            onChange={handleMessageSearch}
                                            className="pl-9 h-10 bg-slate-50 border-slate-200 rounded-3xl"
                                            placeholder="Search messages..."
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setIsSearchOpen(false);
                                            setMessageSearchText("");
                                        }}
                                        className="text-slate-500 hover:text-red-500"
                                    >
                                        Close
                                    </Button>
                                </div>
                            )}
                        <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">WhatsApp</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-500 hover:text-blue-600"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[url('/assets/messageBg2.png')] bg-cover bg-center bg-no-repeat">
                    {groupedEntries?.map(([dateLabel, msgs]: any, index: number) => (
                        <div key={dateLabel}>
                            <div className="flex justify-center my-6">
                                <span className="px-4 py-1.5 text-xs font-medium bg-white/90 text-slate-700 rounded-full shadow-sm backdrop-blur-sm">
                                    {dateLabel}
                                </span>
                            </div>
                            {msgs.map((msg: any, index: number) => (
                                <div key={index} className={`flex gap-2 my-3 items-end ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                                    {msg.sender === 'bot' ?
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                                            <Bot className="w-4 h-4" />
                                        </div> : msg.sender === 'admin' ?
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                                                <User className="w-4 h-4" />
                                            </div> : ""
                                    }
                                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-md ${msg.sender === 'bot' || msg.sender == 'admin'
                                        ? 'bg-[#dcf8c6] text-slate-800 rounded-bl-sm'
                                        : 'bg-white text-slate-800 rounded-br-sm'
                                        }`}>
                                        <p className="text-base mb-1.5 leading-relaxed">
                                            {messageSearchText ? (
                                                <span dangerouslySetInnerHTML={{
                                                    __html: msg.message.replace(
                                                        new RegExp(`(${messageSearchText})`, 'gi'),
                                                        (match: any) => `<span class="bg-yellow-200 text-slate-900 px-0.5 rounded">${match}</span>`
                                                    )
                                                }} />
                                            ) : (
                                                msg.message
                                            )}
                                        </p>
                                        <span className="block text-xs text-right text-slate-500">{formattedTime(msg?.created_at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="p-5 bg-white border-t border-slate-200 flex gap-3 shadow-lg">
                    <Input
                        onChange={handleInputChange}
                        value={message}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                sendMessage();
                                setMessage("");
                            }
                        }}
                        className="text-base h-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-lg"
                        placeholder="Type a reply..."
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={message.length === 0 || isPending}
                        size="icon"
                        className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
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