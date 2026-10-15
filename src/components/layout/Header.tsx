import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Radio } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing = false }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0B101A] px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide text-base">
                ThreatPulse <span className="text-cyan-400 font-mono">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                SOC Core v0.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Intelligent Cyber Threat Detection & Investigation
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* System telemetry status */}
        <div className="hidden lg:flex items-center gap-2 bg-[#0E1626] border border-slate-800 rounded-md px-3 py-1.5 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime || 'Loading UTC...'}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#0E1626] border border-slate-800 rounded-md px-3 py-1.5 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400">SOC Sensor:</span>
          <span className="text-emerald-400 font-semibold">Active</span>
        </div>

        {/* Refresh simulation button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-md border border-slate-700 transition-colors disabled:opacity-50"
            title="Refresh synthetic telemetry stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="font-mono text-xs">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        )}

        {/* Analyst Profile Status */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-semibold text-cyan-300">
            PY
          </div>
          <div className="hidden xl:block text-left text-xs">
            <div className="text-slate-200 font-medium">SecOps Tier-1</div>
            <div className="text-[10px] text-cyan-400 font-mono">Duty Roster #404</div>
          </div>
        </div>
      </div>
    </header>
  );
};
