
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImageViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const imageUrl = location.state?.imageUrl || "/placeholder.svg";
  
  const handleClose = () => {
    navigate(-1);
  };
  
  const handleDownload = () => {
    // In a real app, this would download the image
    console.log("Download image:", imageUrl);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleClose} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={handleDownload} className="text-white">
            <Download className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <img 
          src={imageUrl} 
          alt="Full size preview" 
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
};

export default ImageViewer;
