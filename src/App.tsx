import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import ChatMessage from "./components/ChatMessage";
import { searchFAQ } from "./lib/searchFAQ";

interface Message {
  text: string;
  isBot: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const results = await searchFAQ(userMessage);
      // Always take the first (most relevant) result
      const answer = (results[0] as { answer: string }).answer;
      setMessages((prev) => [...prev, { text: answer, isBot: true }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I apologize, but I'm having trouble accessing the answer database at the moment. Please try again in a few moments.",
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">FAQ Chatbot</h1>
        </div>

        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isBot={message.isBot}
            />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="animate-pulse">⋯</div>
              <span className="text-gray-500">Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
