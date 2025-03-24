
import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  Timestamp,
  getDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "firebase/firestore";

export interface Attachment {
  type: "image" | "voice";
  url: string;
}

export interface Message {
  id: string;
  content: string;
  sender: "me" | "them";
  timestamp: Timestamp;
  attachment?: Attachment;
  status?: "sent" | "delivered" | "read";
}

export interface FirebaseChat {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Timestamp;
  unread: number;
  online: boolean;
  participants: string[];
}

export function useFirebaseChat(userId: string | undefined) {
  const [chats, setChats] = useState<FirebaseChat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch user's chats
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData: FirebaseChat[] = [];
      snapshot.forEach((doc) => {
        chatData.push({ id: doc.id, ...doc.data() } as FirebaseChat);
      });
      setChats(chatData);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
      toast({
        title: "Error fetching chats",
        description: err.message,
        variant: "destructive"
      });
    });

    return () => unsubscribe();
  }, [userId, toast]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat || !userId) return;

    const q = query(
      collection(db, "chats", activeChat, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messageData.push({
          id: doc.id,
          content: data.content,
          sender: data.senderId === userId ? "me" : "them",
          timestamp: data.timestamp,
          attachment: data.attachment,
          status: data.status
        });
      });
      setMessages(messageData);
    }, (err) => {
      setError(err.message);
      toast({
        title: "Error fetching messages",
        description: err.message,
        variant: "destructive"
      });
    });

    // Mark messages as read
    markMessagesAsRead(activeChat, userId);

    return () => unsubscribe();
  }, [activeChat, userId, toast]);

  const markMessagesAsRead = async (chatId: string, userId: string) => {
    try {
      const q = query(
        collection(db, "chats", chatId, "messages"),
        where("senderId", "!=", userId),
        where("status", "!=", "read")
      );
      
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (document) => {
        await updateDoc(doc(db, "chats", chatId, "messages", document.id), {
          status: "read"
        });
      });
      
      // Update unread count in chat
      await updateDoc(doc(db, "chats", chatId), {
        unread: 0
      });
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  const sendMessage = async (content: string, attachment?: File) => {
    if (!activeChat || !userId || !content.trim()) return;

    try {
      let attachmentData: Attachment | undefined;

      if (attachment) {
        const storageRef = ref(storage, `chat-attachments/${activeChat}/${Date.now()}_${attachment.name}`);
        await uploadBytes(storageRef, attachment);
        const downloadUrl = await getDownloadURL(storageRef);
        
        const fileType = attachment.type.startsWith('image') ? 'image' : 'voice';
        attachmentData = {
          type: fileType as "image" | "voice",
          url: downloadUrl
        };
      }

      const messageData = {
        content,
        senderId: userId,
        timestamp: serverTimestamp(),
        status: "sent",
        ...(attachmentData && { attachment: attachmentData })
      };

      // Add message to chat
      await addDoc(collection(db, "chats", activeChat, "messages"), messageData);

      // Update last message in chat
      await updateDoc(doc(db, "chats", activeChat), {
        lastMessage: content,
        lastMessageTime: serverTimestamp()
      });

      // Simulate delivery after a short delay
      setTimeout(async () => {
        // Get the last message
        const q = query(
          collection(db, "chats", activeChat, "messages"),
          where("senderId", "==", userId),
          orderBy("timestamp", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          await updateDoc(doc(db, "chats", activeChat, "messages", querySnapshot.docs[0].id), {
            status: "delivered"
          });
        }
      }, 1000);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          title: "Error sending message",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  };

  const startNewChat = async () => {
    if (!userId) return null;

    try {
      // Find an available random user
      const usersQuery = query(
        collection(db, "users"),
        where("available", "==", true)
      );
      
      const querySnapshot = await getDocs(usersQuery);
      
      if (querySnapshot.empty) {
        toast({
          title: "No users available",
          description: "Try again later"
        });
        return null;
      }
      
      // Get a random user
      const randomIndex = Math.floor(Math.random() * querySnapshot.size);
      const randomUser = querySnapshot.docs[randomIndex];
      const partnerId = randomUser.id;
      
      if (partnerId === userId) {
        toast({
          title: "Cannot chat with yourself",
          description: "Try again to find another user"
        });
        return null;
      }
      
      // Create a new chat
      const chatRef = await addDoc(collection(db, "chats"), {
        participants: [userId, partnerId],
        lastMessage: "Chat started",
        lastMessageTime: serverTimestamp(),
        unread: 0,
        online: true,
        name: "Anonymous Stranger"
      });
      
      // Add welcome message
      await addDoc(collection(db, "chats", chatRef.id, "messages"), {
        content: "You're now chatting with a random stranger. Say hi!",
        senderId: partnerId,
        timestamp: serverTimestamp(),
        status: "read"
      });
      
      setActiveChat(chatRef.id);
      
      return chatRef.id;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          title: "Error starting chat",
          description: err.message,
          variant: "destructive"
        });
      }
      return null;
    }
  };

  const endChat = async (chatId: string) => {
    if (!chatId || !userId) return;

    try {
      // Add system message about chat ending
      await addDoc(collection(db, "chats", chatId, "messages"), {
        content: "You ended this chat. Start a new chat to talk with someone else.",
        senderId: "system",
        timestamp: serverTimestamp(),
        status: "read"
      });
      
      // Update the chat status
      await updateDoc(doc(db, "chats", chatId), {
        ended: true,
        online: false
      });
      
      toast({
        title: "Chat Ended",
        description: "You've ended the chat with this stranger."
      });
      
      setActiveChat(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          title: "Error ending chat",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  };

  const sendFriendRequest = async (chatId: string) => {
    if (!chatId || !userId) return;

    try {
      // Add system message about friend request
      await addDoc(collection(db, "chats", chatId, "messages"), {
        content: "You sent a friend request to this stranger. They'll need to accept it to add you to their contacts.",
        senderId: "system",
        timestamp: serverTimestamp(),
        status: "read"
      });
      
      // Create a friend request document
      const chatDoc = await getDoc(doc(db, "chats", chatId));
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const partnerId = chatData.participants.find((id: string) => id !== userId);
        
        await setDoc(doc(db, "friendRequests", `${userId}_${partnerId}`), {
          senderId: userId,
          receiverId: partnerId,
          status: "pending",
          timestamp: serverTimestamp(),
          chatId: chatId
        });
      }
      
      toast({
        title: "Friend Request Sent",
        description: "Friend request sent to this stranger."
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          title: "Error sending friend request",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  };

  return {
    chats,
    messages,
    activeChat,
    loading,
    error,
    setActiveChat,
    sendMessage,
    startNewChat,
    endChat,
    sendFriendRequest
  };
}
