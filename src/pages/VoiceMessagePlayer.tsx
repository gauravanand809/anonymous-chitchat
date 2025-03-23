
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Play, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const VoiceMessagePlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const audioUrl = location.state?.audioUrl || "";
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    
    // Clean up
    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        toast({
          title: "Playback Error",
          description: "Could not play the audio file.",
          variant: "destructive"
        });
        console.error("Audio playback error:", error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // For the prototype, we'll use a placeholder if no valid audio is provided
  if (!audioUrl) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold mb-4">Voice Message Playback</h2>
          <p className="text-muted-foreground mb-8">No audio file to play.</p>
          <Button onClick={handleClose}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-medium">Voice Message</h2>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-16 w-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSliderChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMessagePlayer;
