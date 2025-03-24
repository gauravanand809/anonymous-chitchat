import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Bell, BellOff, Eye, EyeOff, Trash2, User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'; // Import useFirebaseAuth

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateNickname } = useFirebaseAuth(); // Use updateNickname hook
  const [nickname, setNickname] = useState(() => localStorage.getItem("nickname") || "Anonymous User");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [notifications, setNotifications] = useState(() => localStorage.getItem("notifications") !== "false");
  const [blurPhotos, setBlurPhotos] = useState(() => localStorage.getItem("blurPhotos") === "true");
  const [backupEnabled, setBackupEnabled] = useState(() => localStorage.getItem("backupEnabled") === "true");
  const [preventScreenshots, setPreventScreenshots] = useState(() => localStorage.getItem("preventScreenshots") === "true");
  const [isSaving, setIsSaving] = useState(false);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      await updateNickname(nickname); // Update nickname in Firebase

      // Save settings to localStorage
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("darkMode", darkMode.toString());
      localStorage.setItem("notifications", notifications.toString());
      localStorage.setItem("blurPhotos", blurPhotos.toString());
      localStorage.setItem("backupEnabled", backupEnabled.toString());
      localStorage.setItem("preventScreenshots", preventScreenshots.toString());
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated.",
      });
      
      setIsSaving(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearHistory = () => {
    // Simulate clearing chat history
    setTimeout(() => {
      toast({
        title: "Chat History Cleared",
        description: "All your chat history has been deleted from this device.",
        variant: "destructive",
      });
    }, 500);
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
              <p className="text-xs text-muted-foreground">
                This name will be shown to people you chat with
              </p>
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

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Backup Chat History</span>
              </div>
              <p className="text-xs text-muted-foreground ml-7">
                Securely backup your chats to the cloud
              </p>
            </div>
            <Switch checked={backupEnabled} onCheckedChange={setBackupEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <EyeOff className="h-5 w-5" />
                <span>Prevent Screenshots</span>
              </div>
              <p className="text-xs text-muted-foreground ml-7">
                Attempt to block screenshots (not available on all devices)
              </p>
            </div>
            <Switch checked={preventScreenshots} onCheckedChange={setPreventScreenshots} />
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
        <Button 
          className="w-full" 
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="mr-2">Saving...</span>
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
