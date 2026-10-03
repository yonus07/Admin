import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Standing, Team, Player, Match } from '../types';
import { 
  Printer, 
  Download, 
  FileText, 
  Trophy, 
  Users, 
  Shield, 
  Calendar, 
  Gavel,
  AlertCircle
} from 'lucide-react';

export const PrintReportsPage: React.FC = () => {
  const { teams, players, matches, standings, settings, showToast } = useTournament();
  const [selectedReport, setSelectedReport] = useState<string>('tournament-summary');

  const hasData = teams.length > 0 || players.length > 0 || matches.length > 0;

  const handlePrint = () => {
    if (!hasData) {
      showToast('warning', 'No Report Data', 'Create tournament data before printing.');
      return;
    }
    window.print();
    showToast('info', 'Print Command', 'Opening system print preview.');
  };

  const handleDownloadCSV = () => {
    if (!hasData) {
      showToast('warning', 'No Report Data', 'Create tournament data before exporting.');
      return;
    }

    let csvContent = '';
    let fileName = '';

    if (selectedReport === 'points-table') {
      fileName = `${settings.tournamentName.replace(/\s+/g, '_')}_Points_Table.csv`;
      csvContent = 'Pos,Team,Played,Won,Lost,Tied,Points,NRR\n' +
        standings.map((s: Standing, idx: number) => {
          const t = teams.find((tm: Team) => tm.id === s.teamId)?.name || 'Team';
          return `${idx + 1},"${t}",${s.played},${s.won},${s.lost},${s.tied},${s.points},${s.nrr}\n`;
        }).join('');
    } else if (selectedReport === 'players-list') {
      fileName = `${settings.tournamentName.replace(/\s+/g, '_')}_Players_Master.csv`;
      csvContent = 'ID,Name,Role,Category,Team,Base Price,Auction Price,Status\n' +
        players.map((p: Player) => {
          const t = teams.find((tm: Team) => tm.id === p.teamId)?.name || 'Unassigned';
          return `"${p.playerId}","${p.name}","${p.role}","${p.category}","${t}",${p.basePrice},${p.auctionPrice},"${p.status}"\n`;
        }).join('');
    } else {
      fileName = `${settings.tournamentName.replace(/\s+/g, '_')}_${selectedReport}.csv`;
      csvContent = 'Report,Generated At,Tournament\n' + `"${selectedReport}","${new Date().toISOString()}","${settings.tournamentName}"\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    showToast('success', 'Report Exported', `${fileName} downloaded.`);
  };

  const reportTypes = [
    { id: 'tournament-summary', name: 'Tournament Summary', icon: Trophy },
    { id: 'points-table', name: 'Official Points Table', icon: FileText },
    { id: 'players-list', name: 'Player Master Roster', icon: Users },
    { id: 'teams-list', name: 'Team Profiles & Purses', icon: Shield },
    { id: 'fixtures-schedule', name: 'Fixtures & Results', icon: Calendar },
    { id: 'batting-leaderboard', name: 'Batting Leaderboard', icon: FileText },
    { id: 'auction-report', name: 'Auction Master Report', icon: Gavel },
  ];

  const totalPurseSum = teams.reduce((acc, t) => acc + (t.totalPurse || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner (hidden in print) */}
      <div className="no-print bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950 font-sans">
              PRINT REPORTS
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#111111] text-[#D8AD28] text-xs font-black tracking-wider">
              OFFICIAL DOCUMENTS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Generate print-ready tournament documents, official standings, team rosters, and auction audit sheets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider transition"
          >
            <Download className="w-4 h-4 text-gray-400" />
            <span>DOWNLOAD CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition"
          >
            <Printer className="w-4 h-4 stroke-[3]" />
            <span>PRINT REPORT</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Pills (hidden in print) */}
      <div className="no-print bg-white rounded-2xl p-3 border border-gray-200/90 shadow-subtle flex items-center gap-2 overflow-x-auto">
        {reportTypes.map((rt) => {
          const isSelected = selectedReport === rt.id;
          const Icon = rt.icon;
          return (
            <button
              key={rt.id}
              type="button"
              onClick={() => setSelectedReport(rt.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition ${
                isSelected
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D8AD28]' : 'text-gray-400'}`} />
              <span>{rt.name}</span>
            </button>
          );
        })}
      </div>

      {/* PRINTABLE PREVIEW SHEET CONTAINER */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/90 shadow-card print-card max-w-5xl mx-auto">
        {/* Official Header */}
        <div className="border-b-2 border-gray-950 pb-6 mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-gray-950 tracking-tight">{settings.tournamentName || 'TOURNAMENT'}</span>
              <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-[#D8AD28] text-black">
                OFFICIAL REPORT
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-800 uppercase mt-1">
              {reportTypes.find((r) => r.id === selectedReport)?.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Season: {settings.season || '2026'} • {settings.edition || 'Official Edition'} {settings.defaultVenue ? `• Default Venue: ${settings.defaultVenue}` : ''}
            </p>
          </div>

          <div className="text-right text-xs text-gray-500 font-mono">
            <div>Date: <strong className="text-gray-900">{new Date().toLocaleDateString()}</strong></div>
            <div>Time: <strong className="text-gray-900">{new Date().toLocaleTimeString()}</strong></div>
            <div className="text-[10px] text-gray-400 mt-1 uppercase">TOURNAMENT AUDIT SYSTEM</div>
          </div>
        </div>

        {!hasData ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black uppercase tracking-tight text-gray-950">
              NO REPORT DATA AVAILABLE
            </h4>
            <p className="text-xs text-gray-500 font-medium mt-1 max-w-md">
              Reports will become available after tournament data is created.
            </p>
          </div>
        ) : (
          <>
            {/* REPORT CONTENT: Points Table */}
            {selectedReport === 'points-table' && (
              <div className="space-y-6">
                {standings.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-8 text-center">No standings data available. Add teams to generate points table.</p>
                ) : (
                  <table className="w-full text-left text-xs border border-gray-200">
                    <thead className="bg-gray-100 font-black text-gray-700 uppercase">
                      <tr>
                        <th className="p-3 border-b">POS</th>
                        <th className="p-3 border-b">TEAM FRANCHISE</th>
                        <th className="p-3 border-b text-center">PLAYED</th>
                        <th className="p-3 border-b text-center">WON</th>
                        <th className="p-3 border-b text-center">LOST</th>
                        <th className="p-3 border-b text-center">TIED</th>
                        <th className="p-3 border-b text-center">POINTS</th>
                        <th className="p-3 border-b text-right">NET RUN RATE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {standings.map((st: Standing, idx: number) => {
                        const team = teams.find((t: Team) => t.id === st.teamId);
                        return (
                          <tr key={st.teamId} className="even:bg-gray-50/50">
                            <td className="p-3 font-bold text-gray-900">{idx + 1}</td>
                            <td className="p-3 font-bold text-gray-950">{team?.name || 'Team'}</td>
                            <td className="p-3 text-center">{st.played}</td>
                            <td className="p-3 text-center font-bold text-emerald-700">{st.won}</td>
                            <td className="p-3 text-center text-rose-600">{st.lost}</td>
                            <td className="p-3 text-center">{st.tied}</td>
                            <td className="p-3 text-center font-black text-sm">{st.points}</td>
                            <td className="p-3 text-right font-mono font-bold">
                              {st.nrr >= 0 ? `+${st.nrr.toFixed(3)}` : st.nrr.toFixed(3)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* REPORT CONTENT: Tournament Summary */}
            {selectedReport === 'tournament-summary' && (
              <div className="space-y-6 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-gray-500 font-bold uppercase block text-[10px]">Total Franchises</span>
                    <span className="text-2xl font-black text-gray-900 mt-1 block">{teams.length}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-gray-500 font-bold uppercase block text-[10px]">Total Players</span>
                    <span className="text-2xl font-black text-gray-900 mt-1 block">{players.length}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-gray-500 font-bold uppercase block text-[10px]">Total Fixtures</span>
                    <span className="text-2xl font-black text-gray-900 mt-1 block">{matches.length}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-gray-500 font-bold uppercase block text-[10px]">Total Purse Allocated</span>
                    <span className="text-2xl font-black text-gray-900 mt-1 block">
                      {totalPurseSum > 0 ? `LKR ${(totalPurseSum / 10000000).toFixed(2)} Cr` : '0'}
                    </span>
                  </div>
                </div>

                {teams.length > 0 && (
                  <div className="pt-4">
                    <h4 className="font-bold text-sm text-gray-900 uppercase mb-3">Participating Franchises</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {teams.map((t: Team) => (
                        <div key={t.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <span className="font-black text-gray-900 block">{t.name} ({t.shortName})</span>
                          <span className="text-gray-500 text-[11px]">
                            Captain: {t.captain || 'None'} {t.coach ? `• Coach: ${t.coach}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REPORT CONTENT: Player Master Roster */}
            {selectedReport === 'players-list' && (
              <div>
                {players.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-8 text-center">No player records available.</p>
                ) : (
                  <table className="w-full text-left text-xs border border-gray-200">
                    <thead className="bg-gray-100 font-black text-gray-700 uppercase">
                      <tr>
                        <th className="p-2.5 border-b">ID</th>
                        <th className="p-2.5 border-b">PLAYER NAME</th>
                        <th className="p-2.5 border-b">ROLE</th>
                        <th className="p-2.5 border-b">CATEGORY</th>
                        <th className="p-2.5 border-b">TEAM</th>
                        <th className="p-2.5 border-b">STATUS</th>
                        <th className="p-2.5 border-b text-right">AUCTION PRICE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {players.map((p: Player) => {
                        const team = teams.find((t: Team) => t.id === p.teamId);
                        return (
                          <tr key={p.id} className="even:bg-gray-50/50">
                            <td className="p-2 font-mono font-bold text-gray-500">{p.playerId}</td>
                            <td className="p-2 font-bold text-gray-950">{p.name}</td>
                            <td className="p-2">{p.role}</td>
                            <td className="p-2 uppercase font-semibold text-gray-700">{p.category}</td>
                            <td className="p-2 font-semibold">{team?.name || 'Unassigned'}</td>
                            <td className="p-2">{p.status}</td>
                            <td className="p-2 text-right font-mono font-bold">
                              {p.auctionPrice > 0 ? `LKR ${(p.auctionPrice / 100000).toFixed(2)}L` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* REPORT CONTENT: Team Profiles */}
            {selectedReport === 'teams-list' && (
              <div>
                {teams.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-8 text-center">No team records available.</p>
                ) : (
                  <table className="w-full text-left text-xs border border-gray-200">
                    <thead className="bg-gray-100 font-black text-gray-700 uppercase">
                      <tr>
                        <th className="p-2.5 border-b">FRANCHISE</th>
                        <th className="p-2.5 border-b">SHORT</th>
                        <th className="p-2.5 border-b">CAPTAIN</th>
                        <th className="p-2.5 border-b">COACH</th>
                        <th className="p-2.5 border-b">TOTAL PURSE</th>
                        <th className="p-2.5 border-b">SPENT</th>
                        <th className="p-2.5 border-b text-right">PURSE REMAINING</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teams.map((t: Team) => (
                        <tr key={t.id} className="even:bg-gray-50/50">
                          <td className="p-2 font-bold text-gray-950">{t.name}</td>
                          <td className="p-2 font-mono">{t.shortName}</td>
                          <td className="p-2">{t.captain || 'None'}</td>
                          <td className="p-2">{t.coach || 'None'}</td>
                          <td className="p-2 font-mono">LKR {(t.totalPurse / 100000).toFixed(1)}L</td>
                          <td className="p-2 font-mono">LKR {(t.spentPurse / 100000).toFixed(1)}L</td>
                          <td className="p-2 text-right font-mono font-bold text-[#8E6B15]">
                            LKR {((t.totalPurse - t.spentPurse) / 100000).toFixed(1)}L
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* REPORT CONTENT: Fixtures & Results */}
            {selectedReport === 'fixtures-schedule' && (
              <div className="space-y-3">
                {matches.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-8 text-center">No fixtures scheduled.</p>
                ) : (
                  matches.map((m: Match) => {
                    const t1 = teams.find((t: Team) => t.id === m.team1Id);
                    const t2 = teams.find((t: Team) => t.id === m.team2Id);
                    return (
                      <div key={m.id} className="p-3.5 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-gray-400 block text-[10px]">
                            MATCH #{m.matchNumber} • {m.date} at {m.time} • {m.venue}
                          </span>
                          <span className="text-sm font-black text-gray-950">
                            {t1?.name || 'TBD'} vs {t2?.name || 'TBD'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold uppercase text-gray-700 block">{m.status}</span>
                          {m.winMargin && <span className="text-[11px] text-[#8E6B15] font-semibold">{m.winMargin}</span>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* REPORT CONTENT: Batting Leaderboard */}
            {selectedReport === 'batting-leaderboard' && (
              <div>
                {players.filter((p) => (p.stats?.runs || 0) > 0).length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-8 text-center">No match statistics available yet.</p>
                ) : (
                  <table className="w-full text-left text-xs border border-gray-200">
                    <thead className="bg-gray-100 font-black text-gray-700 uppercase">
                      <tr>
                        <th className="p-3 border-b">POS</th>
                        <th className="p-3 border-b">PLAYER</th>
                        <th className="p-3 border-b">TEAM</th>
                        <th className="p-3 border-b text-center">RUNS</th>
                        <th className="p-3 border-b text-center">INNINGS</th>
                        <th className="p-3 border-b text-center">HS</th>
                        <th className="p-3 border-b text-center">STRIKE RATE</th>
                        <th className="p-3 border-b text-right">AVERAGE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[...players].filter((p) => (p.stats?.runs || 0) > 0).sort((a: Player, b: Player) => (b.stats?.runs || 0) - (a.stats?.runs || 0)).map((p: Player, idx: number) => {
                        const team = teams.find((t: Team) => t.id === p.teamId);
                        return (
                          <tr key={p.id} className="even:bg-gray-50/50">
                            <td className="p-3 font-bold text-gray-900">{idx + 1}</td>
                            <td className="p-3 font-bold text-gray-950">{p.name}</td>
                            <td className="p-3">{team?.name || 'Unassigned'}</td>
                            <td className="p-3 text-center font-black text-sm text-gray-900">{p.stats?.runs || 0}</td>
                            <td className="p-3 text-center">{p.stats?.innings || 0}</td>
                            <td className="p-3 text-center font-bold">{p.stats?.highestScore || 0}</td>
                            <td className="p-3 text-center font-mono font-bold text-[#8E6B15]">{p.stats?.strikeRate || 0}</td>
                            <td className="p-3 text-right font-mono font-bold">{p.stats?.average || 0}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer Signoff */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <div>
            <span className="block font-bold text-gray-700 uppercase">Official Verification</span>
            <span>{settings.tournamentName || 'Tournament'} Management Board</span>
          </div>
          <div className="text-right">
            <span className="block font-bold text-gray-700 uppercase">Audit System</span>
            <span>TOURNAMENT CONTROL VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
