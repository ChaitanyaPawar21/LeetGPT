import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export const MessageBubble = ({ message }) => {
  const isAI = message.role === 'assistant'; // ✅ FIXED

  const [copiedCode, setCopiedCode] = React.useState(null);
  const [copiedAll, setCopiedAll] = React.useState(false);

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(message.content);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className={cn(
      "group w-full flex gap-6 px-6 py-8 transition-colors",
      isAI ? "bg-transparent text-foreground" : "bg-brand-grey/20 text-foreground"
    )}>

      {/* Avatar */}
      <div className="flex-shrink-0 pt-1">
        {isAI ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center text-white">
            <Sparkles size={16} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-grey border border-brand-border flex items-center justify-center text-foreground">
            <User size={16} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3 max-w-3xl">

        {/* Copy Full Response */}
        {isAI && (
          <div className="flex justify-end h-6">
            <button
              onClick={handleCopyAll}
              className="text-[10px] text-brand-text-muted hover:text-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copiedAll ? <Check size={10}/> : <Copy size={10}/>}
              {copiedAll ? "Copied" : "Copy all"}
            </button>
          </div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children }) {
              const match = /language-(\w+)/.exec(className || '');
              const code = String(children).trim();
              const id = Math.random();

              if (!inline && match) {
                return (
                  <div className="relative my-4 rounded-xl overflow-hidden border border-brand-border bg-brand-dark shadow-sm">
                    {/* Header */}
                    <div className="flex justify-between px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-brand-text-muted bg-brand-grey border-b border-brand-border/50">
                      <span>{match[1]}</span>
                      <button 
                        onClick={() => handleCopy(code, id)}
                        className="hover:text-foreground transition-colors"
                      >
                        {copiedCode === id ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, padding: '16px' }}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              if (!inline) {
                return (
                  <div className="relative my-4 bg-[#0d0d0d] p-4 rounded-xl">
                    <button
                      onClick={() => handleCopy(code, id)}
                      className="absolute top-2 right-2 text-xs"
                    >
                      {copiedCode === id ? "Copied" : "Copy"}
                    </button>
                    <pre><code>{code}</code></pre>
                  </div>
                );
              }

              return (
                <code className="bg-brand-grey text-brand-text-muted px-2 py-0.5 rounded-md text-sm border border-brand-border/50">
                  {children}
                </code>
              );
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};