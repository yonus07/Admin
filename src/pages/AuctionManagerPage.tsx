import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Badge } from '../components/common/Badge';
import { TeamLogo } from '../components/common/TeamLogo';
import { Team, Player } from '../types';
import confetti from 'canvas-confetti';
import { 
  Gavel, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  Plus
} from 'lucide-react';

export const AuctionManagerPage: React.FC = () => {
  const { 
    teams, 
    players, 
    auctionState, 
    placeBid, 
    markPlayerSold, 
    markPlayerUnsold, 
    nextAuctionPlayer, 
    previousAuctionPlayer, 
    pauseResumeAuction,
    setActiveTab,
    showToast 
  } = useTournament();

  const [selectedBiddingTeamId, setSelectedBiddingTeamId] = useState<string>(teams[0]?.id || '');

  const availablePool = players.filter((p: Player) => p.status === 'Available' || p.status === 'Unsold');
  const currentPlayer = players.find((p: Player) => p.id === auctionState.currentPlayerId) || availablePool[0] || null;
  const highestBidderTeam = teams.find((t: Team) => t.id === auctionState.highestBidderTeamId);

  const handleQuickBid = (increment: number) => {
    if (!currentPlayer || !selectedBiddingTeamId) {
      showToast('error', 'Select Team', 'Please select a bidding franchise paddle.');
      return;
    }
    const newAmount = auctionState.currentBid + increment;
    placeBid(selectedBiddingTeamId, newAmount);
  };

  const handleSold = () => {
    if (!currentPlayer || !auctionState.highestBidderTeamId) {
      showToast('error', 'Cannot Mark Sold', 'At least one team must place a bid before marking sold.');
      return;
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    markPlayerSold(currentPlayer.id, auctionState.highestBidderTeamId, auctionState.currentBid);
  };

  const handleUnsold = () => {
    if (!currentPlayer) return;
    markPlayerUnsold(currentPlayer.id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950 font-sans">
              AUCTION MANAGER
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#D8AD28] text-gray-950 text-xs font-black tracking-wider">
              LIVE AUCTION CONSOLE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Real-time player auctioneer console, franchise paddle bidding, budget tracking, and contract allocation.
          </p>
        </div>

        {currentPlayer && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={previousAuctionPlayer}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
              title="Previous Player"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={pauseResumeAuction}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                auctionState.isPaused
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {auctionState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span>{auctionState.isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>
            <button
              type="button"
              onClick={nextAuctionPlayer}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
              title="Next Player"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* AUCTION STAGE OR EMPTY STATE */}
      {!currentPlayer || teams.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/90 shadow-subtle flex flex-col items-center justify-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#D8AD28] flex items-center justify-center mb-4 shadow-2xs">
            <Gavel className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight text-gray-950 font-sans mb-1">
            NO AUCTION DATA
          </h3>
          <p className="text-xs text-gray-500 font-medium mb-6 max-w-sm">
            Add players and configure the auction to begin.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('PLAYERS')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition transform active:scale-95"
            >
              <Users className="w-4 h-4 stroke-[3]" />
              <span>+ ADD PLAYERS</span>
            </button>
            {teams.length === 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('TEAMS')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition"
              >
                <Plus className="w-4 h-4 text-[#D8AD28]" />
                <span>CREATE TEAMS</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Spotlight Current Player & Bid Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spotlight Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-subtle relative overflow-hidden">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {currentPlayer.photoUrl ? (
                    <img
                      src={currentPlayer.photoUrl}
                      alt={currentPlayer.name}
                      className="w-32 h-32 rounded-3xl object-cover shadow-card border-4 border-white flex-shrink-0"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-3xl bg-gray-100 text-gray-700 font-black flex items-center justify-center text-4xl border-4 border-white flex-shrink-0 shadow-card">
                      {currentPlayer.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                      <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        {currentPlayer.playerId}
                      </span>
                      <Badge variant="gold" size="sm">
                        {currentPlayer.category} TIER
                      </Badge>
                      <Badge variant={currentPlayer.status === 'Sold' ? 'green' : 'gray'} size="sm">
                        {currentPlayer.status}
                      </Badge>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
                      {currentPlayer.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-600 mt-0.5">
                      {currentPlayer.role} • {currentPlayer.battingStyle}
                      {currentPlayer.bowlingStyle && currentPlayer.bowlingStyle !== 'None' && ` • ${currentPlayer.bowlingStyle}`}
                    </p>

                    {/* Stats pills */}
                    <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 font-bold text-gray-800">
                        {currentPlayer.stats?.matches || 0} Matches
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 font-bold text-gray-800">
                        {currentPlayer.stats?.runs || 0} Runs
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 font-bold text-gray-800">
                        {currentPlayer.stats?.wickets || 0} Wickets
                      </span>
                    </div>
                  </div>
                </div>

                {/* CURRENT BID DISPLAY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center sm:text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                      Base Price
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-gray-900 font-mono mt-1 block">
                      LKR {(currentPlayer.basePrice / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>

                  <div className="bg-[#FBF5D8] rounded-2xl p-4 border border-[#F5E7A6] text-center sm:text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8E6B15] block">
                      Current Highest Bid
                    </span>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-[#8E6B15] font-mono">
                        LKR {(auctionState.currentBid / 100000).toFixed(2)} Lakhs
                      </span>
                      {highestBidderTeam && (
                        <span className="px-2 py-0.5 rounded bg-white text-xs font-black text-gray-900 shadow-2xs">
                          {highestBidderTeam.shortName || highestBidderTeam.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* BIDDING CONTROL CONSOLE */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                      Raise Paddle for Franchise:
                    </label>
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                      {teams.map((team: Team) => {
                        const isSelected = (selectedBiddingTeamId || teams[0]?.id) === team.id;
                        return (
                          <button
                            key={team.id}
                            type="button"
                            onClick={() => setSelectedBiddingTeamId(team.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 justify-center ${
                              isSelected
                                ? 'bg-gray-950 text-white shadow-sm ring-2 ring-[#D8AD28]'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <TeamLogo team={team} size="xs" />
                            <span>{team.shortName || team.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Increment Buttons */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                      Quick Bid Increments
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickBid(25000)}
                        className="py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-900 font-bold text-xs text-gray-900 transition shadow-2xs"
                      >
                        + LKR 25,000
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickBid(50000)}
                        className="py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-900 font-bold text-xs text-gray-900 transition shadow-2xs"
                      >
                        + LKR 50,000
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickBid(100000)}
                        className="py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-900 font-bold text-xs text-gray-900 transition shadow-2xs"
                      >
                        + LKR 100,000
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickBid(200000)}
                        className="py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-900 font-bold text-xs text-gray-900 transition shadow-2xs"
                      >
                        + LKR 200,000
                      </button>
                    </div>
                  </div>

                  {/* Hammer / Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSold}
                      className="py-3.5 px-4 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 font-black text-xs uppercase tracking-wider shadow-sm transition transform active:scale-95"
                    >
                      🔨 SOLD HAMMER
                    </button>
                    <button
                      type="button"
                      onClick={handleUnsold}
                      className="py-3.5 px-4 rounded-2xl border border-gray-300 hover:bg-gray-200 text-gray-700 font-black text-xs uppercase tracking-wider transition"
                    >
                      MARK UNSOLD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Franchise Purse Cards */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
              Franchise Purse Tracker
            </h4>
            {teams.map((t) => {
              const remaining = t.totalPurse - t.spentPurse;
              const percent = t.totalPurse > 0 ? Math.round((t.spentPurse / t.totalPurse) * 100) : 0;
              return (
                <div key={t.id} className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-subtle space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TeamLogo team={t} size="xs" />
                      <span className="font-bold text-xs text-gray-900">{t.name}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-700">
                      LKR {(remaining / 100000).toFixed(1)}L Left
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D8AD28] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
