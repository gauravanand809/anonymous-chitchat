
import { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function useOnlineStatus(userId: string | undefined) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsOffline(false);
      
      if (userId) {
        updateUserStatus(true);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsOffline(true);
      
      toast({
        title: "Connection Lost",
        description: "We're having trouble connecting to the server. Reconnecting...",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set up presence system
    if (userId) {
      updateUserStatus(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Clean up presence
      if (userId) {
        updateUserStatus(false);
      }
    };
  }, [userId, toast]);

  const updateUserStatus = async (online: boolean) => {
    if (!userId) return;

    try {
      await updateDoc(doc(db, 'users', userId), {
        online,
        lastSeen: serverTimestamp()
      });
      
      if (online) {
        toast({
          title: "Connected",
          description: "You're back online!",
        });
      }
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  };

  return { isOnline, isOffline };
}
