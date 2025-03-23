
import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  sender: "me" | "them";
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  status = "read"
}) => {
  const isSent = sender === "me";
  
  return (
    <div className={cn("flex mb-4", isSent ? "justify-end" : "justify-start")}>
      <div className="flex flex-col space-y-1 max-w-[80%]">
        <div className={isSent ? "chat-bubble-sent" : "chat-bubble-received"}>
          {content}
        </div>
        <div 
          className={cn(
            "flex items-center text-xs", 
            isSent ? "justify-end pr-2" : "justify-start pl-2"
          )}
        >
          <span className="text-muted-foreground">{timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
