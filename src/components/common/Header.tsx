import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { 
  User, 
  ExternalLink, 
  Radio, 
  Menu 
} from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const { activeTab, matches, setViewMode, setActiveScorerMatchId, currentUser } = useTournament();

  const getPageTitle = (tab: string) => {
    if (tab === 'TOURNAMENT CONTROL') return 'TOURNAMENT';
    return tab;
  };

  const getPageSubtitle = (tab: string) => {
    switch (tab) {
      case 'TOURNAMENT CONTROL':
        return 'MIELLA SUPER LEAGUE (MSL) Premier League Tournament Management System';
      case 'OVERVIEW':
        return 'Real-time tournament metrics, standings, and performance analytics';
      case 'PLAYERS':
        return 'Registered tournament players, statistics, auction values, and profiles';
      case 'TEAMS':
        return 'Franchise squads, team owners, total purse, and captaincy';
      case 'AUCTION MANAGER':
        return 'IPL-style live player bidding auctioneer console';
      case 'STATS METHODOLOGY':
        return 'Official rules, Net Run Rate (NRR) formulas, and qualification criteria';
      case 'SYSTEM MANUALS':
        return 'Operator manuals, scorer guides, and administrative walkthroughs';
      case 'PRINT REPORTS':
        return 'Official tournament rosters, print-ready fixtures, and audit documents';
      case 'CHANGELOG':
        return 'System release notes and engine upgrades for MSL 2026';
      case 'STAFF & ADMINS':
        return 'Access control, administrative roles, and official operators';
      case 'SETTINGS':
        return 'Global tournament rules, match parameters, and data backups';
      default:
        return 'MIELLA SUPER LEAGUE (MSL) Tournament Management System';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200/90 px-6 sm:px-8 py-5 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Subtitle + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 uppercase font-sans">
              {getPageTitle(activeTab)}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              {getPageSubtitle(activeTab)}
            </p>
          </div>
        </div>

        {/* Right: Status Pill & Administrator Profile */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Quick Launch Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => {
                const targetMatch = matches.find((m) => m.status === 'LIVE') || matches[0];
                setActiveScorerMatchId(targetMatch?.id || null);
                setViewMode('scorer');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
              title="Launch Live Scorer Terminal"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Scorer Mode</span>
            </button>
            <button
              onClick={() => setViewMode('public')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
              title="View Public Fan Portal"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Public Site</span>
            </button>
          </div>

          {/* Database Online Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>DATABASE ONLINE</span>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
            <div className="w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <User className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-gray-900 leading-tight">
                {currentUser?.name || 'Administrator'}
              </div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                {currentUser?.role || 'ADMINISTRATOR'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
