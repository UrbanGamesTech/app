import { Team } from '../types/tournament';

export function generateTeams(count: number): Team[] {
  const teams: Team[] = [];
  
  for (let i = 1; i <= count; i++) {
    teams.push({
      id: crypto.randomUUID(),
      name: `Equipo ${i}`,
      points: 0,
      gamesPlayed: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      players: []
    });
  }
  
  return teams;
}