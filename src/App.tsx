import React, { useState, useEffect } from 'react';
import { useTournament } from './context/TournamentContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';

// Auth View
import { LoginPage } from './components/auth/LoginPage';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { PlayersPage } from './pages/PlayersPage';
import { TeamsPage } from './pages/TeamsPage';
import { TournamentControlPage } from './pages/TournamentControlPage';
import { StatsMethodologyPage } from './pages/StatsMethodologyPage';
import { SystemManualsPage } from './pages/SystemManualsPage';
import { AuctionManagerPage } from './pages/AuctionManagerPage';
import { PrintReportsPage } from './pages/PrintReportsPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { StaffAdminsPage } from './pages/StaffAdminsPage';
import { SettingsPage } from './pages/SettingsPage';

// Standalone Views
import { LiveScorerConsole } from './components/scorer/LiveScorerConsole';
import { PublicWebsiteView } from './components/public/PublicWebsiteView';
import { OBSOverlayView } from './components/obs/OBSOverlayView';

export function AppContent() {
  const { 
    isAuthenticated,
    activeTab, 
    viewMode, 
    setViewMode, 
    setActiveScorerMatchId, 
    setActiveObsMatchId 
  } = useTournament();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check URL query params on initial mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const matchId = params.get('matchId');

    if (mode === 'scorer') {
      if (matchId) setActiveScorerMatchId(matchId);
      setViewMode('scorer');
    } else if (mode === 'obs') {
      if (matchId) setActiveObsMatchId(matchId);
      setViewMode('obs');
    } else if (mode === 'public') {
      setViewMode('public');
    }
  }, [setActiveScorerMatchId, setActiveObsMatchId, setViewMode]);

  // If not authenticated and not in public/obs mode, display LoginPage
  if (!isAuthenticated && viewMode !== 'public' && viewMode !== 'obs') {
    return (
      <>
        <ToastContainer />
        <LoginPage />
      </>
    );
  }

  // Handle Fullscreen Dedicated Views
  if (viewMode === 'scorer') {
    return (
      <>
        <ToastContainer />
        <LiveScorerConsole />
      </>
    );
  }

  if (viewMode === 'public') {
    return (
      <>
        <ToastContainer />
        <PublicWebsiteView />
      </>
    );
  }

  if (viewMode === 'obs') {
    return (
      <>
        <ToastContainer />
        <OBSOverlayView />
      </>
    );
  }

  // Render Admin Portal with Fixed Sidebar and Dynamic Page Content
  const renderActivePage = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return <OverviewPage />;
      case 'PLAYERS':
        return <PlayersPage />;
      case 'TEAMS':
        return <TeamsPage />;
      case 'TOURNAMENT CONTROL':
        return <TournamentControlPage />;
      case 'STATS METHODOLOGY':
        return <StatsMethodologyPage />;
      case 'SYSTEM MANUALS':
        return <SystemManualsPage />;
      case 'AUCTION MANAGER':
        return <AuctionManagerPage />;
      case 'PRINT REPORTS':
        return <PrintReportsPage />;
      case 'CHANGELOG':
        return <ChangelogPage />;
      case 'STAFF & ADMINS':
        return <StaffAdminsPage />;
      case 'SETTINGS':
        return <SettingsPage />;
      default:
        return <TournamentControlPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col font-sans">
      <ToastContainer />

      {/* Fixed Sidebar */}
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="lg:pl-[290px] flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        {/* Page Content Viewport */}
        <main className="flex-1 p-5 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
