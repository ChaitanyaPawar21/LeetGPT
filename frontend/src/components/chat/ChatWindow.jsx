import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ProblemPanel } from './ProblemPanel';
import { useChat } from '../../context/ChatContext';
import { ChevronDown } from 'lucide-react';

// Animated typing indicator
const TypingBubble = () => (
  <div className="flex items-end gap-3 p-6 max-w-4xl mx-auto w-full">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
      <span className="text-[11px] font-bold text-white">AI</span>
    </div>
    <div className="bg-brand-grey border border-brand-border rounded-2xl rounded-bl-sm px-5 py-4">
      <div className="flex gap-1.5 items-center">
        <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

export const ChatWindow = () => {
  const { messages, isLoading } = useChat();
  const scrollRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = React.useState(false);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const scrollHeight = scrollRef.current.scrollHeight;
      const height = scrollRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      scrollRef.current.scrollTo({
        top: maxScrollTop > 0 ? maxScrollTop : 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Initial scroll
    scrollToBottom();
    
    // Delayed scroll for dynamic content (code blocks, animations)
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Show button if we're more than 300px away from bottom
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-brand-black relative">
      <ProblemPanel />
      
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
      >
        <div className="max-w-4xl mx-auto w-full">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          {isLoading && <TypingBubble />}
          {/* Spacer for bottom input */}
          <div className="h-32" />
        </div>
      </div>

      {showScrollButton && (
        <button 
          onClick={scrollToBottom}
          className="absolute bottom-32 right-8 p-2 rounded-full bg-brand-grey border border-brand-border text-neutral-400 hover:text-white shadow-xl animate-bounce z-20"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
};
