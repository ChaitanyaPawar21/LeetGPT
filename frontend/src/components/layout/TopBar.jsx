import React, { useState } from 'react';
import { Share2, Trash2, Edit2, AlertCircle, FileText, Settings } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { cn } from '../../utils/cn';

export const TopBar = ({ onOpenSettings, onOpenShare }) => {
  const { currentChatId, chats, renameChat, createNewChat, isProblemMode, setIsProblemMode } = useChat();
  const currentChat = (chats || []).find(c => c._id === currentChatId) || { title: 'New Chat' };
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(currentChat.title || 'New Chat');

  const handleRename = () => {
    renameChat(currentChatId, tempTitle);
    setIsEditing(false);
  };

  return (
    <header className="h-14 border-b border-brand-border bg-brand-black/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
        {isEditing ? (
          <input 
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="bg-brand-grey border border-neutral-700 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-500"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setTempTitle(currentChat.title || 'New Chat'); setIsEditing(true); }}>
            <h2 className="text-sm font-semibold text-foreground">{currentChat.title || 'New Chat'}</h2>
            <Edit2 size={12} className="text-brand-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Problem Mode Toggle */}
        <button 
          onClick={() => setIsProblemMode(!isProblemMode)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
            isProblemMode 
              ? "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
              : "bg-brand-grey border-brand-border text-brand-text-muted hover:text-foreground"
          )}
        >
          <FileText size={14} />
          <span>{isProblemMode ? "Problem Mode Active" : "Problem Mode"}</span>
        </button>

        <div className="w-[1px] h-4 bg-brand-border mx-1" />

        <button 
          onClick={onOpenShare}
          className="p-2 text-brand-text-muted hover:text-foreground hover:bg-brand-grey rounded-lg transition-all" 
          title="Share Chat"
        >
          <Share2 size={18} />
        </button>
        <button 
          onClick={createNewChat}
          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" 
          title="Clear & New Chat"
        >
          <Trash2 size={18} />
        </button>
        <button 
          onClick={onOpenSettings}
          className="p-2 text-brand-text-muted hover:text-foreground hover:bg-brand-grey rounded-lg transition-all" 
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
