"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Bot, User, MoreVertical } from "lucide-react";
import { useAddMessageMutation, useGetAllChatsQuery, useMessagesByPhoneQuery, useUpdateSeenMutation } from "@/hooks/useMessagesQuery";

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

const formatChatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    // Today → show time
    if (date >= startOfToday) {
        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    // Yesterday → show "Yesterday"
    if (date >= startOfYesterday) {
        return "Yesterday";
    }

    // Within last 7 days → show weekday
    const diffDays =
        (startOfToday.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 7) {
        return date.toLocaleDateString("en-IN", { weekday: "long" });
    }

    // Older → show date
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
    const bottomRef = useRef<HTMLDivElement>(null);
    const {
        data: chatList,
        isLoading: isChatsLoading,
        isError: isChatsError,
    } = useGetAllChatsQuery();
    const [filteredChats, setFilteredChats] = useState(chatList?.data);
    const { mutate: sendMessageMutate, isPending } = useAddMessageMutation();
    const [messageSearchText, setMessageSearchText] = useState("");
    const [filteredMessage, setFilteredMessage] = useState<any[]>([]);
    const [chatSearchText, setChatSearchText] = useState("");
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const {
        data: messagesData,
        isLoading: isMessagesLoading,
        isError: isMessagesError,
    } = useMessagesByPhoneQuery(selectedChat?.phone);
    const { mutate: updateSeenMutate } = useUpdateSeenMutation();
    const [message, setMessage] = useState<string>("");

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [chatFilter, setChatFilter] = useState<'all' | 'read' | 'unread'>('all');

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
            phone: chat?.phone,
            name: chat?.name ?? chat.phone,
        });
    };
    useEffect(() => {
        if (!selectedChat?.phone) return;
        if (!chatList?.data?.length) return;

        const hasUnreadUserMessages = chatList.data.some(
            (msg: any) => msg.seen === "false"
        );
        if (hasUnreadUserMessages) {
            updateSeenMutate(selectedChat.phone);
        }
    }, [selectedChat?.phone, chatList?.data]);

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
        sendMessageMutate({
            phone: selectedChat?.phone,
            message: messageText,
        });
        setMessage("");
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            const value = chatSearchText.trim().toLowerCase();
            let filtered = chatList?.data;
            console.log("chats", chatList?.data)
            if (value) {
                filtered = filtered?.filter((chat: any) => chat?.name?.toLowerCase().includes(value) || chat?.phone?.includes(value));
            }
            console.log("chatFilter", chatFilter)
            if (chatFilter === 'read') {
                filtered = filtered?.filter((chat: any) => chat?.seen == "true");
            } else if (chatFilter === 'unread') {
                filtered = filtered?.filter((chat: any) => chat?.seen == "false" || chat?.seen == null);
            }
            console.log("filtered", filtered)
            setFilteredChats(filtered);
        }, 200);

        return () => clearTimeout(timer);
    }, [chatSearchText, chatList, chatFilter])

    useEffect(() => {
        const value = messageSearchText?.trim().toLowerCase();
        let messagesToFilter = messagesData?.data;

        if (!value) {
            setFilteredMessage(messagesToFilter);
            return;
        }
        const filtered = messagesToFilter?.filter((msg: any) =>
            msg?.message?.toLowerCase().includes(value)
        );
        console.log("filtered", filtered)
        setFilteredMessage(filtered);

    }, [messageSearchText, selectedChat, messagesData]);

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

    useEffect(() => {
        bottomRef?.current?.scrollIntoView({
            behavior: "smooth",
        })
    }, [groupedMessages])

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/30 dark:bg-slate-900/30">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <Input
                            onChange={handleChatSearch}
                            className="pl-10 h-11 text-base bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-3xl"
                            placeholder="Search conversations..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setChatFilter('all')}
                            variant={chatFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            className={`flex-1 rounded-full text-xs font-medium transition-all ${chatFilter === 'all'
                                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            All
                        </Button>
                        <Button
                            onClick={() => setChatFilter('read')}
                            variant={chatFilter === 'read' ? 'default' : 'outline'}
                            size="sm"
                            className={`flex-1 rounded-full text-xs font-medium transition-all ${chatFilter === 'read'
                                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            Read
                        </Button>
                        <Button
                            onClick={() => setChatFilter('unread')}
                            variant={chatFilter === 'unread' ? 'default' : 'outline'}
                            size="sm"
                            className={`flex-1 rounded-full text-xs font-medium transition-all ${chatFilter === 'unread'
                                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            Unread
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {isChatsLoading ? (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-sm text-slate-500 font-medium">Loading chats...</p>
                        </div>
                    ) : filteredChats && filteredChats.length > 0 ? (
                        filteredChats.map((chat: any, index: number) => (
                            <div
                                key={index}
                                onClick={() => handleSelectChat(chat)}
                                className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 ${selectedChat?.phone === chat.phone
                                    ? 'bg-slate-100 border-l-4 border-l-blue-500'
                                    : 'hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm border-l-4 border-l-transparent'
                                    }`}
                            >
                                <div className="flex justify-start items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="flex justify-between w-full items-start gap-2 min-w-0">
                                        <div className="min-w-0 flex-1">
                                            <span
                                                className={`font-semibold text-base block
    ${selectedChat?.phone === chat.phone
                                                        ? "text-slate-900 dark:text-slate-900"
                                                        : "text-slate-900 dark:text-slate-100"}
  `}
                                            >
                                                {chat.phone}
                                            </span>
                                            <div className="flex items-center gap-1 justify-start mt-0.5">
                                                {
                                                    chat.seen == "true" ? <svg
                                                        viewBox="0 0 16 15"
                                                        width="16"
                                                        height="15"
                                                        className="text-blue-500 mt-0.45"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                                        />
                                                    </svg> : (
                                                        <svg
                                                            viewBox="0 0 16 15"
                                                            width="16"
                                                            height="15"
                                                            className="text-gray-400 mt-0.45"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                                            />
                                                        </svg>
                                                    )}
                                                <p className="text-sm text-slate-500 dark:text-slate-900 truncate">{chat?.message?.length > 40
                                                    ? chat?.message.slice(0, 40) + "..."
                                                    : chat?.message}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-500 whitespace-nowrap flex-shrink-0"> {formatChatDate(chat.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <User className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-center text-base font-medium">
                                No chats or messages found
                            </p>
                            <p className="text-slate-400 dark:text-slate-500 text-center text-sm mt-2">
                                {chatSearchText ? "Try adjusting your search" : "Start a conversation to see it here"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shadow-sm h-[84px]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{selectedChat?.name}</h3>
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
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[url('/assets/messageBg.png')] dark:bg-[url('/assets/darkbg.png')] bg-[100% 50%] bg-repeat bg-[length:230px_380px]">
                    {isMessagesLoading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-base font-medium text-slate-600 dark:text-slate-300">Loading messages...</p>
                        </div>
                    ) : (
                        groupedEntries?.map(([dateLabel, msgs]: any, index: number) => (
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
                                            <div className="flex items-center justify-end gap-1 text-xs">
                                                <span className="text-slate-500">{formattedTime(msg?.created_at)}</span>
                                                {(msg.sender === 'bot' || msg.sender === 'admin') && <>{
                                                    msg.seen ? <svg
                                                        viewBox="0 0 16 15"
                                                        width="16"
                                                        height="15"
                                                        className="text-blue-500"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                                        />
                                                    </svg> : (
                                                        <svg
                                                            viewBox="0 0 16 15"
                                                            width="16"
                                                            height="15"
                                                            className="text-gray-400"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                                            />
                                                        </svg>
                                                    )}
                                                    <div ref={bottomRef} />
                                                </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-3 shadow-lg">
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