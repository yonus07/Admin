import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { TeamLogo } from '../common/TeamLogo';
import { ArrowLeft, Radio, Tv } from 'lucide-react';

export const OBSOverlayView: React.FC = () => {
  const { matches, teams, activeObsMatchId, settings, setViewMode } = useTournament();

  const match = matches.find((m) => m.id === activeObsMatchId) || matches.find((m) => m.status === 'LIVE') || matches[0];
  const team1 = teams.find((t) => t.id === match?.team1Id);
  const team2 = teams.find((t) => t.id === match?.team2Id);

  if (!match) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col justify-between p-6 relative font-sans">
        <div className="flex items-center justify-between no-print">
          <button
            onClick={() => setViewMode('admin')}
            className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase backdrop-blur-md flex items-center gap-2 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit OBS Mode (Back to Admin)</span>
          </button>
        </div>
        <div className="max-w-md mx-auto bg-black/90 text-white p-6 rounded-2xl border border-white/20 text-center">
          <h4 className="text-sm font-bold uppercase">NO ACTIVE MATCH FOR OVERLAY</h4>
          <p className="text-xs text-gray-400 mt-1">Start or schedule a match to render live broadcast overlay.</p>
        </div>
      </div>
    );
  }

  const currentInningNum = match?.currentInning || 1;
  const battingTeam = currentInningNum === 1 ? team1 : team2;
  const bowlingTeam = currentInningNum === 1 ? team2 : team1;
  const battingScore = currentInningNum === 1 ? match?.team1Score : match?.team2Score;

  const batsmenList = battingScore?.batsmen || [];
  const activeStriker = batsmenList.find((b) => b.isOnStrike) || batsmenList[0] || {
    name: battingTeam?.captain || 'Striker',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0
  };

  const bowlersList = battingScore?.bowlers || [];
  const currentBowler = bowlersList.find((b) => b.isCurrentBowler) || bowlersList[0] || {
    name: bowlingTeam?.captain || 'Bowler',
    overs: 0,
    runs: 0,
    wickets: 0
  };

  const crr = battingScore && battingScore.overs > 0 
    ? (battingScore.runs / (Math.floor(battingScore.overs) + (Math.round((battingScore.overs - Math.floor(battingScore.overs)) * 10) / 6))).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-between p-6 relative font-sans">
      {/* Top Controls Bar (hidden during stream capture, visible for testing) */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => setViewMode('admin')}
          className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase backdrop-blur-md flex items-center gap-2 border border-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit OBS Mode (Back to Admin)</span>
        </button>

        <div className="bg-black/80 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase backdrop-blur-md flex items-center gap-2 border border-white/20">
          <Tv className="w-4 h-4 text-[#D8AD28]" />
          <span>OBS Studio Browser Source Mode (1920x1080 Transparent)</span>
        </div>
      </div>

      {/* LOWER THIRD LIVE SCORE BUG */}
      <div className="max-w-4xl mx-auto w-full mb-8">
        <div className="bg-gradient-to-r from-gray-950/95 via-gray-900/95 to-gray-950/95 backdrop-blur-md text-white rounded-3xl border-2 border-[#D8AD28]/80 shadow-2xl overflow-hidden">
          {/* Top Info Bar */}
          <div className="bg-[#111111]/90 px-6 py-2 flex items-center justify-between border-b border-gray-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-black text-[#D8AD28] uppercase tracking-wider">{settings.tournamentName} LIVE</span>
              <span className="text-gray-400">• MATCH #{match?.matchNumber}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-300 font-mono text-[11px]">
              <span>CRR: <strong>{crr}</strong></span>
              {match?.target && match.target > 0 ? (
                <span className="text-[#D8AD28] font-bold">
                  TARGET: {match.target}
                </span>
              ) : null}
            </div>
          </div>

          {/* Main Scorecard Body */}
          <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Batting Team & Runs */}
            <div className="flex items-center gap-4">
              <TeamLogo team={battingTeam} size="lg" />
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase block">
                  {battingTeam?.name || 'Batting Team'}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    {battingScore?.runs || 0}/{battingScore?.wickets || 0}
                  </span>
                  <span className="text-xl font-bold text-gray-400 font-mono">
                    ({battingScore?.overs || 0}/{match?.overs || 5} ov)
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Active Batsman & Current Bowler HUD */}
            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-gray-800 pt-3 md:pt-0 md:pl-6 text-xs w-full md:w-auto justify-between md:justify-end">
              {/* Striker */}
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#D8AD28] flex items-center gap-1">
                  <span>* Striker</span>
                </span>
                <div className="font-bold text-white text-sm">{activeStriker.name}</div>
                <div className="text-gray-400 font-mono">
                  <strong className="text-white">{activeStriker.runs}</strong> ({activeStriker.balls}b) • {activeStriker.fours} 4s • {activeStriker.sixes} 6s
                </div>
              </div>

              {/* Bowler */}
              <div className="space-y-0.5 border-l border-gray-800 pl-6">
                <span className="text-[10px] uppercase font-bold text-gray-400">Bowler</span>
                <div className="font-bold text-white text-sm">{currentBowler.name}</div>
                <div className="text-gray-400 font-mono">
                  {currentBowler.overs} ov • {currentBowler.runs} runs • <strong className="text-emerald-400">{currentBowler.wickets} wkts</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
