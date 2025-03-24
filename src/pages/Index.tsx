
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatList from "@/components/ChatList";
import ChatHeader from "@/components/ChatHeader";
import ChatMessageList from "@/components/ChatMessageList";
import MessageInput from "@/components/MessageInput";
import NetworkStatus from "@/components/NetworkStatus";

// Mock data for initial development
const MOCK_CHATS = [
  { id: "1", name: "Anonymous Lynx", lastMessage: "Hey there! How's it going?", time: "12:30 PM", unread: 2, online: true },
  { id: "2", name: "Unknown Fox", lastMessage: "Did you see that news article?", time: "Yesterday", unread: 0, online: false },
  { id: "3", name: "Mystery Owl", lastMessage: "Let's chat later today", time: "Monday", unread: 0, online: false },
];

const MOCK_MESSAGES = [
  { id: "1", content: "Hey there! I'm using Anonymous Chat", sender: "them" as const, timestamp: "12:30 PM" },
  { id: "2", content: "Oh hey! Nice to meet you", sender: "me" as const, timestamp: "12:31 PM" },
  { id: "3", content: "What brings you here today?", sender: "them" as const, timestamp: "12:32 PM" },
  { id: "4", content: "Just exploring the app. It's pretty cool to chat anonymously!", sender: "me" as const, timestamp: "12:33 PM" },
  { id: "5", content: "Agreed! I like the privacy aspect of it. No history, no tracking.", sender: "them" as const, timestamp: "12:34 PM" },
  { id: "6", content: "Exactly. So what are your interests?", sender: "me" as const, timestamp: "12:35 PM" },
  { 
    id: "7", 
    content: "I love photography! Check out this photo I took yesterday.", 
    sender: "them" as const, 
    timestamp: "12:36 PM",
    attachment: {
      type: "image" as const,
      url: "/placeholder.svg"
    }
  },
];

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Attachment {
  type: "image" | "voice";
  url: string;
}

interface Message {
  id: string;
  content: string;
  sender: "me" | "them";
  timestamp: string;
  attachment?: Attachment;
}

const Index = () => {
  const isMobile = useIsMobile();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isOffline, setIsOffline] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
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

  // Simulate occasional connectivity issues
  useEffect(() => {
    const offlineCheck = setInterval(() => {
      const randomOffline = Math.random() < 0.05; // 5% chance to go offline
      if (randomOffline && !isOffline) {
        setIsOffline(true);
        toast({
          title: "Connection Lost",
          description: "We're having trouble connecting to the server. Reconnecting...",
          variant: "destructive"
        });
        
        // Auto reconnect after 3 seconds
        setTimeout(() => {
          setIsOffline(false);
          toast({
            title: "Connected",
            description: "You're back online!",
          });
        }, 3000);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(offlineCheck);
  }, [isOffline, toast]);
  
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    setMobileMenuOpen(false);
  };
  
  const handleNewChat = () => {
    toast({
      title: "New Chat",
      description: "Starting a new anonymous chat...",
    });
    
    // Simulate finding a new chat partner
    setTimeout(() => {
      const newChatId = `new-${Date.now()}`;
      const existingChats = [...MOCK_CHATS];
      existingChats.unshift({
        id: newChatId,
        name: "Anonymous Stranger",
        lastMessage: "Waiting for messages...",
        time: "Just now",
        unread: 0,
        online: true
      });
      
      setActiveChat(newChatId);
      setMessages([]);
      setFriendRequestSent(false);
      
      // Simulate welcome message
      setTimeout(() => {
        setMessages([{
          id: `welcome-${Date.now()}`,
          content: "You're now chatting with a random stranger. Say hi!",
          sender: "them",
          timestamp: "Just now"
        }]);
      }, 1000);
    }, 2000);
  };

  const handleEndChat = () => {
    toast({
      title: "Chat Ended",
      description: "You've ended the chat with this stranger."
    });
    
    // Add system message about chat ending
    const endMessage: Message = {
      id: `end-${Date.now()}`,
      content: "You ended this chat. Start a new chat to talk with someone else.",
      sender: "them",
      timestamp: "Just now"
    };
    
    setMessages(prev => [...prev, endMessage]);
    
    // Reset active chat after a delay
    setTimeout(() => {
      setActiveChat(null);
    }, 2000);
  };
  
  const handleSendFriendRequest = () => {
    setFriendRequestSent(true);
    
    toast({
      title: "Friend Request Sent",
      description: "Friend request sent to this stranger."
    });
    
    // Add system message about friend request
    const friendRequestMessage: Message = {
      id: `friend-${Date.now()}`,
      content: "You sent a friend request to this stranger. They'll need to accept it to add you to their contacts.",
      sender: "them",
      timestamp: "Just now"
    };
    
    setMessages(prev => [...prev, friendRequestMessage]);
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newMessage: Message = {
      id: `me-${Date.now()}`,
      content: message,
      sender: "me",
      timestamp: "Just now"
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Simulate reply after a delay
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        
        const replyMessage: Message = {
          id: `them-${Date.now()}`,
          content: "Thanks for your message! This is a prototype, so I'm just responding with a pre-written reply.",
          sender: "them",
          timestamp: "Just now"
        };
        
        setMessages(prev => [...prev, replyMessage]);
      }, 2000);
    }, 1000);
  };

  const handleAttachment = (type: "image" | "voice") => {
    if (type === "image") {
      // For the prototype, navigate to the image viewer with a placeholder
      navigate("/image-viewer", { state: { imageUrl: "/placeholder.svg" } });
    } else if (type === "voice") {
      // For the prototype, we'll use a mock audio file
      navigate("/voice-player", { state: { audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" } });
    }
  };
  
  const viewAttachment = (attachment: Attachment) => {
    if (attachment.type === "image") {
      navigate("/image-viewer", { state: { imageUrl: attachment.url } });
    } else if (attachment.type === "voice") {
      navigate("/voice-player", { state: { audioUrl: attachment.url } });
    }
  };
  
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile chat list sidebar */}
      <div 
        className={`fixed inset-0 bg-background z-20 md:hidden transform transition-transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center border-b mobile-header">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="rounded-full hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold ml-2">Chats</h1>
          </div>
          
          <div className="flex-1 overflow-auto">
            <ChatList 
              chats={MOCK_CHATS}
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
            />
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:block w-80 lg:w-96 xl:w-1/4 border-r overflow-hidden">
        <ChatList 
          chats={MOCK_CHATS}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
        />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <ChatHeader 
            activeChat={activeChat}
            chatName={MOCK_CHATS.find(chat => chat.id === activeChat)?.name}
            isOnline={MOCK_CHATS.find(chat => chat.id === activeChat)?.online}
            isOffline={isOffline}
            onMobileMenuOpen={() => setMobileMenuOpen(true)}
            onEndChat={handleEndChat}
            onSendFriendRequest={handleSendFriendRequest}
            friendRequestSent={friendRequestSent}
          />
          
          <ChatMessageList 
            activeChat={activeChat}
            messages={messages}
            isTyping={isTyping}
            onNewChat={handleNewChat}
            viewAttachment={viewAttachment}
          />
          
          {activeChat && (
            <MessageInput 
              message={message}
              isOffline={isOffline}
              onMessageChange={(e) => setMessage(e.target.value)}
              onSendMessage={handleSendMessage}
              onAttachment={handleAttachment}
            />
          )}
        </div>
      </div>
      
      {/* Offline indicator */}
      <NetworkStatus isOffline={isOffline} />
    </div>
  );
};

export default Index;
