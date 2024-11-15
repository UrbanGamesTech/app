import React, { useState } from 'react';
import { Table, ChevronDown, ChevronUp } from 'lucide-react';
import { Group } from '../types/tournament';

interface GroupStandingsProps {
  group: Group;
}

export function GroupStandings({ group }: GroupStandingsProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="group-card animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Table className="w-6 h-6 text-yellow-500" />
          <h4 className="group-title text-2xl">GRUPO {group.id.split('-')[1]}</h4>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-yellow-500 hover:text-yellow-400 transition-colors p-2 rounded-full hover:bg-yellow-500/10"
        >
          {showDetails ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-lg">
        <table className="standings-table w-full">
          <thead>
            <tr>
              <th className="text-left rounded-tl-lg">POS</th>
              <th className="text-left">EQUIPO</th>
              <th className="text-center">PTS</th>
              <th className="text-center">DG</th>
              {showDetails && (
                <>
                  <th className="text-center">GF</th>
                  <th className="text-center">GC</th>
                  <th className="text-center">PJ</th>
                  <th className="text-center">PG</th>
                  <th className="text-center">PE</th>
                  <th className="text-center rounded-tr-lg">PP</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {group.standings?.map((standing, index) => (
              <tr 
                key={standing.team.id} 
                className={`
                  transition-colors duration-200
                  ${index < 2 ? 'bg-yellow-500/5' : ''}
                  hover:bg-yellow-500/10
                `}
              >
                <td className="text-left font-bold">{standing.position}°</td>
                <td className="text-left">
                  <span className="team-name">{standing.team.name}</span>
                </td>
                <td className="text-center font-bold text-lg">{standing.points}</td>
                <td className={`text-center font-medium ${
                  standing.goalDifference > 0 
                    ? 'text-green-500' 
                    : standing.goalDifference < 0 
                    ? 'text-red-500' 
                    : ''
                }`}>
                  {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                </td>
                {showDetails && (
                  <>
                    <td className="text-center stats">{standing.goalsFor}</td>
                    <td className="text-center stats">{standing.goalsAgainst}</td>
                    <td className="text-center stats">{standing.gamesPlayed}</td>
                    <td className="text-center stats text-green-500">{standing.wins}</td>
                    <td className="text-center stats text-yellow-500">{standing.draws}</td>
                    <td className="text-center stats text-red-500">{standing.losses}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showDetails && (
        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <p>PTS: Puntos | DG: Diferencia de Gol | GF: Goles a Favor | GC: Goles en Contra</p>
          <p>PJ: Partidos Jugados | PG: Ganados | PE: Empatados | PP: Perdidos</p>
        </div>
      )}
    </div>
  );
}