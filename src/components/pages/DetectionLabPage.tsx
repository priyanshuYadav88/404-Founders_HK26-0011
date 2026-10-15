import React, { useState } from 'react';
import {
  FlaskConical,
  Binary,
  Cpu,
  Terminal,
  Play,
  Info
} from 'lucide-react';
import { DetectionLabItem } from '../../types';
import { MOCK_DETECTION_LAB_ITEMS } from '../../data/mockData';

export const DetectionLabPage: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<'all' | 'known' | 'anomaly'>('all');
  const [selectedItem, setSelectedItem] = useState<DetectionLabItem>(MOCK_DETECTION_LAB_ITEMS[0]);
  const [testOutput, setTestOutput] = useState<{
    running: boolean;
    result: string | null;
    timestamp: string | null;
  }>({ running: false, result: null, timestamp: null });

  const knownAttackItems = MOCK_DETECTION_LAB_ITEMS.filter(
    (item) => item.engineType === 'Known Attack Detection'
  );
  const anomalyDetectionItems = MOCK_DETECTION_LAB_ITEMS.filter(
    (item) => item.engineType === 'Anomaly Detection'
  );

  const handleRunTestVector = (item: DetectionLabItem) => {
    setTestOutput({ running: true, result: null, timestamp: null });
    setTimeout(() => {
      setTestOutput({
        running: false,
        result: `SIMULATION RESULT for [${item.name}]: Rule triggered with ${item.confidenceScore}% confidence. Anomaly vector: ${item.anomalyScore}. Vector classified as malicious pattern.`,
        timestamp: new Date().toTimeString().split(' ')[0] + ' UTC'
      });
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1626] border border-slate-800 rounded-lg p-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Detection Lab & Heuristic Proving Ground
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              Demo Models
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare deterministic signature heuristics with unsupervised anomaly detection models.
          </p>
        </div>

        {/* Engine Filter */}
        <div className="flex items-center gap-1.5 bg-[#111A2D] p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveEngine('all')}
            className={`px-3 py-1 rounded transition-colors ${
              activeEngine === 'all'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Engines (4)
          </button>
          <button
            onClick={() => setActiveEngine('known')}
            className={`px-3 py-1 rounded transition-colors ${
              activeEngine === 'known'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Known Attack (2)
          </button>
          <button
            onClick={() => setActiveEngine('anomaly')}
            className={`px-3 py-1 rounded transition-colors ${
              activeEngine === 'anomaly'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anomaly Detection (2)
          </button>
        </div>
      </div>

      {/* Model Demo Notice */}
      <div className="bg-[#111A2D] border border-cyan-900/40 rounded-lg p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-slate-200">Demonstration Pipeline Notice: </span>
          All confidence and anomaly scores displayed below are illustrative sample outputs. Production model weights and real-time streaming inference will connect via the FastAPI detection backend in Checkpoint 2.
        </div>
      </div>

      {/* Two Main Sections: Section A (Known Attack) & Section B (Anomaly Detection) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section A: Known Attack Detection */}
        {(activeEngine === 'all' || activeEngine === 'known') && (
          <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Binary className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Section A: Known Attack Detection
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Deterministic / AST Rules</span>
            </div>

            <div className="space-y-3">
              {knownAttackItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setTestOutput({ running: false, result: null, timestamp: null });
                  }}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    selectedItem.id === item.id
                      ? 'bg-[#15233D] border-cyan-500 shadow-md shadow-cyan-950'
                      : 'bg-[#111A2D] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                          {item.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-1">
                        {item.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-cyan-400">
                        {item.confidenceScore}% Conf
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Anomaly: {item.anomalyScore}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 font-mono line-clamp-1">
                    {item.detectionMechanism}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section B: Anomaly Detection */}
        {(activeEngine === 'all' || activeEngine === 'anomaly') && (
          <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Section B: Anomaly Detection
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Unsupervised Behavioral ML</span>
            </div>

            <div className="space-y-3">
              {anomalyDetectionItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setTestOutput({ running: false, result: null, timestamp: null });
                  }}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    selectedItem.id === item.id
                      ? 'bg-[#15233D] border-cyan-500 shadow-md shadow-cyan-950'
                      : 'bg-[#111A2D] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-purple-300 border border-slate-800">
                          {item.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-1">
                        {item.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-purple-400">
                        {item.confidenceScore}% Conf
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Anomaly: {item.anomalyScore}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 font-mono line-clamp-1">
                    {item.detectionMechanism}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Model Inspector & Test Vector Harness */}
      {selectedItem && (
        <div className="bg-[#0E1626] border border-cyan-900/60 rounded-lg p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                  {selectedItem.engineType}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {selectedItem.name}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Category: <span className="text-cyan-300">{selectedItem.category}</span> • ID: {selectedItem.id}
              </p>
            </div>

            <button
              onClick={() => handleRunTestVector(selectedItem)}
              disabled={testOutput.running}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 hover:bg-cyan-900 text-xs font-mono transition-colors disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${testOutput.running ? 'animate-spin' : ''}`} />
              <span>{testOutput.running ? 'Evaluating...' : 'Run Simulation Vector'}</span>
            </button>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-[#111A2D] p-3 rounded border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Confidence Score (Demo)</span>
              <div className="text-xl font-bold text-cyan-400">{selectedItem.confidenceScore}%</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${selectedItem.confidenceScore}%` }} />
              </div>
            </div>

            <div className="bg-[#111A2D] p-3 rounded border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Anomaly Deviation Score</span>
              <div className="text-xl font-bold text-purple-400">{selectedItem.anomalyScore} / 1.0</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: `${selectedItem.anomalyScore * 100}%` }} />
              </div>
            </div>

            <div className="bg-[#111A2D] p-3 rounded border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Detection Method</span>
              <div className="text-slate-200 font-semibold text-xs truncate mt-1">
                {selectedItem.detectionMechanism}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {selectedItem.ruleOrModel}
              </div>
            </div>
          </div>

          {/* Test Vector Sample */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Standard Synthetic Test Vector:
            </span>
            <div className="bg-black/60 p-3 rounded border border-slate-800 font-mono text-xs text-cyan-300 break-all">
              {selectedItem.testVector}
            </div>
          </div>

          {/* Execution feedback output */}
          {testOutput.result && (
            <div className="bg-[#0B101A] border border-cyan-800/80 rounded p-3 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-cyan-400">
                <span>SIMULATION OUTPUT • {testOutput.timestamp}</span>
                <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">OK</span>
              </div>
              <p className="text-slate-300 font-sans">{testOutput.result}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
