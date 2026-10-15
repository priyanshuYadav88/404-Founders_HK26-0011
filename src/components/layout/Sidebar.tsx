import React from 'react';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  GitBranch,
  FlaskConical,
  Target,
  Server,
  BookOpenCheck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type PageId =
  | 'overview'
  | 'live-monitor'
  | 'incidents'
  | 'attack-storyline'
  | 'detection-lab'
  | 'mitre-attack'
  | 'asset-inventory'
  | 'response-playbooks'
  | 'detection-quality';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: 'red' | 'cyan' | 'amber';
}

interface SidebarProps {
  activePage: PageId;
  onPageSelect: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeIncidentsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onPageSelect,
  collapsed,
  onToggleCollapse,
  activeIncidentsCount = 1
}) => {
  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'live-monitor',
      label: 'Live Threat Monitor',
      icon: Activity,
      badge: 'Live',
      badgeVariant: 'cyan'
    },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: AlertTriangle,
      badge: `${activeIncidentsCount} P1`,
      badgeVariant: 'red'
    },
    {
      id: 'attack-storyline',
      label: 'Attack Storyline',
      icon: GitBranch
    },
    {
      id: 'detection-lab',
      label: 'Detection Lab',
      icon: FlaskConical
    },
    {
      id: 'mitre-attack',
      label: 'MITRE ATT&CK',
      icon: Target
    },
    {
      id: 'asset-inventory',
      label: 'Asset Inventory',
      icon: Server
    },
    {
      id: 'response-playbooks',
      label: 'Response Playbooks',
      icon: BookOpenCheck
    },
    {
      id: 'detection-quality',
      label: 'Detection Quality',
      icon: ShieldCheck
    }
  ];

  return (
    <aside
      className={`h-[calc(100vh-4rem)] border-r border-slate-800/90 bg-[#0A0E17] flex flex-col justify-between transition-all duration-200 z-20 sticky top-16 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="py-4 px-2 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
          {!collapsed && <span>Navigation</span>}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageSelect(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group text-left ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border uppercase ${
                        item.badgeVariant === 'red'
                          ? 'bg-red-950 text-red-400 border-red-800'
                          : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer controls & collapse toggle */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed && (
          <div className="bg-[#0E1626] rounded-md p-2.5 border border-slate-800 text-[11px] text-slate-400 font-mono mb-2">
            <div className="text-slate-300 font-semibold">Checkpoint 1</div>
            <div>SOC Frontend UI Only</div>
            <div className="text-[10px] text-cyan-400/80 mt-0.5">Mock Telemetry Active</div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 text-xs transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
