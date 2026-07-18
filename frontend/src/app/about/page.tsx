import { ArrowRight, BrainCircuit, Code2, Database, LayoutTemplate, Network, Server } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="text-center mb-16">
          <BrainCircuit className="w-16 h-16 text-glow-graph mx-auto mb-6" />
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            About Synaptic<span className="text-glow-graph">Canvas</span>
          </h1>
          <p className="text-xl text-ink-muted">
            The next generation of STEM education, powered by interactive AI widgets.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white border-b border-canvas-border pb-4 mb-6">
            The Vision
          </h2>
          <p className="text-ink text-lg leading-relaxed mb-4">
            Most AI tools return "walls of text" that are difficult to visualize and boring to read. 
            SynapticCanvas fundamentally changes how students interact with LLMs. 
          </p>
          <p className="text-ink text-lg leading-relaxed">
            Instead of reading about how a pendulum works, the AI generates a fully working interactive 
            simulation. Instead of looking at a static graph, you get sliders to modify variables in real-time.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white border-b border-canvas-border pb-4 mb-6">
            Architecture
          </h2>
          <div className="bg-canvas-panel border border-canvas-border rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="flex items-center gap-2 text-white font-medium mb-4">
                  <LayoutTemplate className="w-5 h-5 text-glow-physics" /> Frontend
                </h3>
                <ul className="space-y-3 text-ink-muted">
                  <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-1 shrink-0 text-glow-physics"/> Next.js 15 (App Router)</li>
                  <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-1 shrink-0 text-glow-physics"/> Tailwind CSS + Shadcn UI</li>
                  <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-1 shrink-0 text-glow-physics"/> Framer Motion Animations</li>
                  <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-1 shrink-0 text-glow-physics"/> Matter.js (Physics) & Recharts (Math)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center gap-2 text-white font-medium mb-4">
                  <Server className="w-5 h-5 text-glow-flow" /> Backend
                </h3>
                <ul className="space-y-3 text-ink-muted">
                  <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-1 shrink-0 text-glow-flow"/> FastAPI (Python)</li>
                  <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-1 shrink-0 text-glow-flow"/> GPT-OSS 120B (via Groq)</li>
                  <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-1 shrink-0 text-glow-flow"/> Tavily API (Web Search)</li>
                  <li className="flex gap-2"><ArrowRight className="w-4 h-4 mt-1 shrink-0 text-glow-flow"/> Server-Sent Events (SSE) Streaming</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center mt-16">
          <Link href="/canvas" className="px-8 py-4 bg-white text-black rounded-xl font-medium transition-transform hover:scale-105">
            Try the Canvas
          </Link>
        </div>
      </div>
    </main>
  );
}
