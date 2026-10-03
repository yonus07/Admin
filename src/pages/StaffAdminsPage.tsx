import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { StaffMember } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { 
  Plus, 
  KeyRound, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  UserCog
} from 'lucide-react';

export const StaffAdminsPage: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff, showToast } = useTournament();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [resettingPasswordStaff, setResettingPasswordStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+94 77 ');
  const [role, setRole] = useState<StaffMember['role']>('Scorer');
  const [status, setStatus] = useState<'Active' | 'Disabled'>('Active');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password reset state
  const [newPassword, setNewPassword] = useState('');

  const openAddModal = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setPhone('+94 77 ');
    setRole('Scorer');
    setStatus('Active');
    setAvatarUrl('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone);
    setRole(member.role);
    setStatus(member.status);
    setAvatarUrl(member.avatarUrl);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaff(editingStaff.id, { name, email, phone, role, status, avatarUrl });
    } else {
      addStaff({ name, email, phone, role, status, avatarUrl });
    }
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (member: StaffMember) => {
    const newStatus = member.status === 'Active' ? 'Disabled' : 'Active';
    updateStaff(member.id, { status: newStatus });
    showToast('info', 'Status Updated', `${member.name} is now ${newStatus}.`);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resettingPasswordStaff) {
      showToast('success', 'Password Reset', `Password reset token generated for ${resettingPasswordStaff.email}.`);
      setResettingPasswordStaff(null);
      setNewPassword('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950 font-sans">
              STAFF & ADMINS
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#111111] text-[#D8AD28] text-xs font-black tracking-wider">
              {staff.length} OPERATORS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Manage administrative privileges, scorer credentials, and auctioneer authorization.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ ADD STAFF</span>
        </button>
      </div>

      {/* Staff Table / Empty State */}
      {staff.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/90 shadow-subtle flex flex-col items-center justify-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center mb-4 shadow-2xs">
            <UserCog className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight text-gray-950 font-sans mb-1">
            NO STAFF OPERATORS YET
          </h3>
          <p className="text-xs text-gray-500 font-medium mb-6 max-w-sm">
            Add operators, scorers, or managers to assign administrative access.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ ADD STAFF</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-400 font-black uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">NAME & OPERATOR</th>
                  <th className="py-4 px-4">ROLE</th>
                  <th className="py-4 px-4">CONTACT</th>
                  <th className="py-4 px-4">STATUS</th>
                  <th className="py-4 px-4">LAST ACTIVE</th>
                  <th className="py-4 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staff.map((member: StaffMember) => (
                  <tr key={member.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-sm border border-gray-200 flex-shrink-0">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-gray-950 block text-sm">{member.name}</span>
                          <span className="text-[11px] text-gray-400 font-medium">{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg text-[11px] uppercase border border-gray-200">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 font-mono text-[11px]">
                      {member.phone}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={member.status === 'Active' ? 'green' : 'red'} size="sm">
                        {member.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-500 font-medium text-[11px]">
                      {member.lastActive}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(member)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition"
                          title="Edit Permissions"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setResettingPasswordStaff(member)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition"
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(member)}
                          className={`p-1.5 rounded-lg transition ${
                            member.status === 'Active'
                              ? 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={member.status === 'Active' ? 'Disable Account' : 'Enable Account'}
                        >
                          {member.status === 'Active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingStaff(member)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Operator"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT STAFF MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingStaff ? 'EDIT STAFF PERMISSIONS' : 'ADD NEW STAFF OPERATOR'}
        subtitle="Configure role hierarchy and authorization"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@tournament.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>

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
              System Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StaffMember['role'])}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            >
              <option value="Administrator">Administrator (Full Access)</option>
              <option value="Tournament Manager">Tournament Manager</option>
              <option value="Scorer">Scorer (Live Scoring Only)</option>
              <option value="Auction Manager">Auction Manager</option>
              <option value="Viewer">Viewer (Read Only)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold uppercase text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs"
            >
              {editingStaff ? 'Save Changes' : 'Grant Access'}
            </button>
          </div>
        </form>
      </Modal>

      {/* RESET PASSWORD MODAL */}
      <Modal
        isOpen={!!resettingPasswordStaff}
        onClose={() => setResettingPasswordStaff(null)}
        title="GENERATE PASSWORD RESET"
        subtitle={`Generate new login credentials for ${resettingPasswordStaff?.name}`}
        maxWidth="sm"
      >
        <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new secure password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setResettingPasswordStaff(null)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold uppercase text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-black uppercase"
            >
              Update Password
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={!!deletingStaff}
        onClose={() => setDeletingStaff(null)}
        onConfirm={() => {
          if (deletingStaff) deleteStaff(deletingStaff.id);
        }}
        title="Revoke Staff Access"
        message={`Are you sure you want to remove ${deletingStaff?.name}? Their access tokens will be immediately disabled.`}
        confirmText="Revoke Access"
      />
    </div>
  );
};
