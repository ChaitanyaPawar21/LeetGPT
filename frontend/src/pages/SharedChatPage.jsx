import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { MessageBubble } from '../components/chat/MessageBubble';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

const SharedChatPage = () => {
  const { shareableId } = useParams();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedChat = async () => {
      try {
        const res = await api.get(`/chat/shared/${shareableId}`);
        setChat(res.data.chat);
      } catch (err) {
        setError(err.response?.data?.message || "Conversation not found or private.");
      } finally {
        setLoading(false);
      }
    };
    fetchSharedChat();
  }, [shareableId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-4 text-foreground">
        <Loader2 size={32} className="animate-spin text-accent" />
        <p className="text-sm font-medium animate-pulse">Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 text-red-500">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Unavailable</h1>
        <p className="text-brand-text-muted max-w-md mb-8">{error}</p>
        <Link 
          to="/"
          className="px-6 py-2 bg-accent text-white rounded-xl font-bold hover:opacity-90 transition-all"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black flex flex-col text-foreground">
      {/* Header */}
      <nav className="h-16 border-b border-brand-border bg-brand-black/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20 transition-transform group-hover:scale-105">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-bold tracking-tight">LeetGPT</span>
        </Link>
        
        <Link 
          to="/register"
          className="text-xs font-bold px-4 py-2 bg-brand-grey border border-brand-border rounded-xl hover:bg-brand-border transition-all"
        >
          Try it Yourself
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full py-8">
        <div className="px-6 mb-12">
          <h1 className="text-3xl font-extrabold mb-3 tracking-tight">{chat?.title || "Shared Conversation"}</h1>
          <div className="flex items-center gap-4 text-sm text-brand-text-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Shared publicly</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-brand-border" />
            <span>{chat?.messages?.length} messages</span>
          </div>
        </div>

        <div className="space-y-2">
          {chat?.messages?.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 mb-12 px-6">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-brand-grey/50 to-brand-dark border border-brand-border text-center space-y-4">
            <h2 className="text-lg font-bold">Want to solve your own problems?</h2>
            <p className="text-sm text-brand-text-muted max-w-sm mx-auto">
              Join LeetGPT to get personalized DSA guidance and interactive coding help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                to="/register"
                className="w-full sm:w-auto px-8 py-3 bg-accent text-white rounded-xl font-bold shadow-xl shadow-accent/20 hover:opacity-90 transition-all active:scale-95"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedChatPage;
