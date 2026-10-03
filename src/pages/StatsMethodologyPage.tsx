import React, { useState } from 'react';
import { 
  Calculator, 
  Award, 
  Target, 
  Sigma, 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

export const StatsMethodologyPage: React.FC = () => {
  // Interactive NRR Simulator state
  const [teamRuns, setTeamRuns] = useState<number>(310);
  const [teamOvers, setTeamOvers] = useState<number>(25.0);
  const [oppRuns, setOppRuns] = useState<number>(270);
  const [oppOvers, setOppOvers] = useState<number>(25.0);

  const calcRunRateFor = teamOvers > 0 ? teamRuns / teamOvers : 0;
  const calcRunRateAgainst = oppOvers > 0 ? oppRuns / oppOvers : 0;
  const calculatedNRR = (calcRunRateFor - calcRunRateAgainst).toFixed(3);

  return (
    <div className="space-y-7 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950 font-sans">
            STATS METHODOLOGY
          </h2>
          <span className="px-3 py-1 rounded-full bg-[#D8AD28] text-gray-950 text-xs font-black tracking-wider">
            OFFICIAL RULEBOOK
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Comprehensive calculation formulas, Net Run Rate (NRR) methodology, and tournament qualification criteria for TPL 2026.
        </p>
      </div>

      {/* INTERACTIVE NRR SIMULATOR */}
      <div className="bg-gradient-to-br from-gray-950 to-gray-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-[#D8AD28]/60 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#D8AD28]/20 flex items-center justify-center text-[#D8AD28]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white">
              INTERACTIVE NET RUN RATE (NRR) SIMULATOR
            </h3>
            <p className="text-xs text-gray-400">
              Simulate tournament scenarios and instant tie-breaker standing shifts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
              Runs Scored (For)
            </label>
            <input
              type="number"
              value={teamRuns}
              onChange={(e) => setTeamRuns(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white font-mono font-bold text-lg"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
              Overs Faced (For)
            </label>
            <input
              type="number"
              step="0.1"
              value={teamOvers}
              onChange={(e) => setTeamOvers(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white font-mono font-bold text-lg"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
              Runs Conceded (Against)
            </label>
            <input
              type="number"
              value={oppRuns}
              onChange={(e) => setOppRuns(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white font-mono font-bold text-lg"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
              Overs Bowled (Against)
            </label>
            <input
              type="number"
              step="0.1"
              value={oppOvers}
              onChange={(e) => setOppOvers(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white font-mono font-bold text-lg"
            />
          </div>
        </div>

        <div className="bg-[#D8AD28]/10 border border-[#D8AD28]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D8AD28]">
              Calculated Net Run Rate:
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-[#D8AD28] mt-0.5">
              {Number(calculatedNRR) >= 0 ? `+${calculatedNRR}` : calculatedNRR}
            </div>
          </div>
          <div className="text-xs text-gray-300 font-mono space-y-1 text-center sm:text-right">
            <div>Runs/Over (For): <strong className="text-white">{calcRunRateFor.toFixed(2)}</strong></div>
            <div>Runs/Over (Against): <strong className="text-white">{calcRunRateAgainst.toFixed(2)}</strong></div>
          </div>
        </div>
      </div>

      {/* METHODOLOGY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batting Statistics Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              🏏
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-gray-950">
                BATTING METRICS FORMULAS
              </h3>
              <p className="text-xs text-gray-400">Standard T20/T10 scoring calculations</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-600">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="font-bold text-gray-900 block mb-1">Strike Rate (SR)</span>
              <code className="text-[11px] text-[#8E6B15] font-mono block bg-amber-50/50 p-1.5 rounded">
                SR = (Runs Scored / Balls Faced) × 100
              </code>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="font-bold text-gray-900 block mb-1">Batting Average</span>
              <code className="text-[11px] text-gray-800 font-mono block bg-white p-1.5 rounded border border-gray-200">
                Average = Total Runs / Total Dismissals (Innings - Not Outs)
              </code>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="font-bold text-gray-900 block mb-1">Boundary Percentage</span>
              <code className="text-[11px] text-gray-800 font-mono block bg-white p-1.5 rounded border border-gray-200">
                Boundary % = ((Fours × 4 + Sixes × 6) / Total Runs) × 100
              </code>
            </div>
          </div>
        </div>

        {/* Bowling Statistics Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              🎯
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-gray-950">
                BOWLING METRICS FORMULAS
              </h3>
              <p className="text-xs text-gray-400">Economy and strike rates</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-600">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="font-bold text-gray-900 block mb-1">Economy Rate (Econ)</span>
              <code className="text-[11px] text-blue-700 font-mono block bg-blue-50/50 p-1.5 rounded">
                Economy = Runs Conceded / (Balls Bowled / 6)
              </code>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="font-bold text-gray-900 block mb-1">Bowling Strike Rate</span>
              <code className="text-[11px] text-gray-800 font-mono block bg-white p-1.5 rounded border border-gray-200">
                Bowling SR = Total Legal Deliveries / Wickets Taken
              </code>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="font-bold text-gray-900 block mb-1">Bowling Average</span>
              <code className="text-[11px] text-gray-800 font-mono block bg-white p-1.5 rounded border border-gray-200">
                Bowling Avg = Runs Conceded / Wickets Taken
              </code>
            </div>
          </div>
        </div>

        {/* Points Calculation System */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              🏆
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-gray-950">
                POINTS CALCULATION SYSTEM
              </h3>
              <p className="text-xs text-gray-400">Official league points allocation</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 font-bold border border-emerald-200">
              <span>Match Victory (Win)</span>
              <span className="font-mono text-sm">2 Points</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-gray-800 font-bold border border-gray-200">
              <span>Tie / No Result / Weather Abandoned</span>
              <span className="font-mono text-sm">1 Point</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 text-rose-800 font-bold border border-rose-200">
              <span>Match Defeat (Loss)</span>
              <span className="font-mono text-sm">0 Points</span>
            </div>
          </div>
        </div>

        {/* Tournament Qualification Rules */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              📋
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-gray-950">
                QUALIFICATION & TIE BREAKERS
              </h3>
              <p className="text-xs text-gray-400">Standings hierarchy rules</p>
            </div>
          </div>

          <ol className="list-decimal list-inside space-y-2 text-xs text-gray-600 font-medium">
            <li className="p-2 bg-gray-50 rounded-lg">
              <strong>Total Points:</strong> Higher points earned in league stage matches.
            </li>
            <li className="p-2 bg-gray-50 rounded-lg">
              <strong>Net Run Rate (NRR):</strong> Superior NRR if teams are tied on points.
            </li>
            <li className="p-2 bg-gray-50 rounded-lg">
              <strong>Head-to-Head Result:</strong> Result between the tied teams during league stage.
            </li>
            <li className="p-2 bg-gray-50 rounded-lg">
              <strong>Super Over / Coin Toss:</strong> As arbitrated by the Tournament Director.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
