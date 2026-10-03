import React from 'react';
import { Player, Team } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { TeamLogo } from '../common/TeamLogo';
import { Phone, Mail, Award, Target, Trophy, DollarSign, Activity } from 'lucide-react';

interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  team: Team | null | undefined;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  isOpen,
  onClose,
  player,
  team
}) => {
  if (!player) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="PLAYER PROFILE" subtitle={player.playerId} maxWidth="xl">
      <div className="space-y-6">
        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-gray-50 p-5 rounded-2xl border border-gray-100">
          {player.photoUrl ? (
            <img
              src={player.photoUrl}
              alt={player.name}
              className="w-24 h-24 rounded-2xl object-cover shadow-sm border-2 border-white flex-shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gray-200 text-gray-800 font-black flex items-center justify-center text-3xl shadow-sm border-2 border-white flex-shrink-0">
              {player.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-950">{player.name}</h3>
              <Badge variant={player.status === 'Sold' ? 'green' : 'amber'} size="sm">
                {player.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-gray-500 font-medium">
              <span className="font-bold text-gray-700">{player.role}</span>
              <span>•</span>
              <span>{player.battingStyle}</span>
              {player.bowlingStyle && player.bowlingStyle !== 'None' && (
                <>
                  <span>•</span>
                  <span>{player.bowlingStyle}</span>
                </>
              )}
            </div>

            {/* Team badge */}
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
              <TeamLogo team={team} size="xs" />
              <span className="text-xs font-bold text-gray-900">
                {team ? team.name : 'Unassigned (Auction Pool)'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-400">Category</p>
            <p className="text-sm font-black text-gray-900 mt-0.5">{player.category}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-400">Base Price</p>
            <p className="text-sm font-black text-gray-900 mt-0.5">LKR {(player.basePrice / 100000).toFixed(2)}L</p>
          </div>
          <div className="p-3 rounded-xl bg-[#FBF5D8] border border-[#F5E7A6] text-center col-span-2 sm:col-span-1">
            <p className="text-[10px] font-bold uppercase text-[#8E6B15]">Auction Price</p>
            <p className="text-sm font-black text-[#8E6B15] mt-0.5">
              {player.auctionPrice > 0 ? `LKR ${(player.auctionPrice / 100000).toFixed(2)}L` : 'Pending'}
            </p>
          </div>
        </div>

        {/* Career Stats Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
            Tournament Performance Statistics
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            <div className="p-2.5 bg-gray-50 rounded-xl text-center border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Matches</div>
              <div className="text-base font-black text-gray-950 mt-0.5">{player.stats.matches}</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl text-center border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Runs</div>
              <div className="text-base font-black text-gray-950 mt-0.5">{player.stats.runs}</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl text-center border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase">HS</div>
              <div className="text-base font-black text-gray-950 mt-0.5">{player.stats.highestScore}</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl text-center border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Strike Rate</div>
              <div className="text-base font-black text-[#8E6B15] mt-0.5">{player.stats.strikeRate}</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl text-center border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Wickets</div>
              <div className="text-base font-black text-gray-950 mt-0.5">{player.stats.wickets}</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl text-center border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase">Best Bowl</div>
              <div className="text-base font-black text-gray-950 mt-0.5">{player.stats.bestBowling}</div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-3">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            <span>{player.phone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span>{player.email}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
