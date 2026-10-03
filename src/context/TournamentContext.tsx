import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Team, 
  Player, 
  Match, 
  Standing, 
  StaffMember, 
  TournamentSettings, 
  ActivityLog, 
  AuctionState, 
  Bid, 
  BallRecord,
  MatchStatus
} from '../types';
import { 
  initialTeams, 
  initialPlayers, 
  initialMatches, 
  initialStaff, 
  initialSettings, 
  initialActivities 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

interface TournamentContextType {
  // Authentication
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (email: string, remember: boolean) => void;
  logout: () => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data
  teams: Team[];
  players: Player[];
  matches: Match[];
  staff: StaffMember[];
  settings: TournamentSettings;
  activities: ActivityLog[];
  auctionState: AuctionState;
  standings: Standing[];
  toasts: ToastMessage[];

  // Quick Switch view modes
  viewMode: 'admin' | 'scorer' | 'public' | 'obs';
  setViewMode: (mode: 'admin' | 'scorer' | 'public' | 'obs') => void;
  activeScorerMatchId: string | null;
  setActiveScorerMatchId: (id: string | null) => void;
  activeObsMatchId: string | null;
  setActiveObsMatchId: (id: string | null) => void;

  // Toast
  showToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Player CRUD
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  // Team CRUD
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  // Match CRUD & Fixtures
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  generateSchedule9Matches: () => void;
  scheduleKnockout: () => void;
  resetPendingFixtures: () => void;
  resetAllFreshTesting: () => void;

  // Scoring engine
  recordBall: (matchId: string, ball: Omit<BallRecord, 'id' | 'timestamp'>) => void;
  undoLastBall: (matchId: string) => void;
  setMatchStatus: (matchId: string, status: MatchStatus) => void;
  switchInning: (matchId: string) => void;
  completeMatchManually: (matchId: string, winnerId: string, margin: string, mom?: string) => void;

  // Auction actions
  startAuction: (playerId: string) => void;
  placeBid: (teamId: string, amount: number) => void;
  markPlayerSold: (playerId: string, teamId: string, finalAmount: number) => void;
  markPlayerUnsold: (playerId: string) => void;
  nextAuctionPlayer: () => void;
  previousAuctionPlayer: () => void;
  pauseResumeAuction: () => void;

  // Staff CRUD
  addStaff: (member: Omit<StaffMember, 'id' | 'lastActive'>) => void;
  updateStaff: (id: string, member: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  // Settings
  updateSettings: (newSettings: Partial<TournamentSettings>) => void;
  restoreFactoryDefaults: () => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLEAN_FLAG: 'msl_empty_clean_v1',
  AUTH: 'msl_auth',
  TEAMS: 'msl_teams',
  PLAYERS: 'msl_players',
  MATCHES: 'msl_matches',
  STAFF: 'msl_staff',
  SETTINGS: 'msl_settings',
  ACTIVITIES: 'msl_activities',
  AUCTION: 'msl_auction'
};

// Clear legacy fake data from localStorage on first run
(() => {
  try {
    const isCleaned = localStorage.getItem(STORAGE_KEYS.CLEAN_FLAG);
    if (!isCleaned) {
      localStorage.removeItem(STORAGE_KEYS.TEAMS);
      localStorage.removeItem(STORAGE_KEYS.PLAYERS);
      localStorage.removeItem(STORAGE_KEYS.MATCHES);
      localStorage.removeItem(STORAGE_KEYS.STAFF);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.AUCTION);
      localStorage.setItem(STORAGE_KEYS.CLEAN_FLAG, 'true');
    }
  } catch (e) {
    // Ignore localStorage errors in restricted environments
  }
})();

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('OVERVIEW');
  const [viewMode, setViewMode] = useState<'admin' | 'scorer' | 'public' | 'obs'>('admin');
  const [activeScorerMatchId, setActiveScorerMatchId] = useState<string | null>(null);
  const [activeObsMatchId, setActiveObsMatchId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved).isLoggedIn : true;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved).user : {
      name: 'Administrator',
      email: 'admin@tournament.com',
      role: 'Administrator',
      avatarUrl: ''
    };
  });

  const login = (email: string, remember: boolean) => {
    const user: AuthUser = {
      name: email.includes('scorer') ? 'Official Scorer' : 'Tournament Administrator',
      email,
      role: email.includes('scorer') ? 'Scorer' : 'Administrator',
      avatarUrl: ''
    };

    setIsAuthenticated(true);
    setCurrentUser(user);

    if (remember) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ isLoggedIn: true, user }));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  // Load data from localStorage or defaults (empty state)
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return saved ? JSON.parse(saved) : initialTeams;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return saved ? JSON.parse(saved) : initialPlayers;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return saved ? JSON.parse(saved) : initialMatches;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    return saved ? JSON.parse(saved) : initialStaff;
  });

  const [settings, setSettings] = useState<TournamentSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [auctionState, setAuctionState] = useState<AuctionState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUCTION);
    return saved ? JSON.parse(saved) : {
      currentPlayerId: null,
      currentBid: 0,
      highestBidderTeamId: null,
      isPaused: false,
      bidHistory: [],
      completedCount: 0
    };
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUCTION, JSON.stringify(auctionState));
  }, [auctionState]);

  // Toast Helpers
  const showToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivity = (type: ActivityLog['type'], title: string, description: string) => {
    const newLog: ActivityLog = {
      id: 'act-' + Date.now(),
      type,
      title,
      description,
      timestamp: 'Just now',
      user: currentUser?.name || 'Administrator'
    };
    setActivities((prev) => [newLog, ...prev.slice(0, 24)]);
  };

  // Standings calculation directly from matches and teams
  const standings = useMemo(() => {
    if (teams.length === 0) return [];

    const table: Record<string, Standing> = {};

    teams.forEach((t) => {
      table[t.id] = {
        teamId: t.id,
        played: 0,
        won: 0,
        lost: 0,
        tied: 0,
        noResult: 0,
        points: 0,
        nrr: 0,
        forRuns: 0,
        forOvers: 0,
        againstRuns: 0,
        againstOvers: 0
      };
    });

    matches.forEach((m) => {
      if (m.status === 'COMPLETED') {
        const t1 = table[m.team1Id];
        const t2 = table[m.team2Id];
        if (!t1 || !t2) return;

        t1.played += 1;
        t2.played += 1;

        const t1Runs = m.team1Score?.runs || 0;
        const t1Overs = m.team1Score?.overs || m.overs;
        const t2Runs = m.team2Score?.runs || 0;
        const t2Overs = m.team2Score?.overs || m.overs;

        t1.forRuns += t1Runs;
        t1.forOvers += t1Overs;
        t1.againstRuns += t2Runs;
        t1.againstOvers += t2Overs;

        t2.forRuns += t2Runs;
        t2.forOvers += t2Overs;
        t2.againstRuns += t1Runs;
        t2.againstOvers += t1Overs;

        if (m.winnerId === m.team1Id) {
          t1.won += 1;
          t1.points += 2;
          t2.lost += 1;
        } else if (m.winnerId === m.team2Id) {
          t2.won += 1;
          t2.points += 2;
          t1.lost += 1;
        } else {
          t1.tied += 1;
          t2.tied += 1;
          t1.points += 1;
          t2.points += 1;
        }
      }
    });

    return Object.values(table).map((s) => {
      const runRateFor = s.forOvers > 0 ? s.forRuns / s.forOvers : 0;
      const runRateAgainst = s.againstOvers > 0 ? s.againstRuns / s.againstOvers : 0;
      const nrr = Number((runRateFor - runRateAgainst).toFixed(3));
      return { ...s, nrr };
    }).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.nrr - a.nrr;
    });
  }, [teams, matches]);

  // Player Operations
  const addPlayer = (playerData: Omit<Player, 'id'>) => {
    const id = 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5);
    const newPlayer: Player = { 
      ...playerData, 
      id,
      stats: playerData.stats || {
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
    };
    setPlayers((prev) => [...prev, newPlayer]);
    showToast('success', 'Player Registered', `${newPlayer.name} added to roster.`);
    addActivity('player', 'New Player Registered', `${newPlayer.name} (${newPlayer.role}) registered.`);
  };

  const updatePlayer = (id: string, updatedData: Partial<Player>) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
    showToast('success', 'Player Updated', 'Player details saved.');
  };

  const deletePlayer = (id: string) => {
    const target = players.find((p) => p.id === id);
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    showToast('warning', 'Player Removed', `${target?.name || 'Player'} was removed.`);
    addActivity('player', 'Player Removed', `${target?.name} deleted from records.`);
  };

  // Team Operations
  const addTeam = (teamData: Omit<Team, 'id'>) => {
    const id = 'team-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5);
    const newTeam: Team = { ...teamData, id };
    setTeams((prev) => [...prev, newTeam]);
    showToast('success', 'Team Created', `${newTeam.name} has been created.`);
    addActivity('team', 'New Franchise Registered', `${newTeam.name} created.`);
  };

  const updateTeam = (id: string, updatedData: Partial<Team>) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)));
    showToast('success', 'Team Updated', 'Team profile saved.');
  };

  const deleteTeam = (id: string) => {
    const target = teams.find((t) => t.id === id);
    setTeams((prev) => prev.filter((t) => t.id !== id));
    // Also release assigned players
    setPlayers((prev) => prev.map((p) => p.teamId === id ? { ...p, teamId: null, status: 'Available' } : p));
    showToast('warning', 'Team Removed', `${target?.name || 'Team'} was deleted.`);
  };

  // Match Operations
  const addMatch = (matchData: Omit<Match, 'id'>) => {
    const id = 'match-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5);
    const newMatch: Match = { 
      ...matchData, 
      id,
      team1Score: matchData.team1Score || {
        teamId: matchData.team1Id,
        runs: 0,
        wickets: 0,
        overs: 0,
        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
        batsmen: [],
        bowlers: []
      },
      team2Score: matchData.team2Score || {
        teamId: matchData.team2Id,
        runs: 0,
        wickets: 0,
        overs: 0,
        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
        batsmen: [],
        bowlers: []
      }
    };
    setMatches((prev) => [...prev, newMatch]);
    showToast('success', 'Match Scheduled', `Match #${newMatch.matchNumber} added to fixtures.`);
    addActivity('match', 'New Match Scheduled', `Match #${newMatch.matchNumber} created.`);
  };

  const updateMatch = (id: string, updatedData: Partial<Match>) => {
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m)));
    showToast('success', 'Match Updated', 'Match fixtures updated.');
  };

  const deleteMatch = (id: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
    showToast('warning', 'Match Deleted', 'Fixture removed.');
  };

  const generateSchedule9Matches = () => {
    if (teams.length < 2) {
      showToast('error', 'Cannot Generate Schedule', 'At least 2 teams are required to generate fixtures.');
      return;
    }

    const venues = [settings.defaultVenue || 'Main Ground', 'Arena Stadium', 'Sports Complex'];
    const times = ['3:30 PM', '6:00 PM', '8:15 PM'];
    const generated: Match[] = [];

    let count = 1;
    const targetCount = Math.min(9, Math.max(teams.length * (teams.length - 1), 3));
    
    for (let round = 1; round <= 3 && generated.length < targetCount; round++) {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          if (generated.length >= targetCount) break;
          const matchNum = count++;
          const dayOffset = Math.floor((count - 1) / 2);
          const dateObj = new Date();
          dateObj.setDate(dateObj.getDate() + dayOffset + 1);
          const date = dateObj.toISOString().split('T')[0];
          const pin = Math.floor(1000 + Math.random() * 9000).toString();

          generated.push({
            id: `match-gen-${Date.now().toString(36)}-${matchNum}`,
            matchNumber: matchNum,
            team1Id: round % 2 === 1 ? teams[i].id : teams[j].id,
            team2Id: round % 2 === 1 ? teams[j].id : teams[i].id,
            date,
            time: times[(matchNum - 1) % times.length],
            venue: venues[(matchNum - 1) % venues.length],
            overs: settings.defaultOvers || 5,
            matchType: 'League',
            status: 'UPCOMING',
            scorerPin: pin
          });
        }
      }
    }

    setMatches(generated);
    showToast('success', 'Schedule Generated', `${generated.length} League matches schedule created.`);
    addActivity('match', 'Auto-Schedule Generated', `${generated.length}-match round robin fixture created.`);
  };

  const scheduleKnockout = () => {
    if (teams.length < 4) {
      showToast('error', 'Knockout Setup', 'At least 4 teams are required for knockout brackets.');
      return;
    }
    const today = new Date();
    const sfDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const finalDate = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const knockoutMatches: Match[] = [
      {
        id: `match-sf1-${Date.now()}`,
        matchNumber: matches.length + 1,
        team1Id: teams[0].id,
        team2Id: teams[3].id,
        date: sfDate,
        time: '4:30 PM',
        venue: settings.defaultVenue || 'Main Ground',
        overs: settings.defaultOvers || 5,
        matchType: 'Semi Final',
        status: 'UPCOMING',
        scorerPin: Math.floor(1000 + Math.random() * 9000).toString()
      },
      {
        id: `match-sf2-${Date.now() + 1}`,
        matchNumber: matches.length + 2,
        team1Id: teams[1].id,
        team2Id: teams[2].id,
        date: sfDate,
        time: '7:30 PM',
        venue: settings.defaultVenue || 'Main Ground',
        overs: settings.defaultOvers || 5,
        matchType: 'Semi Final',
        status: 'UPCOMING',
        scorerPin: Math.floor(1000 + Math.random() * 9000).toString()
      },
      {
        id: `match-final-${Date.now() + 2}`,
        matchNumber: matches.length + 3,
        team1Id: teams[0].id,
        team2Id: teams[1].id,
        date: finalDate,
        time: '7:00 PM',
        venue: settings.defaultVenue || 'Main Ground',
        overs: settings.defaultOvers || 5,
        matchType: 'Final',
        status: 'UPCOMING',
        scorerPin: Math.floor(1000 + Math.random() * 9000).toString()
      }
    ];

    setMatches((prev) => [...prev, ...knockoutMatches]);
    showToast('success', 'Knockout Scheduled', 'Semi Finals & Grand Final fixtures scheduled.');
    addActivity('match', 'Knockout Rounds Scheduled', '3 Knockout fixtures added.');
  };

  const resetPendingFixtures = () => {
    setMatches((prev) => prev.filter((m) => m.status === 'COMPLETED'));
    showToast('info', 'Pending Fixtures Reset', 'All upcoming and live matches cleared.');
    addActivity('system', 'Pending Fixtures Cleared', 'Reset pending match schedule.');
  };

  const resetAllFreshTesting = () => {
    setTeams([]);
    setPlayers([]);
    setMatches([]);
    setStaff([]);
    setActivities([]);
    setAuctionState({
      currentPlayerId: null,
      currentBid: 0,
      highestBidderTeamId: null,
      isPaused: false,
      bidHistory: [],
      completedCount: 0
    });
    localStorage.removeItem(STORAGE_KEYS.TEAMS);
    localStorage.removeItem(STORAGE_KEYS.PLAYERS);
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.AUCTION);
    showToast('success', 'Clean State Initialized', 'All tournament records have been reset to empty state.');
  };

  // Live Scoring Engine
  const recordBall = (matchId: string, ballData: Omit<BallRecord, 'id' | 'timestamp'>) => {
    setMatches((prev) => prev.map((m) => {
      if (m.id !== matchId) return m;

      const currentInningNum = m.currentInning || 1;
      const targetInningKey = currentInningNum === 1 ? 'team1Score' : 'team2Score';

      const currentInning = m[targetInningKey] || {
        teamId: currentInningNum === 1 ? m.team1Id : m.team2Id,
        runs: 0,
        wickets: 0,
        overs: 0,
        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
        batsmen: [],
        bowlers: []
      };

      const newRuns = currentInning.runs + ballData.runs + ballData.extraRuns;
      const newWickets = currentInning.wickets + (ballData.isWicket ? 1 : 0);

      const currentOvers = currentInning.overs;
      let completedOvers = Math.floor(currentOvers);
      let ballsInOver = Math.round((currentOvers - completedOvers) * 10);

      const isLegalDelivery = !ballData.extraType || (ballData.extraType !== 'wide' && ballData.extraType !== 'noBall');

      if (isLegalDelivery) {
        ballsInOver += 1;
        if (ballsInOver >= 6) {
          completedOvers += 1;
          ballsInOver = 0;
        }
      }

      const newOversDecimal = Number((completedOvers + ballsInOver * 0.1).toFixed(1));

      const newExtras = { ...currentInning.extras };
      if (ballData.extraType === 'wide') newExtras.wides += ballData.extraRuns || 1;
      if (ballData.extraType === 'noBall') newExtras.noBalls += ballData.extraRuns || 1;
      if (ballData.extraType === 'bye') newExtras.byes += ballData.extraRuns || 1;
      if (ballData.extraType === 'legBye') newExtras.legByes += ballData.extraRuns || 1;

      const updatedBatsmen = [...(currentInning.batsmen || [])];
      let striker = updatedBatsmen.find((b) => b.name === ballData.batsmanName);
      if (striker) {
        striker.runs += ballData.runs;
        if (isLegalDelivery) striker.balls += 1;
        if (ballData.runs === 4) striker.fours += 1;
        if (ballData.runs === 6) striker.sixes += 1;
        striker.strikeRate = striker.balls > 0 ? Number(((striker.runs / striker.balls) * 100).toFixed(1)) : 0;
        if (ballData.isWicket) {
          striker.isOut = true;
          striker.dismissal = `b ${ballData.bowlerName}`;
          striker.isOnStrike = false;
        }
      } else if (ballData.batsmanName) {
        updatedBatsmen.push({
          playerId: 'p-' + Date.now(),
          name: ballData.batsmanName,
          runs: ballData.runs,
          balls: isLegalDelivery ? 1 : 0,
          fours: ballData.runs === 4 ? 1 : 0,
          sixes: ballData.runs === 6 ? 1 : 0,
          strikeRate: ballData.runs > 0 ? 100 : 0,
          isOut: ballData.isWicket || false,
          isOnStrike: !ballData.isWicket
        });
      }

      const updatedBowlers = [...(currentInning.bowlers || [])];
      let bowler = updatedBowlers.find((b) => b.name === ballData.bowlerName);
      if (bowler) {
        bowler.runs += (ballData.runs + (ballData.extraType === 'wide' || ballData.extraType === 'noBall' ? ballData.extraRuns : 0));
        if (ballData.isWicket) bowler.wickets += 1;
        if (isLegalDelivery) {
          let bOvers = Math.floor(bowler.overs);
          let bBalls = Math.round((bowler.overs - bOvers) * 10) + 1;
          if (bBalls >= 6) {
            bOvers += 1;
            bBalls = 0;
          }
          bowler.overs = Number((bOvers + bBalls * 0.1).toFixed(1));
        }
        const totalBowlerOvers = Math.floor(bowler.overs) + (Math.round((bowler.overs - Math.floor(bowler.overs)) * 10) / 6);
        bowler.economy = totalBowlerOvers > 0 ? Number((bowler.runs / totalBowlerOvers).toFixed(1)) : 0;
      } else if (ballData.bowlerName) {
        updatedBowlers.push({
          playerId: 'p-b-' + Date.now(),
          name: ballData.bowlerName,
          overs: isLegalDelivery ? 0.1 : 0,
          maidens: 0,
          runs: ballData.runs + (ballData.extraType === 'wide' || ballData.extraType === 'noBall' ? ballData.extraRuns : 0),
          wickets: ballData.isWicket ? 1 : 0,
          economy: 0,
          isCurrentBowler: true
        });
      }

      const newBall: BallRecord = {
        ...ballData,
        id: 'ball-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      const updatedRecentBalls = [newBall, ...(m.recentBalls || []).slice(0, 19)];

      return {
        ...m,
        status: 'LIVE',
        [targetInningKey]: {
          ...currentInning,
          runs: newRuns,
          wickets: newWickets,
          overs: newOversDecimal,
          extras: newExtras,
          batsmen: updatedBatsmen,
          bowlers: updatedBowlers
        },
        recentBalls: updatedRecentBalls
      };
    }));
  };

  const undoLastBall = (matchId: string) => {
    setMatches((prev) => prev.map((m) => {
      if (m.id !== matchId || !m.recentBalls || m.recentBalls.length === 0) return m;
      const lastBall = m.recentBalls[0];
      const targetKey = lastBall.inning === 1 ? 'team1Score' : 'team2Score';
      const inning = m[targetKey];
      if (!inning) return m;

      const rRuns = Math.max(0, inning.runs - lastBall.runs - lastBall.extraRuns);
      const rWickets = Math.max(0, inning.wickets - (lastBall.isWicket ? 1 : 0));

      let completedOvers = Math.floor(inning.overs);
      let ballsInOver = Math.round((inning.overs - completedOvers) * 10);
      const isLegal = !lastBall.extraType || (lastBall.extraType !== 'wide' && lastBall.extraType !== 'noBall');

      if (isLegal) {
        if (ballsInOver > 0) {
          ballsInOver -= 1;
        } else if (completedOvers > 0) {
          completedOvers -= 1;
          ballsInOver = 5;
        }
      }

      const rOvers = Number((completedOvers + ballsInOver * 0.1).toFixed(1));

      return {
        ...m,
        [targetKey]: {
          ...inning,
          runs: rRuns,
          wickets: rWickets,
          overs: rOvers
        },
        recentBalls: m.recentBalls.slice(1)
      };
    }));
    showToast('info', 'Undo Successful', 'Last delivery rolled back.');
  };

  const setMatchStatus = (matchId: string, status: MatchStatus) => {
    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, status } : m)));
    showToast('info', 'Status Changed', `Match marked as ${status}.`);
  };

  const switchInning = (matchId: string) => {
    setMatches((prev) => prev.map((m) => {
      if (m.id !== matchId) return m;
      const currentInning = m.currentInning || 1;
      const nextInning = currentInning === 1 ? 2 : 1;
      const targetScore = (m.team1Score?.runs || 0) + 1;
      return {
        ...m,
        currentInning: nextInning as 1 | 2,
        target: nextInning === 2 ? targetScore : m.target
      };
    }));
    showToast('success', 'Innings Switched', 'Inning 2 started.');
  };

  const completeMatchManually = (matchId: string, winnerId: string, margin: string, mom?: string) => {
    setMatches((prev) => prev.map((m) => {
      if (m.id !== matchId) return m;
      return {
        ...m,
        status: 'COMPLETED',
        winnerId,
        winMargin: margin,
        manOfTheMatch: mom || ''
      };
    }));

    // Update real player stats from completed match scorecard
    const targetMatch = matches.find((m) => m.id === matchId);
    if (targetMatch) {
      const allBatsmen = [...(targetMatch.team1Score?.batsmen || []), ...(targetMatch.team2Score?.batsmen || [])];
      const allBowlers = [...(targetMatch.team1Score?.bowlers || []), ...(targetMatch.team2Score?.bowlers || [])];

      setPlayers((prevPlayers) => prevPlayers.map((p) => {
        const batsmanData = allBatsmen.find((b) => b.name.toLowerCase() === p.name.toLowerCase());
        const bowlerData = allBowlers.find((b) => b.name.toLowerCase() === p.name.toLowerCase());

        if (!batsmanData && !bowlerData) return p;

        const currentStats = p.stats || {
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
        };

        const newMatches = currentStats.matches + 1;
        const newInnings = currentStats.innings + (batsmanData ? 1 : 0);
        const newRuns = currentStats.runs + (batsmanData?.runs || 0);
        const newHighest = Math.max(currentStats.highestScore, batsmanData?.runs || 0);
        const newFifties = currentStats.fifties + ((batsmanData?.runs || 0) >= 50 && (batsmanData?.runs || 0) < 100 ? 1 : 0);
        const newHundreds = currentStats.hundreds + ((batsmanData?.runs || 0) >= 100 ? 1 : 0);
        const newWickets = currentStats.wickets + (bowlerData?.wickets || 0);

        return {
          ...p,
          stats: {
            ...currentStats,
            matches: newMatches,
            innings: newInnings,
            runs: newRuns,
            highestScore: newHighest,
            fifties: newFifties,
            hundreds: newHundreds,
            wickets: newWickets,
            average: newInnings > 0 ? Number((newRuns / newInnings).toFixed(1)) : 0,
            strikeRate: batsmanData?.strikeRate || currentStats.strikeRate
          }
        };
      }));
    }

    showToast('success', 'Match Finalized', margin);
    addActivity('match', 'Match Result Finalized', `${margin}`);
  };

  // Auction Engine
  const startAuction = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    setAuctionState((prev) => ({
      ...prev,
      currentPlayerId: playerId,
      currentBid: player.basePrice,
      highestBidderTeamId: null,
      isPaused: false,
      bidHistory: []
    }));

    showToast('info', 'Auction Active', `Now auctioning: ${player.name} (Base: LKR ${(player.basePrice / 100000).toFixed(2)}L)`);
  };

  const placeBid = (teamId: string, amount: number) => {
    if (!auctionState.currentPlayerId) return;

    const biddingTeam = teams.find((t) => t.id === teamId);
    if (!biddingTeam) return;

    const remainingPurse = biddingTeam.totalPurse - biddingTeam.spentPurse;
    if (amount > remainingPurse) {
      showToast('error', 'Insufficient Purse', `${biddingTeam.name} has only LKR ${(remainingPurse / 100000).toFixed(2)} Lakhs remaining.`);
      return;
    }

    const newBid: Bid = {
      id: 'bid-' + Date.now(),
      playerId: auctionState.currentPlayerId,
      teamId,
      amount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setAuctionState((prev) => ({
      ...prev,
      currentBid: amount,
      highestBidderTeamId: teamId,
      bidHistory: [newBid, ...prev.bidHistory]
    }));

    showToast('info', 'New High Bid!', `${biddingTeam.name} bid LKR ${(amount / 100000).toFixed(2)} Lakhs`);
  };

  const markPlayerSold = (playerId: string, teamId: string, finalAmount: number) => {
    const player = players.find((p) => p.id === playerId);
    const team = teams.find((t) => t.id === teamId);
    if (!player || !team) return;

    setPlayers((prev) => prev.map((p) => (p.id === playerId ? {
      ...p,
      teamId,
      auctionPrice: finalAmount,
      status: 'Sold'
    } : p)));

    setTeams((prev) => prev.map((t) => (t.id === teamId ? {
      ...t,
      spentPurse: t.spentPurse + finalAmount
    } : t)));

    const availablePlayers = players.filter((p) => p.status === 'Available' && p.id !== playerId);
    const nextPlayer = availablePlayers.length > 0 ? availablePlayers[0] : null;

    setAuctionState((prev) => ({
      ...prev,
      currentPlayerId: nextPlayer ? nextPlayer.id : null,
      currentBid: nextPlayer ? nextPlayer.basePrice : 0,
      highestBidderTeamId: null,
      completedCount: prev.completedCount + 1,
      bidHistory: []
    }));

    showToast('success', '🎉 SOLD!', `${player.name} sold to ${team.name} for LKR ${(finalAmount / 100000).toFixed(2)} Lakhs!`);
    addActivity('auction', 'Player Sold in Auction', `${player.name} -> ${team.name} (LKR ${(finalAmount / 100000).toFixed(2)}L)`);
  };

  const markPlayerUnsold = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    setPlayers((prev) => prev.map((p) => (p.id === playerId ? {
      ...p,
      status: 'Unsold'
    } : p)));

    const availablePlayers = players.filter((p) => p.status === 'Available' && p.id !== playerId);
    const nextPlayer = availablePlayers.length > 0 ? availablePlayers[0] : null;

    setAuctionState((prev) => ({
      ...prev,
      currentPlayerId: nextPlayer ? nextPlayer.id : null,
      currentBid: nextPlayer ? nextPlayer.basePrice : 0,
      highestBidderTeamId: null,
      completedCount: prev.completedCount + 1,
      bidHistory: []
    }));

    showToast('warning', 'Player Unsold', `${player.name} went unsold and was moved to pool.`);
    addActivity('auction', 'Player Unsold', `${player.name} moved to unsold reserve.`);
  };

  const nextAuctionPlayer = () => {
    const availablePlayers = players.filter((p) => p.status === 'Available' || p.status === 'Unsold');
    if (availablePlayers.length === 0) {
      showToast('info', 'Auction Complete', 'No more unassigned players in pool.');
      return;
    }
    const currentIndex = availablePlayers.findIndex((p) => p.id === auctionState.currentPlayerId);
    const nextIdx = (currentIndex + 1) % availablePlayers.length;
    const next = availablePlayers[nextIdx];

    setAuctionState((prev) => ({
      ...prev,
      currentPlayerId: next.id,
      currentBid: next.basePrice,
      highestBidderTeamId: null,
      bidHistory: []
    }));
  };

  const previousAuctionPlayer = () => {
    const availablePlayers = players.filter((p) => p.status === 'Available' || p.status === 'Unsold');
    if (availablePlayers.length === 0) return;
    const currentIndex = availablePlayers.findIndex((p) => p.id === auctionState.currentPlayerId);
    const prevIdx = currentIndex <= 0 ? availablePlayers.length - 1 : currentIndex - 1;
    const prev = availablePlayers[prevIdx];

    setAuctionState((s) => ({
      ...s,
      currentPlayerId: prev.id,
      currentBid: prev.basePrice,
      highestBidderTeamId: null,
      bidHistory: []
    }));
  };

  const pauseResumeAuction = () => {
    setAuctionState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
    showToast('info', auctionState.isPaused ? 'Auction Resumed' : 'Auction Paused', 'Auctioneer timer state updated.');
  };

  // Staff CRUD
  const addStaff = (memberData: Omit<StaffMember, 'id' | 'lastActive'>) => {
    const id = 'st-' + Date.now();
    const newStaff: StaffMember = { ...memberData, id, lastActive: 'Never' };
    setStaff((prev) => [...prev, newStaff]);
    showToast('success', 'Staff Added', `${newStaff.name} granted access.`);
  };

  const updateStaff = (id: string, updatedData: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)));
    showToast('success', 'Staff Updated', 'Staff permissions updated.');
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    showToast('warning', 'Staff Removed', 'User access revoked.');
  };

  // Settings
  const updateSettings = (newSettings: Partial<TournamentSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('success', 'Settings Saved', 'Tournament configurations updated.');
  };

  const restoreFactoryDefaults = () => {
    setSettings(initialSettings);
    showToast('info', 'Defaults Restored', 'Tournament settings set back to original defaults.');
  };

  return (
    <TournamentContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        activeTab,
        setActiveTab,
        teams,
        players,
        matches,
        staff,
        settings,
        activities,
        auctionState,
        standings,
        toasts,
        viewMode,
        setViewMode,
        activeScorerMatchId,
        setActiveScorerMatchId,
        activeObsMatchId,
        setActiveObsMatchId,
        showToast,
        removeToast,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addTeam,
        updateTeam,
        deleteTeam,
        addMatch,
        updateMatch,
        deleteMatch,
        generateSchedule9Matches,
        scheduleKnockout,
        resetPendingFixtures,
        resetAllFreshTesting,
        recordBall,
        undoLastBall,
        setMatchStatus,
        switchInning,
        completeMatchManually,
        startAuction,
        placeBid,
        markPlayerSold,
        markPlayerUnsold,
        nextAuctionPlayer,
        previousAuctionPlayer,
        pauseResumeAuction,
        addStaff,
        updateStaff,
        deleteStaff,
        updateSettings,
        restoreFactoryDefaults
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
