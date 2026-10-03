import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Team, Player } from '../types';
import { CreateTeamModal } from '../components/teams/CreateTeamModal';
import { TeamDetailModal } from '../components/teams/TeamDetailModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TeamLogo } from '../components/common/TeamLogo';
import { Badge } from '../components/common/Badge';
import { Plus, Trash2, Shield } from 'lucide-react';

export const TeamsPage: React.FC = () => {
  const { teams, players, deleteTeam } = useTournament();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950 font-sans">
              TEAMS
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#111111] text-[#D8AD28] text-xs font-black tracking-wider">
              {teams.length} FRANCHISES
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Official tournament franchises, captains, coaches, and auction purse management.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTeam(null);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ CREATE TEAM</span>
        </button>
      </div>

      {/* Teams Content / Empty State */}
      {teams.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/90 shadow-subtle flex flex-col items-center justify-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#D8AD28] flex items-center justify-center mb-4 shadow-2xs">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight text-gray-950 font-sans mb-1">
            NO TEAMS YET
          </h3>
          <p className="text-xs text-gray-500 font-medium mb-6 max-w-sm">
            Create your first team to start building the tournament.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingTeam(null);
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ CREATE TEAM</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {teams.map((team: Team) => {
            const teamPlayers = players.filter((p: Player) => p.teamId === team.id);
            const remainingPurse = team.totalPurse - team.spentPurse;
            const spentPercent = team.totalPurse > 0 ? Math.min(100, Math.round((team.spentPurse / team.totalPurse) * 100)) : 0;

            return (
              <div
                key={team.id}
                className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-subtle hover:shadow-card hover:border-gray-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Team Card Header */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <TeamLogo team={team} size="lg" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-gray-950 uppercase truncate">
                            {team.name}
                          </h3>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">
                            {team.shortName}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          Captain: <strong className="text-gray-800">{team.captain || 'Not appointed'}</strong> {team.coach ? `• Coach: ${team.coach}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge variant={team.status === 'Active' ? 'green' : 'gray'} size="sm">
                        {team.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Squad & Financial Metrics */}
                  <div className="grid grid-cols-3 gap-3 my-4">
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">Squad</span>
                      <span className="text-base font-black text-gray-900">{teamPlayers.length} Players</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">Spent</span>
                      <span className="text-base font-black text-gray-900">LKR {(team.spentPurse / 100000).toFixed(1)}L</span>
                    </div>

                    <div className="p-3 bg-[#FBF5D8] rounded-2xl border border-[#F5E7A6] text-center">
                      <span className="text-[10px] font-bold uppercase text-[#8E6B15] block">Purse Left</span>
                      <span className="text-base font-black text-[#8E6B15]">LKR {(remainingPurse / 100000).toFixed(1)}L</span>
                    </div>
                  </div>

                  {/* Purse Progress Bar */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                      <span>Purse Utilization</span>
                      <span>{spentPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${spentPercent}%`,
                          backgroundColor: team.primaryColor || '#D8AD28'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      type="button"
                      onClick={() => setViewingTeam(team)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs uppercase tracking-wider transition text-center"
                    >
                      VIEW TEAM
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTeam(team);
                        setIsCreateModalOpen(true);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider transition text-center"
                    >
                      EDIT TEAM
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeletingTeam(team)}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Team"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTeam(null);
        }}
        teamToEdit={editingTeam}
      />

      <TeamDetailModal
        isOpen={!!viewingTeam}
        onClose={() => setViewingTeam(null)}
        team={viewingTeam}
        players={players}
      />

      <ConfirmDialog
        isOpen={!!deletingTeam}
        onClose={() => setDeletingTeam(null)}
        onConfirm={() => {
          if (deletingTeam) deleteTeam(deletingTeam.id);
        }}
        title="Delete Team Franchise"
        message={`Are you sure you want to delete ${deletingTeam?.name}? Any signed players will be returned to the unassigned auction pool.`}
        confirmText="Delete Team"
      />
    </div>
  );
};
