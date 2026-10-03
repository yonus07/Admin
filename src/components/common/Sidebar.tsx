import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { MslLogo } from './MslLogo';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Trophy, 
  Calculator, 
  BookOpen, 
  Gavel, 
  Printer, 
  History, 
  UserCog, 
  Settings, 
  Radio, 
  Globe, 
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile = false, onCloseMobile }) => {
  const { 
    activeTab, 
    matches,
    setActiveTab, 
    setViewMode, 
    setActiveScorerMatchId, 
    logout,
    showToast 
  } = useTournament();

  const navItems = [
    { name: 'OVERVIEW', icon: LayoutDashboard },
    { name: 'PLAYERS', icon: Users },
    { name: 'TEAMS', icon: Shield },
    { name: 'TOURNAMENT CONTROL', icon: Trophy },
    { name: 'STATS METHODOLOGY', icon: Calculator },
    { name: 'SYSTEM MANUALS', icon: BookOpen },
    { name: 'AUCTION MANAGER', icon: Gavel },
    { name: 'PRINT REPORTS', icon: Printer },
    { name: 'CHANGELOG', icon: History },
    { name: 'STAFF & ADMINS', icon: UserCog },
    { name: 'SETTINGS', icon: Settings },
  ];

  const handleNavClick = (tabName: string) => {
    setActiveTab(tabName);
    setViewMode('admin');
    if (onCloseMobile) onCloseMobile();
  };

  const handleScorerClick = () => {
    const targetMatch = matches.find((m) => m.status === 'LIVE') || matches[0];
    setActiveScorerMatchId(targetMatch?.id || null);
    setViewMode('scorer');
    if (onCloseMobile) onCloseMobile();
  };

  const handlePublicClick = () => {
    setViewMode('public');
    if (onCloseMobile) onCloseMobile();
  };

  const handleSignOut = () => {
    logout();
    showToast('info', 'Signed Out', 'You have been logged out of MSL Admin Portal.');
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200/90 w-[290px] select-none">
      {/* Top Branding with MSL Logo */}
      <div className="p-6 border-b border-gray-100/80">
        <div className="flex items-center justify-between">
          <MslLogo
            size="md"
            showText={true}
            textColor="dark"
            subtitle="ADMIN PORTAL"
          />

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => handleNavClick(item.name)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all duration-150 text-left ${
                isActive
                  ? 'bg-[#F59E0B] text-gray-950 shadow-xs font-extrabold scale-[1.01]'
                  : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/80 font-semibold'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-gray-950' : 'text-gray-400'}`} />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Utility Section */}
      <div className="p-4 border-t border-gray-100/90 space-y-1 bg-gray-50/50">
        <button
          type="button"
          onClick={handleScorerClick}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 transition uppercase tracking-wider"
        >
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Scorer Console</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-extrabold">LIVE</span>
        </button>

        <button
          type="button"
          onClick={handlePublicClick}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-200/70 transition uppercase tracking-wider text-left"
        >
          <Globe className="w-4 h-4 text-gray-400" />
          <span>Public Website</span>
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition uppercase tracking-wider text-left"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Footer Branding */}
      <div className="px-6 py-3 border-t border-gray-100 text-center bg-gray-50/80">
        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
          TECHNOLOGY PARTNER: <span className="text-gray-700 font-extrabold">VALGROW LABS</span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
