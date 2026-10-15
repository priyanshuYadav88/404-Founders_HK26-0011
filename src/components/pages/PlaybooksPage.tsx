import React, { useState } from 'react';
import {
  BookOpenCheck,
  CheckCircle,
  AlertTriangle,
  Play,
  X
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ResponsePlaybook } from '../../types';
import { useDemo } from '../../context/DemoContext';

export const PlaybooksPage: React.FC = () => {
  const { playbooks, updatePlaybookStatus } = useDemo();
  const [selectedPlaybook, setSelectedPlaybook] = useState<ResponsePlaybook | null>(null);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    updatePlaybookStatus(id, 'Approved');
    if (selectedPlaybook && selectedPlaybook.id === id) {
      setSelectedPlaybook({ ...selectedPlaybook, approvalStatus: 'Approved' });
    }
  };

  const handleReject = (id: string) => {
    updatePlaybookStatus(id, 'Rejected');
    if (selectedPlaybook && selectedPlaybook.id === id) {
      setSelectedPlaybook({ ...selectedPlaybook, approvalStatus: 'Rejected' });
    }
  };

  const handleSimulateExecution = (id: string) => {
    updatePlaybookStatus(id, 'Executed (Simulated)');
    if (selectedPlaybook && selectedPlaybook.id === id) {
      setSelectedPlaybook({ ...selectedPlaybook, approvalStatus: 'Executed (Simulated)' });
    }
    setExecutionMessage(
      `SIMULATED EXECUTION CONFIRMED: Playbook [${id}] dispatched to simulation pipeline. Zero real-world destructive changes executed.`
    );
    setTimeout(() => {
      setExecutionMessage(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1626] border border-slate-800 rounded-lg p-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              SOC Defensive Response Playbooks
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              Human-in-the-Loop
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated defensive containment recommendations requiring Tier-1 analyst review and approval.
          </p>
        </div>
      </div>

      {/* Safety Guardrail Notice */}
      <div className="bg-[#111A2D] border border-amber-900/50 rounded-lg p-3.5 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-amber-300">Defensive Safety Sandbox: </span>
          All response actions require mandatory analyst review prior to triggering. In Checkpoint 1, all executions are strictly simulated in the frontend ledger; no remote infrastructure commands or destructive network modifications will be issued.
        </div>
      </div>

      {/* Execution Feedback Notification */}
      {executionMessage && (
        <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-200 p-3 rounded-lg text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{executionMessage}</span>
          </div>
          <button
            onClick={() => setExecutionMessage(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Playbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playbooks.map((pb) => (
          <div
            key={pb.id}
            className="bg-[#0E1626] border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                    {pb.id}
                  </span>
                  <h3 className="text-sm font-semibold text-white mt-1">
                    {pb.name}
                  </h3>
                </div>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${
                    pb.approvalStatus === 'Approved'
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700'
                      : pb.approvalStatus === 'Pending Review'
                      ? 'bg-amber-950/70 text-amber-300 border-amber-700'
                      : pb.approvalStatus === 'Executed (Simulated)'
                      ? 'bg-cyan-950/70 text-cyan-300 border-cyan-700'
                      : 'bg-red-950/70 text-red-300 border-red-700'
                  }`}
                >
                  {pb.approvalStatus}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-mono text-slate-400">Trigger Condition:</span>
                <p className="text-slate-300 font-mono text-[11px] bg-[#111A2D] p-2 rounded border border-slate-800">
                  {pb.triggerCondition}
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-mono text-slate-400">Suggested Action:</span>
                <p className="text-slate-200 font-sans">
                  {pb.suggestedAction}
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-mono text-slate-400">Target & Impact:</span>
                <div className="flex items-center gap-3 text-slate-300 text-[11px] font-mono">
                  <span>Target: <span className="text-cyan-300">{pb.targetAsset}</span></span>
                  <span>Impact: <span className={pb.impactRisk === 'High' ? 'text-red-400 font-bold' : pb.impactRisk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}>{pb.impactRisk}</span></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedPlaybook(pb)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
              >
                Review Step & Details
              </button>

              {pb.approvalStatus === 'Pending Review' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(pb.id)}
                    className="px-2.5 py-1.5 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-mono transition-colors"
                    title="Reject this defensive action"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(pb.id)}
                    className="px-2.5 py-1.5 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-xs font-mono transition-colors"
                    title="Approve this defensive action"
                  >
                    Approve
                  </button>
                </div>
              )}

              {pb.approvalStatus === 'Approved' && (
                <button
                  onClick={() => handleSimulateExecution(pb.id)}
                  className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute (Simulated)</span>
                </button>
              )}

              {pb.approvalStatus === 'Executed (Simulated)' && (
                <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Executed (Simulated)</span>
                </span>
              )}

              {pb.approvalStatus === 'Rejected' && (
                <span className="text-xs font-mono text-red-400 flex items-center gap-1">
                  <X className="w-3.5 h-3.5 text-red-400" />
                  <span>Rejected by SOC</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedPlaybook && (
        <Modal
          isOpen={!!selectedPlaybook}
          onClose={() => setSelectedPlaybook(null)}
          title={`Analyst Review Step: ${selectedPlaybook.name}`}
          subtitle={`Playbook ID: ${selectedPlaybook.id} • Target: ${selectedPlaybook.targetAsset}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="bg-[#111A2D] p-3 rounded border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Defensive Rationale & Operational Reason:</span>
              <p className="text-slate-200 font-sans text-xs mt-1 leading-relaxed">
                {selectedPlaybook.reason}
              </p>
            </div>

            <div className="bg-[#111A2D] p-3 rounded border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Blast Radius & Service Disruption Analysis:</span>
              <p className="text-slate-300 font-sans text-xs mt-1 leading-relaxed">
                {selectedPlaybook.reviewNotes}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0B101A] p-3 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Impact Risk:</span>
                <span className={`text-sm font-bold ${selectedPlaybook.impactRisk === 'High' ? 'text-red-400' : 'text-amber-400'}`}>
                  {selectedPlaybook.impactRisk} Risk
                </span>
              </div>
              <div className="bg-[#0B101A] p-3 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Approval Status:</span>
                <span className="text-sm font-bold text-cyan-300">
                  {selectedPlaybook.approvalStatus}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedPlaybook(null)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                Close Review
              </button>

              <div className="flex items-center gap-2">
                {selectedPlaybook.approvalStatus === 'Pending Review' && (
                  <>
                    <button
                      onClick={() => handleReject(selectedPlaybook.id)}
                      className="px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-mono"
                    >
                      Reject Action
                    </button>
                    <button
                      onClick={() => handleApprove(selectedPlaybook.id)}
                      className="px-3 py-1.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-xs font-mono"
                    >
                      Authorize & Approve
                    </button>
                  </>
                )}
                {selectedPlaybook.approvalStatus === 'Approved' && (
                  <button
                    onClick={() => {
                      handleSimulateExecution(selectedPlaybook.id);
                      setSelectedPlaybook(null);
                    }}
                    className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-mono flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Confirm Simulated Execution</span>
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
