import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ShieldCheck, 
  Radio, 
  Gavel, 
  Calendar, 
  Tv, 
  HelpCircle 
} from 'lucide-react';

interface ManualSection {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  summary: string;
  content: {
    heading: string;
    steps: string[];
    tips?: string;
  }[];
}

export const SystemManualsPage: React.FC = () => {
  const [openSectionId, setOpenSectionId] = useState<string>('admin-guide');
  const [searchQuery, setSearchQuery] = useState('');

  const manuals: ManualSection[] = [
    {
      id: 'admin-guide',
      title: 'ADMINISTRATOR MASTER GUIDE',
      category: 'Core Operations',
      icon: <ShieldCheck className="w-5 h-5 text-[#D8AD28]" />,
      summary: 'Managing permissions, system health, franchise setups, and tournament configurations.',
      content: [
        {
          heading: 'Access Control & Staff Onboarding',
          steps: [
            'Navigate to "Staff & Admins" in the fixed left sidebar.',
            'Click "+ ADD STAFF" and enter operator email, assigned role, and phone number.',
            'Assign granular permissions (Scorer, Auction Manager, or Tournament Manager).',
            'Staff members will receive active operator tokens and PIN access.'
          ],
          tips: 'Only users with the Administrator role can execute "RESET ALL (FRESH TESTING)".'
        },
        {
          heading: 'Database Backups & State Persistence',
          steps: [
            'Go to "Settings" in the sidebar.',
            'Scroll to "Data Management" and click "Download JSON Backup" to archive data locally.',
            'In case of network failure, restore state using "Import JSON Backup".'
          ]
        }
      ]
    },
    {
      id: 'scorer-guide',
      title: 'LIVE SCORER CONSOLE OPERATOR MANUAL',
      category: 'Match Operations',
      icon: <Radio className="w-5 h-5 text-emerald-600" />,
      summary: 'Ball-by-ball recording, strike rotation, extras accounting, and result finalization.',
      content: [
        {
          heading: 'Live Match Scoring Workflow',
          steps: [
            'Select a scheduled fixture from "Tournament Control" and click "OPEN SCORER".',
            'Use the large touch-friendly keypad to log deliveries (0, 1, 2, 3, 4, 6).',
            'For extras, tap WIDE, NO BALL, BYE, or LEG BYE to automatically calculate extra runs.',
            'For dismissals, tap "🔴 WICKET" and select the dismissal mode (Bowled, Caught, LBW, Run Out).',
            'If a mistake is made, immediately click "UNDO BALL" to reverse the delivery.'
          ],
          tips: 'Scorer PIN is visible on each match card and can be shared with dedicated ground scorers.'
        },
        {
          heading: 'Switching Innings & Finalizing Winner',
          steps: [
            'Once the first inning overs conclude (e.g. 5.0 overs), tap "🔄 SWITCH INNINGS".',
            'The target score will automatically calculate as (Team 1 Runs + 1).',
            'When the match finishes, tap "🏆 FINALIZE RESULT" and enter the Man of the Match.'
          ]
        }
      ]
    },
    {
      id: 'auction-guide',
      title: 'AUCTION MANAGER CONSOLE GUIDE',
      category: 'Player Acquisition',
      icon: <Gavel className="w-5 h-5 text-amber-600" />,
      summary: 'Conducting live IPL-style bidding, managing team budgets, and hammer confirmations.',
      content: [
        {
          heading: 'Conducting a Live Player Auction',
          steps: [
            'Open "Auction Manager" from the sidebar navigation.',
            'Select a player from the "Auction Queue" or spotlight pool.',
            'Select the bidding franchise paddle.',
            'Tap quick bid increment buttons (+25k, +50k, +100k, +200k) to elevate the high bid.',
            'When bidding concludes, hit "SOLD HAMMER 🔨" to deduct team purse and assign player contract.',
            'If no team places a bid, click "MARK UNSOLD" to return player to the reserve pool.'
          ]
        }
      ]
    },
    {
      id: 'fixture-guide',
      title: 'FIXTURE & SCHEDULE AUTOMATION',
      category: 'Tournament Setup',
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      summary: 'Automating round-robin fixtures, scheduling knockout brackets, and resetting testing environments.',
      content: [
        {
          heading: 'Automated Schedule Generator',
          steps: [
            'In "Tournament Control", click "GENERATE SCHEDULE (9 MATCHES)".',
            'The system will generate a balanced round-robin match matrix across all 4 franchises.',
            'Each fixture is allocated date, time slots, stadium venue, and unique 4-digit Scorer PINs.',
            'Click "SCHEDULE KNOCKOUT" once league stages conclude to append Semi Finals and Final.'
          ]
        }
      ]
    },
    {
      id: 'obs-guide',
      title: 'OBS STUDIO BROADCAST OVERLAY INTEGRATION',
      category: 'Live Streaming',
      icon: <Tv className="w-5 h-5 text-purple-600" />,
      summary: 'Live graphics lower-third overlays, transparency keys, and browser source integration.',
      content: [
        {
          heading: 'Setting up OBS Studio Browser Source',
          steps: [
            'On any Match Card, click "COPY OBS URL".',
            'Open OBS Studio and add a new "Browser Source" in your scene.',
            'Paste the copied URL into the URL field.',
            'Set Width to 1920 and Height to 1080.',
            'The lower-third score bug will automatically render with transparent background and animate in real-time!'
          ],
          tips: 'All score updates from Scorer Console sync across tabs and OBS overlays instantly.'
        }
      ]
    }
  ];

  const filteredManuals = manuals.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-950 font-sans">
              SYSTEM MANUALS
            </h2>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-black tracking-wider">
              OPERATOR DOCUMENTATION
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Official step-by-step guides, scorer instructions, auction protocols, and OBS broadcast setups.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search manuals & guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D8AD28] bg-white"
          />
        </div>
      </div>

      {/* Accordion Manuals */}
      <div className="space-y-4">
        {filteredManuals.map((section) => {
          const isOpen = openSectionId === section.id;

          return (
            <div
              key={section.id}
              className="bg-white rounded-3xl border border-gray-200/90 shadow-subtle overflow-hidden transition-all duration-200"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => setOpenSectionId(isOpen ? '' : section.id)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50/70 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-0.5">
                      {section.category}
                    </span>
                    <h3 className="text-base font-black text-gray-950 uppercase tracking-tight">
                      {section.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{section.summary}</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-gray-100 text-gray-600 flex-shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100 space-y-6 animate-fade-in">
                  {section.content.map((item, idx) => (
                    <div key={idx} className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100 space-y-3">
                      <h4 className="text-sm font-bold text-gray-900 uppercase">
                        {idx + 1}. {item.heading}
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-xs text-gray-600 font-medium leading-relaxed">
                        {item.steps.map((step, sIdx) => (
                          <li key={sIdx} className="pl-1">
                            {step}
                          </li>
                        ))}
                      </ol>

                      {item.tips && (
                        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs font-medium text-amber-900 flex items-start gap-2">
                          <span className="font-bold">PRO TIP:</span>
                          <span>{item.tips}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
