import React from 'react';
import { X, Monitor, Trash2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Check } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { systemMessage, setSystemMessage, deleteAllHistory } = useChat();
  const { updateProfile } = useAuth();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState(null);

  const handleSaveSystemPrompt = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ systemPrompt: systemMessage });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-brand-dark border border-brand-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-brand-border">
          <h2 className="text-lg font-bold">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-grey rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* System Message Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">System Message</h3>
              {saveStatus === 'success' && (
                <span className="text-[10px] text-green-500 flex items-center gap-1 font-bold">
                  <Check size={10} /> Saved
                </span>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-[11px] text-brand-text-muted px-1">Custom instructions for the AI assistant</p>
              <textarea 
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                onBlur={handleSaveSystemPrompt}
                className="w-full bg-brand-grey/50 border border-brand-border rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent min-h-[120px] resize-none transition-all placeholder:text-neutral-600"
                placeholder="e.g. Always provide C++ code and explain time complexity."
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleSaveSystemPrompt}
                  disabled={isSaving}
                  className="px-4 py-2 bg-brand-grey hover:bg-brand-border border border-brand-border rounded-lg text-xs font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={12} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-red-500/80 uppercase tracking-widest px-1">Danger Zone</h3>
            <button 
              onClick={() => { if(confirm('Are you sure? This will permanently delete all your chats and messages.')){ deleteAllHistory(); onClose(); }}}
              className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/30 transition-colors group"
            >
              <div className="flex items-center gap-3 text-red-500">
                <Trash2 size={18} />
                <span className="text-sm font-medium">Clear Chat History</span>
              </div>
              <span className="text-[10px] font-bold text-red-500/50 group-hover:text-red-500">Permanent</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
