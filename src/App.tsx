
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ImageViewer from "./pages/ImageViewer";
import VoiceMessagePlayer from "./pages/VoiceMessagePlayer";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { user, loading } = useFirebaseAuth();
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 border-4 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <>{element}</> : <Navigate to="/" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/chat" 
            element={<ProtectedRoute element={<Index />} />}
          />
          <Route 
            path="/settings" 
            element={<ProtectedRoute element={<Settings />} />}
          />
          <Route path="/image-viewer" element={<ImageViewer />} />
          <Route path="/voice-player" element={<VoiceMessagePlayer />} />
          <Route path="/" element={<Welcome />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
