import { createContext, useContext, useState } from "react";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const value = {
    messages,
    setMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};
