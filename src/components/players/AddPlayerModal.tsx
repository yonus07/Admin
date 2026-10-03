import React, { useState, useEffect } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Modal } from '../common/Modal';
import { Player, Role, Category, PlayerStatus } from '../../types';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerToEdit?: Player | null;
}

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
  isOpen,
  onClose,
  playerToEdit
}) => {
  const { teams, players, addPlayer, updatePlayer, settings } = useTournament();

  const isEditing = !!playerToEdit;

  const [name, setName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [phone, setPhone] = useState('+94 77 ');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Batsman');
  const [category, setCategory] = useState<Category>('Gold');
  const [teamId, setTeamId] = useState<string>('unassigned');
  const [basePrice, setBasePrice] = useState<number>(300000);
  const [auctionPrice, setAuctionPrice] = useState<number>(0);
  const [status, setStatus] = useState<PlayerStatus>('Available');
  const [photoUrl, setPhotoUrl] = useState('');
  const [battingStyle, setBattingStyle] = useState<'Right-Handed' | 'Left-Handed'>('Right-Handed');
  const [bowlingStyle, setBowlingStyle] = useState<'Right-Arm Fast' | 'Right-Arm Spin' | 'Left-Arm Fast' | 'Left-Arm Spin' | 'None'>('Right-Arm Fast');
  const [jerseyNumber, setJerseyNumber] = useState<number>(10);

  useEffect(() => {
    if (playerToEdit) {
      setName(playerToEdit.name);
      setPlayerId(playerToEdit.playerId);
      setPhone(playerToEdit.phone);
      setEmail(playerToEdit.email);
      setRole(playerToEdit.role);
      setCategory(playerToEdit.category);
      setTeamId(playerToEdit.teamId || 'unassigned');
      setBasePrice(playerToEdit.basePrice);
      setAuctionPrice(playerToEdit.auctionPrice);
      setStatus(playerToEdit.status);
      setPhotoUrl(playerToEdit.photoUrl || '');
      setBattingStyle(playerToEdit.battingStyle);
      setBowlingStyle(playerToEdit.bowlingStyle || 'None');
      setJerseyNumber(playerToEdit.jerseyNumber || 10);
    } else {
      const nextIdNum = players.length + 1;
      const prefix = (settings.tournamentName || 'PL').split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'PL';
      setPlayerId(`${prefix}-${nextIdNum.toString().padStart(3, '0')}`);
      setName('');
      setPhone('+94 77 ');
      setEmail('');
      setRole('Batsman');
      setCategory('Gold');
      setTeamId('unassigned');
      setBasePrice(300000);
      setAuctionPrice(0);
      setStatus('Available');
      setPhotoUrl('');
      setBattingStyle('Right-Handed');
      setBowlingStyle('None');
      setJerseyNumber(10);
    }
  }, [playerToEdit, isOpen, players.length, settings.tournamentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTeamId = teamId === 'unassigned' ? null : teamId;

    if (isEditing && playerToEdit) {
      updatePlayer(playerToEdit.id, {
        name,
        playerId,
        phone,
        email,
        role,
        category,
        teamId: finalTeamId,
        basePrice,
        auctionPrice,
        status,
        photoUrl,
        battingStyle,
        bowlingStyle,
        jerseyNumber
      });
    } else {
      addPlayer({
        name,
        playerId,
        phone,
        email,
        role,
        category,
        teamId: finalTeamId,
        basePrice,
        auctionPrice,
        status,
        photoUrl,
        battingStyle,
        bowlingStyle,
        jerseyNumber,
        stats: {
          matches: 0,
          innings: 0,
          runs: 0,
          highestScore: 0,
          fifties: 0,
          hundreds: 0,
          strikeRate: 0,
          average: 0,
          wickets: 0,
          bestBowling: '-',
          economy: 0,
          catches: 0
        }
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'EDIT PLAYER DETAILS' : 'ADD NEW PLAYER'}
      subtitle="Register tournament athlete profile and bidding tier"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Full Name & Player ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kumar Sangakkara"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Player ID
            </label>
            <input
              type="text"
              required
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
        </div>

        {/* Row 2: Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="player@tplcricket.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
        </div>

        {/* Row 3: Role, Category & Team */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Playing Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            >
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
              <option value="Wicket Keeper">Wicket Keeper</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Category Tier
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            >
              <option value="Platinum">Platinum (5.0L Base)</option>
              <option value="Gold">Gold (3.5L Base)</option>
              <option value="Silver">Silver (2.0L Base)</option>
              <option value="Emerging">Emerging (1.0L Base)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Assigned Team
            </label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            >
              <option value="unassigned">-- Unassigned Pool --</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Base Price, Auction Price & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Base Price (LKR)
            </label>
            <input
              type="number"
              min="50000"
              step="50000"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Auction Price (LKR)
            </label>
            <input
              type="number"
              min="0"
              step="50000"
              value={auctionPrice}
              onChange={(e) => setAuctionPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PlayerStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            >
              <option value="Available">Available (Auction Pool)</option>
              <option value="Sold">Sold</option>
              <option value="Auctioned">Auctioned</option>
              <option value="Unsold">Unsold</option>
              <option value="Injured">Injured</option>
            </select>
          </div>
        </div>

        {/* Profile Photo URL */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Profile Photo URL
          </label>
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
          />
        </div>

        {/* Buttons */}
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
            className="px-6 py-2.5 rounded-xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition"
          >
            {isEditing ? 'UPDATE PLAYER' : 'SAVE PLAYER'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
