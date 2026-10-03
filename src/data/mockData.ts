import { Team, Player, Match, StaffMember, TournamentSettings, ActivityLog } from '../types';

export const initialTeams: Team[] = [];

export const initialPlayers: Player[] = [];

export const initialMatches: Match[] = [];

export const initialStaff: StaffMember[] = [];

export const initialSettings: TournamentSettings = {
  tournamentName: 'PREMIER LEAGUE',
  season: 'Season 2026',
  edition: 'Premier League',
  logoUrl: '🏆',
  startDate: '',
  endDate: '',
  defaultVenue: 'Main Stadium',
  defaultOvers: 5,
  currency: 'LKR',
  timezone: 'Asia/Colombo (GMT+5:30)',
  totalTeamPurse: 10000000,
  minSquadSize: 8,
  maxSquadSize: 15,
  whatsappMessageTemplate: `🏏 *{TOURNAMENT} LIVE UPDATE*\n*Match {MATCH_NO}:* {TEAM1} vs {TEAM2}\n*Status:* {STATUS}\n*Score:* {SCORE_SUMMARY}\n*Scorecard:* {URL}`,
  liveSyncEnabled: true,
  powerplayOvers: 1,
  wideRuns: 1,
  noBallRuns: 1
};

export const initialActivities: ActivityLog[] = [];
