import React, { useState, useEffect } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Modal } from '../common/Modal';
import { Match, MatchType, MatchStatus } from '../../types';

interface EditMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
}

export const EditMatchModal: React.FC<EditMatchModalProps> = ({ isOpen, onClose, match }) => {
  const { teams, updateMatch } = useTournament();

  const [matchNumber, setMatchNumber] = useState<number>(1);
  const [team1Id, setTeam1Id] = useState<string>('');
  const [team2Id, setTeam2Id] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [venue, setVenue] = useState<string>('');
  const [overs, setOvers] = useState<number>(5);
  const [matchType, setMatchType] = useState<MatchType>('League');
  const [status, setStatus] = useState<MatchStatus>('UPCOMING');
  const [scorerPin, setScorerPin] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (match) {
      setMatchNumber(match.matchNumber);
      setTeam1Id(match.team1Id);
      setTeam2Id(match.team2Id);
      setDate(match.date);
      setTime(match.time);
      setVenue(match.venue);
      setOvers(match.overs);
      setMatchType(match.matchType);
      setStatus(match.status);
      setScorerPin(match.scorerPin);
    }
  }, [match]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;

    if (!team1Id || !team2Id) {
      setError('Please select both teams.');
      return;
    }
    if (team1Id === team2Id) {
      setError('Team 1 and Team 2 cannot be the same team!');
      return;
    }

    updateMatch(match.id, {
      matchNumber,
      team1Id,
      team2Id,
      date,
      time,
      venue,
      overs,
      matchType,
      status,
      scorerPin
    });

    onClose();
  };

  if (!match) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`EDIT MATCH #${match.matchNumber}`} subtitle="Update fixture schedules, venues or status" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Match Number
            </label>
            <input
              type="number"
              min="1"
              value={matchNumber}
              onChange={(e) => setMatchNumber(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Match Type
            </label>
            <select
              value={matchType}
              onChange={(e) => setMatchType(e.target.value as MatchType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            >
              <option value="League">League Match</option>
              <option value="Semi Final">Semi Final</option>
              <option value="Final">Grand Final</option>
              <option value="Playoff">Playoff</option>
              <option value="Exhibition">Exhibition</option>
            </select>
          </div>
        </div>

        {/* Teams selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Team 1 (Home)
            </label>
            <select
              value={team1Id}
              onChange={(e) => setTeam1Id(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Team 2 (Away)
            </label>
            <select
              value={team2Id}
              onChange={(e) => setTeam2Id(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Time
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
        </div>

        {/* Venue, Overs, Scorer PIN */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Venue
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Overs
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={overs}
              onChange={(e) => setOvers(Number(e.target.value))}
              required
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Scorer PIN
            </label>
            <input
              type="text"
              value={scorerPin}
              onChange={(e) => setScorerPin(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Match Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MatchStatus)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
          >
            <option value="UPCOMING">UPCOMING</option>
            <option value="LIVE">LIVE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ABANDONED">ABANDONED</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-extrabold uppercase tracking-wider shadow-xs transition"
          >
            SAVE CHANGES
          </button>
        </div>
      </form>
    </Modal>
  );
};
