'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  storeId: string;
  className?: string;
}

export function ChatInterface({ storeId, className = '' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          storeId,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response },
        ]);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`flex flex-col h-[600px] w-full max-w-md ${className} overflow-hidden rounded-xl shadow-lg`}>
      <motion.div 
        className="flex items-center gap-2 p-4 border-b bg-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <h2 className="font-semibold text-xl text-white">Store Assistant</h2>
      </motion.div>

      <ScrollArea className="flex-1 p-4 bg-white" ref={scrollAreaRef}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-2 mb-4 ${
                message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[80%] shadow-md ${
                  message.role === 'assistant'
                    ? 'bg-white text-gray-800'
                    : 'bg-black text-white ml-auto'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'assistant' ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {message.role === 'assistant' ? 'Assistant' : 'You'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            className="flex items-center gap-2 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Bot className="w-5 h-5" />
            <span className="text-sm">Typing</span>
            <TypingAnimation />
          </motion.div>
        )}
      </ScrollArea>

      <motion.form 
        onSubmit={handleSubmit} 
        className="p-4 border-t bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-grow rounded-full border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-200 transition-all duration-300"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="rounded-full bg-black hover:bg-gray-800 transition-colors duration-300"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </motion.form>
    </Card>
  );
}

const TypingAnimation = () => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className="w-1.5 h-1.5 bg-black rounded-full"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.5,
          delay: index * 0.15,
        }}
      />
    ))}
  </div>
);

