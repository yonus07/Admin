import React, { useState, useEffect } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Modal } from '../common/Modal';
import { Team } from '../../types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamToEdit?: Team | null;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  teamToEdit
}) => {
  const { addTeam, updateTeam } = useTournament();
  const isEditing = !!teamToEdit;

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [captain, setCaptain] = useState('');
  const [coach, setCoach] = useState('');
  const [logo, setLogo] = useState('👑');
  const [primaryColor, setPrimaryColor] = useState('#1E3A8A');
  const [secondaryColor, setSecondaryColor] = useState('#D8AD28');
  const [owner, setOwner] = useState('');
  const [totalPurse, setTotalPurse] = useState<number>(10000000);
  const [slogan, setSlogan] = useState('');

  useEffect(() => {
    if (teamToEdit) {
      setName(teamToEdit.name);
      setShortName(teamToEdit.shortName);
      setCaptain(teamToEdit.captain);
      setCoach(teamToEdit.coach);
      setLogo(teamToEdit.logo);
      setPrimaryColor(teamToEdit.primaryColor);
      setSecondaryColor(teamToEdit.secondaryColor);
      setOwner(teamToEdit.owner || '');
      setTotalPurse(teamToEdit.totalPurse);
      setSlogan(teamToEdit.slogan || '');
    } else {
      setName('');
      setShortName('');
      setCaptain('');
      setCoach('');
      setLogo('🏏');
      setPrimaryColor('#111111');
      setSecondaryColor('#D8AD28');
      setOwner('');
      setTotalPurse(10000000);
      setSlogan('');
    }
  }, [teamToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && teamToEdit) {
      updateTeam(teamToEdit.id, {
        name,
        shortName,
        captain,
        coach,
        logo,
        primaryColor,
        secondaryColor,
        owner,
        totalPurse,
        slogan
      });
    } else {
      addTeam({
        name,
        shortName: shortName || name.substring(0, 3).toUpperCase(),
        captain,
        coach,
        logo,
        primaryColor,
        secondaryColor,
        owner,
        totalPurse,
        spentPurse: 0,
        status: 'Active',
        slogan
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'EDIT TEAM' : 'CREATE TEAM'}
      subtitle="Configure franchise identity and auction budget"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Team Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. RIVERSIDE KINGS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Short Code / Initials
            </label>
            <input
              type="text"
              maxLength={4}
              placeholder="e.g. RK"
              value={shortName}
              onChange={(e) => setShortName(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Captain
            </label>
            <input
              type="text"
              required
              placeholder="Captain Name"
              value={captain}
              onChange={(e) => setCaptain(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Head Coach
            </label>
            <input
              type="text"
              placeholder="Coach Name"
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Logo Icon / Emoji
            </label>
            <input
              type="text"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Secondary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Team Owner / Enterprise
            </label>
            <input
              type="text"
              placeholder="e.g. Riverside Holdings"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Total Auction Purse (LKR)
            </label>
            <input
              type="number"
              min="1000000"
              step="500000"
              value={totalPurse}
              onChange={(e) => setTotalPurse(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Team Slogan / Motto
          </label>
          <input
            type="text"
            placeholder="e.g. Reign Supreme"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
          />
        </div>

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
            {isEditing ? 'UPDATE TEAM' : 'CREATE TEAM'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
