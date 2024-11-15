import React from 'react';
import { Trash2 } from 'lucide-react';
import { Team } from '../types/tournament';

interface TeamListProps {
  teams: Team[];
  onRemoveTeam: (id: string) => void;
}

export function TeamList({ teams, onRemoveTeam }: TeamListProps) {
  if (teams.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map(team => (
        <div
          key={team.id}
          className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
        >
          <span>{team.name}</span>
          <button
            onClick={() => onRemoveTeam(team.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}