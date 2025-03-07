"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Stars, Send } from "lucide-react"

const styles = `
  @keyframes bubble {
    0% { transform: translateY(0); opacity: 0.6; }
    50% { transform: translateY(-4px); opacity: 1; }
    100% { transform: translateY(0); opacity: 0.6; }
  }
  .animate-bubble {
    animation: bubble 0.6s infinite ease-in-out;
  }
`

interface Message {
  text: string
  isUser: boolean
  timestamp: string
}

const ChatBot = () => {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
  
    const userMessage: Message = {
      text: query,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);
  
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }
  
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
  
      if (!reader) throw new Error("No reader available");
  
      const botMessage: Message = {
        text: "",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
  

      setMessages((prev) => {
        const updatedMessages = [...prev, botMessage];
        return updatedMessages;
      });
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
  
        setMessages((prev) => {

          return prev.map((msg, index) =>
            index === prev.length - 1 && !msg.isUser 
              ? { ...msg, text: msg.text + chunk }
              : msg
          );
        });
      }
  
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Error fetching response. Please try again.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Ask AI <Stars className="ml-2 h-4 w-4 text-purple-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[70vh] flex flex-col bg-white/95 rounded-xl">
        <DialogHeader className="shrink-0 px-4 pt-4">
          <DialogTitle className="bg-black backdrop-blur-md text-white p-2 flex items-center w-fit rounded-md">
            Ask AI <Stars className="ml-2 h-4 w-4 text-purple-500" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 mt-8">
              Start a conversation by typing a message below
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                msg.isUser 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <span className="text-xs opacity-70 block mt-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 flex items-center space-x-2 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bubble" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bubble" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bubble" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="shrink-0 px-4 pb-4 flex gap-2">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white shadow-sm"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading} className="bg-black hover:bg-gray-800">
            <Send className="h-4 w-4 text-white" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ChatBot