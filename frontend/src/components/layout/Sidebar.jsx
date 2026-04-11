import React, { useState } from 'react';
import { Plus, Search, Pin, PinOff, Trash2, Settings, History, LogOut } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export const Sidebar = ({ onOpenSettings, isOpen }) => {
  const {
    chats,
    currentChatId,
    switchChat,
    createNewChat,
    deleteChat,
    togglePin
  } = useChat();

  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ✅ Safe filtering
  const filteredChats = (chats || []).filter(chat =>
    (chat.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredChats.filter(chat => chat.pinned);
  const unpinnedChats = filteredChats.filter(chat => !chat.pinned);

  const ChatItem = ({ chat }) => (
    <div
      className={cn(
        "group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200",
        currentChatId === chat._id
          ? "bg-brand-grey text-foreground border border-brand-border/50"
          : "text-brand-text-muted hover:bg-brand-grey/50 hover:text-foreground"
      )}
      onClick={() => switchChat(chat._id)}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <History size={16} className="shrink-0" />
        <span className="truncate text-sm font-medium">
          {chat.title || "New Chat"}
        </span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePin(chat._id); // ✅ FIXED
          }}
          className="p-1 hover:text-amber-400"
        >
          {chat.pinned ? <PinOff size={14} /> : <Pin size={14} />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteChat(chat._id); // ✅ FIXED
          }}
          className="p-1 hover:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <aside className={cn(
      "fixed md:relative z-40 inset-y-0 left-0 w-64 h-screen bg-brand-dark border-r border-brand-border flex flex-col shrink-0 transition-transform duration-300 ease-in-out font-sans",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      
      {/* New Chat */}
      <div className="p-4">
        <button
          onClick={createNewChat}
          className="w-full flex items-center justify-center gap-2 bg-accent text-white hover:opacity-90 p-2 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-accent/20"
        >
          <Plus size={20} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mb-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-grey border border-brand-border rounded-lg pl-8 p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-700"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6">
        
        {pinnedChats.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-2 mb-2">
              Pinned
            </h3>
            <div className="space-y-1">
              {pinnedChats.map(chat => (
                <ChatItem key={chat._id} chat={chat} /> // ✅ FIXED
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-2 mb-2">
            Recent
          </h3>
          <div className="space-y-1">
            {unpinnedChats.map(chat => (
              <ChatItem key={chat._id} chat={chat} /> // ✅ FIXED
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-brand-border space-y-2 relative">

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 p-2 rounded-lg text-brand-text-muted hover:bg-brand-grey transition-colors"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>

        {showProfileMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-brand-dark border border-brand-border rounded-xl shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="px-4 py-2 border-b border-brand-border/50 text-[10px] text-brand-text-muted truncate">
              {user?.email}
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        )}

        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-full flex items-center gap-3 p-2 rounded-lg text-brand-text-muted hover:bg-brand-grey transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] text-white font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-sm font-medium truncate">
            {user?.name || 'User'}
          </span>
        </button>

      </div>
    </aside>
  );
};