import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  ExternalLink,
  Server,
  Activity,
  FileCheck,
  Layers
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { IncidentStatus } from '../../types';
import { useDemo } from '../../context/DemoContext';

interface IncidentsPageProps {
  onNavigateToStoryline?: () => void;
  onNavigateToPlaybooks?: () => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({
  onNavigateToStoryline,
  onNavigateToPlaybooks
}) => {
  const {
    incidents,
    updateIncidentStatus,
    selectedIncidentId,
    setSelectedIncidentId,
    events
  } = useDemo();

  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected incident object
  const activeModalIncident = useMemo(() => {
    if (!selectedIncidentId) return null;
    return incidents.find((i) => i.id === selectedIncidentId) || null;
  }, [selectedIncidentId, incidents]);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesPriority = priorityFilter === 'all' || inc.severity === priorityFilter;
    const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.affectedAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.mitreTechnique.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPriority && matchesStatus && matchesSearch;
  });

  // Find linked events for the modal
  const correlatedEvents = useMemo(() => {
    if (!activeModalIncident) return [];
    return events.filter(
      (e) =>
        e.relatedIncidentId === activeModalIncident.id ||
        (activeModalIncident.relatedEventIds && activeModalIncident.relatedEventIds.includes(e.id)) ||
        e.destinationIp.includes(activeModalIncident.affectedAsset)
    );
  }, [activeModalIncident, events]);

  return (
    <div className="space-y-6">
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1626] border border-slate-800 rounded-lg p-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Incident Management & Triage
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              {incidents.filter((i) => i.status !== 'Resolved').length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Correlated multi-stage security incidents automatically created and updated by detection rules.
          </p>
        </div>

        {/* Priority Quick Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#111A2D] p-1 rounded-lg border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 px-2">Priority:</span>
          {['all', 'P1', 'P2', 'P3', 'P4'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                priorityFilter === p
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incident ID, title, asset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111A2D] border border-slate-700/80 rounded px-3 py-1.5 pl-9 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111A2D] border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">Status: All</option>
            <option value="Active">Active</option>
            <option value="Investigating">Investigating</option>
            <option value="Contained">Contained</option>
            <option value="Resolved">Resolved</option>
          </select>

          <span className="text-xs font-mono text-slate-400">
            Showing <span className="text-cyan-400">{filteredIncidents.length}</span> incidents
          </span>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-[#0E1626] border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#111A2D] border-b border-slate-800 text-slate-400 text-[11px]">
              <tr>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Title & Attack Chain</th>
                <th className="py-3 px-4">Affected Asset</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Correlated Events</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <Badge priority={inc.severity}>{inc.severity}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200 group-hover:text-cyan-300">
                      {inc.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-medium text-slate-200">
                        {inc.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Stage: <span className="text-cyan-400">{inc.attackChainStep}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{inc.affectedAsset}</div>
                      <div className="text-[11px] text-slate-400">{inc.affectedAssetIp}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              inc.confidence > 90 ? 'bg-cyan-400' : 'bg-amber-400'
                            }`}
                            style={{ width: `${inc.confidence}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-300">{inc.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {inc.eventsCount} telemetry hits
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={inc.status}>{inc.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {inc.timestamp.includes(' ') ? inc.timestamp.split(' ')[1] : inc.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIncidentId(inc.id);
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                      >
                        <span>Triage</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No incidents match the selected priority and status filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {activeModalIncident && (
        <Modal
          isOpen={!!activeModalIncident}
          onClose={() => setSelectedIncidentId(null)}
          title={`Incident Triage: ${activeModalIncident.id}`}
          subtitle={`${activeModalIncident.title} • ${activeModalIncident.timestamp}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {/* Top metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111A2D] p-3 rounded-lg border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-[11px] text-slate-400">Priority</span>
                <div className="mt-1">
                  <Badge priority={activeModalIncident.severity}>{activeModalIncident.severity}</Badge>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Current Status</span>
                <div className="mt-1">
                  <Badge status={activeModalIncident.status}>{activeModalIncident.status}</Badge>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">AI Confidence</span>
                <div className="text-cyan-400 font-bold mt-1">{activeModalIncident.confidence}%</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Assigned Team</span>
                <div className="text-slate-300 mt-1 truncate">{activeModalIncident.assignedAnalyst || 'SecOps Tier-1'}</div>
              </div>
            </div>

            {/* Incident Summary */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                Correlation Summary & Rule Rationale
              </h4>
              <p className="text-xs text-slate-300 bg-[#0B101A] p-3 rounded border border-slate-800 leading-relaxed font-sans">
                {activeModalIncident.summary}
              </p>
            </div>

            {/* Affected Asset & MITRE mapping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#111A2D] p-3 rounded border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  Target Host Details
                </span>
                <div className="text-slate-200 font-bold">{activeModalIncident.affectedAsset}</div>
                <div className="text-slate-400 text-[11px]">IP: {activeModalIncident.affectedAssetIp}</div>
              </div>

              <div className="bg-[#111A2D] p-3 rounded border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  MITRE Technique
                </span>
                <div className="text-amber-300 font-bold">{activeModalIncident.mitreTechnique}</div>
                <div className="text-slate-400 text-[11px]">{activeModalIncident.attackChainStep}</div>
              </div>
            </div>

            {/* Correlated Telemetry Events List */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Correlated Telemetry Events ({correlatedEvents.length})
              </h4>
              <div className="bg-[#0B101A] rounded border border-slate-800 max-h-36 overflow-y-auto divide-y divide-slate-800/80 text-xs font-mono">
                {correlatedEvents.length > 0 ? (
                  correlatedEvents.map((evt) => (
                    <div key={evt.id} className="p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-semibold">{evt.id}</span>
                        <span className="text-slate-200">{evt.eventType}</span>
                        <span className="text-slate-400 text-[11px]">{evt.sourceIp}</span>
                      </div>
                      <Badge severity={evt.severity}>{evt.severity}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-slate-400 text-center">
                    Correlated by host affinity. Initial telemetry baseline.
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Action */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                Recommended SOC Playbook Action
              </h4>
              <div className="bg-cyan-950/40 border border-cyan-800/60 p-3 rounded text-xs text-cyan-200">
                {activeModalIncident.recommendedAction}
              </div>
            </div>

            {/* Status Change Triage Buttons */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Update Status:</span>
                {(['Active', 'Investigating', 'Contained', 'Resolved'] as IncidentStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateIncidentStatus(activeModalIncident.id, status)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-colors ${
                      activeModalIncident.status === status
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-600 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {onNavigateToStoryline && (
                  <button
                    onClick={() => {
                      setSelectedIncidentId(null);
                      onNavigateToStoryline();
                    }}
                    className="px-3 py-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 hover:bg-cyan-900 text-xs font-mono transition-colors"
                  >
                    View Attack Storyline
                  </button>
                )}
                {onNavigateToPlaybooks && (
                  <button
                    onClick={() => {
                      setSelectedIncidentId(null);
                      onNavigateToPlaybooks();
                    }}
                    className="px-3 py-1.5 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-mono transition-colors"
                  >
                    Open Playbooks
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
