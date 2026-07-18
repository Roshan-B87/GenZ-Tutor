"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ChatPanel from "@/components/ChatPanel";
import WidgetRenderer from "@/components/WidgetRenderer";
import { askTutorStream } from "@/lib/api";
import { saveToHistory } from "@/lib/storage";
import type { WidgetSpec } from "@/types/widget";
import { GLOW_COLOR } from "@/types/widget";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

function CanvasContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const [spec, setSpec] = useState<WidgetSpec | null>(null);
  const [status, setStatus] = useState<string>("Waiting for question...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAskedRef = useRef(false);

  useEffect(() => {
    if (q && !hasAskedRef.current) {
      hasAskedRef.current = true;
      handleAsk(q);
    }
  }, [q]);
  
  const handleAsk = async (question: string) => {
    setLoading(true);
    setError(null);
    setStatus("Connecting to AI...");
    
    try {
      await askTutorStream(question, {
        onStatus: (msg) => setStatus(msg),
        onProgress: (tokens) => setStatus(`Building widget... (${tokens} tokens)`),
        onComplete: (completedSpec) => {
          setSpec(completedSpec);
          saveToHistory(question, completedSpec);
          setLoading(false);
          setStatus("Done!");
        },
        onError: (err) => {
          setError(err);
          setLoading(false);
          setStatus("Error occurred.");
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 h-full w-full">
      {/* Chat Sidebar */}
      <aside className="w-full md:w-[380px] shrink-0 border-r border-canvas-border bg-canvas-panel/30 p-6 flex flex-col z-20">
        <ChatPanel
          onAsk={handleAsk}
          loading={loading}
          error={error}
          status={status}
        />
      </aside>

      {/* Main Canvas Area */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-canvas">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#20232E 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        
        {/* Ambient Glow */}
        <AnimatePresence>
          {spec && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute pointer-events-none h-[600px] w-[800px] rounded-full blur-[100px]"
              style={{ backgroundColor: GLOW_COLOR[spec.widget] }}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center justify-center">
          {loading && !spec ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-ink-muted"
            >
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-glow-graph" />
              <p className="animate-pulse">{status}</p>
            </motion.div>
          ) : spec ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="mb-6 bg-canvas-panel/50 backdrop-blur-md border border-canvas-border p-4 rounded-xl flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                  🤖
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-1">AI Tutor</p>
                  <p className="text-ink text-sm leading-relaxed">{spec.tutor_text}</p>
                </div>
              </div>
              
              <div className="bg-canvas-panel/80 backdrop-blur-xl border border-canvas-border rounded-2xl overflow-hidden shadow-2xl p-6">
                <WidgetRenderer spec={spec} />
              </div>
            </motion.div>
          ) : (
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-canvas-panel border border-canvas-border flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h2 className="text-white text-xl font-semibold mb-2">Blank Canvas</h2>
              <p className="text-ink-muted text-sm">
                Ask a question on the left panel to generate an interactive widget. Try "How does a pendulum work?"
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function CanvasPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-canvas text-white">Loading Canvas...</div>}>
      <CanvasContent />
    </Suspense>
  );
}
