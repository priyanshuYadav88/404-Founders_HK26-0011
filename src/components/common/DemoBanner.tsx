import React from 'react';
import { AlertTriangle, Play, Pause, Plus, RotateCcw } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const DemoBanner: React.FC = () => {
  const { isAutoStreaming, toggleAutoStream, simulateEvent, resetDemo, metrics } = useDemo();

  return (
    <div className="bg-[#0B1524] border-b border-cyan-900/50 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAutoStreaming ? 'bg-cyan-400' : 'bg-slate-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoStreaming ? 'bg-cyan-500' : 'bg-slate-500'}`}></span>
        </span>
        <span className="font-mono font-semibold text-cyan-300 uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80 text-[11px]">
          Demo Controls
        </span>
        <span className="text-slate-400 hidden lg:inline font-mono text-[11px]">
          {metrics.totalEvents} Events • {metrics.activeIncidents} Active Incidents • {metrics.criticalAlerts} Critical
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="flex items-center gap-2 font-mono text-xs">
        <button
          onClick={toggleAutoStream}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] transition-colors ${
            isAutoStreaming
              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/80 font-semibold'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
          }`}
          title={isAutoStreaming ? 'Pause continuous synthetic event generation' : 'Start continuous synthetic event generation'}
        >
          {isAutoStreaming ? (
            <>
              <Pause className="w-3 h-3 text-cyan-400 fill-current" />
              <span>Streaming ON</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-slate-400" />
              <span>Auto-Stream OFF</span>
            </>
          )}
        </button>

        <button
          onClick={() => simulateEvent()}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-[11px] transition-colors shadow-sm"
          title="Generate a synthetic security event immediately"
        >
          <Plus className="w-3 h-3" />
          <span>Simulate Event</span>
        </button>

        <button
          onClick={resetDemo}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-[11px] transition-colors"
          title="Reset demo buffer to default state"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>

        <span className="hidden sm:inline-flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded text-amber-300 border border-amber-800/40 text-[10px]">
          <AlertTriangle className="w-3 h-3" />
          Simulation Sandbox
        </span>
      </div>
    </div>
  );
};
