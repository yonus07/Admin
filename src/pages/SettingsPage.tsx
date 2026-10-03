import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { TournamentSettings } from '../types';
import { 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Database, 
  Trophy, 
  Gavel, 
  Sliders 
} from 'lucide-react';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const SettingsPage: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetAllFreshTesting, 
    showToast,
    teams,
    players,
    matches,
    staff
  } = useTournament();

  const [formData, setFormData] = useState<TournamentSettings>(settings);
  const [showResetTestingConfirm, setShowResetTestingConfirm] = useState(false);

  const handleChange = (field: keyof TournamentSettings, value: any) => {
    setFormData((prev: TournamentSettings) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleExportJSON = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '2.4.0',
      settings: formData,
      teams,
      players,
      matches,
      staff
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TPL_2026_Full_Backup_${Date.now()}.json`;
    a.click();
    showToast('success', 'Backup Exported', 'Complete tournament JSON snapshot saved.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings) {
          updateSettings(parsed.settings);
          setFormData(parsed.settings);
          showToast('success', 'Backup Restored', 'Tournament data state imported successfully.');
        }
      } catch (err) {
        showToast('error', 'Import Failed', 'Invalid JSON backup format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950 font-sans">
              SETTINGS
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#111111] text-[#D8AD28] text-xs font-black tracking-wider">
              SYSTEM CONFIGURATION
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Global tournament parameters, overs formats, currency units, WhatsApp message templates, and JSON database state.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#D8AD28] hover:bg-[#c99f1f] text-gray-950 text-xs font-black uppercase tracking-wider shadow-xs transition transform active:scale-95"
        >
          <Save className="w-4 h-4 stroke-[3]" />
          <span>SAVE ALL CHANGES</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: TOURNAMENT & ORGANIZATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <Trophy className="w-5 h-5 text-[#D8AD28]" />
            <div>
              <h3 className="text-base font-black uppercase text-gray-950">
                TOURNAMENT IDENTITY & SCHEDULE
              </h3>
              <p className="text-xs text-gray-400">Branding, season dates, and stadium venues</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Tournament Name
              </label>
              <input
                type="text"
                value={formData.tournamentName}
                onChange={(e) => handleChange('tournamentName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Season / Edition
              </label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) => handleChange('season', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Default Stadium Venue
              </label>
              <input
                type="text"
                value={formData.defaultVenue}
                onChange={(e) => handleChange('defaultVenue', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Currency Unit
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Timezone
              </label>
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: MATCH & SCORING RULES */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-black uppercase text-gray-950">
                MATCH & SCORING PARAMETERS
              </h3>
              <p className="text-xs text-gray-400">Overs limits, powerplay settings and penalty runs</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Default Overs Per Inning
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.defaultOvers}
                onChange={(e) => handleChange('defaultOvers', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Powerplay Overs
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.powerplayOvers}
                onChange={(e) => handleChange('powerplayOvers', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Wide Penalty Runs
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.wideRuns}
                onChange={(e) => handleChange('wideRuns', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                No-Ball Penalty Runs
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.noBallRuns}
                onChange={(e) => handleChange('noBallRuns', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: AUCTION & PURSE RULES */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <Gavel className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-black uppercase text-gray-950">
                AUCTION & SQUAD LIMITS
              </h3>
              <p className="text-xs text-gray-400">Total franchise purse ceiling and roster constraints</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Total Franchise Purse (LKR)
              </label>
              <input
                type="number"
                min="1000000"
                step="500000"
                value={formData.totalTeamPurse}
                onChange={(e) => handleChange('totalTeamPurse', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Min. Squad Size
              </label>
              <input
                type="number"
                min="5"
                max="25"
                value={formData.minSquadSize}
                onChange={(e) => handleChange('minSquadSize', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Max. Squad Size
              </label>
              <input
                type="number"
                min="5"
                max="30"
                value={formData.maxSquadSize}
                onChange={(e) => handleChange('maxSquadSize', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold focus:ring-2 focus:ring-[#D8AD28] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: DATA BACKUP & MAINTENANCE */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-black uppercase text-gray-950">
                DATA BACKUP & PERSISTENCE
              </h3>
              <p className="text-xs text-gray-400">Offline state preservation, JSON export, and fresh environment resets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={handleExportJSON}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition flex items-center gap-3 text-left"
            >
              <Download className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-gray-900 uppercase block">Download JSON Backup</span>
                <span className="text-[11px] text-gray-500">Export teams, players, and match scores</span>
              </div>
            </button>

            <label className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition flex items-center gap-3 cursor-pointer">
              <Upload className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-gray-900 uppercase block">Import JSON Backup</span>
                <span className="text-[11px] text-gray-500">Restore complete database from file</span>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowResetTestingConfirm(true)}
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 transition flex items-center gap-3 text-left"
            >
              <RotateCcw className="w-6 h-6 text-rose-600 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-rose-900 uppercase block">Reset for Testing</span>
                <span className="text-[11px] text-rose-600">Restore factory demo matches & squads</span>
              </div>
            </button>
          </div>
        </div>
      </form>

      {/* CONFIRMATION MODALS */}
      <ConfirmDialog
        isOpen={showResetTestingConfirm}
        onClose={() => setShowResetTestingConfirm(false)}
        onConfirm={resetAllFreshTesting}
        title="Factory Reset Tournament Database"
        message="This will overwrite all active matches, live scores, and auction bids with original demo data. Are you sure?"
        confirmText="Confirm Factory Reset"
        isDestructive={true}
      />
    </div>
  );
};
