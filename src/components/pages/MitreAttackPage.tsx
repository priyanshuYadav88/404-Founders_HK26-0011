import React, { useState, useMemo } from 'react';
import {
  Target,
  Search,
  ExternalLink,
  Info
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { MitreTechnique } from '../../types';
import { MOCK_MITRE_TECHNIQUES } from '../../data/mockData';
import { useDemo } from '../../context/DemoContext';

export const MitreAttackPage: React.FC = () => {
  const { events } = useDemo();
  const [techniques] = useState<MitreTechnique[]>(MOCK_MITRE_TECHNIQUES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState<MitreTechnique | null>(null);

  // Dynamically calculate detection count from current events buffer
  const techniqueDetections = useMemo(() => {
    const counts: Record<string, number> = {};
    techniques.forEach((t) => {
      const liveMatches = events.filter(
        (e) => e.mitreTechnique && e.mitreTechnique.includes(t.techniqueId)
      ).length;
      counts[t.techniqueId] = t.detectionCount + liveMatches;
    });
    return counts;
  }, [events, techniques]);

  const filteredTechniques = techniques.filter(
    (t) =>
      searchQuery === '' ||
      t.techniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tactic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1626] border border-slate-800 rounded-lg p-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              MITRE ATT&CK® Enterprise Matrix Mapping
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              v14.1 Alignment
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tactics, Techniques, and Procedures (TTPs) mapped against observed telemetry heuristics.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search technique ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111A2D] border border-slate-700/80 rounded px-3 py-1.5 pl-9 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Suggested / Illustrative Mapping Notice */}
      <div className="bg-[#111A2D] border border-cyan-900/50 rounded-lg p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-slate-200">Mapping Classification: </span>
          All MITRE ATT&CK technique associations are marked as{' '}
          <span className="font-mono text-cyan-300 bg-cyan-950 px-1 py-0.5 rounded border border-cyan-800">
            Suggested
          </span>{' '}
          or{' '}
          <span className="font-mono text-cyan-300 bg-cyan-950 px-1 py-0.5 rounded border border-cyan-800">
            Illustrative
          </span>{' '}
          to signify that heuristics suggest these tactical alignments, but full evidence chains are subject to analyst validation.
        </div>
      </div>

      {/* Techniques Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechniques.map((item) => {
          const liveCount = techniqueDetections[item.techniqueId] ?? item.detectionCount;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedTechnique(item)}
              className="bg-[#0E1626] border border-slate-800 rounded-lg p-5 flex flex-col justify-between hover:border-cyan-800/80 cursor-pointer transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold font-mono text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    {item.techniqueId}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111A2D] text-slate-300 border border-slate-700">
                    {item.mappingType} Mapping
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {item.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                    Tactic: {item.tactic}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Telemetry hits: <span className="text-cyan-300 font-bold">{liveCount}</span>
                </span>
                <span className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Technique Detail Modal */}
      {selectedTechnique && (
        <Modal
          isOpen={!!selectedTechnique}
          onClose={() => setSelectedTechnique(null)}
          title={`Technique: ${selectedTechnique.techniqueId} — ${selectedTechnique.name}`}
          subtitle={`MITRE ATT&CK Tactic: ${selectedTechnique.tactic} • Status: ${selectedTechnique.mappingType}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3 bg-[#111A2D] p-3 rounded border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400">Technique Identifier</span>
                <div className="text-cyan-400 font-bold text-sm mt-0.5">{selectedTechnique.techniqueId}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Classification Level</span>
                <div className="text-slate-200 font-bold text-sm mt-0.5">{selectedTechnique.mappingType} Mapping</div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Adversary Technique Description
              </h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-[#0B101A] p-3 rounded border border-slate-800">
                {selectedTechnique.description}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Detection Guidance & Engineering Notes
              </h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-[#0B101A] p-3 rounded border border-slate-800">
                {selectedTechnique.detectionGuidance}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Correlated Telemetry Heuristics
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTechnique.associatedAlerts.map((alert, i) => (
                  <span
                    key={i}
                    className="bg-cyan-950/60 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded text-xs"
                  >
                    {alert}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTechnique(null)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
