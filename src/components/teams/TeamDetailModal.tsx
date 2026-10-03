import React from 'react';
import { Team, Player } from '../../types';
import { Modal } from '../common/Modal';
import { TeamLogo } from '../common/TeamLogo';
import { Badge } from '../common/Badge';
import { Users, Shield, DollarSign, Award } from 'lucide-react';

interface TeamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  players: Player[];
}

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({
  isOpen,
  onClose,
  team,
  players
}) => {
  if (!team) return null;

  const teamPlayers = players.filter((p) => p.teamId === team.id);
  const remainingPurse = team.totalPurse - team.spentPurse;
  const spentPercent = Math.round((team.spentPurse / team.totalPurse) * 100);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="TEAM PROFILE & SQUAD" subtitle={team.name} maxWidth="2xl">
      <div className="space-y-6">
        {/* Banner */}
        <div
          className="rounded-2xl p-6 text-white relative overflow-hidden shadow-card"
          style={{ backgroundColor: team.primaryColor }}
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-3xl border border-white/20">
              {team.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-2xl font-black tracking-tight">{team.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase">
                  {team.shortName}
                </span>
              </div>
              {team.slogan && <p className="text-xs text-white/80 italic mt-0.5">"{team.slogan}"</p>}
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs">
                <span>Captain: <strong className="text-white">{team.captain}</strong></span>
                <span>•</span>
                <span>Coach: <strong className="text-white">{team.coach}</strong></span>
                {team.owner && (
                  <>
                    <span>•</span>
                    <span>Owner: <strong className="text-white">{team.owner}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Purse Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-400">Squad Size</p>
            <p className="text-base font-black text-gray-900 mt-0.5">{teamPlayers.length} Players</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-400">Total Purse</p>
            <p className="text-base font-black text-gray-900 mt-0.5">LKR {(team.totalPurse / 100000).toFixed(0)}L</p>
          </div>
          <div className="p-3 bg-[#FBF5D8] rounded-xl border border-[#F5E7A6] text-center">
            <p className="text-[10px] font-bold uppercase text-[#8E6B15]">Purse Left</p>
            <p className="text-base font-black text-[#8E6B15] mt-0.5">LKR {(remainingPurse / 100000).toFixed(1)}L</p>
          </div>
        </div>

        {/* Squad Player List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center justify-between">
            <span>OFFICIAL SQUAD ROSTER ({teamPlayers.length})</span>
            <span className="text-[10px] text-gray-400">Avg. Spend: LKR {(teamPlayers.length > 0 ? (team.spentPurse / teamPlayers.length / 100000).toFixed(1) : '0')}L</span>
          </h4>

          {teamPlayers.length === 0 ? (
            <div className="p-8 bg-gray-50 rounded-2xl text-center text-xs text-gray-500">
              No players currently signed to this franchise. Acquire players in Auction Manager.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto border border-gray-100 rounded-2xl">
              {teamPlayers.map((player) => (
                <div key={player.id} className="p-3 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="w-9 h-9 rounded-xl object-cover border border-gray-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {player.name === team.captain && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-extrabold">
                            (C)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {player.role} • {player.category} • {player.stats.matches} Matches ({player.stats.runs} Runs / {player.stats.wickets} Wkts)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-gray-900">
                      LKR {(player.auctionPrice / 100000).toFixed(2)}L
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
