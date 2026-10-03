import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { TeamLogo } from '../common/TeamLogo';
import { Badge } from '../common/Badge';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Radio, 
  Users, 
  ChevronRight, 
  Trophy,
  Activity,
  Maximize2,
  Tv,
  Share2
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const LiveScorerConsole: React.FC = () => {
  const { 
    matches, 
    teams, 
    players, 
    recordBall, 
    undoLastBall, 
    switchInning, 
    completeMatchManually, 
    activeScorerMatchId, 
    setViewMode, 
    setActiveObsMatchId,
    showToast 
  } = useTournament();

  const match = matches.find((m) => m.id === activeScorerMatchId) || matches.find((m) => m.status === 'LIVE') || matches[0];
  const team1 = teams.find((t) => t.id === match?.team1Id);
  const team2 = teams.find((t) => t.id === match?.team2Id);

  const currentInningNum = match?.currentInning || 1;
  const battingTeam = currentInningNum === 1 ? team1 : team2;
  const bowlingTeam = currentInningNum === 1 ? team2 : team1;
  const battingScore = currentInningNum === 1 ? match?.team1Score : match?.team2Score;
  const targetRuns = match?.target || 0;

  // Custom ball action modals
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [winnerTeamId, setWinnerTeamId] = useState<string>(team1?.id || '');
  const [winMarginText, setWinMarginText] = useState<string>('');
  const [momPlayerName, setMomPlayerName] = useState<string>('');

  if (!match) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center max-w-md">
          <h3 className="text-lg font-bold text-gray-900 uppercase">No Active Match Selected</h3>
          <p className="text-xs text-gray-500 mt-2 mb-6">Select a match from the Tournament Fixture Control list to begin live scoring.</p>
          <button
            onClick={() => setViewMode('admin')}
            className="px-6 py-2.5 rounded-xl bg-[#D8AD28] text-black font-bold text-xs uppercase"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Active striker & bowler detection
  const batsmenList = battingScore?.batsmen || [];
  const activeStriker = batsmenList.find((b) => b.isOnStrike) || batsmenList[0] || {
    name: battingTeam?.captain || 'Striker',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0
  };
  const nonStriker = batsmenList.find((b) => !b.isOnStrike && !b.isOut) || batsmenList[1] || {
    name: 'Non-Striker',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0
  };

  const bowlersList = battingScore?.bowlers || [];
  const currentBowler = bowlersList.find((b) => b.isCurrentBowler) || bowlersList[0] || {
    name: bowlingTeam?.captain || 'Bowler',
    overs: 0,
    runs: 0,
    wickets: 0,
    economy: 0
  };

  const crr = battingScore && battingScore.overs > 0 
    ? (battingScore.runs / (Math.floor(battingScore.overs) + (Math.round((battingScore.overs - Math.floor(battingScore.overs)) * 10) / 6))).toFixed(2)
    : '0.00';

  const ballsRemaining = Math.max(0, match.overs * 6 - (Math.floor(battingScore?.overs || 0) * 6 + Math.round(((battingScore?.overs || 0) - Math.floor(battingScore?.overs || 0)) * 10)));
  const runsNeeded = targetRuns > 0 ? Math.max(0, targetRuns - (battingScore?.runs || 0)) : 0;
  const rrr = targetRuns > 0 && ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : '0.00';

  // Handle standard ball click
  const handleScoreRun = (runs: number) => {
    recordBall(match.id, {
      inning: currentInningNum as 1 | 2,
      over: Math.floor(battingScore?.overs || 0),
      ballNumber: Math.round(((battingScore?.overs || 0) - Math.floor(battingScore?.overs || 0)) * 10) + 1,
      runs,
      isWicket: false,
      extraRuns: 0,
      bowlerName: currentBowler.name,
      batsmanName: activeStriker.name,
      commentary: runs === 6 ? 'SIX! Clean hit over boundary!' : runs === 4 ? 'FOUR! Smashed to fence!' : runs === 1 ? 'Single taken.' : `${runs} runs scored.`
    });

    // Check if target is achieved
    if (currentInningNum === 2 && targetRuns > 0 && (battingScore?.runs || 0) + runs >= targetRuns) {
      confetti({ particleCount: 150, spread: 80 });
      showToast('success', 'Match Finished!', `${battingTeam?.name} chased the target successfully!`);
    }
  };

  const handleExtra = (extraType: 'wide' | 'noBall' | 'bye' | 'legBye', extraRuns = 1) => {
    recordBall(match.id, {
      inning: currentInningNum as 1 | 2,
      over: Math.floor(battingScore?.overs || 0),
      ballNumber: Math.round(((battingScore?.overs || 0) - Math.floor(battingScore?.overs || 0)) * 10) + 1,
      runs: 0,
      isWicket: false,
      extraType,
      extraRuns,
      bowlerName: currentBowler.name,
      batsmanName: activeStriker.name,
      commentary: `${extraType.toUpperCase()} conceded (${extraRuns} runs).`
    });
  };

  const handleWicket = (wicketType: string) => {
    recordBall(match.id, {
      inning: currentInningNum as 1 | 2,
      over: Math.floor(battingScore?.overs || 0),
      ballNumber: Math.round(((battingScore?.overs || 0) - Math.floor(battingScore?.overs || 0)) * 10) + 1,
      runs: 0,
      isWicket: true,
      wicketType,
      extraRuns: 0,
      bowlerName: currentBowler.name,
      batsmanName: activeStriker.name,
      commentary: `OUT! ${activeStriker.name} dismissed (${wicketType}).`
    });
    setShowWicketModal(false);
  };

  const handleFinishMatch = () => {
    const winner = teams.find((t) => t.id === winnerTeamId);
    const defaultMargin = `${winner?.name || 'Winner'} won the match!`;
    completeMatchManually(match.id, winnerTeamId, winMarginText || defaultMargin, momPlayerName);
    confetti({ particleCount: 200, spread: 100 });
    setShowCompleteModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-950 flex flex-col font-sans select-none">
      {/* Top Scorer Header Bar */}
      <div className="bg-gray-950 text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setViewMode('admin')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold uppercase tracking-wider transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase text-[#D8AD28]">
                MATCH #{match.matchNumber} SCORER CONSOLE
              </span>
              <Badge variant="green" dot size="sm">LIVE</Badge>
            </div>
            <p className="text-[11px] text-gray-400">
              {team1?.name} vs {team2?.name} • {match.venue} ({match.overs} Overs)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-mono">
            <span className="text-gray-400">SCORER PIN:</span>
            <span className="font-black text-[#D8AD28]">{match.scorerPin}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveObsMatchId(match.id);
              setViewMode('obs');
            }}
            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold uppercase tracking-wider text-gray-200 transition flex items-center gap-1.5"
            title="Launch OBS Graphics Overlay"
          >
            <Tv className="w-3.5 h-3.5 text-[#D8AD28]" />
            <span>OBS HUD</span>
          </button>
        </div>
      </div>

      {/* MAIN SCORER CONSOLE BODY */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Scorecard & Touch Keypad */}
        <div className="lg:col-span-2 space-y-5">
          {/* Main Giant Score Display Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <TeamLogo team={battingTeam} size="md" />
                <div>
                  <span className="text-xs font-extrabold tracking-wider text-gray-400 uppercase">
                    INNING {currentInningNum} • BATTING
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-950 uppercase">
                    {battingTeam?.name}
                  </h2>
                </div>
              </div>

              {/* Target Banner if 2nd Inning */}
              {currentInningNum === 2 && targetRuns > 0 && (
                <div className="bg-[#FBF5D8] border border-[#F5E7A6] px-4 py-2 rounded-2xl text-right">
                  <span className="text-[10px] uppercase font-bold text-[#8E6B15] block">Target</span>
                  <span className="text-base font-black text-[#8E6B15] font-mono">
                    Need {runsNeeded} off {ballsRemaining}b (RRR {rrr})
                  </span>
                </div>
              )}
            </div>

            {/* Giant Score Numbers */}
            <div className="my-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl sm:text-6xl font-black text-gray-950 tracking-tight font-mono">
                  {battingScore?.runs || 0}/{battingScore?.wickets || 0}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-gray-500 font-mono">
                  ({battingScore?.overs || 0} / {match.overs} ov)
                </span>
              </div>

              <div className="flex items-center gap-5 text-xs text-gray-600 font-bold border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">CRR</span>
                  <span className="text-sm font-black text-gray-900 font-mono">{crr}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Extras</span>
                  <span className="text-sm font-black text-gray-900 font-mono">
                    {(battingScore?.extras.wides || 0) + (battingScore?.extras.noBalls || 0) + (battingScore?.extras.byes || 0) + (battingScore?.extras.legByes || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Max Overs</span>
                  <span className="text-sm font-black text-gray-900 font-mono">{match.overs}.0</span>
                </div>
              </div>
            </div>

            {/* Batsmen on Crease Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Striker */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-black uppercase text-gray-900">{activeStriker.name} *</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {activeStriker.fours} 4s • {activeStriker.sixes} 6s • SR {activeStriker.strikeRate}
                  </span>
                </div>
                <div className="text-right font-mono font-black text-gray-950 text-base">
                  {activeStriker.runs} <span className="text-xs text-gray-500 font-normal">({activeStriker.balls})</span>
                </div>
              </div>

              {/* Non-Striker */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-300" />
                    <span className="text-xs font-bold uppercase text-gray-700">{nonStriker.name}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {nonStriker.fours} 4s • {nonStriker.sixes} 6s • SR {nonStriker.strikeRate}
                  </span>
                </div>
                <div className="text-right font-mono font-black text-gray-950 text-base">
                  {nonStriker.runs} <span className="text-xs text-gray-500 font-normal">({nonStriker.balls})</span>
                </div>
              </div>
            </div>

            {/* Bowler Bar */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase text-gray-500">Bowler:</span>
                <span className="font-bold text-gray-900">{currentBowler.name}</span>
              </div>
              <div className="flex items-center gap-4 font-mono font-semibold text-gray-700">
                <span>{currentBowler.overs} ov</span>
                <span>{currentBowler.runs} runs</span>
                <span className="font-black text-emerald-700">{currentBowler.wickets} wkts</span>
                <span className="text-gray-400">Econ {currentBowler.economy}</span>
              </div>
            </div>
          </div>

          {/* GIANT TOUCH-FRIENDLY SCORING KEYPAD */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                TOUCH SCORING KEYPAD
              </span>
              <button
                type="button"
                onClick={() => undoLastBall(match.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-700 uppercase transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                <span>UNDO BALL</span>
              </button>
            </div>

            {/* Run Buttons: 0, 1, 2, 3, 4, 6 */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[0, 1, 2, 3, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleScoreRun(num)}
                  className={`h-16 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl font-mono shadow-xs active:scale-95 transition flex items-center justify-center ${
                    num === 6
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : num === 4
                      ? 'bg-[#1E3A8A] hover:bg-blue-900 text-white'
                      : 'bg-[#111111] hover:bg-black text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Special Deliveries & Extras Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowWicketModal(true)}
                className="h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider transition shadow-2xs"
              >
                🔴 WICKET
              </button>
              <button
                type="button"
                onClick={() => handleExtra('wide', 1)}
                className="h-12 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs uppercase tracking-wider transition"
              >
                WIDE (+1)
              </button>
              <button
                type="button"
                onClick={() => handleExtra('noBall', 1)}
                className="h-12 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs uppercase tracking-wider transition"
              >
                NO BALL (+1)
              </button>
              <button
                type="button"
                onClick={() => handleExtra('bye', 1)}
                className="h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider transition"
              >
                BYE
              </button>
              <button
                type="button"
                onClick={() => handleExtra('legBye', 1)}
                className="h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider transition col-span-2 sm:col-span-1"
              >
                LEG BYE
              </button>
            </div>

            {/* Bottom Actions Row: Switch Innings / End Match */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => switchInning(match.id)}
                className="py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-800 font-black text-xs uppercase tracking-wider transition"
              >
                🔄 SWITCH INNINGS ({currentInningNum === 1 ? 'START INN 2' : 'BACK TO INN 1'})
              </button>
              <button
                type="button"
                onClick={() => setShowCompleteModal(true)}
                className="py-3 rounded-xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 font-black text-xs uppercase tracking-wider transition shadow-xs"
              >
                🏆 FINALIZE RESULT
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Ball by Ball Commentary Timeline */}
        <div className="space-y-5">
          {/* Recent Deliveries */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-950">
                  BALL-BY-BALL LOG
                </h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                {match.recentBalls?.length || 0} DELIVERIES
              </span>
            </div>

            {(!match.recentBalls || match.recentBalls.length === 0) ? (
              <div className="p-8 bg-gray-50 rounded-2xl text-center text-xs text-gray-500">
                No deliveries recorded yet. Tap any run button on the keypad.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[550px] overflow-y-auto">
                {match.recentBalls.map((ball) => (
                  <div
                    key={ball.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                      ball.isWicket
                        ? 'bg-rose-50 border-rose-200'
                        : ball.runs === 6
                        ? 'bg-purple-50 border-purple-200'
                        : ball.runs === 4
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                        <span>OV {ball.over}.{ball.ballNumber}</span>
                        <span>•</span>
                        <span>{ball.bowlerName} to {ball.batsmanName}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 mt-0.5 truncate">
                        {ball.commentary}
                      </p>
                    </div>

                    <div className="flex-shrink-0 ml-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-sm ${
                        ball.isWicket
                          ? 'bg-rose-600 text-white'
                          : ball.runs === 6
                          ? 'bg-purple-600 text-white'
                          : ball.runs === 4
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        {ball.isWicket ? 'W' : ball.extraType ? (ball.extraType === 'wide' ? 'Wd' : 'Nb') : ball.runs}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WICKET MODAL */}
      <Modal
        isOpen={showWicketModal}
        onClose={() => setShowWicketModal(false)}
        title="RECORD WICKET DISMISSAL"
        subtitle={`Select dismissal type for ${activeStriker.name}`}
        maxWidth="md"
      >
        <div className="grid grid-cols-2 gap-3 p-2">
          {['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleWicket(type)}
              className="py-3 rounded-xl bg-gray-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-gray-200 text-xs font-bold uppercase tracking-wider transition"
            >
              {type}
            </button>
          ))}
        </div>
      </Modal>

      {/* FINALIZE MATCH RESULT MODAL */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="FINALIZE MATCH RESULT"
        subtitle="Declare winner, margin and Player of the Match"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Winning Franchise
            </label>
            <select
              value={winnerTeamId}
              onChange={(e) => setWinnerTeamId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            >
              <option value={team1?.id}>{team1?.name}</option>
              <option value={team2?.id}>{team2?.name}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Win Margin Statement
            </label>
            <input
              type="text"
              placeholder="e.g. Riverside Kings won by 14 runs"
              value={winMarginText}
              onChange={(e) => setWinMarginText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Man of the Match
            </label>
            <input
              type="text"
              placeholder="e.g. Kumar Sangakkara (38 off 12 balls)"
              value={momPlayerName}
              onChange={(e) => setMomPlayerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowCompleteModal(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFinishMatch}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase shadow-xs"
            >
              Confirm Result & Archive
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
