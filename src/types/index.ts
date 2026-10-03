export type Role = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket Keeper';

export type Category = 'Platinum' | 'Gold' | 'Silver' | 'Emerging';

export type PlayerStatus = 'Auctioned' | 'Available' | 'Sold' | 'Unsold' | 'Injured';

export interface Player {
  id: string;
  name: string;
  playerId: string;
  phone: string;
  email: string;
  role: Role;
  category: Category;
  teamId: string | null;
  basePrice: number; // in USD/LKR e.g. 50000
  auctionPrice: number;
  status: PlayerStatus;
  photoUrl: string;
  jerseyNumber?: number;
  battingStyle: 'Right-Handed' | 'Left-Handed';
  bowlingStyle?: 'Right-Arm Fast' | 'Right-Arm Spin' | 'Left-Arm Fast' | 'Left-Arm Spin' | 'None';
  stats: {
    matches: number;
    innings: number;
    runs: number;
    highestScore: number;
    fifties: number;
    hundreds: number;
    strikeRate: number;
    average: number;
    wickets: number;
    bestBowling: string;
    economy: number;
    catches: number;
  };
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  captain: string;
  coach: string;
  owner?: string;
  totalPurse: number;
  spentPurse: number;
  status: 'Active' | 'Pending' | 'Disqualified';
  slogan?: string;
}

export type MatchStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'ABANDONED';
export type MatchType = 'League' | 'Semi Final' | 'Final' | 'Playoff' | 'Exhibition';

export interface BatsmanScore {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissal?: string;
  isOnStrike?: boolean;
}

export interface BowlerScore {
  playerId: string;
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  isCurrentBowler?: boolean;
}

export interface InningScore {
  teamId: string;
  runs: number;
  wickets: number;
  overs: number; // e.g., 4.2
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
  };
  batsmen: BatsmanScore[];
  bowlers: BowlerScore[];
  currentStrikerId?: string;
  currentNonStrikerId?: string;
  currentBowlerId?: string;
}

export interface BallRecord {
  id: string;
  inning: 1 | 2;
  over: number;
  ballNumber: number; // 1 to 6
  runs: number;
  isWicket: boolean;
  wicketType?: string;
  extraType?: 'wide' | 'noBall' | 'bye' | 'legBye' | null;
  extraRuns: number;
  bowlerName: string;
  batsmanName: string;
  commentary: string;
  timestamp: string;
}

export interface Match {
  id: string;
  matchNumber: number;
  team1Id: string;
  team2Id: string;
  date: string;
  time: string;
  venue: string;
  overs: number;
  matchType: MatchType;
  status: MatchStatus;
  scorerPin: string;
  tossWinnerId?: string;
  tossDecision?: 'Bat' | 'Bowl';
  currentInning?: 1 | 2;
  team1Score?: InningScore;
  team2Score?: InningScore;
  recentBalls?: BallRecord[];
  winnerId?: string;
  winMargin?: string;
  manOfTheMatch?: string;
  target?: number;
}

export interface Bid {
  id: string;
  playerId: string;
  teamId: string;
  amount: number;
  timestamp: string;
}

export interface AuctionState {
  currentPlayerId: string | null;
  currentBid: number;
  highestBidderTeamId: string | null;
  isPaused: boolean;
  bidHistory: Bid[];
  completedCount: number;
}

export interface Standing {
  teamId: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  nrr: number; // Net Run Rate
  forRuns: number;
  forOvers: number;
  againstRuns: number;
  againstOvers: number;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Administrator' | 'Tournament Manager' | 'Scorer' | 'Auction Manager' | 'Viewer';
  status: 'Active' | 'Disabled';
  lastActive: string;
  avatarUrl: string;
}

export interface TournamentSettings {
  tournamentName: string;
  season: string;
  edition: string;
  logoUrl: string;
  startDate: string;
  endDate: string;
  defaultVenue: string;
  defaultOvers: number;
  currency: string;
  timezone: string;
  totalTeamPurse: number;
  minSquadSize: number;
  maxSquadSize: number;
  whatsappMessageTemplate: string;
  liveSyncEnabled: boolean;
  powerplayOvers: number;
  wideRuns: number;
  noBallRuns: number;
}

export interface ActivityLog {
  id: string;
  type: 'match' | 'player' | 'auction' | 'team' | 'system';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}
