import React, { useState } from 'react';
import { Match, Team } from '../../types';
import { useTournament } from '../../context/TournamentContext';
import { Badge } from '../common/Badge';
import { TeamLogo } from '../common/TeamLogo';
import { 
  Radio, 
  Copy, 
  Tv, 
  Share2, 
  Edit, 
  Trash2, 
  Play, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  KeyRound,
  ChevronRight
} from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface MatchCardProps {
  match: Match;
  onEdit?: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onEdit }) => {
  const { 
    teams, 
    deleteMatch, 
    setMatchStatus, 
    setViewMode, 
    setActiveScorerMatchId, 
    setActiveObsMatchId,
    showToast 
  } = useTournament();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const team1 = teams.find((t) => t.id === match.team1Id);
  const team2 = teams.find((t) => t.id === match.team2Id);

  const getStatusBadge = () => {
    switch (match.status) {
      case 'LIVE':
        return <Badge variant="green" dot size="sm">LIVE</Badge>;
      case 'COMPLETED':
        return <Badge variant="gold" size="sm">COMPLETED</Badge>;
      case 'UPCOMING':
      default:
        return <Badge variant="gray" size="sm">UPCOMING</Badge>;
    }
  };

  const copyScorerUrl = () => {
    const origin = window.location.origin;
    const url = `${origin}?mode=scorer&matchId=${match.id}&pin=${match.scorerPin}`;
    navigator.clipboard.writeText(url);
    showToast('success', 'Scorer URL Copied!', `PIN: ${match.scorerPin} included.`);
  };

  const copyObsUrl = () => {
    const origin = window.location.origin;
    const url = `${origin}?mode=obs&matchId=${match.id}`;
    navigator.clipboard.writeText(url);
    showToast('success', 'OBS Overlay URL Copied!', 'Add as Browser Source in OBS Studio (1920x1080).');
  };

  const openScorer = () => {
    setActiveScorerMatchId(match.id);
    setViewMode('scorer');
  };

  const openObs = () => {
    setActiveObsMatchId(match.id);
    setViewMode('obs');
  };

  const sendWhatsApp = () => {
    const t1Name = team1?.name || 'Team 1';
    const t2Name = team2?.name || 'Team 2';
    const origin = window.location.origin;
    const liveLink = `${origin}?mode=public&matchId=${match.id}`;
    
    let text = `🏏 *TPL 2026 PREMIER LEAGUE*\n*Match #${match.matchNumber}:* ${t1Name} vs ${t2Name}\n`;
    text += `*Date & Time:* ${match.date} at ${match.time}\n`;
    text += `*Venue:* ${match.venue} (${match.overs} Overs Match)\n`;
    text += `*Status:* ${match.status}\n`;

    if (match.status === 'LIVE' && match.team1Score) {
      text += `*Score:* ${t1Name} ${match.team1Score.runs}/${match.team1Score.wickets} (${match.team1Score.overs} ov)\n`;
    } else if (match.status === 'COMPLETED') {
      text += `*Result:* ${match.winMargin || 'Match finished'}\n`;
    }

    text += `*Follow Live Scorecard:* ${liveLink}`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    showToast('info', 'WhatsApp Share', 'Opening WhatsApp message composer.');
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-subtle hover:shadow-card hover:border-gray-300 transition-all duration-200 flex flex-col justify-between">
        {/* Card Header: Match number and Status Badge */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider text-gray-950 uppercase font-sans">
                MATCH {match.matchNumber}
              </span>
              <span className="text-xs text-gray-400">• {match.matchType}</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              {/* Quick Card Edit/Delete Action Icons */}
              <div className="flex items-center ml-1 border-l border-gray-200 pl-1.5 gap-0.5">
                {onEdit && (
                  <button
                    onClick={() => onEdit(match)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    title="Edit Match"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Match"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Match Info: Time & Overs */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{match.time} • {match.date}</span>
            </div>
            <span className="font-semibold text-gray-700">{match.overs} Overs Match</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400 truncate">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{match.venue}</span>
          </div>

          {/* Teams Display */}
          <div className="my-5 bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
            {/* Team 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <TeamLogo team={team1} size="sm" />
                <span className="text-sm font-bold text-gray-900 truncate">
                  {team1?.name || 'Team 1'}
                </span>
              </div>
              {match.team1Score && (match.status === 'LIVE' || match.status === 'COMPLETED') && (
                <div className="text-right flex-shrink-0">
                  <span className="text-base font-black text-gray-900">
                    {match.team1Score.runs}/{match.team1Score.wickets}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium block">
                    ({match.team1Score.overs} ov)
                  </span>
                </div>
              )}
            </div>

            {/* VS Divider */}
            <div className="relative my-2.5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-[#F9FAFB] px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                VS
              </span>
            </div>

            {/* Team 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <TeamLogo team={team2} size="sm" />
                <span className="text-sm font-bold text-gray-900 truncate">
                  {team2?.name || 'Team 2'}
                </span>
              </div>
              {match.team2Score && (match.status === 'LIVE' || match.status === 'COMPLETED') && (
                <div className="text-right flex-shrink-0">
                  <span className="text-base font-black text-gray-900">
                    {match.team2Score.runs}/{match.team2Score.wickets}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium block">
                    ({match.team2Score.overs} ov)
                  </span>
                </div>
              )}
            </div>

            {/* Win Outcome if Completed */}
            {match.status === 'COMPLETED' && match.winMargin && (
              <div className="mt-3 pt-2.5 border-t border-gray-200 text-center">
                <p className="text-xs font-bold text-[#8E6B15] bg-[#FBF5D8] py-1 px-2.5 rounded-lg inline-block">
                  🏆 {match.winMargin}
                </p>
              </div>
            )}
          </div>

          {/* Scorer PIN section */}
          <div className="flex items-center justify-between bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200/80 mb-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-gray-500">
                SCORER PIN
              </span>
            </div>
            <span className="text-sm font-mono font-black text-gray-950 tracking-widest bg-white px-2.5 py-0.5 rounded-md border border-gray-200 shadow-2xs">
              {match.scorerPin}
            </span>
          </div>
        </div>

        {/* Action Buttons Grid Matching Reference */}
        <div className="space-y-2 pt-1 border-t border-gray-100">
          {/* Row 1: Open Scorer & Copy Scorer URL */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={openScorer}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 font-bold text-xs uppercase tracking-wider transition shadow-2xs"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>OPEN SCORER</span>
            </button>
            <button
              type="button"
              onClick={copyScorerUrl}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider transition"
            >
              <Copy className="w-3.5 h-3.5 text-gray-500" />
              <span>COPY SCORER</span>
            </button>
          </div>

          {/* Row 2: Open OBS & Copy OBS URL */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={openObs}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition shadow-2xs"
            >
              <Tv className="w-3.5 h-3.5 text-[#D8AD28]" />
              <span>OPEN OBS</span>
            </button>
            <button
              type="button"
              onClick={copyObsUrl}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider transition"
            >
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>COPY OBS</span>
            </button>
          </div>

          {/* Row 3: Send WhatsApp */}
          <button
            type="button"
            onClick={sendWhatsApp}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100/70 text-emerald-800 font-bold text-xs uppercase tracking-wider transition"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>SEND WHATSAPP</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteMatch(match.id)}
        title="Delete Match Fixture"
        message={`Are you sure you want to permanently delete Match #${match.matchNumber} (${team1?.name} vs ${team2?.name})?`}
        confirmText="Delete Fixture"
      />
    </>
  );
};
