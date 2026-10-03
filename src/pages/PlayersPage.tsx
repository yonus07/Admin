import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Player } from '../types';
import { AddPlayerModal } from '../components/players/AddPlayerModal';
import { PlayerDetailModal } from '../components/players/PlayerDetailModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import { TeamLogo } from '../components/common/TeamLogo';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Eye, 
  Edit, 
  Trash2, 
  Users,
  Download
} from 'lucide-react';

export const PlayersPage: React.FC = () => {
  const { teams, players, deletePlayer, showToast, settings } = useTournament();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const [selectedPlayerForView, setSelectedPlayerForView] = useState<Player | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filtering
  const filteredPlayers = players.filter((p: Player) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.playerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone && p.phone.includes(searchQuery)) ||
      (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTeam = 
      teamFilter === 'ALL' || 
      (teamFilter === 'unassigned' ? !p.teamId : p.teamId === teamFilter);

    const matchesRole = roleFilter === 'ALL' || p.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    return matchesSearch && matchesTeam && matchesRole && matchesStatus && matchesCategory;
  });

  const exportCSV = () => {
    if (players.length === 0) {
      showToast('info', 'No Players to Export', 'Register players to export CSV roster.');
      return;
    }
    const headers = ['Player ID,Name,Role,Category,Team,Base Price,Auction Price,Status,Matches,Runs,Wickets\n'];
    const rows = filteredPlayers.map((p: Player) => {
      const team = teams.find((t) => t.id === p.teamId)?.name || 'Unassigned';
      return `"${p.playerId}","${p.name}","${p.role}","${p.category}","${team}",${p.basePrice},${p.auctionPrice},"${p.status}",${p.stats?.matches || 0},${p.stats?.runs || 0},${p.stats?.wickets || 0}\n`;
    });
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.tournamentName.replace(/\s+/g, '_')}_Players_${Date.now()}.csv`;
    a.click();
    showToast('success', 'Roster Exported', 'CSV roster downloaded successfully.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Actions Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950 font-sans">
              PLAYERS
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#111111] text-[#D8AD28] text-xs font-black tracking-wider">
              {players.length} REGISTERED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Manage player rosters, update bidding tiers, review statistics, and assign franchise contracts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {players.length > 0 && (
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider transition"
            >
              <Download className="w-4 h-4 text-gray-400" />
              <span>EXPORT CSV</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setPlayerToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ ADD PLAYER</span>
          </button>
        </div>
      </div>

      {players.length === 0 ? (
        /* ZERO PLAYERS EMPTY STATE */
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/90 shadow-subtle flex flex-col items-center justify-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight text-gray-950 font-sans mb-1">
            NO PLAYERS YET
          </h3>
          <p className="text-xs text-gray-500 font-medium mb-6 max-w-sm">
            Add your first player.
          </p>
          <button
            type="button"
            onClick={() => {
              setPlayerToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ ADD PLAYER</span>
          </button>
        </div>
      ) : (
        <>
          {/* Filter & Search Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, player ID, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Team Filter */}
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D8AD28] bg-gray-50/50"
              >
                <option value="ALL">All Teams</option>
                <option value="unassigned">Unassigned Pool</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D8AD28] bg-gray-50/50"
              >
                <option value="ALL">All Roles</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket Keeper">Wicket Keeper</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D8AD28] bg-gray-50/50"
              >
                <option value="ALL">All Categories</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Emerging">Emerging</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D8AD28] bg-gray-50/50"
              >
                <option value="ALL">All Status</option>
                <option value="Sold">Sold</option>
                <option value="Available">Available</option>
                <option value="Unsold">Unsold</option>
                <option value="Injured">Injured</option>
              </select>

              {/* Table / Grid Mode Toggle */}
              <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'table' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'cards' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Grid Cards View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filtered Players Content */}
          {filteredPlayers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-gray-900 uppercase">No Players Match Filter</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          ) : viewMode === 'table' ? (
            /* TABLE VIEW */
            <div className="bg-white rounded-3xl border border-gray-200/90 shadow-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-400 font-black uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-5">PLAYER</th>
                      <th className="py-4 px-4">ROLE</th>
                      <th className="py-4 px-4">TEAM</th>
                      <th className="py-4 px-4">CATEGORY</th>
                      <th className="py-4 px-4">BASE PRICE</th>
                      <th className="py-4 px-4">AUCTION PRICE</th>
                      <th className="py-4 px-4">STATUS</th>
                      <th className="py-4 px-5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPlayers.map((player: Player) => {
                      const team = teams.find((t) => t.id === player.teamId);

                      let statusVariant: 'green' | 'amber' | 'gray' | 'red' = 'gray';
                      if (player.status === 'Sold') statusVariant = 'green';
                      else if (player.status === 'Available') statusVariant = 'amber';
                      else if (player.status === 'Injured') statusVariant = 'red';

                      return (
                        <tr key={player.id} className="hover:bg-gray-50/60 transition">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              {player.photoUrl ? (
                                <img
                                  src={player.photoUrl}
                                  alt={player.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 font-black flex items-center justify-center text-sm border border-gray-200 flex-shrink-0">
                                  {player.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-gray-950 block text-sm">{player.name}</span>
                                <span className="text-[11px] font-mono font-bold text-gray-400">
                                  {player.playerId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-700">{player.role}</td>
                          <td className="py-3.5 px-4">
                            {team ? (
                              <div className="flex items-center gap-2">
                                <TeamLogo team={team} size="xs" />
                                <span className="font-bold text-gray-900">{team.name}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Unassigned Pool</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-gray-900 uppercase text-[11px] px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
                              {player.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-gray-700">
                            LKR {(player.basePrice / 100000).toFixed(2)}L
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#8E6B15]">
                            {player.auctionPrice > 0 ? `LKR ${(player.auctionPrice / 100000).toFixed(2)}L` : '-'}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant={statusVariant} size="sm">
                              {player.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedPlayerForView(player)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition"
                                title="View Profile & Stats"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPlayerToEdit(player);
                                  setIsAddModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition"
                                title="Edit Profile"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPlayerToDelete(player)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Delete Player"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* GRID CARDS VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredPlayers.map((player: Player) => {
                const team = teams.find((t) => t.id === player.teamId);

                return (
                  <div
                    key={player.id}
                    className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-subtle hover:shadow-card hover:border-gray-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {player.photoUrl ? (
                            <img
                              src={player.photoUrl}
                              alt={player.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shadow-2xs"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-700 font-black flex items-center justify-center text-base border border-gray-200">
                              {player.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-gray-950 text-sm leading-tight">{player.name}</h4>
                            <span className="text-[11px] font-mono text-gray-400 font-bold">{player.playerId}</span>
                          </div>
                        </div>

                        <Badge variant="gold" size="sm">
                          {player.category}
                        </Badge>
                      </div>

                      <div className="space-y-1.5 py-3 border-y border-gray-100 text-xs">
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Role:</span>
                          <strong className="text-gray-900">{player.role}</strong>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Team:</span>
                          <strong className="text-gray-900">{team?.shortName || team?.name || 'Unassigned'}</strong>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Base Price:</span>
                          <strong className="font-mono text-gray-900">LKR {(player.basePrice / 100000).toFixed(1)}L</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPlayerForView(player)}
                        className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs uppercase transition text-center"
                      >
                        VIEW
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPlayerToEdit(player);
                          setIsAddModalOpen(true);
                        }}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlayerToDelete(player)}
                        className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* MODALS */}
      <AddPlayerModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setPlayerToEdit(null);
        }}
        playerToEdit={playerToEdit}
      />

      <PlayerDetailModal
        isOpen={!!selectedPlayerForView}
        onClose={() => setSelectedPlayerForView(null)}
        player={selectedPlayerForView}
        team={teams.find((t) => t.id === selectedPlayerForView?.teamId)}
      />

      <ConfirmDialog
        isOpen={!!playerToDelete}
        onClose={() => setPlayerToDelete(null)}
        onConfirm={() => {
          if (playerToDelete) deletePlayer(playerToDelete.id);
        }}
        title="Delete Player Profile"
        message={`Are you sure you want to delete ${playerToDelete?.name}? This will remove all associated auction records.`}
        confirmText="Delete Player"
      />
    </div>
  );
};
