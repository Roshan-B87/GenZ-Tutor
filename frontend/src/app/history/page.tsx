"use client";

import { useEffect, useState } from "react";
import { getHistory, deleteHistoryItem, clearHistory, HistoryItem } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import WidgetRenderer from "@/components/WidgetRenderer";
import { Trash2, Clock, Inbox } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeItem, setActiveItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    const newHistory = getHistory();
    setHistory(newHistory);
    if (activeItem?.id === id) setActiveItem(null);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      clearHistory();
      setHistory([]);
      setActiveItem(null);
    }
  };

  if (history.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-canvas-panel border border-canvas-border flex items-center justify-center mb-6">
          <Inbox className="w-10 h-10 text-ink-muted" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">No History Yet</h2>
        <p className="text-ink-muted mb-8 max-w-sm">
          Widgets you generate on the canvas will automatically be saved here for you to revisit later.
        </p>
        <Link href="/canvas" className="px-6 py-3 bg-white text-black rounded-xl font-medium">
          Go to Canvas
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 flex h-[calc(100vh-4rem)]">
      {/* Sidebar List */}
      <div className="w-full md:w-[350px] border-r border-canvas-border bg-canvas-panel/30 flex flex-col">
        <div className="p-4 border-b border-canvas-border flex items-center justify-between">
          <h2 className="font-semibold text-white">Your Sessions</h2>
          <button onClick={handleClear} className="text-xs text-red-400 hover:text-red-300 transition-colors">
            Clear All
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeItem?.id === item.id 
                  ? "bg-canvas-panel border-white/20" 
                  : "bg-canvas border-canvas-border hover:border-white/10"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-ink-muted capitalize px-2 py-0.5 rounded bg-white/5">
                  {item.discipline}
                </span>
                <button 
                  onClick={(e) => handleDelete(item.id, e)}
                  className="text-ink-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-white font-medium mb-2 line-clamp-2">{item.question}</p>
              <div className="flex items-center gap-1 text-xs text-ink-muted">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Preview */}
      <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-canvas">
        {activeItem ? (
          <div className="w-full max-w-3xl">
            <div className="mb-6 bg-canvas-panel border border-canvas-border p-6 rounded-xl text-center">
              <h3 className="text-lg text-white font-medium mb-1">"{activeItem.question}"</h3>
              <p className="text-sm text-ink-muted">{activeItem.spec.tutor_text}</p>
            </div>
            <div className="bg-canvas-panel/80 border border-canvas-border rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
              <WidgetRenderer spec={activeItem.spec} />
            </div>
          </div>
        ) : (
          <div className="text-ink-muted text-sm text-center">
            Select a past session from the sidebar to view it.
          </div>
        )}
      </div>
    </main>
  );
}
