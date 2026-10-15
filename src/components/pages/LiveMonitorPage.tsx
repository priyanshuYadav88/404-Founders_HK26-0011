import React, { useState, useMemo } from 'react';
import {
  Search,
  Terminal,
  Shield,
  ArrowRight,
  X,
  Play,
  RotateCcw
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { SecurityEvent } from '../../types';
import { MOCK_SECURITY_EVENTS } from '../../data/mockData';

interface LiveMonitorPageProps {
  selectedEvent: SecurityEvent | null;
  onSelectEvent: (event: SecurityEvent | null) => void;
}

export const LiveMonitorPage: React.FC<LiveMonitorPageProps> = ({
  selectedEvent,
  onSelectEvent
}) => {
  const [events, setEvents] = useState<SecurityEvent[]>(MOCK_SECURITY_EVENTS);
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
        e.mitreTechnique.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = severityFilter === 'all' || e.severity === severityFilter;
      const matchesType = typeFilter === 'all' || e.eventType === typeFilter;
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesType && matchesStatus;
    });
  }, [events, searchQuery, severityFilter, typeFilter, statusFilter]);

  const handleSimulateNewEvent = () => {
    const randomTypes: SecurityEvent['eventType'][] = [
      'Failed Login',
      'Port Scan',
      'SQL Injection',
      'DDoS Probe',
      'Suspicious Login'
    ];
    const pickedType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
    const newId = `EVT-${Math.floor(8950 + Math.random() * 50)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const newSimulatedEvent: SecurityEvent = {
      id: newId,
      timestamp: now,
      eventType: pickedType,
      sourceIp: `198.51.100.${Math.floor(Math.random() * 200 + 10)}`,
      destinationIp: '10.0.1.15 (auth-prod-srv01)',
      severity: pickedType === 'Suspicious Login' ? 'high' : 'medium',
      status: 'detected',
      details: `Simulated ${pickedType} stream packet triggered by SOC synthetic agent tester.`,
      mitreTechnique: pickedType === 'Failed Login' ? 'T1110.001 - Password Guessing' : 'T1046 - Service Discovery',
      payloadSnippet: `SIMULATED_PROBE seq=${Math.floor(Math.random() * 10000)} protocol=TCP flag=SYN`
    };

    setEvents((prev) => [newSimulatedEvent, ...prev]);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSeverityFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Demo Mode Indicator */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1626] border border-slate-800 rounded-lg p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Live Threat Monitor
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              Demo Mode Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time synthetic telemetry buffer. Filter events by severity, attack category, or status.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateNewEvent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-mono transition-colors shadow-sm"
            title="Inject a simulated attack event into the stream"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Stream Event</span>
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
              placeholder="Search IP, event, details..."
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

      {/* Main Content Layout: Table + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table View (Takes 2 cols if item selected, else full 3 cols) */}
        <div className={`bg-[#0E1626] border border-slate-800 rounded-lg overflow-hidden ${selectedEvent ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111A2D] border-b border-slate-800 text-slate-400 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4">Target</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((evt) => {
                    const isSelected = selectedEvent?.id === evt.id;
                    return (
                      <tr
                        key={evt.id}
                        onClick={() => onSelectEvent(evt)}
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
                          {evt.timestamp}
                        </td>
                        <td className="py-3 px-4 text-slate-200">
                          {evt.eventType}
                        </td>
                        <td className="py-3 px-4">
                          <Badge severity={evt.severity}>{evt.severity}</Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {evt.sourceIp}
                        </td>
                        <td className="py-3 px-4 text-slate-400 truncate max-w-[140px]">
                          {evt.destinationIp}
                        </td>
                        <td className="py-3 px-4">
                          <Badge status={evt.status}>{evt.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEvent(evt);
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

        {/* Event Details Panel */}
        {selectedEvent && (
          <div className="bg-[#0E1626] border border-cyan-900/60 rounded-lg p-5 space-y-4 lg:col-span-1 sticky top-20 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Event Inspection
                </h3>
              </div>
              <button
                onClick={() => onSelectEvent(null)}
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

              <div>
                <span className="text-[11px] text-slate-400">Timestamp:</span>
                <div className="text-slate-200 mt-0.5">{selectedEvent.timestamp}</div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400">Attack Classification:</span>
                <div className="text-cyan-300 font-semibold mt-0.5">{selectedEvent.eventType}</div>
              </div>

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

              <div>
                <span className="text-[11px] text-slate-400">Heuristic Observation:</span>
                <p className="text-slate-300 text-xs mt-1 font-sans leading-relaxed">
                  {selectedEvent.details}
                </p>
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
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Verification Status:</span>
              <span className="text-cyan-400">Simulated Telemetry</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
