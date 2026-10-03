import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { MatchCard } from '../components/tournament/MatchCard';
import { CreateMatchModal } from '../components/tournament/CreateMatchModal';
import { EditMatchModal } from '../components/tournament/EditMatchModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Match } from '../types';
import { 
  Plus, 
  CalendarDays, 
  RotateCcw, 
  Trash2, 
  Search, 
  Trophy 
} from 'lucide-react';

export const TournamentControlPage: React.FC = () => {
  const { 
    teams,
    matches, 
    generateSchedule9Matches, 
    scheduleKnockout, 
    resetPendingFixtures, 
    resetAllFreshTesting,
    showToast 
  } = useTournament();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Confirm dialogs
  const [confirmGenerateSchedule, setConfirmGenerateSchedule] = useState(false);
  const [confirmKnockout, setConfirmKnockout] = useState(false);
  const [confirmResetPending, setConfirmResetPending] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  // Filter matches
  const filteredMatches = matches.filter((m: Match) => {
    const matchesFilter = filterStatus === 'ALL' || m.status === filterStatus;
    const matchesSearch = 
      m.matchNumber.toString().includes(searchQuery) ||
      m.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.matchType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const liveCount = matches.filter((m: Match) => m.status === 'LIVE').length;
  const upcomingCount = matches.filter((m: Match) => m.status === 'UPCOMING').length;
  const completedCount = matches.filter((m: Match) => m.status === 'COMPLETED').length;

  const handleOpenCreateModal = () => {
    if (teams.length < 2) {
      showToast('warning', 'Teams Required', 'Please create at least 2 teams before creating a match fixture.');
    }
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* TOURNAMENT FIXTURE CONTROL CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950 font-sans">
                TOURNAMENT FIXTURE CONTROL
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold">
                FIXTURES
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Create and manage tournament fixtures, automate schedules, configure knockout brackets and assign scorer PIN credentials.
            </p>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* + CREATE SINGLE MATCH */}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ CREATE SINGLE MATCH</span>
            </button>

            {/* GENERATE SCHEDULE */}
            {teams.length >= 2 && (
              <button
                type="button"
                onClick={() => setConfirmGenerateSchedule(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-xs transition"
              >
                <CalendarDays className="w-4 h-4 text-[#D8AD28]" />
                <span>GENERATE SCHEDULE</span>
              </button>
            )}

            {/* SCHEDULE KNOCKOUT */}
            {teams.length >= 4 && (
              <button
                type="button"
                onClick={() => setConfirmKnockout(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-xs transition"
              >
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>SCHEDULE KNOCKOUT</span>
              </button>
            )}

            {/* RESET PENDING FIXTURES */}
            {matches.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmResetPending(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider transition"
              >
                <RotateCcw className="w-4 h-4 text-gray-500" />
                <span>RESET PENDING FIXTURES</span>
              </button>
            )}

            {/* RESET ALL */}
            <button
              type="button"
              onClick={() => setConfirmResetAll(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider transition"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>RESET ALL TO EMPTY</span>
            </button>
          </div>
        </div>
      </div>

      {/* MATCH LIST SECTION */}
      <div className="space-y-4">
        {/* Section Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-950 font-sans">
              MATCH LIST
            </h3>
            <span className="px-3 py-1 rounded-full bg-gray-900 text-[#D8AD28] text-xs font-black tracking-wider">
              {matches.length} MATCHES
            </span>
          </div>

          {/* Filter Bar & Search */}
          {matches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search venue or match #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28] bg-white w-48 sm:w-56"
                />
              </div>

              {/* Filter Tabs */}
              <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200/80">
                <button
                  type="button"
                  onClick={() => setFilterStatus('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition uppercase ${
                    filterStatus === 'ALL'
                      ? 'bg-white text-gray-950 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ALL ({matches.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('LIVE')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition uppercase flex items-center gap-1.5 ${
                    filterStatus === 'LIVE'
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {liveCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                  LIVE ({liveCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('UPCOMING')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition uppercase ${
                    filterStatus === 'UPCOMING'
                      ? 'bg-white text-gray-950 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  UPCOMING ({upcomingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('COMPLETED')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition uppercase ${
                    filterStatus === 'COMPLETED'
                      ? 'bg-white text-gray-950 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  COMPLETED ({completedCount})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MATCHES DISPLAY OR EMPTY STATE */}
        {matches.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/90 shadow-subtle flex flex-col items-center justify-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
              <CalendarDays className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-gray-950 font-sans mb-1">
              NO MATCHES SCHEDULED
            </h3>
            <p className="text-xs text-gray-500 font-medium mb-6 max-w-sm">
              Create a fixture to begin.
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ CREATE SINGLE MATCH</span>
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-900 uppercase">No Matches Found</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              No matches match your current search/filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredMatches.map((match: Match) => (
              <MatchCard
                key={match.id}
                match={match}
                onEdit={(m: Match) => setEditingMatch(m)}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      <CreateMatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditMatchModal
        isOpen={!!editingMatch}
        onClose={() => setEditingMatch(null)}
        match={editingMatch}
      />

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={confirmGenerateSchedule}
        onClose={() => setConfirmGenerateSchedule(false)}
        onConfirm={generateSchedule9Matches}
        title="Generate League Match Fixtures"
        message="This will automatically schedule a round-robin fixture set across all registered teams."
        confirmText="Generate Schedule"
        isDestructive={false}
      />

      <ConfirmDialog
        isOpen={confirmKnockout}
        onClose={() => setConfirmKnockout(false)}
        onConfirm={scheduleKnockout}
        title="Schedule Knockout Brackets"
        message="This will append Semi Finals and Grand Final matches to the tournament fixtures."
        confirmText="Schedule Knockouts"
        isDestructive={false}
      />

      <ConfirmDialog
        isOpen={confirmResetPending}
        onClose={() => setConfirmResetPending(false)}
        onConfirm={resetPendingFixtures}
        title="Reset Pending Matches"
        message="Are you sure you want to clear all upcoming and uncompleted fixtures?"
        confirmText="Clear Pending"
      />

      <ConfirmDialog
        isOpen={confirmResetAll}
        onClose={() => setConfirmResetAll(false)}
        onConfirm={resetAllFreshTesting}
        title="Reset Entire Tournament"
        message="Are you sure you want to reset all tournament records (teams, players, matches, auctions) to a clean empty state?"
        confirmText="Reset Everything"
      />
    </div>
  );
};
