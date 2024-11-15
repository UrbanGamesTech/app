import { Player, Match, MatchResult } from '../types/tournament';

export function updatePlayerStats(
  players: Player[],
  match: Match,
  result: MatchResult
): Player[] {
  const updatedPlayers = [...players];

  // Update goals
  result.scorers.forEach(({ playerId, goals }) => {
    const player = updatedPlayers.find(p => p.id === playerId);
    if (player) {
      player.goals += goals;
    }
  });

  // Update cards and calculate suspensions
  result.cards.forEach(({ playerId, type }) => {
    const player = updatedPlayers.find(p => p.id === playerId);
    if (player) {
      if (type === 'yellow') {
        player.yellowCards++;
        // Check for suspension due to yellow card accumulation
        if (player.yellowCards === 3) {
          player.isSuspended = true;
          player.suspensionReason = 'yellowAccumulation';
          player.yellowCards = 0; // Reset after suspension
        }
      } else if (type === 'red') {
        player.redCards++;
        player.isSuspended = true;
        player.suspensionReason = 'red';
      }
    }
  });

  return updatedPlayers;
}

export function getTopScorers(players: Player[]): Player[] {
  return [...players]
    .sort((a, b) => b.goals - a.goals)
    .filter(player => player.goals > 0);
}

export function getSuspendedPlayers(players: Player[]): Player[] {
  return players.filter(player => player.isSuspended);
}

export function getCardReport(players: Player[]): {
  redCards: Player[];
  yellowCards: Player[];
} {
  return {
    redCards: players.filter(p => p.redCards > 0).sort((a, b) => b.redCards - a.redCards),
    yellowCards: players.filter(p => p.yellowCards > 0).sort((a, b) => b.yellowCards - a.yellowCards)
  };
}