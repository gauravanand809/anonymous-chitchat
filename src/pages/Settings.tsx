
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Bell, BellOff, Eye, EyeOff, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nickname, setNickname] = useState("Anonymous User");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [blurPhotos, setBlurPhotos] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
    navigate("/chat");
  };

  const handleClearHistory = () => {
    toast({
      title: "Chat History Cleared",
      description: "All your chat history has been deleted from this device.",
      variant: "destructive",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="p-4 border-b flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate("/chat")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Profile</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-medium">
                Nickname
              </label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Notifications</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {notifications ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
              <span>{notifications ? "Notifications On" : "Notifications Off"}</span>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Privacy</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {blurPhotos ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              <span>{blurPhotos ? "Blur Photos" : "Show Photos"}</span>
            </div>
            <Switch checked={blurPhotos} onCheckedChange={setBlurPhotos} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Data</h2>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleClearHistory}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Chat History
          </Button>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button className="w-full" onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
