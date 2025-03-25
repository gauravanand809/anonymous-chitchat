
import React from "react";
import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

interface ChatMessageListProps {
  activeChat: string | null;
  messages: Message[];
  isTyping: boolean;
  onNewChat: () => void;
  viewAttachment: (attachment: Attachment) => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  activeChat,
  messages,
  isTyping,
  onNewChat,
  viewAttachment
}) => {
  const navigate = useNavigate();
  
  if (!activeChat) {
    return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-background">
      <div className="bg-background border rounded-xl p-8 max-w-md w-full shadow-sm">
        <div className="h-12 w-12 text-primary mx-auto mb-4">
          <MessageSquare className="h-12 w-12" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Welcome to Anonymous Chat</h3>
        <p className="text-muted-foreground mb-6">
          Start a new conversation or select an existing chat to begin messaging
        </p>
        <Button onClick={onNewChat} className="w-full" size="lg">
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>
    </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-auto p-4 space-y-4 no-scrollbar bg-background">
      {messages.map((msg) => (
        <div key={msg.id}>
          <ChatMessage
            content={msg.content}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
          {msg.attachment && (
            <div 
              className={`mt-1 ${msg.sender === "me" ? "ml-auto" : "mr-auto"} max-w-[240px] cursor-pointer`}
              onClick={() => viewAttachment(msg.attachment!)}
            >
              {msg.attachment.type === "image" ? (
                <div className="rounded-xl overflow-hidden border shadow-sm">
                  <img 
                    src={msg.attachment.url} 
                    alt="Attachment" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : (
                <div className="bg-secondary rounded-lg flex items-center gap-2 px-4 py-3 text-sm">
                  <Mic className="h-4 w-4" />
                  <span>Voice Message</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {isTyping && <TypingIndicator />}
    </div>
  );
};

import { MessageSquare } from "lucide-react";

export default ChatMessageList;
