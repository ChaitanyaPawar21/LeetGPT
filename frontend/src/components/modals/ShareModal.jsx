import { X, Copy, Check, Share2, Link as LinkIcon, Globe, Loader2, ShieldOff, ShieldCheck } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { cn } from '../../utils/cn';

export const ShareModal = ({ isOpen, onClose }) => {
  const { currentChatId, chats, toggleChatSharing } = useChat();
  const currentChat = (chats || []).find(c => c._id === currentChatId);
  const [copied, setCopied] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const shareableId = currentChat?.shareableId;
  const isPublic = currentChat?.isPublic;
  const shareUrl = shareableId ? `${window.location.origin}/share/${shareableId}` : "";

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const handleToggleSharing = async () => {
    setIsUpdating(true);
    try {
      await toggleChatSharing(currentChatId);
    } catch (err) {
      console.error("Failed to toggle sharing", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-brand-dark border border-brand-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <Share2 size={20} className="text-accent" />
            <h2 className="text-lg font-bold">Share Chat</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-grey rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <button 
            onClick={handleToggleSharing}
            disabled={isUpdating}
            className={cn(
              "w-full p-4 rounded-xl border transition-all flex items-start gap-4 text-left group",
              isPublic 
                ? "bg-green-500/10 border-green-500/20" 
                : "bg-brand-grey/50 border-brand-border hover:bg-brand-grey"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0 transition-colors",
              isPublic ? "bg-green-500/20 text-green-500" : "bg-brand-grey text-brand-text-muted"
            )}>
              {isPublic ? <ShieldCheck size={20} /> : <Globe size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{isPublic ? "Visible to anyone" : "Private"}</p>
                {isUpdating && <Loader2 size={14} className="animate-spin text-brand-text-muted" />}
              </div>
              <p className="text-xs text-brand-text-muted mt-0.5">
                {isPublic 
                  ? "Anyone with the link can view. Click to make private." 
                  : "Only you can see this chat. Click to generate a public link."}
              </p>
            </div>
          </button>

          {isPublic && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <input 
                  type="text" 
                  readOnly
                  value={shareUrl}
                  className="w-full bg-brand-grey/50 border border-brand-border rounded-xl pl-10 pr-24 py-3 text-sm text-foreground focus:outline-none"
                />
                <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                <button 
                  onClick={handleCopy}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    copied ? "bg-green-600 text-white" : "bg-accent text-white hover:opacity-90 active:scale-95"
                  )}
                >
                  {copied ? <Check size={14} className="inline mr-1" /> : null}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-[11px] text-brand-text-muted justify-center">
            <span>Messages: {currentChat?.messages?.length || 0}</span>
            <div className="w-1 h-1 rounded-full bg-brand-border" />
            <span>Last activity: Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

