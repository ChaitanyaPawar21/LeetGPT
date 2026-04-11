import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileCode, Maximize2, Minimize2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { cn } from '../../utils/cn';

export const ProblemPanel = () => {
  const { problemData, setProblemData } = useChat();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!problemData) return null;

  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out border-b border-brand-border bg-brand-grey/50 backdrop-blur-sm",
      isFullscreen ? "fixed inset-0 z-50 bg-brand-black" : "relative",
      isCollapsed && !isFullscreen ? "h-12" : "h-auto"
    )}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-brand-border/50">
        <div className="flex items-center gap-2">
          <FileCode size={16} className="text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">Current Problem</h3>
          <span className="text-xs text-foreground font-medium">{problemData.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 px-2 text-[10px] font-bold text-brand-text-muted hover:text-foreground transition-colors"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 px-2 text-[10px] font-bold text-brand-text-muted hover:text-foreground transition-colors"
          >

            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {(!isCollapsed || isFullscreen) && (
        <div className={cn(
          "px-6 py-4 overflow-y-auto custom-scrollbar",
          isFullscreen ? "h-[calc(100vh-48px)]" : "max-h-64"
        )}>
          <pre className="text-sm font-sans whitespace-pre-wrap text-neutral-300 leading-relaxed">
            {problemData.description}
          </pre>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setProblemData(null)}
              className="text-[10px] font-bold text-red-500/70 hover:text-red-500 underline"
            >
              Clear Problem Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
