import React from 'react';
import { GitCommit } from 'lucide-react';
import { Badge } from '../components/common/Badge';

interface Release {
  version: string;
  date: string;
  tag: 'Latest' | 'Stable' | 'Major' | 'Legacy';
  title: string;
  summary: string;
  changes: {
    type: 'feature' | 'improvement' | 'fix';
    text: string;
  }[];
}

export const ChangelogPage: React.FC = () => {
  const releases: Release[] = [
    {
      version: 'v2.4.0',
      date: 'October 2026',
      tag: 'Latest',
      title: 'LIVE SCORER ENGINE & OBS BROADCAST OVERLAY',
      summary: 'Touch-friendly ball-by-ball scoring keypad, undo action history, and transparent browser source HUD for OBS Studio.',
      changes: [
        { type: 'feature', text: 'Touch scoring interface with direct run buttons (0, 1, 2, 3, 4, 6) and extras keypad.' },
        { type: 'feature', text: 'Live OBS broadcast graphics overlay URL generation with animated lower-third score bug.' },
        { type: 'improvement', text: 'Real-time strike rotation, overs increment, and target chase calculation.' },
        { type: 'improvement', text: 'WhatsApp match scorecard link composer for instant media distribution.' }
      ]
    },
    {
      version: 'v2.2.0',
      date: 'September 2026',
      tag: 'Major',
      title: 'IPL-STYLE LIVE AUCTION MANAGER',
      summary: 'Dynamic bidding console with franchise paddle selections, live budget deduction, and confetti hammer celebrations.',
      changes: [
        { type: 'feature', text: 'Franchise paddle bidding selector with instant purse limit validation.' },
        { type: 'feature', text: 'Quick bid increment toggles (+25k, +50k, +100k, +200k).' },
        { type: 'feature', text: 'Auction state persistence and real-time bid history logging.' },
        { type: 'improvement', text: 'Instant contract allocation and squad size limits tracking.' }
      ]
    },
    {
      version: 'v2.0.0',
      date: 'August 2026',
      tag: 'Stable',
      title: 'TOURNAMENT FIXTURE AUTOMATOR & 5-OVERS SUPPORT',
      summary: 'One-click 9-match league schedule generator, knockout brackets, and 4-digit Scorer PIN security tokens.',
      changes: [
        { type: 'feature', text: 'Automated 9-match round-robin fixture matrix generator.' },
        { type: 'feature', text: 'Knockout bracket scheduling (Semi Finals and Grand Final).' },
        { type: 'feature', text: 'Unique Scorer PIN generator for ground referee authentication.' },
        { type: 'improvement', text: '3-column responsive fixture card layout.' }
      ]
    },
    {
      version: 'v1.5.0',
      date: 'July 2026',
      tag: 'Stable',
      title: 'STANDINGS & NET RUN RATE (NRR) ENGINE',
      summary: 'Dynamic points table generator with precise cricket NRR calculations and qualification tie-breakers.',
      changes: [
        { type: 'feature', text: 'Automated Net Run Rate calculator computed from completed scorecards.' },
        { type: 'feature', text: 'Interactive NRR simulator and tournament methodology documentation.' },
        { type: 'improvement', text: 'Top run scorers and top wicket takers real-time leaderboards.' }
      ]
    },
    {
      version: 'v1.0.0',
      date: 'June 2026',
      tag: 'Legacy',
      title: 'INITIAL TPL 2026 ADMIN PORTAL RELEASE',
      summary: 'Core franchise management, athlete profiles, roles, and administrative access control.',
      changes: [
        { type: 'feature', text: 'Franchise team management, logos, colors, and squad rosters.' },
        { type: 'feature', text: 'Player registration, role categories, and base price tiers.' },
        { type: 'feature', text: 'LocalStorage offline persistence architecture.' }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950 font-sans">
            CHANGELOG
          </h2>
          <span className="px-3 py-1 rounded-full bg-[#D8AD28] text-gray-950 text-xs font-black tracking-wider">
            VERSION HISTORY
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Release notes, feature evolutions, and core engine upgrades for the TPL 2026 Premier League Tournament Management System.
        </p>
      </div>

      {/* Timeline of Releases */}
      <div className="relative border-l-2 border-gray-200 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
        {releases.map((rel, idx) => (
          <div key={rel.version} className="relative group">
            {/* Timeline Node Icon */}
            <div className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 rounded-full flex items-center justify-center border-4 border-[#F7F7F7] ${
              idx === 0 ? 'bg-[#D8AD28] text-black shadow-xs' : 'bg-gray-900 text-white'
            }`}>
              <GitCommit className="w-3.5 h-3.5" />
            </div>

            {/* Release Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle space-y-4 hover:border-gray-300 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-gray-950 font-mono tracking-tight">
                    {rel.version}
                  </span>
                  <Badge variant={rel.tag === 'Latest' ? 'gold' : rel.tag === 'Major' ? 'blue' : 'gray'} size="sm">
                    {rel.tag}
                  </Badge>
                </div>
                <span className="text-xs text-gray-400 font-medium">{rel.date}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 uppercase">
                  {rel.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {rel.summary}
                </p>
              </div>

              {/* Changes list */}
              <div className="space-y-2 pt-2">
                {rel.changes.map((ch, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2.5 text-xs text-gray-600">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase flex-shrink-0 mt-0.5 ${
                      ch.type === 'feature'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : ch.type === 'improvement'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {ch.type}
                    </span>
                    <span className="leading-snug">{ch.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
