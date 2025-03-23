
import { useState, useEffect } from "react";
import { User, ArrowLeft, Send, Menu, MessageSquare, Plus, Settings, LogOut, Search, Image, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Mock data for initial development
const MOCK_CHATS = [
  { id: "1", name: "Anonymous Lynx", lastMessage: "Hey there! How's it going?", time: "12:30 PM", unread: 2, online: true },
  { id: "2", name: "Unknown Fox", lastMessage: "Did you see that news article?", time: "Yesterday", unread: 0, online: false },
  { id: "3", name: "Mystery Owl", lastMessage: "Let's chat later today", time: "Monday", unread: 0, online: false },
];

const MOCK_MESSAGES = [
  { id: "1", content: "Hey there! I'm using Anonymous Chat", sender: "them", timestamp: "12:30 PM" },
  { id: "2", content: "Oh hey! Nice to meet you", sender: "me", timestamp: "12:31 PM" },
  { id: "3", content: "What brings you here today?", sender: "them", timestamp: "12:32 PM" },
  { id: "4", content: "Just exploring the app. It's pretty cool to chat anonymously!", sender: "me", timestamp: "12:33 PM" },
  { id: "5", content: "Agreed! I like the privacy aspect of it. No history, no tracking.", sender: "them", timestamp: "12:34 PM" },
  { id: "6", content: "Exactly. So what are your interests?", sender: "me", timestamp: "12:35 PM" },
];

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const Index = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Simulate typing indicator
  useEffect(() => {
    if (activeChat) {
      const typingInterval = setInterval(() => {
        setIsTyping(prev => !prev);
      }, 5000);
      
      return () => clearInterval(typingInterval);
    }
  }, [activeChat]);
  
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    setMobileMenuOpen(false);
  };
  
  const handleNewChat = () => {
    toast({
      title: "New Chat",
      description: "Starting a new anonymous chat...",
    });
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    console.log("Sending message:", message);
    // Here we would normally send the message to Firebase
    setMessage("");
  };

  const handleAttachment = () => {
    toast({
      title: "Attachments",
      description: "Photo and voice message feature coming soon!",
    });
  };
  
  const navigateToSettings = () => {
    navigate("/settings");
  };
  
  const renderSidebar = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Chats</h1>
          <Button variant="ghost" size="icon" onClick={handleNewChat}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-9" />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        {MOCK_CHATS.map((chat) => (
          <div
            key={chat.id}
            className={`px-4 py-3 mb-1 cursor-pointer rounded-lg ${
              activeChat === chat.id ? "bg-secondary" : "hover:bg-secondary/50"
            }`}
            onClick={() => handleChatSelect(chat.id)}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center">
                <h3 className="font-medium">{chat.name}</h3>
                {chat.online && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{chat.time}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                {chat.lastMessage}
              </p>
              {chat.unread > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-auto border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <div className="font-medium">Anonymous User</div>
              <div className="text-xs text-muted-foreground">Tap to set nickname</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={navigateToSettings}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
  
  const renderChatView = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 flex items-center">
          <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <div className="font-medium">
              {activeChat ? MOCK_CHATS.find(chat => chat.id === activeChat)?.name : "Start Chatting"}
            </div>
            <div className="text-xs text-muted-foreground">
              {activeChat && MOCK_CHATS.find(chat => chat.id === activeChat)?.online 
                ? "Online now" 
                : "Offline"}
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="icon">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {activeChat ? (
          <>
            {MOCK_MESSAGES.map((msg) => (
              <ChatMessage
                key={msg.id}
                content={msg.content}
                sender={msg.sender as "me" | "them"}
                timestamp={msg.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Welcome to Anonymous Chat</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start a new conversation or select an existing chat to begin messaging
            </p>
            <Button onClick={handleNewChat}>
              <Plus className="mr-2 h-4 w-4" /> New Chat
            </Button>
          </div>
        )}
      </div>
      
      {activeChat && (
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleAttachment}>
              <Image className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleAttachment}>
              <Mic className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile chat list sidebar */}
      <div 
        className={`fixed inset-0 bg-background z-20 md:hidden transform transition-transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center border-b">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold ml-2">Chats</h1>
          </div>
          
          <div className="flex-1 overflow-auto">
            {renderSidebar()}
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:block w-80 border-r overflow-hidden">
        {renderSidebar()}
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 overflow-hidden">
        {renderChatView()}
      </div>
    </div>
  );
};

export default Index;
