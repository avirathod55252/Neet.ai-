import React from 'react';
import { Activity, Zap, BookOpen, BrainCircuit, Sparkles } from 'lucide-react';

export const ThumbnailCard = () => {
  return (
    <div className="w-[560px] h-[280px] bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center text-white shadow-2xl font-sans select-none ring-1 ring-slate-800">
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
       <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full translate-x-1/2 translate-y-1/2"></div>
       
       {/* Decorative Noise/Grid (Simulated with opacity) */}
       <div className="absolute inset-0 bg-slate-900/50"></div>
       
       {/* Floating Icons (Decorative) */}
       <Zap className="absolute top-12 left-12 text-emerald-500/20 w-12 h-12 rotate-12" />
       <BookOpen className="absolute bottom-12 left-20 text-blue-500/20 w-10 h-10 -rotate-12" />
       <BrainCircuit className="absolute top-10 right-16 text-purple-500/20 w-14 h-14 rotate-45" />

       {/* Main Content */}
       <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-3">
             <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Activity className="w-10 h-10 text-white" />
             </div>
             <h1 className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
               NEET.ai
             </h1>
          </div>
          
          <div className="flex items-center gap-3 text-slate-400 text-lg font-medium tracking-wide">
             <span className="h-px w-8 bg-slate-700"></span>
             <span>Next-Gen Medical Entrance Prep</span>
             <span className="h-px w-8 bg-slate-700"></span>
          </div>
       </div>

       {/* Footer Badge */}
       <div className="absolute bottom-6 flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Powered by Gemini AI</span>
       </div>
    </div>
  );
};