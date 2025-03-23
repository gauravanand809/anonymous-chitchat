
import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex mb-4 justify-start">
      <div className="chat-bubble-received py-3 px-4">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-muted-foreground/70 rounded-full animate-bounce delay-100"></div>
          <div className="h-2 w-2 bg-muted-foreground/70 rounded-full animate-bounce delay-200"></div>
          <div className="h-2 w-2 bg-muted-foreground/70 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
