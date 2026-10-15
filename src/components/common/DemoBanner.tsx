import React from 'react';
import { AlertTriangle, Terminal } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-[#0E1B2E] border-b border-cyan-900/50 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="font-mono font-semibold text-cyan-300 uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80 text-[11px]">
          Demo Mode Active
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Synthetic security telemetry & simulated attack sequences for interface validation.
        </span>
      </div>
      <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
        <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
          <Terminal className="w-3 h-3 text-cyan-400" />
          Backend Pipeline: Pending Checkpoint 2
        </span>
        <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-amber-300 border border-amber-800/50">
          <AlertTriangle className="w-3 h-3" />
          Simulated Events
        </span>
      </div>
    </div>
  );
};
