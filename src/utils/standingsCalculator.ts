import { Team, Match, TeamStanding } from '../types/tournament';

export function calculateStandings(teams: Team[], matches: Match[]): TeamStanding[] {
  const standings: TeamStanding[] = teams.map(team => ({
    team,
    points: 0,
    gamesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    position: 0
  }));

  // Calculate points and statistics
  matches.forEach(match => {
    if (match.status === 'completed' && match.result) {
      const { homeGoals, awayGoals } = match.result;
      
      // Home team
      const homeStanding = standings.find(s => s.team.id === match.homeTeam.id)!;
      homeStanding.gamesPlayed++;
      homeStanding.goalsFor += homeGoals;
      homeStanding.goalsAgainst += awayGoals;
      
      if (homeGoals > awayGoals) {
        homeStanding.wins++;
        homeStanding.points += 3;
      } else if (homeGoals === awayGoals) {
        homeStanding.draws++;
        homeStanding.points += 1;
      } else {
        homeStanding.losses++;
      }
      
      // Away team
      const awayStanding = standings.find(s => s.team.id === match.awayTeam.id)!;
      awayStanding.gamesPlayed++;
      awayStanding.goalsFor += awayGoals;
      awayStanding.goalsAgainst += homeGoals;
      
      if (awayGoals > homeGoals) {
        awayStanding.wins++;
        awayStanding.points += 3;
      } else if (awayGoals === homeGoals) {
        awayStanding.draws++;
        awayStanding.points += 1;
      } else {
        awayStanding.losses++;
      }
    }
  });

  // Calculate goal differences
  standings.forEach(standing => {
    standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
  });

  // Sort standings based on criteria
  standings.sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) return b.points - a.points;
    
    // 2. Goal difference
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    
    // 3. Goals scored
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    
    // 4. Head to head (if applicable)
    const headToHead = findHeadToHeadWinner(a.team, b.team, matches);
    if (headToHead) return headToHead === a.team.id ? -1 : 1;
    
    // 5. Alphabetical order as last resort
    return a.team.name.localeCompare(b.team.name);
  });

  // Assign positions
  standings.forEach((standing, index) => {
    standing.position = index + 1;
  });

  return standings;
}

function findHeadToHeadWinner(teamA: Team, teamB: Team, matches: Match[]): string | null {
  const directMatch = matches.find(match => {
    return (
      match.status === 'completed' &&
      match.result &&
      ((match.homeTeam.id === teamA.id && match.awayTeam.id === teamB.id) ||
       (match.homeTeam.id === teamB.id && match.awayTeam.id === teamA.id))
    );
  });

  if (!directMatch || !directMatch.result) return null;

  const { homeGoals, awayGoals } = directMatch.result;
  if (homeGoals === awayGoals) return null;

  if (directMatch.homeTeam.id === teamA.id) {
    return homeGoals > awayGoals ? teamA.id : teamB.id;
  } else {
    return awayGoals > homeGoals ? teamA.id : teamB.id;
  }
}