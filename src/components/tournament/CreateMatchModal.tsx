import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Modal } from '../common/Modal';
import { MatchType, MatchStatus } from '../../types';

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({ isOpen, onClose }) => {
  const { teams, matches, addMatch, showToast } = useTournament();

  const nextMatchNum = matches.length > 0 ? Math.max(...matches.map((m) => m.matchNumber)) + 1 : 1;

  const [matchNumber, setMatchNumber] = useState<number>(nextMatchNum);
  const [team1Id, setTeam1Id] = useState<string>(teams[0]?.id || '');
  const [team2Id, setTeam2Id] = useState<string>(teams[1]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('6:00 PM');
  const [venue, setVenue] = useState<string>('Colombo International Stadium');
  const [overs, setOvers] = useState<number>(5);
  const [matchType, setMatchType] = useState<MatchType>('League');
  const [status, setStatus] = useState<MatchStatus>('UPCOMING');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1Id || !team2Id) {
      setError('Please select both teams.');
      return;
    }
    if (team1Id === team2Id) {
      setError('Team 1 and Team 2 cannot be the same team!');
      return;
    }

    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();

    addMatch({
      matchNumber,
      team1Id,
      team2Id,
      date,
      time,
      venue,
      overs,
      matchType,
      status,
      scorerPin: randomPin
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CREATE SINGLE MATCH" subtitle="Configure fixture parameters and allocate scorer PIN" maxWidth="lg">
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
              onChange={(e) => {
                setTeam1Id(e.target.value);
                setError('');
              }}
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
              onChange={(e) => {
                setTeam2Id(e.target.value);
                setError('');
              }}
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
              placeholder="e.g. 8:00 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
        </div>

        {/* Venue & Overs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Venue
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Overs Per Inning
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={overs}
              onChange={(e) => setOvers(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Initial Match Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MatchStatus)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
          >
            <option value="UPCOMING">UPCOMING</option>
            <option value="LIVE">LIVE</option>
            <option value="COMPLETED">COMPLETED</option>
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
            className="px-6 py-2.5 rounded-xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-extrabold uppercase tracking-wider shadow-xs transition"
          >
            CREATE MATCH
          </button>
        </div>
      </form>
    </Modal>
  );
};
