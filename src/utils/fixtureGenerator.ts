import { Team, Group, Match, Fixture } from '../types/tournament';

export function generateGroups(teams: Team[], teamsPerGroup: number = 4): Group[] {
  const totalTeams = teams.length;
  const numberOfGroups = Math.ceil(totalTeams / teamsPerGroup);
  const groups: Group[] = [];
  const teamsClone = [...teams].sort(() => Math.random() - 0.5); // Aleatorizar equipos
  
  for (let i = 0; i < numberOfGroups; i++) {
    const groupId = `group-${String.fromCharCode(65 + i)}`;
    groups.push({
      id: groupId,
      teams: [],
      standings: []
    });
  }
  
  // Distribución serpentina para equilibrar grupos
  let currentGroup = 0;
  let direction = 1;

  while (teamsClone.length > 0) {
    const team = teamsClone.shift();
    if (team) {
      team.group = groups[currentGroup].id;
      groups[currentGroup].teams.push(team);
      
      currentGroup += direction;
      if (currentGroup >= groups.length) {
        currentGroup = groups.length - 1;
        direction = -1;
      } else if (currentGroup < 0) {
        currentGroup = 0;
        direction = 1;
      }
    }
  }

  // Inicializar standings
  groups.forEach(group => {
    group.standings = group.teams.map((team, index) => ({
      team,
      points: 0,
      gamesPlayed: 0,
      position: index + 1
    }));
  });
  
  return groups;
}

export function generateFixture(groups: Group[], courts: number): Fixture {
  const rounds: Match[][] = [];
  const matchesPerTimeSlot = courts;
  const timeSlots = generateTimeSlots();
  const startDate = new Date();
  
  groups.forEach(group => {
    const teams = group.teams;
    const matchesPerRound: Match[][] = [];
    
    // Generar calendario round-robin para cada grupo
    for (let round = 0; round < teams.length - 1; round++) {
      if (!matchesPerRound[round]) matchesPerRound[round] = [];
      
      for (let i = 0; i < Math.floor(teams.length / 2); i++) {
        const homeIndex = i;
        const awayIndex = teams.length - 1 - i;
        
        if (homeIndex >= awayIndex) continue;
        
        const match: Match = {
          id: crypto.randomUUID(),
          homeTeam: teams[homeIndex],
          awayTeam: teams[awayIndex],
          court: (matchesPerRound[round].length % courts) + 1,
          round: round,
          time: timeSlots[Math.floor(matchesPerRound[round].length / matchesPerTimeSlot)],
          date: getMatchDate(startDate, round),
          group: group.id,
          status: 'pending'
        };
        
        matchesPerRound[round].push(match);
      }
      
      // Rotar equipos (mantener primer equipo fijo)
      teams.push(teams.splice(1, 1)[0]);
    }
    
    // Fusionar partidos de grupo en rondas principales
    matchesPerRound.forEach((roundMatches, index) => {
      if (!rounds[index]) rounds[index] = [];
      rounds[index].push(...roundMatches);
    });
  });
  
  // Optimizar asignación de canchas y horarios
  rounds.forEach(round => {
    round.sort((a, b) => {
      const groupA = a.group || '';
      const groupB = b.group || '';
      return groupA.localeCompare(groupB);
    });
    
    round.forEach((match, index) => {
      match.court = (index % courts) + 1;
      match.time = timeSlots[Math.floor(index / courts)];
    });
  });
  
  return {
    id: crypto.randomUUID(),
    rounds,
    groups,
    courtCount: courts,
    startDate,
    tournamentName: 'URBAN GAMES'
  };
}

function generateTimeSlots(): string[] {
  return ['8:00', '9:00', '10:00', '11:00', '12:30', '13:30', '14:30', '15:30'];
}

function getMatchDate(startDate: Date, round: number): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + (round * 7)); // Un round por semana
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}