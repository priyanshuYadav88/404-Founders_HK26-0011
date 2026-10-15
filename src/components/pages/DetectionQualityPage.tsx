import React from 'react';
import {
  ShieldCheck,
  Zap,
  Target,
  Percent,
  Clock,
  Info
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { MOCK_DETECTION_QUALITY_METRICS } from '../../data/mockData';

export const DetectionQualityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1626] border border-slate-800 rounded-lg p-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Detection Quality & Pipeline Observability
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              Benchmark v0.4
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical quality telemetry measuring classifier sensitivity, specificity, and inference turnaround.
          </p>
        </div>
      </div>

      {/* Illustrative Benchmark Disclaimer */}
      <div className="bg-[#111A2D] border border-cyan-900/50 rounded-lg p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-slate-200">Illustrative Benchmark Dataset: </span>
          The precision, recall, false-positive rate, and latency figures below represent offline synthetic validation runs. Live continuous evaluation telemetry will populate automatically once the detection streaming backend is connected in Checkpoint 2.
        </div>
      </div>

      {/* 4 Primary Quality Metrics Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Precision (PPV)"
          value="94.2%"
          subtitle="SOC Target: > 90.0%"
          badge="+1.4%"
          badgeVariant="green"
          icon={Target}
          trend="Synthetic Eval"
          trendPositive={true}
        />
        <MetricCard
          title="Recall (Sensitivity)"
          value="91.8%"
          subtitle="SOC Target: > 88.0%"
          badge="+2.1%"
          badgeVariant="green"
          icon={Zap}
          trend="Full Matrix Pass"
          trendPositive={true}
        />
        <MetricCard
          title="False-Positive Rate"
          value="2.1%"
          subtitle="SOC Target: < 5.0%"
          badge="-0.8%"
          badgeVariant="green"
          icon={Percent}
          trend="Noise Filter Active"
          trendPositive={true}
        />
        <MetricCard
          title="Detection Latency"
          value="142 ms"
          subtitle="p95 Pipeline Budget: 300 ms"
          badge="Nominal"
          badgeVariant="cyan"
          icon={Clock}
          trend="Median: 78 ms"
          trendPositive={true}
        />
      </div>

      {/* Analytical Breakdown: Confusion Matrix & Detailed Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Synthetic Confusion Matrix */}
        <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
                Evaluation Confusion Matrix
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">N = 2,500 tests</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#111A2D] p-3 rounded border border-emerald-900/60 space-y-1">
                <span className="text-[10px] text-slate-400">True Positives (TP)</span>
                <div className="text-lg font-bold text-emerald-400">1,148</div>
                <div className="text-[10px] text-slate-400">Attacks correctly flagged</div>
              </div>

              <div className="bg-[#111A2D] p-3 rounded border border-amber-900/60 space-y-1">
                <span className="text-[10px] text-slate-400">False Positives (FP)</span>
                <div className="text-lg font-bold text-amber-400">26</div>
                <div className="text-[10px] text-slate-400">Benign flagged as threat</div>
              </div>

              <div className="bg-[#111A2D] p-3 rounded border border-red-900/60 space-y-1">
                <span className="text-[10px] text-slate-400">False Negatives (FN)</span>
                <div className="text-lg font-bold text-red-400">102</div>
                <div className="text-[10px] text-slate-400">Attacks undetected</div>
              </div>

              <div className="bg-[#111A2D] p-3 rounded border border-cyan-900/60 space-y-1">
                <span className="text-[10px] text-slate-400">True Negatives (TN)</span>
                <div className="text-lg font-bold text-cyan-400">1,224</div>
                <div className="text-[10px] text-slate-400">Benign verified clear</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Overall Accuracy:</span>
            <span className="text-cyan-400 font-bold">94.88%</span>
          </div>
        </div>

        {/* Detailed Metrics Descriptions */}
        <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
              Quality Metric Specifications & Verification
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Offline Benchmark Run #24</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_DETECTION_QUALITY_METRICS.map((m, idx) => (
              <div key={idx} className="bg-[#111A2D] p-3.5 rounded border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200">{m.metric}</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">{m.value}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {m.benchmark} • <span className="text-emerald-400">{m.subValue}</span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1">
                  {m.description}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Benchmark Suite: SecOps-Synth-v1</span>
            <span className="text-cyan-400">Continuous Evaluation Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
