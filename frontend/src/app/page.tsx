"use client";

import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { WorldMapDemo } from "@/components/WorldMapDemo";
import Link from "next/link";
import { ArrowRight, Brain, Zap, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

import { FocusCards } from "@/components/ui/focus-cards";

export const StarsBackgroundDemo = () => {
  return (
    <StarsBackground
      starColor="#FFF"
      className={cn(
        'absolute inset-0 z-0',
        'bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]'
      )}
    />
  );
};

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center relative min-h-[calc(100vh-4rem)]">
      <div className="w-full flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-neutral-950">
        <StarsBackgroundDemo />
        
        <div className="z-10 flex flex-col items-center max-w-4xl px-4 text-center mt-32 md:mt-40">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold"
          >
            Learn STEM by Playing
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-neutral-500 max-w-2xl mx-auto my-6 text-base md:text-xl text-center relative z-10"
          >
            Stop reading boring textbooks. Ask a question and watch our AI instantly build 
            interactive physics simulations, math graphs, and chemical flow diagrams.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 relative z-10 mt-4"
          >
            <Link 
              href="/canvas" 
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-medium transition-all hover:scale-105"
            >
              Start Building Widgets
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/explore" 
              className="flex items-center justify-center px-8 py-4 bg-transparent border border-neutral-800 text-white rounded-xl font-medium transition-all hover:bg-neutral-900"
            >
              Explore Gallery
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-24 w-full relative z-10 max-w-5xl mx-auto pb-24"
          >
            <FocusCards cards={[
              { title: "Interactive Math Graphs", src: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop" },
              { title: "Real-time Physics", src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop" },
              { title: "Flow Diagrams", src: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=600&auto=format&fit=crop" },
            ]} />
          </motion.div>
        </div>
      </div>
      
      {/* World Map Demo section at the bottom */}
      <WorldMapDemo />
      
      <Footer />
    </main>
  );
}
