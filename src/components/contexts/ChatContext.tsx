import React, { createContext, useContext, useState } from 'react';

interface ChatContextType {
  isVisible: boolean;
  toggleChatbot: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleChatbot = () => setIsVisible(prev => !prev);

  return (
    <ChatContext.Provider value={{ isVisible, toggleChatbot }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatProvider');
  }
  return context;
}
