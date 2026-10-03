import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { TeamLogo } from '../common/TeamLogo';
import { Badge } from '../common/Badge';
import { 
  Trophy, 
  Calendar, 
  Shield, 
  ArrowLeft, 
  Radio, 
  Flame, 
  Users 
} from 'lucide-react';

export const PublicWebsiteView: React.FC = () => {
  const { teams, players, matches, standings, settings, setViewMode } = useTournament();

  const [activePublicTab, setActivePublicTab] = useState<'fixtures' | 'standings' | 'teams' | 'stats'>('fixtures');

  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const topBatsmen = [...players].filter((p) => (p.stats?.runs || 0) > 0).sort((a, b) => b.stats.runs - a.stats.runs).slice(0, 5);
  const topBowlers = [...players].filter((p) => (p.stats?.wickets || 0) > 0).sort((a, b) => b.stats.wickets - a.stats.wickets).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-gray-950 font-sans flex flex-col">
      {/* PUBLIC NAVBAR */}
      <header className="bg-gray-950 text-white sticky top-0 z-40 border-b border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#D8AD28] text-black flex items-center justify-center font-black text-xl shadow-xs">
              🏏
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">{settings.tournamentName}</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#D8AD28] text-black">
                  FAN HUB
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                {settings.edition} {settings.defaultVenue ? `• ${settings.defaultVenue}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('admin')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold uppercase tracking-wider text-gray-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO BANNER WITH LIVE SCORE TICKER */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white py-12 px-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D8AD28] bg-[#D8AD28]/10 px-3 py-1 rounded-full border border-[#D8AD28]/30 inline-block">
              {settings.season} • OFFICIAL MATCH CENTER
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">
              {settings.tournamentName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              {teams.length} Franchises • {matches.length} Scheduled Matches • Real-time Ball-by-Ball Scorecard
            </p>
          </div>

          {/* LIVE TICKER CARDS */}
          {liveMatches.length > 0 && (
            <div className="max-w-4xl mx-auto">
              {liveMatches.map((lm) => {
                const t1 = teams.find((t) => t.id === lm.team1Id);
                const t2 = teams.find((t) => t.id === lm.team2Id);
                return (
                  <div
                    key={lm.id}
                    className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border-2 border-[#D8AD28]/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Radio className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-black text-[10px] uppercase">
                            LIVE NOW
                          </span>
                          <span className="text-xs text-gray-400">Match #{lm.matchNumber} • {lm.venue}</span>
                        </div>
                        <h3 className="text-xl font-bold mt-1 text-white">
                          {t1?.name || 'Team 1'} vs {t2?.name || 'Team 2'}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      {lm.team1Score && (
                        <div className="text-right">
                          <div className="text-3xl font-black text-[#D8AD28] font-mono">
                            {lm.team1Score.runs}/{lm.team1Score.wickets}
                          </div>
                          <div className="text-xs text-gray-400">
                            ({lm.team1Score.overs} ov)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* PUBLIC TAB NAVIGATION */}
      <div className="bg-white border-b border-gray-200/90 shadow-2xs sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4 overflow-x-auto py-3">
          {[
            { id: 'fixtures', name: 'FIXTURES & RESULTS', icon: Calendar },
            { id: 'standings', name: 'POINTS TABLE', icon: Trophy },
            { id: 'teams', name: 'TEAMS & SQUADS', icon: Shield },
            { id: 'stats', name: 'TOP PERFORMERS', icon: Flame }
          ].map((tab) => {
            const isSelected = activePublicTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePublicTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-[#D8AD28] text-black shadow-xs'
                    : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 space-y-8">
        {/* FIXTURES & RESULTS TAB */}
        {activePublicTab === 'fixtures' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-950">
              MATCH FIXTURES ({matches.length})
            </h3>

            {matches.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/90">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-900 uppercase">NO MATCHES SCHEDULED</h4>
                <p className="text-xs text-gray-500 mt-1">Tournament fixtures will be displayed here once scheduled.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matches.map((m) => {
                  const t1 = teams.find((t) => t.id === m.team1Id);
                  const t2 = teams.find((t) => t.id === m.team2Id);
                  return (
                    <div key={m.id} className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-subtle flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                          <span className="text-xs font-black uppercase text-gray-900">
                            MATCH {m.matchNumber} • {m.matchType}
                          </span>
                          <Badge variant={m.status === 'LIVE' ? 'green' : m.status === 'COMPLETED' ? 'gold' : 'gray'} size="sm">
                            {m.status}
                          </Badge>
                        </div>

                        <div className="my-2 text-[11px] text-gray-500">
                          {m.date} at {m.time} • {m.venue}
                        </div>

                        {/* Teams */}
                        <div className="my-4 bg-gray-50 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <TeamLogo team={t1} size="xs" />
                              <span className="text-xs font-bold text-gray-900">{t1?.name || 'TBD'}</span>
                            </div>
                            {m.team1Score && (m.status === 'LIVE' || m.status === 'COMPLETED') && (
                              <span className="font-mono font-black text-gray-900 text-sm">
                                {m.team1Score.runs}/{m.team1Score.wickets}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <TeamLogo team={t2} size="xs" />
                              <span className="text-xs font-bold text-gray-900">{t2?.name || 'TBD'}</span>
                            </div>
                            {m.team2Score && (m.status === 'LIVE' || m.status === 'COMPLETED') && (
                              <span className="font-mono font-black text-gray-900 text-sm">
                                {m.team2Score.runs}/{m.team2Score.wickets}
                              </span>
                            )}
                          </div>
                        </div>

                        {m.winMargin && (
                          <p className="text-xs font-bold text-[#8E6B15] bg-[#FBF5D8] p-2 rounded-xl text-center">
                            🏆 {m.winMargin}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STANDINGS / POINTS TABLE TAB */}
        {activePublicTab === 'standings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-subtle space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-950">
              OFFICIAL TOURNAMENT STANDINGS
            </h3>
            {standings.length === 0 ? (
              <div className="py-12 text-center">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-900 uppercase">NO TEAMS YET</h4>
                <p className="text-xs text-gray-500 mt-1">Standings will update automatically after match results.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 uppercase font-black tracking-wider">
                      <th className="pb-3 pl-3">POS</th>
                      <th className="pb-3">TEAM FRANCHISE</th>
                      <th className="pb-3 text-center">PLAYED</th>
                      <th className="pb-3 text-center">WON</th>
                      <th className="pb-3 text-center">LOST</th>
                      <th className="pb-3 text-center">TIED</th>
                      <th className="pb-3 text-center">PTS</th>
                      <th className="pb-3 text-right pr-3">NET RUN RATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {standings.map((st, idx) => {
                      const team = teams.find((t) => t.id === st.teamId);
                      return (
                        <tr key={st.teamId} className="hover:bg-gray-50 transition">
                          <td className="py-4 pl-3 font-bold text-gray-900">{idx + 1}</td>
                          <td className="py-4 font-bold text-gray-950 flex items-center gap-3">
                            <TeamLogo team={team} size="xs" />
                            <span>{team?.name || 'Team'}</span>
                          </td>
                          <td className="py-4 text-center">{st.played}</td>
                          <td className="py-4 text-center font-bold text-emerald-700">{st.won}</td>
                          <td className="py-4 text-center text-rose-600">{st.lost}</td>
                          <td className="py-4 text-center">{st.tied}</td>
                          <td className="py-4 text-center font-black text-base text-gray-950">{st.points}</td>
                          <td className="py-4 text-right pr-3 font-mono font-bold">
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
        )}

        {/* TEAMS TAB */}
        {activePublicTab === 'teams' && (
          <div>
            {teams.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/90">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-900 uppercase">NO TEAMS REGISTERED</h4>
                <p className="text-xs text-gray-500 mt-1">Teams will appear here once created by administrator.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map((team) => {
                  const teamPlayers = players.filter((p) => p.teamId === team.id);
                  return (
                    <div key={team.id} className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle space-y-4">
                      <div className="flex items-center gap-4">
                        <TeamLogo team={team} size="lg" />
                        <div>
                          <h3 className="text-xl font-black text-gray-950 uppercase">{team.name}</h3>
                          <p className="text-xs text-gray-500 font-medium">
                            Captain: <strong>{team.captain || 'None'}</strong> {team.coach ? `• Coach: ${team.coach}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-xs font-bold uppercase text-gray-400 block mb-2">
                          Official Squad ({teamPlayers.length})
                        </span>
                        {teamPlayers.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">No players signed yet.</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {teamPlayers.map((p) => (
                              <div key={p.id} className="p-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                                {p.photoUrl ? (
                                  <img src={p.photoUrl} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
                                ) : (
                                  <div className="w-6 h-6 rounded-md bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-[10px]">
                                    {p.name.charAt(0)}
                                  </div>
                                )}
                                <span className="font-bold text-gray-900 truncate">{p.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STATS & PERFORMERS TAB */}
        {activePublicTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black uppercase text-gray-950">LEADING RUN SCORERS</h3>
              </div>
              {topBatsmen.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-6 text-center">No player run statistics available yet.</p>
              ) : (
                <div className="space-y-3">
                  {topBatsmen.map((p, idx) => (
                    <div key={p.id} className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-gray-400">{idx + 1}</span>
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs">
                            {p.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-gray-950 block">{p.name}</span>
                          <span className="text-[10px] text-gray-500">{p.role}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-gray-950 text-sm">{p.stats?.runs || 0} Runs</span>
                        <span className="text-[10px] text-gray-400 block">SR {p.stats?.strikeRate || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black uppercase text-gray-950">LEADING WICKET TAKERS</h3>
              </div>
              {topBowlers.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-6 text-center">No wicket statistics available yet.</p>
              ) : (
                <div className="space-y-3">
                  {topBowlers.map((p, idx) => (
                    <div key={p.id} className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-gray-400">{idx + 1}</span>
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs">
                            {p.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-gray-950 block">{p.name}</span>
                          <span className="text-[10px] text-gray-500">{p.role}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-700 text-sm">{p.stats?.wickets || 0} Wkts</span>
                        <span className="text-[10px] text-gray-400 block">Econ {p.stats?.economy || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-400 py-8 px-6 border-t border-gray-800 text-center text-xs">
        <p className="uppercase font-bold text-gray-300">
          {settings.tournamentName} TOURNAMENT MANAGEMENT SYSTEM
        </p>
      </footer>
    </div>
  );
};
