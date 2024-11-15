export interface Player {
  id: string;
  name: string;
  teamId: string;
  goals: number;
  yellowCards: number;
  redCards: number;
  isSuspended: boolean;
  suspensionReason?: 'red' | 'yellowAccumulation';
}

export interface Team {
  id: string;
  name: string;
  group?: string;
  points: number;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  players: Player[];
}

export interface Group {
  id: string;
  teams: Team[];
  standings: TeamStanding[];
}

export interface TeamStanding {
  team: Team;
  points: number;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  position: number;
  headToHead?: string;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  scorers: {
    playerId: string;
    playerName: string;
    teamId: string;
    goals: number;
  }[];
  cards: {
    playerId: string;
    playerName: string;
    teamId: string;
    type: 'yellow' | 'red';
    minute: number;
  }[];
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  court: number;
  round: number;
  time: string;
  date?: string;
  group?: string;
  status: 'pending' | 'completed';
  result?: MatchResult;
}

export interface Fixture {
  id: string;
  rounds: Match[][];
  groups: Group[];
  courtCount: number;
  startDate: Date;
  tournamentName: string;
}