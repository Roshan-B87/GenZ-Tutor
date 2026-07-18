import { useState } from "react";
import { Send, Loader2, Sparkles, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  onAsk: (q: string) => void;
  loading: boolean;
  error: string | null;
  status: string;
}

const SUGGESTIONS = [
  "How does gravity affect orbit?",
  "Graph the sine wave amplitude",
  "Show me the Krebs cycle",
];

export default function ChatPanel({ onAsk, loading, error, status }: ChatPanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onAsk(input);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <img src="/GENZTutor.png" alt="GENZTutor Logo" className="h-[48px] w-auto object-contain" />
        </div>
        <p className="text-sm text-ink-muted mt-1">
          Ask anything. I'll build a widget to explain it.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
        {/* Suggestions */}
        {!loading && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-3">
              Try asking
            </p>
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => onAsk(q)}
                className="w-full text-left p-3 rounded-lg bg-canvas border border-canvas-border text-sm text-ink hover:text-white hover:border-glow-graph/50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-4 rounded-xl bg-canvas border border-canvas-border flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 text-glow-flow animate-spin" />
            <span className="text-sm text-ink">{status}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-200">
            <p className="text-sm mb-3">{error}</p>
            <button 
              onClick={() => onAsk(input)}
              className="flex items-center gap-2 text-xs font-medium bg-red-900/40 hover:bg-red-900/60 px-3 py-1.5 rounded border border-red-800 transition-colors"
            >
              <RefreshCcw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-canvas-border relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          className="w-full bg-canvas border border-canvas-border rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-ink-muted focus:outline-none focus:border-glow-graph/50 focus:ring-1 focus:ring-glow-graph/50 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
