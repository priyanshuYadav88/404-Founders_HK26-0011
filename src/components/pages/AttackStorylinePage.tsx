import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  ArrowRight,
  ShieldAlert,
  Info,
  Play,
  Layers
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { StorylineNode, SecurityEvent } from '../../types';
import { MOCK_STORYLINE_NODES } from '../../data/mockData';
import { useDemo } from '../../context/DemoContext';

export const AttackStorylinePage: React.FC = () => {
  const { events, simulateEvent } = useDemo();
  const [nodes] = useState<StorylineNode[]>(MOCK_STORYLINE_NODES);
  const [selectedNode, setSelectedNode] = useState<StorylineNode>(nodes[3]);
  const [activeView, setActiveView] = useState<'timeline' | 'graph'>('timeline');

  // Match live simulated events to each storyline stage
  const matchedEventsByStage = useMemo(() => {
    return {
      'node-1': events.filter((e) => e.eventType === 'Port Scan'),
      'node-2': events.filter((e) => e.eventType === 'Failed Login'),
      'node-3': events.filter((e) => e.eventType === 'Suspicious Login'),
      'node-4': events.filter((e) => e.eventType === 'Privilege Escalation')
    };
  }, [events]);

  const activeStageEvents = matchedEventsByStage[selectedNode.id as keyof typeof matchedEventsByStage] || [];

  const handleSimulateStageEvent = (node: StorylineNode) => {
    const stageEventMap: Record<string, Partial<SecurityEvent>> = {
      'node-1': {
        eventType: 'Port Scan',
        details: 'Simulated SYN sweep across target host 10.0.1.15 listening ports.',
        severity: 'low'
      },
      'node-2': {
        eventType: 'Failed Login',
        details: 'Sequential SSH credential brute force targeting svc_backup.',
        severity: 'medium'
      },
      'node-3': {
        eventType: 'Suspicious Login',
        details: 'Anomalous SSH interactive key login established for svc_backup.',
        severity: 'high'
      },
      'node-4': {
        eventType: 'Privilege Escalation',
        details: 'Unauthorized modification to sudoers configuration granting NOPASSWD root privilege.',
        severity: 'critical'
      }
    };

    simulateEvent(stageEventMap[node.id]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1626] border border-slate-800 rounded-lg p-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Attack Storyline Reconstruction
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
              Simulated Sequence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Correlated multi-stage attack lifecycle linking live synthetic events across the cyber kill chain.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-[#111A2D] p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1 rounded transition-colors ${
              activeView === 'timeline'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sequence Flow
          </button>
          <button
            onClick={() => setActiveView('graph')}
            className={`px-3 py-1 rounded transition-colors ${
              activeView === 'graph'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Evidence Ledger
          </button>
        </div>
      </div>

      {/* Non-factual Inference Disclaimer Alert */}
      <div className="bg-[#111A2D] border border-cyan-900/50 rounded-lg p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-slate-200">
            Analytic Notice: Inferred Telemetry Association (Simulation Model)
          </div>
          <p className="text-slate-400 leading-relaxed">
            The transitions below (Port Scan &rarr; Failed Login &rarr; Suspicious Login &rarr; Privilege Change) represent a <strong className="text-slate-300">probabilistic correlation hypothesis</strong> based on common source addresses and target assets. They do not constitute forensically confirmed facts until signed cryptographic verification is finalized.
          </p>
        </div>
      </div>

      {/* Visual Attack Sequence (The 4 Stages) */}
      <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Attack Progression Chain
            </span>
            <span className="text-[11px] font-mono text-cyan-400">4 Stages Correlated</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Click a node to inspect forensic evidence</span>
        </div>

        {/* 4 Interactive Nodes with Connecting Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {nodes.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            const isLast = index === nodes.length - 1;
            const liveMatches = matchedEventsByStage[node.id as keyof typeof matchedEventsByStage]?.length || 0;

            return (
              <div key={node.id} className="relative flex flex-col">
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between h-full group ${
                    isSelected
                      ? 'bg-[#15233D] border-cyan-400 shadow-md shadow-cyan-950'
                      : 'bg-[#111A2D] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Node Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                            isSelected
                              ? 'bg-cyan-500 text-black'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {node.stepNumber}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {node.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        {node.techniqueId}
                      </span>
                    </div>

                    {/* Node Title */}
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {node.title}
                    </h3>

                    {/* Live Matched Count Badge */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      <span>{liveMatches} Live Telemetry Matches</span>
                    </div>

                    {/* Brief Evidence */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {node.evidenceSummary}
                    </p>
                  </div>

                  {/* Node Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Relationship:</span>
                    <span className="text-cyan-400 font-semibold">Inferred Link</span>
                  </div>
                </div>

                {/* Connecting Arrow for Desktop (between nodes) */}
                {!isLast && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center rounded-full bg-[#0B0F17] border border-cyan-800 text-cyan-400 shadow">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Deep-Dive Inspection Panel */}
      <div className="bg-[#0E1626] border border-cyan-900/60 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                Stage {selectedNode.stepNumber} of 4
              </span>
              <h3 className="text-base font-bold text-white tracking-wide">
                {selectedNode.title}
              </h3>
              <Badge status="Simulated">Simulated Evidence</Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Observed timestamp: {selectedNode.timestamp} • Category: {selectedNode.category}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSimulateStageEvent(selectedNode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-mono transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Inject Stage Event</span>
            </button>
            <div className="bg-[#111A2D] px-3 py-1.5 rounded border border-slate-800 text-xs font-mono text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>MITRE: {selectedNode.techniqueId} ({selectedNode.techniqueName})</span>
            </div>
          </div>
        </div>

        {/* Source and Destination Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-[#111A2D] p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Source Entity (Attacker):</span>
            <div className="text-slate-200 font-bold">{selectedNode.source}</div>
          </div>
          <div className="bg-[#111A2D] p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Target Entity (Defended Host):</span>
            <div className="text-slate-200 font-bold">{selectedNode.target}</div>
          </div>
        </div>

        {/* Evidence Analysis */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Forensic Evidence Summary & Correlation Rationale
          </h4>
          <div className="bg-[#111A2D] p-4 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
            {selectedNode.evidenceSummary}
          </div>
        </div>

        {/* Extracted Indicators */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Extracted Telemetry Indicators
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedNode.indicators.map((ind, i) => (
              <span
                key={i}
                className="bg-[#111A2D] border border-cyan-800/60 text-cyan-300 px-2.5 py-1 rounded text-xs font-mono"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>

        {/* Live Matching Telemetry in Buffer */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Live Events Ingestion Matching Stage ({activeStageEvents.length})</span>
            <span className="text-[11px] text-cyan-400 lowercase font-normal">automatically filtered from demo state</span>
          </h4>
          <div className="bg-[#0B101A] rounded border border-slate-800 max-h-40 overflow-y-auto divide-y divide-slate-800 text-xs font-mono">
            {activeStageEvents.length > 0 ? (
              activeStageEvents.map((e) => (
                <div key={e.id} className="p-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">{e.id}</span>
                      <span className="text-slate-300">{e.details}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Src: {e.sourceIp} &rarr; Dst: {e.destinationIp}
                    </div>
                  </div>
                  <Badge severity={e.severity}>{e.severity}</Badge>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400">
                No events in current buffer match this stage. Click "Inject Stage Event" above to simulate one!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
