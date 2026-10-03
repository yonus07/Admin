import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { TeamLogo } from '../components/common/TeamLogo';
import { Badge } from '../components/common/Badge';
import { 
  Users, 
  User, 
  Trophy, 
  Calendar, 
  Clock, 
  Activity, 
  Radio, 
  Flame, 
  Gavel, 
  ArrowRight,
  Plus,
  Shield
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { 
    teams, 
    players, 
    matches, 
    standings, 
    activities, 
    auctionState, 
    setActiveTab, 
    setViewMode, 
    setActiveScorerMatchId 
  } = useTournament();

  const completedMatches = matches.filter((m) => m.status === 'COMPLETED');
  const upcomingMatches = matches.filter((m) => m.status === 'UPCOMING');
  const liveMatch = matches.find((m) => m.status === 'LIVE');

  // Top run scorers from players with runs > 0
  const topBatsmen = [...players].filter((p) => (p.stats?.runs || 0) > 0).sort((a, b) => b.stats.runs - a.stats.runs).slice(0, 5);

  const totalPurseSpent = teams.reduce((acc, t) => acc + (t.spentPurse || 0), 0);
  const totalPurseAllocated = teams.reduce((acc, t) => acc + (t.totalPurse || 0), 0);
  const purseSpentPercent = totalPurseAllocated > 0 ? Math.round((totalPurseSpent / totalPurseAllocated) * 100) : 0;

  // Tournament Status
  const tournamentStatus = matches.length === 0
    ? 'NOT STARTED'
    : completedMatches.length === matches.length
    ? 'COMPLETED'
    : liveMatch || completedMatches.length > 0
    ? 'IN PROGRESS'
    : 'NOT STARTED';

  return (
    <div className="space-y-7 pb-12">
      {/* 4 CLEAN HORIZONTAL KPI STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CARD 1: TOTAL TEAMS */}
        <div
          onClick={() => setActiveTab('TEAMS')}
          className="bg-white rounded-[18px] p-5 sm:p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] min-h-[108px] flex items-center gap-4 cursor-pointer hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.07)] hover:border-gray-200 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-none">
              TOTAL TEAMS
            </span>
            <span className="text-[30px] sm:text-[32px] font-bold text-gray-950 font-sans tracking-tight leading-tight my-0.5">
              {teams.length}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 font-normal leading-none">
              Active teams
            </span>
          </div>
        </div>

        {/* CARD 2: TOTAL PLAYERS */}
        <div
          onClick={() => setActiveTab('PLAYERS')}
          className="bg-white rounded-[18px] p-5 sm:p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] min-h-[108px] flex items-center gap-4 cursor-pointer hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.07)] hover:border-gray-200 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-none">
              TOTAL PLAYERS
            </span>
            <span className="text-[30px] sm:text-[32px] font-bold text-gray-950 font-sans tracking-tight leading-tight my-0.5">
              {players.length}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 font-normal leading-none">
              In tournament pool
            </span>
          </div>
        </div>

        {/* CARD 3: TOTAL MATCHES */}
        <div
          onClick={() => setActiveTab('TOURNAMENT CONTROL')}
          className="bg-white rounded-[18px] p-5 sm:p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] min-h-[108px] flex items-center gap-4 cursor-pointer hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.07)] hover:border-gray-200 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-none">
              TOTAL MATCHES
            </span>
            <span className="text-[30px] sm:text-[32px] font-bold text-gray-950 font-sans tracking-tight leading-tight my-0.5">
              {matches.length}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 font-normal leading-none">
              {upcomingMatches.length} Upcoming
            </span>
          </div>
        </div>

        {/* CARD 4: COMPLETED MATCHES / TOURNAMENT STATUS */}
        <div
          onClick={() => setActiveTab('TOURNAMENT CONTROL')}
          className="bg-white rounded-[18px] p-5 sm:p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] min-h-[108px] flex items-center gap-4 cursor-pointer hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.07)] hover:border-gray-200 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-none">
              COMPLETED MATCHES
            </span>
            <span className="text-[30px] sm:text-[32px] font-bold text-gray-950 font-sans tracking-tight leading-tight my-0.5">
              {completedMatches.length}
            </span>
            <span className="text-[11px] sm:text-xs text-amber-600 font-bold leading-none uppercase">
              {tournamentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* LIVE MATCH SECTION */}
      {liveMatch ? (
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 rounded-3xl p-6 text-white border-2 border-[#D8AD28]/50 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="green" dot size="sm">LIVE MATCH #{liveMatch.matchNumber}</Badge>
                <span className="text-xs text-gray-400">{liveMatch.venue} • {liveMatch.overs} Overs</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
                {teams.find((t) => t.id === liveMatch.team1Id)?.name || 'Team 1'} vs {teams.find((t) => t.id === liveMatch.team2Id)?.name || 'Team 2'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            {liveMatch.team1Score && (
              <div className="text-right">
                <div className="text-2xl font-black text-[#D8AD28]">
                  {liveMatch.team1Score.runs}/{liveMatch.team1Score.wickets}
                </div>
                <div className="text-xs text-gray-300 font-medium">
                  {liveMatch.team1Score.overs} Overs (CRR: {(liveMatch.team1Score.overs > 0 ? (liveMatch.team1Score.runs / liveMatch.team1Score.overs).toFixed(2) : '0.00')})
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setActiveScorerMatchId(liveMatch.id);
                setViewMode('scorer');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider transition shadow-sm flex-shrink-0"
            >
              LAUNCH SCORER
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight text-gray-950">
                NO LIVE MATCH
              </h4>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                No match is currently in progress.
              </p>
            </div>
          </div>
          {matches.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('TOURNAMENT CONTROL')}
              className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold uppercase text-gray-700 transition"
            >
              View Fixtures
            </button>
          )}
        </div>
      )}

      {/* MAIN TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Standings & Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          {/* TOURNAMENT STANDINGS */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-[#D8AD28]" />
                <h3 className="text-base font-black uppercase tracking-tight text-gray-950 font-sans">
                  TOURNAMENT STANDINGS
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('STATS METHODOLOGY')}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 transition flex items-center gap-1 uppercase"
              >
                <span>Rules & NRR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {standings.length === 0 ? (
              <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D8AD28] flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight text-gray-950">
                  NO TEAMS YET
                </h4>
                <p className="text-xs text-gray-500 font-medium mt-1 mb-4">
                  Add teams to begin tournament standings.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('TEAMS')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider transition"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ CREATE TEAM</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 uppercase font-black tracking-wider">
                      <th className="pb-3 pl-2">#</th>
                      <th className="pb-3">TEAM</th>
                      <th className="pb-3 text-center">P</th>
                      <th className="pb-3 text-center">W</th>
                      <th className="pb-3 text-center">L</th>
                      <th className="pb-3 text-center">PTS</th>
                      <th className="pb-3 text-right pr-2">NRR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {standings.map((st, idx) => {
                      const team = teams.find((t) => t.id === st.teamId);
                      const isQualifying = idx < 2;

                      return (
                        <tr key={st.teamId} className="hover:bg-gray-50/80 transition">
                          <td className="py-3.5 pl-2 font-bold text-gray-900">
                            <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                              isQualifying ? 'bg-[#D8AD28] text-black font-extrabold' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-2.5">
                              <TeamLogo team={team} size="xs" />
                              <span className="font-bold text-gray-900 truncate">{team?.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-center font-semibold text-gray-700">{st.played}</td>
                          <td className="py-3.5 text-center font-bold text-emerald-700">{st.won}</td>
                          <td className="py-3.5 text-center font-semibold text-rose-600">{st.lost}</td>
                          <td className="py-3.5 text-center font-black text-gray-950 text-sm">{st.points}</td>
                          <td className="py-3.5 text-right pr-2 font-mono font-bold text-gray-900">
                            {st.nrr >= 0 ? `+${st.nrr.toFixed(3)}` : st.nrr.toFixed(3)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* UPCOMING MATCHES PREVIEW */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black uppercase tracking-tight text-gray-950 font-sans">
                  UPCOMING MATCHES
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('TOURNAMENT CONTROL')}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 transition flex items-center gap-1 uppercase"
              >
                <span>View All Fixtures</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingMatches.length === 0 ? (
              <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight text-gray-950">
                  NO MATCHES SCHEDULED
                </h4>
                <p className="text-xs text-gray-500 font-medium mt-1 mb-4">
                  Create a fixture to begin.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('TOURNAMENT CONTROL')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D8AD28]" />
                  <span>CREATE FIXTURE</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {upcomingMatches.slice(0, 4).map((m) => {
                  const t1 = teams.find((t) => t.id === m.team1Id);
                  const t2 = teams.find((t) => t.id === m.team2Id);
                  return (
                    <div key={m.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase">
                        <span>MATCH #{m.matchNumber}</span>
                        <span className="text-gray-700 font-semibold">{m.time}</span>
                      </div>
                      <div className="my-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TeamLogo team={t1} size="xs" />
                          <span className="text-xs font-bold text-gray-900 truncate max-w-[90px]">{t1?.shortName || t1?.name || 'TBD'}</span>
                        </div>
                        <span className="text-[10px] font-black text-gray-400">VS</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 truncate max-w-[90px] text-right">{t2?.shortName || t2?.name || 'TBD'}</span>
                          <TeamLogo team={t2} size="xs" />
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400 truncate pt-2 border-t border-gray-200/60">
                        {m.venue} • PIN: <span className="font-mono font-bold text-gray-700">{m.scorerPin}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Top Players, Auction summary & Recent Activity */}
        <div className="space-y-6">
          {/* TOP PLAYERS LEADERBOARD */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black uppercase tracking-tight text-gray-950 font-sans">
                  TOP RUN SCORERS
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('PLAYERS')}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 transition flex items-center gap-1 uppercase"
              >
                <span>All Players</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {topBatsmen.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-2">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-tight text-gray-950">
                  NO PLAYER STATISTICS
                </h4>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  Player statistics will appear after matches are completed.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topBatsmen.map((player, idx) => {
                  const team = teams.find((t) => t.id === player.teamId);
                  return (
                    <div key={player.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-black text-gray-400 w-4">{idx + 1}</span>
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {player.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{player.name}</h4>
                          <p className="text-[10px] text-gray-500 truncate">{team?.shortName || 'Unassigned'} • {player.role}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-black text-gray-950">{player.stats.runs} Runs</span>
                        <span className="text-[10px] text-gray-400 block font-medium">SR {player.stats.strikeRate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AUCTION SUMMARY */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Gavel className="w-5 h-5 text-[#D8AD28]" />
                <h3 className="text-base font-black uppercase tracking-tight text-gray-950 font-sans">
                  AUCTION SUMMARY
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('AUCTION MANAGER')}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 transition flex items-center gap-1 uppercase"
              >
                <span>Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {teams.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D8AD28] flex items-center justify-center mx-auto mb-2">
                  <Gavel className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-tight text-gray-950">
                  NO AUCTION DATA
                </h4>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5 mb-3">
                  Add players and configure the auction to begin.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('PLAYERS')}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-bold uppercase text-gray-700 transition"
                >
                  Manage Players
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="text-gray-500">Purse Utilized</span>
                    <span className="text-gray-950">{purseSpentPercent}% (LKR {(totalPurseSpent / 10000000).toFixed(2)} Cr)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D8AD28] rounded-full transition-all duration-500"
                      style={{ width: `${purseSpentPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {teams.map((t) => {
                    const remaining = t.totalPurse - t.spentPurse;
                    return (
                      <div key={t.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <TeamLogo team={t} size="xs" />
                          <span className="font-bold text-gray-900">{t.shortName || t.name}</span>
                        </div>
                        <span className="font-mono font-semibold text-gray-600">
                          LKR {(remaining / 100000).toFixed(1)}L Left
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RECENT ACTIVITY LOG */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-black uppercase tracking-tight text-gray-950 font-sans">
                  RECENT ACTIVITY
                </h3>
              </div>
            </div>

            {activities.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-tight text-gray-950">
                  NO RECENT ACTIVITY
                </h4>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  Actions taken in the system will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {activities.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#D8AD28] mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 leading-snug">{act.title}</div>
                      <div className="text-gray-500 text-[11px] leading-relaxed mt-0.5">{act.description}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{act.timestamp} • {act.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
