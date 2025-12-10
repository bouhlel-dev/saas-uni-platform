import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/formatUtils";
import { Search, Send, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { UniversityAdminSidebar } from "@/components/UniversityAdminSidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { TeacherSidebar } from "@/components/TeacherSidebar";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    is_read: boolean;
    createdAt: string;
    Sender?: User;
    Receiver?: User;
}

interface Conversation {
    contact: User;
    lastMessage: Message;
}

const Messages = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (searchQuery.length > 2) {
            searchUsers();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const loadConversations = async () => {
        try {
            const data = await api.get("/messages/conversations");
            setConversations(data);
        } catch (error) {
            console.error("Error loading conversations:", error);
        }
    };

    const searchUsers = async () => {
        try {
            setLoading(true);
            const data = await api.get(`/messages/search?query=${searchQuery}`);
            setSearchResults(data);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (userId: number) => {
        try {
            const data = await api.get(`/messages/messages/${userId}`);
            setMessages(data);
        } catch (error) {
            console.error("Error loading messages:", error);
            toast({
                title: "Error",
                description: "Failed to load messages",
                variant: "destructive",
            });
        }
    };

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setSearchQuery("");
        setSearchResults([]);
        loadMessages(user.id);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedUser || sending) return;

        try {
            setSending(true);
            const message = await api.post("/messages/send", {
                receiver_id: selectedUser.id,
                content: newMessage.trim(),
            });

            setMessages([...messages, message]);
            setNewMessage("");
            loadConversations(); // Refresh conversations list
        } catch (error) {
            console.error("Error sending message:", error);
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            });
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Determine sidebar based on user role
    const getSidebar = () => {
        const role = currentUser.role;

        if (role === 'universityadmin' || role === 'admin') {
            return <UniversityAdminSidebar />;
        }

        if (role === 'teacher') {
            return <TeacherSidebar />;
        }

        return <StudentSidebar />;
    };

    return (
        <DashboardLayout sidebar={getSidebar()} title="Messages">
            <div className="h-[calc(100vh-8rem)]">
                <Card className="h-full">
                    <div className="flex h-full">
                        {/* Sidebar - Conversations & Search */}
                        <div className="w-80 border-r flex flex-col">
                            <CardHeader className="border-b">
                                <CardTitle>Messages</CardTitle>
                                <div className="relative mt-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </CardHeader>

                            <ScrollArea className="flex-1">
                                {searchResults.length > 0 ? (
                                    <div className="p-2">
                                        <p className="text-xs text-muted-foreground px-3 py-2">Search Results</p>
                                        {searchResults.map((user) => (
                                            <button
                                                key={user.id}
                                                onClick={() => handleSelectUser(user)}
                                                className="w-full text-left p-3 hover:bg-muted rounded-lg transition-colors"
                                            >
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        {conversations.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-8">
                                                No conversations yet. Search for users to start chatting.
                                            </p>
                                        ) : (
                                            conversations.map((conv) => (
                                                <button
                                                    key={conv.contact.id}
                                                    onClick={() => handleSelectUser(conv.contact)}
                                                    className={`w-full text-left p-3 hover:bg-muted rounded-lg transition-colors ${selectedUser?.id === conv.contact.id ? "bg-muted" : ""
                                                        }`}
                                                >
                                                    <p className="font-medium">{conv.contact.name}</p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {conv.lastMessage.content}
                                                    </p>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col">
                            {selectedUser ? (
                                <>
                                    <CardHeader className="border-b">
                                        <CardTitle>{selectedUser.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground capitalize">{selectedUser.role}</p>
                                    </CardHeader>

                                    <ScrollArea className="flex-1 p-4">
                                        <div className="space-y-4">
                                            {messages.map((message) => {
                                                const isSender = message.sender_id === currentUser.id;
                                                return (
                                                    <div
                                                        key={message.id}
                                                        className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                                                    >
                                                        <div
                                                            className={`max-w-[70%] rounded-lg p-3 ${isSender
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-muted"
                                                                }`}
                                                        >
                                                            <p className="text-sm">{message.content}</p>
                                                            <p className="text-xs mt-1 opacity-70">
                                                                {new Date(message.createdAt).toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </ScrollArea>

                                    <CardContent className="border-t p-4">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Type a message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                disabled={sending}
                                            />
                                            <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
                                                {sending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                    <p>Select a conversation or search for a user to start messaging</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Messages;
