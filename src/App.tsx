import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { DemoBanner } from './components/common/DemoBanner';
import { OverviewPage } from './components/pages/OverviewPage';
import { LiveMonitorPage } from './components/pages/LiveMonitorPage';
import { IncidentsPage } from './components/pages/IncidentsPage';
import { AttackStorylinePage } from './components/pages/AttackStorylinePage';
import { DetectionLabPage } from './components/pages/DetectionLabPage';
import { MitreAttackPage } from './components/pages/MitreAttackPage';
import { AssetInventoryPage } from './components/pages/AssetInventoryPage';
import { PlaybooksPage } from './components/pages/PlaybooksPage';
import { DetectionQualityPage } from './components/pages/DetectionQualityPage';
import { SecurityEvent, Incident } from './types';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSelectEventFromAnywhere = (evt: SecurityEvent) => {
    setSelectedEvent(evt);
    setActivePage('live-monitor');
  };

  const handleSelectIncidentFromAnywhere = (_inc: Incident) => {
    setActivePage('incidents');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200 flex flex-col font-sans">
      {/* Top Demo Banner */}
      <DemoBanner />

      {/* Main SOC Header */}
      <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* Content Body with Persistent Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Persistent Sidebar */}
        <Sidebar
          activePage={activePage}
          onPageSelect={(page) => setActivePage(page)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeIncidentsCount={1}
        />

        {/* Dynamic Page Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#0B0F17] text-slate-200">
          <div className="max-w-7xl mx-auto space-y-6">
            {activePage === 'overview' && (
              <OverviewPage
                onNavigateToIncidents={() => setActivePage('incidents')}
                onNavigateToLiveMonitor={() => setActivePage('live-monitor')}
                onSelectEvent={handleSelectEventFromAnywhere}
                onSelectIncident={handleSelectIncidentFromAnywhere}
              />
            )}

            {activePage === 'live-monitor' && (
              <LiveMonitorPage
                selectedEvent={selectedEvent}
                onSelectEvent={(evt) => setSelectedEvent(evt)}
              />
            )}

            {activePage === 'incidents' && (
              <IncidentsPage
                onNavigateToStoryline={() => setActivePage('attack-storyline')}
                onNavigateToPlaybooks={() => setActivePage('response-playbooks')}
              />
            )}

            {activePage === 'attack-storyline' && <AttackStorylinePage />}

            {activePage === 'detection-lab' && <DetectionLabPage />}

            {activePage === 'mitre-attack' && <MitreAttackPage />}

            {activePage === 'asset-inventory' && <AssetInventoryPage />}

            {activePage === 'response-playbooks' && <PlaybooksPage />}

            {activePage === 'detection-quality' && <DetectionQualityPage />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
