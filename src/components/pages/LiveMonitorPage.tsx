import React, { useState, useMemo } from 'react';
import {
  Search,
  Terminal,
  Shield,
  ArrowRight,
  X,
  Play,
  RotateCcw,
  Zap,
  Cpu,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { useDemo } from '../../context/DemoContext';
import { calculateRiskScore } from '../../services/detectionEngine';

interface LiveMonitorPageProps {
  onNavigateToIncident?: (incidentId: string) => void;
}

export const LiveMonitorPage: React.FC<LiveMonitorPageProps> = ({ onNavigateToIncident }) => {
  const { events, simulateEvent, selectedEvent, setSelectedEvent, assets, incidents } = useDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        searchQuery === '' ||
        e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.sourceIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.destinationIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.mitreTechnique.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.ruleTriggered?.name && e.ruleTriggered.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSeverity = severityFilter === 'all' || e.severity === severityFilter;
      const matchesType = typeFilter === 'all' || e.eventType === typeFilter;
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesType && matchesStatus;
    });
  }, [events, searchQuery, severityFilter, typeFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSeverityFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  // Compute live risk breakdown for the selected event
  const currentRiskBreakdown = useMemo(() => {
    if (!selectedEvent) return null;
    const targetAsset = assets.find((a) => selectedEvent.destinationIp.includes(a.name)) || assets[0];
    const confidence = selectedEvent.ruleTriggered?.confidence || 85;
    return calculateRiskScore(selectedEvent.severity, confidence, targetAsset.criticality);
  }, [selectedEvent, assets]);

  // Find related incident if present
  const relatedIncident = useMemo(() => {
    if (!selectedEvent) return null;
    if (selectedEvent.relatedIncidentId) {
      return incidents.find((i) => i.id === selectedEvent.relatedIncidentId);
    }
    return incidents.find((i) => selectedEvent.destinationIp.includes(i.affectedAsset) && i.status !== 'Resolved');
  }, [selectedEvent, incidents]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Demo Mode Indicator & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1626] border border-slate-800 rounded-lg p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Live Threat Monitor & Detection Engine
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              Live Rule Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time synthetic telemetry buffer evaluated by local detection rules. Click any event to inspect rule triggers and risk scoring.
          </p>
        </div>

        {/* Action Controls for Quick Injections */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => simulateEvent()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-mono transition-colors shadow-sm"
            title="Generate a random synthetic event"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Random Event</span>
          </button>
          <button
            onClick={() =>
              simulateEvent({
                eventType: 'SQL Injection',
                details: "Injected SQL tautology payload: ' UNION SELECT schema_name,2 FROM information_schema.schemata--",
                severity: 'high'
              })
            }
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono transition-colors"
            title="Simulate a SQL Injection attempt"
          >
            + SQLi
          </button>
          <button
            onClick={() =>
              simulateEvent({
                eventType: 'Failed Login',
                details: 'Sequential dictionary brute force attempts against SSH root account.',
                severity: 'medium'
              })
            }
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono transition-colors"
            title="Simulate Failed Logins"
          >
            + Failed Login
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search IP, event, rule, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111A2D] border border-slate-700/80 rounded px-3 py-1.5 pl-9 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-[#111A2D] border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">Severity: All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Event Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-[#111A2D] border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">Event Type: All</option>
              <option value="Port Scan">Port Scan</option>
              <option value="Failed Login">Failed Login</option>
              <option value="Suspicious Login">Suspicious Login</option>
              <option value="Privilege Escalation">Privilege Escalation</option>
              <option value="SQL Injection">SQL Injection</option>
              <option value="DDoS Probe">DDoS Probe</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#111A2D] border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">Status: All</option>
              <option value="detected">Detected</option>
              <option value="investigating">Investigating</option>
              <option value="mitigated">Mitigated</option>
              <option value="false_positive">False Positive</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
          <div>
            Showing <span className="text-cyan-400">{filteredEvents.length}</span> of {events.length} simulated events
          </div>
          {(searchQuery || severityFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout: Table + Live Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table View */}
        <div className={`bg-[#0E1626] border border-slate-800 rounded-lg overflow-hidden ${selectedEvent ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111A2D] border-b border-slate-800 text-slate-400 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Rule Matched</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((evt) => {
                    const isSelected = selectedEvent?.id === evt.id;
                    return (
                      <tr
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-slate-200">
                          {evt.id}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                          {evt.timestamp.split(' ')[1] || evt.timestamp}
                        </td>
                        <td className="py-3 px-4 text-slate-200">
                          {evt.eventType}
                        </td>
                        <td className="py-3 px-4">
                          <Badge severity={evt.severity}>{evt.severity}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold ${
                              (evt.riskScore || 0) >= 80
                                ? 'text-red-400'
                                : (evt.riskScore || 0) >= 60
                                ? 'text-amber-400'
                                : 'text-cyan-400'
                            }`}
                          >
                            {evt.riskScore || 65}/100
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 truncate max-w-[130px]">
                          <span className="text-[10px] text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
                            {evt.ruleTriggered?.id || 'RULE-AUTO'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {evt.sourceIp}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(evt);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-xs inline-flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No security events match the current filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Details & Rule Trigger Explanation Panel */}
        {selectedEvent && (
          <div className="bg-[#0E1626] border border-cyan-900/60 rounded-lg p-5 space-y-4 lg:col-span-1 sticky top-20 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Event & Rule Diagnostic
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
                title="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-[11px] text-slate-400">Event ID & Severity:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-white">{selectedEvent.id}</span>
                  <Badge severity={selectedEvent.severity}>{selectedEvent.severity}</Badge>
                  <Badge status={selectedEvent.status}>{selectedEvent.status}</Badge>
                </div>
              </div>

              {/* Dynamic Risk Score Breakdown */}
              {currentRiskBreakdown && (
                <div className="bg-[#111A2D] p-3 rounded-lg border border-cyan-800/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-300 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      Calculated Demo Risk Score:
                    </span>
                    <span className="text-sm font-bold text-cyan-300">
                      {currentRiskBreakdown.totalScore}/100 ({currentRiskBreakdown.level})
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        currentRiskBreakdown.totalScore >= 80
                          ? 'bg-red-500'
                          : currentRiskBreakdown.totalScore >= 60
                          ? 'bg-amber-500'
                          : 'bg-cyan-500'
                      }`}
                      style={{ width: `${currentRiskBreakdown.totalScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1 font-sans">
                    <strong>Formula:</strong> {currentRiskBreakdown.formula}
                  </p>
                </div>
              )}

              {/* Rule Trigger Explanation */}
              {selectedEvent.ruleTriggered && (
                <div className="bg-[#111A2D] p-3 rounded-lg border border-amber-900/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-amber-400" />
                      Rule Triggered:
                    </span>
                    <span className="text-[10px] bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800 text-amber-300 font-bold">
                      {selectedEvent.ruleTriggered.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 font-semibold">
                    {selectedEvent.ruleTriggered.name}
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-0.5">
                    <strong>Why it triggered:</strong> {selectedEvent.ruleTriggered.reason}
                  </p>
                </div>
              )}

              <div>
                <span className="text-[11px] text-slate-400">Network Flow:</span>
                <div className="bg-[#111A2D] p-2 rounded border border-slate-800 mt-1 space-y-1 text-[11px]">
                  <div><span className="text-slate-400">Src:</span> <span className="text-slate-200">{selectedEvent.sourceIp}</span></div>
                  <div><span className="text-slate-400">Dst:</span> <span className="text-slate-200">{selectedEvent.destinationIp}</span></div>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400">MITRE ATT&CK Technique:</span>
                <div className="text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-1 rounded mt-1 text-[11px]">
                  {selectedEvent.mitreTechnique}
                </div>
              </div>

              {selectedEvent.payloadSnippet && (
                <div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    Payload Capture (Simulated):
                  </span>
                  <div className="bg-black/60 p-2.5 rounded border border-slate-800 text-[10px] text-cyan-200 break-all font-mono mt-1 overflow-x-auto">
                    {selectedEvent.payloadSnippet}
                  </div>
                </div>
              )}

              {/* Related Incident Link */}
              {relatedIncident && (
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToIncident && onNavigateToIncident(relatedIncident.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-800/80 text-cyan-300 text-xs font-mono transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Linked Incident: <strong>{relatedIncident.id}</strong></span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
