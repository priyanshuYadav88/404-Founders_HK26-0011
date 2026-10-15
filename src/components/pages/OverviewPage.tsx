import React from 'react';
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Cpu,
  Eye,
  Info
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';
import {
  MOCK_SECURITY_EVENTS,
  MOCK_INCIDENTS,
  MOCK_ASSETS,
  MOCK_INCIDENT_SEVERITY_BREAKDOWN,
  MOCK_TIMELINE_ACTIVITY
} from '../../data/mockData';
import { SecurityEvent, Incident } from '../../types';

interface OverviewPageProps {
  onNavigateToIncidents: () => void;
  onNavigateToLiveMonitor: () => void;
  onSelectEvent: (event: SecurityEvent) => void;
  onSelectIncident: (incident: Incident) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateToIncidents,
  onNavigateToLiveMonitor,
  onSelectEvent,
  onSelectIncident
}) => {
  const totalEvents = 1428;
  const activeIncidents = MOCK_INCIDENTS.filter(i => i.status !== 'Resolved').length;
  const criticalAlerts = MOCK_SECURITY_EVENTS.filter(e => e.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      <div className="bg-[#0E1626] border border-cyan-900/40 rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">
              SOC Pipeline Status: <span className="text-cyan-400 font-mono">Demo Telemetry Mode</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Displaying synthetic security telemetry and baseline models. Real-time correlation will activate in Checkpoint 2.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
          Engine: Synthetic v0.1
        </span>
      </div>

      {/* 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Security Events"
          value={totalEvents.toLocaleString()}
          subtitle="Past 24 hours (simulated)"
          badge="+12% / 1h"
          badgeVariant="cyan"
          icon={Activity}
          trend="Synthetic Feed"
          trendPositive={true}
        />
        <MetricCard
          title="Active Incidents"
          value={activeIncidents}
          subtitle="Under triage"
          badge="1 Critical P1"
          badgeVariant="red"
          icon={AlertTriangle}
          trend="Requires Review"
          trendPositive={false}
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalAlerts}
          subtitle="Unresolved critical level"
          badge="High Severity"
          badgeVariant="red"
          icon={ShieldAlert}
          trend="Immediate Action"
          trendPositive={false}
        />
        <MetricCard
          title="Detection Status"
          value="Nominal"
          subtitle="Rule Engine & ML Baselines"
          badge="Simulation"
          badgeVariant="green"
          icon={Cpu}
          trend="4 Models Loaded"
          trendPositive={true}
        />
      </div>

      {/* Charts & Analytical Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Severity Chart */}
        <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
                Incident Severity Distribution
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">Total: 4 active</span>
            </div>

            {/* Severity Bars */}
            <div className="space-y-3">
              {MOCK_INCIDENT_SEVERITY_BREAKDOWN.map((item) => (
                <div key={item.severity} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{item.severity}</span>
                    <span className="text-slate-400">{item.count} incident ({item.count * 25}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.count * 25}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Escalation SLA:</span>
            <span className="text-amber-400">P1 SLA &lt; 15 mins</span>
          </div>
        </div>

        {/* 1-Hour Telemetry Activity Volume */}
        <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
                Hourly Event Volume Trend
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">Events / 10m bucket</span>
            </div>

            <div className="h-32 flex items-end gap-3 pt-4 px-2">
              {MOCK_TIMELINE_ACTIVITY.map((bucket, idx) => {
                const heightPercent = Math.max(15, (bucket.count / 90) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {bucket.count}
                    </span>
                    <div
                      className="w-full bg-cyan-950 border border-cyan-500/50 rounded-t group-hover:bg-cyan-900 transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] font-mono text-slate-400">
                      {bucket.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Peak Velocity:</span>
            <span className="text-cyan-400 font-mono">88 events/10m @ 12:50</span>
          </div>
        </div>

        {/* Asset Risk Summary */}
        <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
                Asset Risk Summary
              </h3>
              <span className="text-[11px] font-mono text-red-400">Top Exposures</span>
            </div>

            <div className="space-y-3">
              {MOCK_ASSETS.slice(0, 3).map((asset) => (
                <div
                  key={asset.id}
                  className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-200">
                        {asset.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {asset.ipAddress}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {asset.type} • {asset.environment}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-red-400">
                      Risk {asset.riskScore}/100
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {asset.activeIncidents} active inc
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Criticality Monitored:</span>
            <span className="text-slate-300 font-mono">6 Assets Active</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Incidents & Recent Security Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents List */}
        <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
                Recent Correlated Incidents
              </h3>
              <p className="text-[11px] text-slate-400">High priority alerts requiring triage</p>
            </div>
            <button
              onClick={onNavigateToIncidents}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {MOCK_INCIDENTS.map((inc) => (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className="p-3 rounded-lg bg-[#111A2D] border border-slate-800/80 hover:border-cyan-800/60 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge priority={inc.severity}>{inc.severity}</Badge>
                      <span className="text-xs font-mono font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {inc.id}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {inc.timestamp}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      {inc.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Asset: <span className="font-mono text-slate-300">{inc.affectedAsset}</span> • Confidence: <span className="font-mono text-cyan-400">{inc.confidence}%</span>
                    </div>
                  </div>
                  <Badge status={inc.status}>{inc.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security Events Table */}
        <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
                Recent Security Events Feed
              </h3>
              <p className="text-[11px] text-slate-400">Simulated atomic event detections</p>
            </div>
            <button
              onClick={onNavigateToLiveMonitor}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Threat Monitor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Event</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2">Severity</th>
                  <th className="pb-2 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {MOCK_SECURITY_EVENTS.slice(0, 5).map((evt) => (
                  <tr
                    key={evt.id}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => onSelectEvent(evt)}
                  >
                    <td className="py-2.5 text-slate-400 text-[11px] whitespace-nowrap">
                      {evt.timestamp.split(' ')[1]}
                    </td>
                    <td className="py-2.5 text-slate-200 group-hover:text-cyan-300">
                      {evt.eventType}
                    </td>
                    <td className="py-2.5 text-slate-400">
                      {evt.sourceIp}
                    </td>
                    <td className="py-2.5">
                      <Badge severity={evt.severity}>{evt.severity}</Badge>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                        title="View event details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
