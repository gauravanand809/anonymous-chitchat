
import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Welcome = () => {
  const navigate = useNavigate();

  const handleStartChatting = () => {
    navigate("/");
  };

  const handleLinkAccount = () => {
    // This will be implemented with Firebase authentication later
    console.log("Link Google Account clicked");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold">Anonymous Chat</h1>
          <p className="text-muted-foreground">
            Start chatting instantly without registration. Your privacy is our priority.
          </p>
        </div>

        <div className="space-y-4 pt-6">
          <Button 
            className="w-full py-6 text-lg"
            size="lg"
            onClick={handleStartChatting}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Start Chatting
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full py-6 text-lg"
            size="lg"
            onClick={handleLinkAccount}
          >
            <User className="mr-2 h-5 w-5" />
            Link Google Account (Optional)
          </Button>
        </div>

        <p className="pt-8 text-sm text-muted-foreground">
          By using this app, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Welcome;
