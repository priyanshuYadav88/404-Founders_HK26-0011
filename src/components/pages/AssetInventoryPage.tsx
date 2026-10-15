import React, { useState, useMemo } from 'react';
import {
  Server,
  Search,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { useDemo } from '../../context/DemoContext';

interface AssetInventoryPageProps {
  onNavigateToIncident?: (incidentId: string) => void;
}

export const AssetInventoryPage: React.FC<AssetInventoryPageProps> = ({ onNavigateToIncident }) => {
  const { assets, incidents, events, selectedAssetId, setSelectedAssetId } = useDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState<string>('all');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('all');

  const selectedAsset = useMemo(() => {
    if (selectedAssetId) {
      return assets.find((a) => a.id === selectedAssetId) || assets[0];
    }
    return assets[0];
  }, [selectedAssetId, assets]);

  // Associated incidents for selected asset
  const assetIncidents = useMemo(() => {
    if (!selectedAsset) return [];
    return incidents.filter((i) => i.affectedAsset === selectedAsset.name);
  }, [selectedAsset, incidents]);

  // Associated events for selected asset
  const assetEvents = useMemo(() => {
    if (!selectedAsset) return [];
    return events.filter(
      (e) =>
        e.destinationIp.includes(selectedAsset.name) ||
        e.destinationIp.includes(selectedAsset.ipAddress)
    );
  }, [selectedAsset, events]);

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      searchQuery === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnv = envFilter === 'all' || a.environment === envFilter;
    const matchesCrit = criticalityFilter === 'all' || a.criticality === criticalityFilter;
    return matchesSearch && matchesEnv && matchesCrit;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0E1626] border border-slate-800 rounded-lg p-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Defended Asset Inventory & Posture
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              {assets.length} Hosts Monitored
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Infrastructure telemetry topology spanning Production, Staging, and Development enclaves. Click any host to inspect associated incidents and events.
          </p>
        </div>

        {/* Environment Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#111A2D] p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <span className="text-[11px] text-slate-400 px-2">Env:</span>
          {['all', 'Production', 'Staging', 'Development'].map((env) => (
            <button
              key={env}
              onClick={() => setEnvFilter(env)}
              className={`px-2.5 py-1 rounded transition-colors ${
                envFilter === env
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {env === 'all' ? 'ALL' : env}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="bg-[#0E1626] border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search hostname, IP, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111A2D] border border-slate-700/80 rounded px-3 py-1.5 pl-9 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
            className="bg-[#111A2D] border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">Criticality: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <span className="text-xs font-mono text-slate-400">
            Displaying <span className="text-cyan-400">{filteredAssets.length}</span> assets
          </span>
        </div>
      </div>

      {/* Main Asset Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table View */}
        <div className="bg-[#0E1626] border border-slate-800 rounded-lg overflow-hidden lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#111A2D] border-b border-slate-800 text-slate-400 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Asset Name</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Environment</th>
                  <th className="py-3 px-4">Criticality</th>
                  <th className="py-3 px-4">Risk Exposure</th>
                  <th className="py-3 px-4">Active Incidents</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAssets.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  const matchingActiveIncCount = incidents.filter(
                    (i) => i.affectedAsset === asset.name && i.status !== 'Resolved'
                  ).length;

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200">{asset.name}</div>
                        <div className="text-[11px] text-slate-400">{asset.type}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {asset.ipAddress}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            asset.environment === 'Production'
                              ? 'bg-red-950/40 text-red-300 border-red-800/50'
                              : asset.environment === 'Staging'
                              ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                              : 'bg-blue-950/40 text-blue-300 border-blue-800/50'
                          }`}
                        >
                          {asset.environment}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-semibold ${
                            asset.criticality === 'Critical'
                              ? 'text-red-400'
                              : asset.criticality === 'High'
                              ? 'text-orange-400'
                              : asset.criticality === 'Medium'
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {asset.criticality}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                asset.riskScore > 80
                                  ? 'bg-red-500'
                                  : asset.riskScore > 50
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${asset.riskScore}%` }}
                            />
                          </div>
                          <span className="text-slate-200">{asset.riskScore}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {matchingActiveIncCount > 0 ? (
                          <span className="text-red-400 font-bold">{matchingActiveIncCount} active</span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAssetId(asset.id);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 text-xs inline-flex items-center gap-1"
                        >
                          <span>Posture</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Asset Posture Card with Associated Incidents & Events */}
        {selectedAsset && (
          <div className="bg-[#0E1626] border border-cyan-900/60 rounded-lg p-5 space-y-4 lg:col-span-1 sticky top-20 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono font-bold text-white">
                  {selectedAsset.name}
                </h3>
                <span className="text-xs font-mono text-cyan-400">{selectedAsset.ipAddress}</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  selectedAsset.environment === 'Production'
                    ? 'bg-red-950 text-red-300 border-red-800'
                    : 'bg-blue-950 text-blue-300 border-blue-800'
                }`}
              >
                {selectedAsset.environment}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-[11px] text-slate-400">Risk Exposure Index:</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-bold text-red-400">{selectedAsset.riskScore} / 100</span>
                  <span className="text-xs text-slate-400">{selectedAsset.criticality} Criticality</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${selectedAsset.riskScore}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#111A2D] p-3 rounded border border-slate-800 space-y-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Host Operating System & Kernel:</span>
                  <span className="text-slate-200">{selectedAsset.os}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Role & Service Enclave:</span>
                  <span className="text-slate-200">{selectedAsset.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Last Vulnerability Telemetry:</span>
                  <span className="text-slate-400">{selectedAsset.lastScanned}</span>
                </div>
              </div>

              {/* Associated Incidents */}
              <div>
                <span className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Associated Incidents ({assetIncidents.length}):</span>
                </span>
                <div className="mt-1 space-y-1.5 max-h-32 overflow-y-auto">
                  {assetIncidents.length > 0 ? (
                    assetIncidents.map((inc) => (
                      <div
                        key={inc.id}
                        className="bg-[#111A2D] p-2 rounded border border-slate-800 flex items-center justify-between text-[11px]"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Badge priority={inc.severity}>{inc.severity}</Badge>
                            <span className="text-cyan-400 font-semibold">{inc.id}</span>
                          </div>
                          <div className="text-slate-300 truncate max-w-[170px]">{inc.title}</div>
                        </div>
                        {onNavigateToIncident && (
                          <button
                            onClick={() => onNavigateToIncident(inc.id)}
                            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                            title="Open Incident"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#111A2D] p-2.5 rounded border border-slate-800 text-slate-400 text-center">
                      No active incidents linked to this host.
                    </div>
                  )}
                </div>
              </div>

              {/* Associated Telemetry Events */}
              <div>
                <span className="text-[11px] text-slate-400">
                  Associated Telemetry Events ({assetEvents.length}):
                </span>
                <div className="mt-1 space-y-1 max-h-28 overflow-y-auto">
                  {assetEvents.length > 0 ? (
                    assetEvents.slice(0, 4).map((evt) => (
                      <div
                        key={evt.id}
                        className="bg-[#0B101A] p-2 rounded border border-slate-800 flex items-center justify-between text-[10px]"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-cyan-400">{evt.id}</span>
                          <span className="text-slate-300">{evt.eventType}</span>
                        </div>
                        <Badge severity={evt.severity}>{evt.severity}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#0B101A] p-2 rounded border border-slate-800 text-slate-400 text-center text-[11px]">
                      No recent events recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
