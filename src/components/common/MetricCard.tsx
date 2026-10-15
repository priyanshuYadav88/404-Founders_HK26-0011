import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'red' | 'amber' | 'green' | 'cyan' | 'slate';
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  badgeVariant = 'cyan',
  icon: Icon,
  trend,
  trendPositive
}) => {
  const badgeColors = {
    red: 'bg-red-950/60 text-red-400 border-red-800/60',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    green: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
    slate: 'bg-slate-800 text-slate-400 border-slate-700'
  };

  return (
    <div className="bg-[#0E1626] border border-slate-800/80 rounded-lg p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
          {title}
        </span>
        <div className="p-2 rounded bg-slate-800/60 text-cyan-400 border border-slate-700/50">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">
          {value}
        </span>
        {badge && (
          <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${badgeColors[badgeVariant]}`}>
            {badge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span className={`font-mono ${trendPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
