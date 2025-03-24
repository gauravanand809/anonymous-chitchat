
import React from "react";
import { Image, Mic, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  message: string;
  isOffline: boolean;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onAttachment: (type: "image" | "voice") => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  isOffline,
  onMessageChange,
  onSendMessage,
  onAttachment
}) => {
  return (
    <div className="p-4 mobile-footer safe-bottom">
      <div className="flex space-x-2 items-center">
        <Button variant="ghost" size="icon" onClick={() => onAttachment("image")} className="rounded-full hover:bg-secondary">
          <Image className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onAttachment("voice")} className="rounded-full hover:bg-secondary">
          <Mic className="h-5 w-5" />
        </Button>
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={onMessageChange}
          onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
          className="flex-1 rounded-full bg-secondary border-0"
          disabled={isOffline}
        />
        <Button 
          onClick={onSendMessage} 
          disabled={!message.trim() || isOffline}
          className="rounded-full aspect-square"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
