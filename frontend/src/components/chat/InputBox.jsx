import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code2, Zap, HelpCircle, ChevronUp } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { cn } from '../../utils/cn';

export const InputBox = () => {
  const { sendMessage, isProblemMode, setProblemData, isLoading } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (isProblemMode && input.includes('Example 1')) {
      // Mock detecting a problem description
      setProblemData({
        title: "Detected LeetCode Problem",
        description: input
      });
    }

    sendMessage(input);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const QuickAction = ({ icon: Icon, label, onClick }) => (
    <button 
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-grey border border-brand-border text-[11px] font-semibold text-brand-text-muted hover:text-foreground hover:border-foreground/30 transition-all active:scale-95 shadow-sm"
    >
      <Icon size={12} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="p-4 bg-brand-black/80 backdrop-blur-xl border-t border-brand-border sticky bottom-0 z-30">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Quick Actions */}
        <div className="hidden md:flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar">
          <QuickAction icon={Sparkles} label="Explain in simple terms" onClick={() => sendMessage("Explain the current problem in very simple terms for a beginner.")} />
          <QuickAction icon={Zap} label="Give optimized solution" onClick={() => sendMessage("What is the most time and space optimized solution for this problem?")} />
          <QuickAction icon={Code2} label="Show dry run" onClick={() => sendMessage("Walk me through a dry run of the solution with an example input.")} />
          <QuickAction icon={HelpCircle} label="Hint only" onClick={() => sendMessage("Don't give the code yet, just give me a small hint to point me in the right direction.")} />
        </div>

        {/* Input Area */}
        <div className="relative bg-brand-grey border border-brand-border rounded-2xl focus-within:border-neutral-600 transition-colors shadow-2xl">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isProblemMode ? "Paste your LeetCode problem description here..." : "Ask your DSA doubt or paste code..."}
            className="w-full bg-transparent p-4 pr-12 text-[15px] resize-none focus:outline-none min-h-[56px] custom-scrollbar text-foreground disabled:opacity-50"
          />
          <button 
            disabled={!input.trim() || isLoading}
            onClick={handleSubmit}
            className={cn(
              "absolute right-2 bottom-2 p-2 rounded-xl transition-all",
              input.trim() 
                ? "bg-accent text-white hover:opacity-90 scale-100 opacity-100 shadow-lg shadow-accent/20" 
                : "bg-brand-grey text-brand-text-muted scale-90 opacity-50"
            )}
          >
            <Send size={18} />
          </button>
        </div>
        
        <p className="text-[10px] text-center text-brand-text-muted">
          DSA Assistant may give incorrect answers. Verify code before using. Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
};
